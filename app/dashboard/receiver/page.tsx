"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Droplet, Clock, AlertCircle, CheckCircle } from "lucide-react"

interface BloodRequest {
  id: string
  date: string
  bloodType: string
  units: number
  urgency: "normal" | "urgent" | "emergency"
  status: "pending" | "approved" | "fulfilled" | "cancelled"
  hospital: string
}

export default function ReceiverDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bloodType, setBloodType] = useState("")
  const [units, setUnits] = useState("1")
  const [urgency, setUrgency] = useState("normal")
  const [hospital, setHospital] = useState("")
  const [reason, setReason] = useState("")
  const [requests, setRequests] = useState<BloodRequest[]>([])
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
    if (parsedUser.role !== "receiver") {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }

    setUser(parsedUser)

    // Load saved profile data if available
    const savedProfile = localStorage.getItem(`receiver_profile_${parsedUser.id}`)
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      if (profileData.bloodType) {
        setBloodType(profileData.bloodType)
      }
    }

    // Mock request data
    const mockRequests: BloodRequest[] = [
      {
        id: "req-1",
        date: "2024-03-15",
        bloodType: "B+",
        units: 2,
        urgency: "urgent",
        status: "fulfilled",
        hospital: "City Hospital",
      },
      {
        id: "req-2",
        date: "2024-04-20",
        bloodType: "B+",
        units: 1,
        urgency: "normal",
        status: "pending",
        hospital: "Memorial Hospital",
      },
    ]

    setRequests(mockRequests)
    setLoading(false)
  }, [router])

  const handleRequestBlood = () => {
    if (!bloodType || !units || !hospital) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would make an API call to create the request
    const newRequest: BloodRequest = {
      id: "req-" + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split("T")[0],
      bloodType,
      units: Number.parseInt(units),
      urgency: urgency as "normal" | "urgent" | "emergency",
      status: "pending",
      hospital,
    }

    setRequests([...requests, newRequest])

    toast({
      title: "Request submitted",
      description: `Your blood request has been submitted successfully.`,
    })

    // Reset form
    setUnits("1")
    setUrgency("normal")
    setReason("")
  }

  if (loading) {
    return <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">Loading...</div>
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receiver Dashboard</h1>
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
      {/* <h1 className="text-3xl font-bold mb-6">Receiver Dashboard</h1> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Welcome, {user?.name}</CardTitle>
            <CardDescription>Receiver ID: {user?.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-2">
              <Droplet className="h-5 w-5 text-red-500 mr-2" />
              <span>Blood Type: {bloodType || "Not specified"}</span>
            </div>
            <div className="flex items-center mt-2">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span>Active Requests: {requests.filter((r) => r.status === "pending").length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Request Status</CardTitle>
            <CardDescription>Overview of your blood requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold">{requests.filter((r) => r.status === "fulfilled").length}</p>
                <p className="text-sm text-muted-foreground">Fulfilled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Blood Availability</CardTitle>
            <CardDescription>Current blood inventory status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>A+</span>
                <span className="text-green-500">Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span>B+</span>
                <span className="text-green-500">Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span>AB+</span>
                <span className="text-yellow-500">Limited</span>
              </div>
              <div className="flex justify-between items-center">
                <span>O-</span>
                <span className="text-red-500">Low</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="request">
        <TabsList className="mb-4">
          <TabsTrigger value="request">Request Blood</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Blood</CardTitle>
              <CardDescription>Fill in the details to request blood units</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type Needed</Label>
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
                  <Label htmlFor="units">Units Required</Label>
                  <Select value={units} onValueChange={setUnits}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Unit</SelectItem>
                      <SelectItem value="2">2 Units</SelectItem>
                      <SelectItem value="3">3 Units</SelectItem>
                      <SelectItem value="4">4 Units</SelectItem>
                      <SelectItem value="5">5+ Units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <Select value={hospital} onValueChange={setHospital}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="City Hospital">City Hospital</SelectItem>
                      <SelectItem value="Memorial Hospital">Memorial Hospital</SelectItem>
                      <SelectItem value="General Hospital">General Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide details about why you need the blood"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <Button onClick={handleRequestBlood}>Submit Request</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>History of your blood requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-center py-4">No request history found.</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{new Date(request.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{request.hospital}</p>
                      </div>
                      <div className="text-center">
                        <p>
                          {request.bloodType} ({request.units} {request.units === 1 ? "unit" : "units"})
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">{request.urgency}</p>
                      </div>
                      <div className="text-right flex items-center">
                        {request.status === "pending" && <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />}
                        {request.status === "fulfilled" && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                        <span
                          className={`capitalize ${
                            request.status === "pending"
                              ? "text-yellow-500"
                              : request.status === "fulfilled"
                                ? "text-green-500"
                                : request.status === "approved"
                                  ? "text-blue-500"
                                  : "text-red-500"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Textarea id="medicalHistory" placeholder="Enter relevant medical history" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter your address" />
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    // Save profile data to localStorage
                    const profileData = {
                      name: user?.name,
                      email: user?.email,
                      phone: (document.getElementById("phone") as HTMLInputElement)?.value,
                      bloodType,
                      medicalHistory: (document.getElementById("medicalHistory") as HTMLTextAreaElement)?.value,
                      address: (document.getElementById("address") as HTMLInputElement)?.value,
                    }

                    localStorage.setItem(`receiver_profile_${user?.id}`, JSON.stringify(profileData))

                    toast({
                      title: "Profile updated",
                      description: "Your profile information has been saved successfully.",
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
