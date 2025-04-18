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
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Users, Droplet } from "lucide-react"

interface BloodDrive {
  id: string
  name: string
  date: string
  location: string
  status: "upcoming" | "active" | "completed" | "cancelled"
  donors: number
  unitsCollected: number
}

export default function OrganizationDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bloodDrives, setBloodDrives] = useState<BloodDrive[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [driveName, setDriveName] = useState("")
  const [location, setLocation] = useState("")
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
    if (parsedUser.role !== "organization") {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }

    setUser(parsedUser)

    // Load saved profile data if available
    const savedProfile = localStorage.getItem(`organization_profile_${parsedUser.id}`)
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      // You can set any state variables here if needed
    }

    // Mock blood drive data
    const mockBloodDrives: BloodDrive[] = [
      {
        id: "drive-1",
        name: "Community Blood Drive",
        date: "2024-05-15",
        location: "Community Center",
        status: "upcoming",
        donors: 0,
        unitsCollected: 0,
      },
      {
        id: "drive-2",
        name: "Corporate Donation Day",
        date: "2024-04-10",
        location: "Tech Park",
        status: "completed",
        donors: 45,
        unitsCollected: 40,
      },
      {
        id: "drive-3",
        name: "University Blood Drive",
        date: "2024-03-22",
        location: "State University",
        status: "completed",
        donors: 78,
        unitsCollected: 70,
      },
    ]

    // Load saved blood drives data if available
    const savedBloodDrives = localStorage.getItem(`organization_blood_drives_${parsedUser.id}`)
    if (savedBloodDrives) {
      setBloodDrives(JSON.parse(savedBloodDrives))
    } else {
      setBloodDrives(mockBloodDrives)
    }
    setLoading(false)
  }, [router])

  const handleCreateBloodDrive = () => {
    if (!driveName || !date || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would make an API call to create the blood drive
    const newDrive: BloodDrive = {
      id: "drive-" + Math.random().toString(36).substring(2, 9),
      name: driveName,
      date: date.toISOString().split("T")[0],
      location,
      status: "upcoming",
      donors: 0,
      unitsCollected: 0,
    }

    setBloodDrives([...bloodDrives, newDrive])

    localStorage.setItem(`organization_blood_drives_${user?.id}`, JSON.stringify([...bloodDrives, newDrive]))

    toast({
      title: "Blood drive created",
      description: `Your blood drive has been scheduled for ${date.toLocaleDateString()}.`,
    })

    // Reset form
    setDriveName("")
    setDate(undefined)
    setLocation("")
  }

  if (loading) {
    return <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">Loading...</div>
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organization Dashboard</h1>
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
      {/* <h1 className="text-3xl font-bold mb-6">Organization Dashboard</h1> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Welcome, {user?.name}</CardTitle>
            <CardDescription>Organization ID: {user?.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-2">
              <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span>Upcoming Drives: {bloodDrives.filter((drive) => drive.status === "upcoming").length}</span>
            </div>
            <div className="flex items-center mt-2">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <span>Total Donors: {bloodDrives.reduce((sum, drive) => sum + drive.donors, 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Impact Statistics</CardTitle>
            <CardDescription>Your contribution to saving lives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold">
                  {bloodDrives.reduce((sum, drive) => sum + drive.unitsCollected, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Units Collected</p>
              </div>
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold">
                  {bloodDrives.filter((drive) => drive.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Drives Completed</p>
              </div>
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
              <Users className="mr-2 h-4 w-4" />
              Manage Volunteers
            </Button>
            <Button className="w-full" variant="outline">
              <Droplet className="mr-2 h-4 w-4" />
              View Donation Stats
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create">
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create Blood Drive</TabsTrigger>
          <TabsTrigger value="manage">Manage Blood Drives</TabsTrigger>
          <TabsTrigger value="profile">Organization Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Blood Drive</CardTitle>
              <CardDescription>Schedule and organize a blood donation event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="driveName">Blood Drive Name</Label>
                  <Input
                    id="driveName"
                    placeholder="Enter blood drive name"
                    value={driveName}
                    onChange={(e) => setDriveName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="border rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedDonors">Expected Donors</Label>
                    <Select defaultValue="50">
                      <SelectTrigger>
                        <SelectValue placeholder="Select expected donors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">Less than 25</SelectItem>
                        <SelectItem value="50">25-50</SelectItem>
                        <SelectItem value="100">50-100</SelectItem>
                        <SelectItem value="200">More than 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter blood drive description" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partners">Partners</Label>
                    <Input id="partners" placeholder="Enter partner organizations (optional)" />
                  </div>

                  <Button className="w-full mt-4" onClick={handleCreateBloodDrive}>
                    Create Blood Drive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Blood Drives</CardTitle>
              <CardDescription>View and manage your blood donation events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Donors</TableHead>
                    <TableHead>Units Collected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodDrives.map((drive) => (
                    <TableRow key={drive.id}>
                      <TableCell className="font-medium">{drive.name}</TableCell>
                      <TableCell>{new Date(drive.date).toLocaleDateString()}</TableCell>
                      <TableCell>{drive.location}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize ${
                            drive.status === "upcoming"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : drive.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : drive.status === "completed"
                                  ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {drive.status}
                        </span>
                      </TableCell>
                      <TableCell>{drive.donors}</TableCell>
                      <TableCell>{drive.unitsCollected}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          {drive.status === "upcoming" ? "Edit" : "View"}
                        </Button>
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
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>Manage your organization information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter organization phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" placeholder="Enter organization website" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter organization address" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">About Organization</Label>
                  <Textarea id="description" placeholder="Enter organization description" />
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    // Save profile data to localStorage
                    const profileData = {
                      name: user?.name,
                      email: user?.email,
                      phone: (document.getElementById("phone") as HTMLInputElement)?.value,
                      website: (document.getElementById("website") as HTMLInputElement)?.value,
                      address: (document.getElementById("address") as HTMLInputElement)?.value,
                      description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
                    }

                    localStorage.setItem(`organization_profile_${user?.id}`, JSON.stringify(profileData))

                    toast({
                      title: "Profile updated",
                      description: "Your organization information has been saved successfully.",
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
