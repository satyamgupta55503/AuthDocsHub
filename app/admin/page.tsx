"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Users, Shield, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react"

interface User {
  id: string
  username: string
  created_date: string
  status: "active" | "inactive"
  last_login?: string
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Create user form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Mock users data - in real implementation would fetch from API
  const [users] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      created_date: "2024-01-15",
      status: "active",
      last_login: "2024-01-20",
    },
    {
      id: "2",
      username: "john_doe",
      created_date: "2024-01-16",
      status: "active",
      last_login: "2024-01-19",
    },
    {
      id: "3",
      username: "jane_smith",
      created_date: "2024-01-17",
      status: "inactive",
    },
  ])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all required fields")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // In real implementation, would call API endpoint
      // const result = await apiClient.createUser({ username, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(`User "${username}" created successfully!`)
      setUsername("")
      setPassword("")
    } catch (error) {
      setError("Failed to create user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">
                Manage users and system settings for the document management system.
              </p>
            </div>

            <div className="max-w-6xl">
              <Tabs defaultValue="create-user" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create-user" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create User
                  </TabsTrigger>
                  <TabsTrigger value="manage-users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Manage Users
                  </TabsTrigger>
                </TabsList>

                {/* Create User Tab */}
                <TabsContent value="create-user">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Create New User
                      </CardTitle>
                      <CardDescription>Add a new user to the document management system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Alerts */}
                      {error && (
                        <Alert variant="destructive" className="mb-6">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {success && (
                        <Alert className="mb-6">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription className="text-green-600">{success}</AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleCreateUser} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Username */}
                          <div className="space-y-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                              id="username"
                              type="text"
                              placeholder="Enter username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              disabled={loading}
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              Username must be unique and contain only letters, numbers, and underscores
                            </p>
                          </div>

                          {/* Password */}
                          <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                          <Button type="submit" disabled={loading} className="min-w-32">
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create User
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Manage Users Tab */}
                <TabsContent value="manage-users">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>View and manage existing users in the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {users.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">No users found</p>
                          <p className="text-sm">Create your first user to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Users List */}
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Shield className="h-5 w-5 text-primary" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-foreground">{user.username}</h3>
                                    {getStatusBadge(user.status)}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span>Created: {formatDate(user.created_date)}</span>
                                    {user.last_login && <span>Last login: {formatDate(user.last_login)}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // In real implementation, would toggle user status
                                    console.log("Toggle user status:", user.id)
                                  }}
                                >
                                  {user.status === "active" ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // In real implementation, would reset password
                                    console.log("Reset password for user:", user.id)
                                  }}
                                >
                                  Reset Password
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Summary Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-foreground">{users.length}</div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-green-600">
                                  {users.filter((u) => u.status === "active").length}
                                </div>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-orange-600">
                                  {users.filter((u) => u.status === "inactive").length}
                                </div>
                                <p className="text-sm text-muted-foreground">Inactive Users</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
