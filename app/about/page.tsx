import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Heart, Users, Building, User } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Our Blood Bank Management System</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-6 w-6 text-red-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our mission is to bridge the gap between blood donors and those in need, ensuring that every patient has
              access to safe and timely blood transfusions. We strive to create a seamless ecosystem that connects
              donors, receivers, hospitals, and organizations to save lives through efficient blood donation management.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplet className="mr-2 h-6 w-6 text-red-500" />
              Why Blood Donation Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Blood donation is a critical lifeline for many medical treatments and emergency situations. Every day,
              thousands of people need blood transfusions to survive surgeries, cancer treatments, childbirth
              complications, and traumatic injuries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Blood Facts</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>One donation can save up to three lives</li>
                  <li>Someone needs blood every two seconds</li>
                  <li>Only 37% of the population is eligible to donate blood</li>
                  <li>Less than 10% of eligible donors actually donate</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Blood Types</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>O- is the universal donor (can donate to any blood type)</li>
                  <li>AB+ is the universal recipient (can receive any blood type)</li>
                  <li>The most common blood type is O+</li>
                  <li>The rarest blood type is AB-</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6 text-blue-500" />
              How Our System Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <User className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold">For Donors</h3>
                  <p className="text-sm text-muted-foreground">
                    Donors can register, schedule donations, view their donation history, and track their impact. Our
                    system makes it easy to find nearby donation centers and keep track of eligibility periods.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">For Receivers</h3>
                  <p className="text-sm text-muted-foreground">
                    Patients or their representatives can request specific blood types, specify urgency levels, and
                    track the status of their requests. The system helps match receivers with available blood units at
                    nearby hospitals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">For Hospitals</h3>
                  <p className="text-sm text-muted-foreground">
                    Hospitals can manage their blood inventory, process blood requests, and coordinate with donors and
                    organizations. The system provides real-time updates on blood availability and helps optimize
                    distribution.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">For Organizations</h3>
                  <p className="text-sm text-muted-foreground">
                    Blood donation organizations can schedule and manage blood drives, track donor participation, and
                    measure their impact. The system helps organizations coordinate with hospitals to address specific
                    needs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplet className="mr-2 h-6 w-6 text-red-500" />
              Our Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Since our inception, our blood bank management system has made a significant impact on blood donation and
              distribution:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-3xl font-bold text-red-600">10,000+</p>
                <p className="text-sm text-muted-foreground">Donors Registered</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">25,000+</p>
                <p className="text-sm text-muted-foreground">Units Collected</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-3xl font-bold text-green-600">8,000+</p>
                <p className="text-sm text-muted-foreground">Lives Saved</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">500+</p>
                <p className="text-sm text-muted-foreground">Blood Drives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
