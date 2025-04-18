"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Droplet, Clock, MapPin, History } from "lucide-react"

interface DonationHistory {
  id: string
  date: string
  location: string
  bloodType: string
  amount: string
  status: "completed" | "scheduled" | "cancelled"
}

export default function DonorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [bloodType, setBloodType] = useState("")
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([])
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
    if (parsedUser.role !== "donor") {
      router.push(`/dashboard/${parsedUser.role}`)
      return
    }

    setUser(parsedUser)

    // Load saved profile data if available
    const savedProfile = localStorage.getItem(`donor_profile_${parsedUser.id}`)
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      if (profileData.bloodType) {
        setBloodType(profileData.bloodType)
      }
    }

    // Mock donation history data
    const mockHistory: DonationHistory[] = [
      {
        id: "don-1",
        date: "2023-12-15",
        location: "City Hospital",
        bloodType: "A+",
        amount: "450ml",
        status: "completed",
      },
      {
        id: "don-2",
        date: "2024-02-20",
        location: "Red Cross Center",
        bloodType: "A+",
        amount: "450ml",
        status: "completed",
      },
      {
        id: "don-3",
        date: "2024-05-10",
        location: "Community Blood Drive",
        bloodType: "A+",
        amount: "450ml",
        status: "scheduled",
      },
    ]

    setDonationHistory(mockHistory)
    setLoading(false)
  }, [router])

  const handleScheduleDonation = () => {
    if (!date) {
      toast({
        title: "Please select a date",
        description: "You need to select a date for your donation.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would make an API call to schedule the donation
    const newDonation: DonationHistory = {
      id: "don-" + Math.random().toString(36).substring(2, 9),
      date: date.toISOString().split("T")[0],
      location: "City Hospital",
      bloodType: bloodType || "Unknown",
      amount: "450ml",
      status: "scheduled",
    }

    setDonationHistory([...donationHistory, newDonation])

    toast({
      title: "Donation scheduled",
      description: `Your donation has been scheduled for ${date.toLocaleDateString()}.`,
    })

    setDate(undefined)
  }

  if (loading) {
    return <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">Loading...</div>
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>
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
      {/* <h1 className="text-3xl font-bold mb-6">Donor Dashboard</h1> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Welcome, {user?.name}</CardTitle>
            <CardDescription>Donor ID: {user?.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-2">
              <Droplet className="h-5 w-5 text-red-500 mr-2" />
              <span>Blood Type: {bloodType || "Not specified"}</span>
            </div>
            <div className="flex items-center mt-2">
              <History className="h-5 w-5 text-gray-500 mr-2" />
              <span>
                Last Donation:{" "}
                {donationHistory.length > 0 ? new Date(donationHistory[0].date).toLocaleDateString() : "Never"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Donation Stats</CardTitle>
            <CardDescription>Your contribution so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold">{donationHistory.filter((d) => d.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Total Donations</p>
              </div>
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold">{donationHistory.filter((d) => d.status === "scheduled").length}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
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
              <MapPin className="mr-2 h-4 w-4" />
              Find Donation Centers
            </Button>
            <Button className="w-full" variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              View Appointments
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="mb-4">
          <TabsTrigger value="schedule">Schedule Donation</TabsTrigger>
          <TabsTrigger value="history">Donation History</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule a New Donation</CardTitle>
              <CardDescription>Select a date and location for your next blood donation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                    }
                    className="border rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Donation Center</Label>
                    <Select defaultValue="city-hospital">
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="city-hospital">City Hospital</SelectItem>
                        <SelectItem value="red-cross">Red Cross Center</SelectItem>
                        <SelectItem value="community">Community Blood Drive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select defaultValue="morning">
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (1PM - 4PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Your Blood Type</Label>
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

                  <Button className="w-full mt-4" onClick={handleScheduleDonation}>
                    Schedule Donation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>Record of your past and upcoming donations</CardDescription>
            </CardHeader>
            <CardContent>
              {donationHistory.length === 0 ? (
                <p className="text-center py-4">No donation history found.</p>
              ) : (
                <div className="space-y-4">
                  {donationHistory.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{new Date(donation.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{donation.location}</p>
                      </div>
                      <div className="text-right">
                        <p>
                          {donation.bloodType} ({donation.amount})
                        </p>
                        <p
                          className={`text-sm ${
                            donation.status === "completed"
                              ? "text-green-500"
                              : donation.status === "scheduled"
                                ? "text-blue-500"
                                : "text-red-500"
                          }`}
                        >
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </p>
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
                      address: (document.getElementById("address") as HTMLInputElement)?.value,
                    }

                    localStorage.setItem(`donor_profile_${user?.id}`, JSON.stringify(profileData))

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
