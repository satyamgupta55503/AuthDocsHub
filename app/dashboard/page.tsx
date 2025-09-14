"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { FileText, Upload, Search, Settings, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  const { userId } = useAuth()

  const stats = [
    {
      title: "Total Documents",
      value: "0",
      description: "Documents uploaded",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Recent Uploads",
      value: "0",
      description: "This week",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Pending Reviews",
      value: "0",
      description: "Awaiting approval",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const quickActions = [
    {
      title: "Upload Document",
      description: "Add new documents to the system",
      href: "/upload",
      icon: Upload,
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      title: "Search Documents",
      description: "Find and manage existing documents",
      href: "/search",
      icon: Search,
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      title: "Admin Panel",
      description: "Manage users and system settings",
      href: "/admin",
      icon: Settings,
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {userId}! Here's an overview of your document management system.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action) => (
                  <Card key={action.title} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link href={action.href}>Get Started</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest document management activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start by uploading your first document</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
