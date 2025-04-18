import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Droplet, Building, User, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Blood Bank Management System
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Connecting donors, receivers, hospitals, and organizations to save lives through efficient blood
                donation management.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/login">
                <Button>
                  Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-2 bg-red-100 rounded-full dark:bg-red-900">
                  <Droplet className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold">For Donors</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Register as a donor, schedule donations, and track your donation history.
                </p>
                <Link href="/auth/register?role=donor">
                  <Button variant="outline" className="w-full">
                    Register as Donor
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">For Receivers</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Request blood, find matching donors, and manage your medical needs.
                </p>
                <Link href="/auth/register?role=receiver">
                  <Button variant="outline" className="w-full">
                    Register as Receiver
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
                  <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">For Hospitals</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage blood inventory, request donations, and coordinate with donors.
                </p>
                <Link href="/auth/register?role=hospital">
                  <Button variant="outline" className="w-full">
                    Register as Hospital
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">For Organizations</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Organize blood drives, manage campaigns, and connect donors with hospitals.
                </p>
                <Link href="/auth/register?role=organization">
                  <Button variant="outline" className="w-full">
                    Register as Organization
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
