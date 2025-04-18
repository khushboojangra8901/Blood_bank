"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Droplet, Plus, Search, Check, X } from "lucide-react"

interface BloodInventory {
  type: string
  units: number
  lastUpdated: string
}

interface BloodRequest {
  id: string
  date: string
  patientName: string
  bloodType: string
  units: number
  urgency: "normal" | "urgent" | "emergency"
  status: "pending" | "approved" | "fulfilled" | "rejected"
}

export default function HospitalDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<BloodInventory[]>([])
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [bloodType, setBloodType] = useState("")
  const [units, setUnits] = useState("1")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "hospital") {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }

    setUser(parsedUser)

    // Load saved profile data if available
    const savedProfile = localStorage.getItem(`hospital_profile_${parsedUser.id}`)
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      // You can set any state variables here if needed
    }

    // Mock inventory data
    const mockInventory: BloodInventory[] = [
      { type: "A+", units: 15, lastUpdated: "2024-04-25" },
      { type: "A-", units: 8, lastUpdated: "2024-04-24" },
      { type: "B+", units: 12, lastUpdated: "2024-04-25" },
      { type: "B-", units: 5, lastUpdated: "2024-04-23" },
      { type: "AB+", units: 7, lastUpdated: "2024-04-22" },
      { type: "AB-", units: 3, lastUpdated: "2024-04-21" },
      { type: "O+", units: 20, lastUpdated: "2024-04-25" },
      { type: "O-", units: 10, lastUpdated: "2024-04-24" },
    ]

    // Load saved inventory data if available
    const savedInventory = localStorage.getItem(`hospital_inventory_${parsedUser.id}`)
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      setInventory(mockInventory)
    }

    // Mock request data
    const mockRequests: BloodRequest[] = [
      {
        id: "req-1",
        date: "2024-04-25",
        patientName: "John Doe",
        bloodType: "B+",
        units: 2,
        urgency: "urgent",
        status: "pending",
      },
      {
        id: "req-2",
        date: "2024-04-24",
        patientName: "Jane Smith",
        bloodType: "O-",
        units: 1,
        urgency: "normal",
        status: "approved",
      },
      {
        id: "req-3",
        date: "2024-04-23",
        patientName: "Robert Johnson",
        bloodType: "A+",
        units: 3,
        urgency: "emergency",
        status: "fulfilled",
      },
    ]

    setRequests(mockRequests)
    setLoading(false)
  }, [router])

  const handleUpdateInventory = () => {
    if (!bloodType || !units) {
      toast({
        title: "Missing information",
        description: "Please select blood type and units.",
        variant: "destructive",
      })
      return
    }

    // Update inventory
    const updatedInventory = [...inventory]
    const index = updatedInventory.findIndex((item) => item.type === bloodType)

    if (index !== -1) {
      updatedInventory[index].units += Number.parseInt(units)
      updatedInventory[index].lastUpdated = new Date().toISOString().split("T")[0]
    } else {
      updatedInventory.push({
        type: bloodType,
        units: Number.parseInt(units),
        lastUpdated: new Date().toISOString().split("T")[0],
      })
    }

    setInventory(updatedInventory)
    localStorage.setItem(`hospital_inventory_${user?.id}`, JSON.stringify(updatedInventory))

    toast({
      title: "Inventory updated",
      description: `Added ${units} units of ${bloodType} blood to inventory.`,
    })

    setUnits("1")
  }

  const handleRequestAction = (requestId: string, action: "approve" | "reject" | "fulfill") => {
    const updatedRequests = [...requests]
    const index = updatedRequests.findIndex((req) => req.id === requestId)

    if (index !== -1) {
      const request = updatedRequests[index]

      if (action === "approve") {
        updatedRequests[index].status = "approved"
        toast({
          title: "Request approved",
          description: `Blood request for ${request.patientName} has been approved.`,
        })
      } else if (action === "reject") {
        updatedRequests[index].status = "rejected"
        toast({
          title: "Request rejected",
          description: `Blood request for ${request.patientName} has been rejected.`,
        })
      } else if (action === "fulfill") {
        // Check if we have enough inventory
        const bloodItem = inventory.find((item) => item.type === request.bloodType)

        if (!bloodItem || bloodItem.units < request.units) {
          toast({
            title: "Insufficient inventory",
            description: `Not enough ${request.bloodType} blood units available.`,
            variant: "destructive",
          })
          return
        }

        // Update inventory
        const updatedInventory = [...inventory]
        const inventoryIndex = updatedInventory.findIndex((item) => item.type === request.bloodType)
        updatedInventory[inventoryIndex].units -= request.units
        setInventory(updatedInventory)

        // Update request status
        updatedRequests[index].status = "fulfilled"

        toast({
          title: "Request fulfilled",
          description: `Blood request for ${request.patientName} has been fulfilled.`,
        })
      }

      setRequests(updatedRequests)
    }
  }

  if (loading) {
    return <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">Loading...</div>
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem("user")
            router.push("/auth/login")
          }}
        >
          Logout
        </Button>
      </div>

      {/* <h1 className="text-3xl font-bold mb-6">Hospital Dashboard</h1> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Welcome, {user?.name}</CardTitle>
            <CardDescription>Hospital ID: {user?.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-2">
              <Droplet className="h-5 w-5 text-red-500 mr-2" />
              <span>Total Blood Units: {inventory.reduce((sum, item) => sum + item.units, 0)}</span>
            </div>
            <div className="flex items-center mt-2">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <span>Pending Requests: {requests.filter((r) => r.status === "pending").length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current blood inventory levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {inventory.map((item) => (
                <div
                  key={item.type}
                  className={`text-center p-2 rounded-lg ${
                    item.units > 10
                      ? "bg-green-50 dark:bg-green-900/20"
                      : item.units > 5
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  <p className="font-bold">{item.type}</p>
                  <p
                    className={`text-sm ${
                      item.units > 10
                        ? "text-green-600 dark:text-green-400"
                        : item.units > 5
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.units} units
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Blood Drive
            </Button>
            <Button className="w-full" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Find Donors
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="requests">Blood Requests</TabsTrigger>
          <TabsTrigger value="profile">Hospital Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Update Inventory</CardTitle>
              <CardDescription>Add new blood units to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select value={bloodType} onValueChange={setBloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Units to Add</Label>
                  <Select value={units} onValueChange={setUnits}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Unit</SelectItem>
                      <SelectItem value="2">2 Units</SelectItem>
                      <SelectItem value="3">3 Units</SelectItem>
                      <SelectItem value="5">5 Units</SelectItem>
                      <SelectItem value="10">10 Units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleUpdateInventory}>Add to Inventory</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>Overview of available blood units</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Available Units</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.type}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{item.units}</TableCell>
                      <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.units > 10
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : item.units > 5
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {item.units > 10 ? "Sufficient" : item.units > 5 ? "Limited" : "Low"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Blood Requests</CardTitle>
              <CardDescription>Manage incoming blood requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{request.patientName}</TableCell>
                      <TableCell>{request.bloodType}</TableCell>
                      <TableCell>{request.units}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize ${
                            request.urgency === "emergency"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : request.urgency === "urgent"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {request.urgency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : request.status === "approved"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : request.status === "fulfilled"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleRequestAction(request.id, "approve")}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleRequestAction(request.id, "reject")}
                            >
                              <X className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </div>
                        )}
                        {request.status === "approved" && (
                          <Button size="sm" onClick={() => handleRequestAction(request.id, "fulfill")}>
                            Fulfill
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Profile</CardTitle>
              <CardDescription>Manage your hospital information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input id="hospitalName" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter hospital phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input id="licenseNumber" placeholder="Enter hospital license number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter hospital address" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter hospital description" />
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    // Save profile data to localStorage
                    const profileData = {
                      name: user?.name,
                      email: user?.email,
                      phone: (document.getElementById("phone") as HTMLInputElement)?.value,
                      licenseNumber: (document.getElementById("licenseNumber") as HTMLInputElement)?.value,
                      address: (document.getElementById("address") as HTMLInputElement)?.value,
                      description: (document.getElementById("description") as HTMLInputElement)?.value,
                    }

                    localStorage.setItem(`hospital_profile_${user?.id}`, JSON.stringify(profileData))

                    toast({
                      title: "Profile updated",
                      description: "Your hospital information has been saved successfully.",
                    })
                  }}
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
