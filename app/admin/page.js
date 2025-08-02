"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Mail, QrCode, CheckCircle, XCircle, Clock, Copy, Send } from "lucide-react"

export default function AdminPage() {
  const [inviteMethod, setInviteMethod] = useState("email")
  const [generatedCode, setGeneratedCode] = useState("")

  // Mock data for current organization
  const orgStats = {
    name: "Harvard University",
    totalUsers: 2847,
    activeReports: 156,
    resolvedItems: 89,
    pendingVerifications: 12,
  }

  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@harvard.edu", status: "active", joinDate: "2024-01-10", reports: 3 },
    { id: 2, name: "Bob Smith", email: "bob@harvard.edu", status: "active", joinDate: "2024-01-08", reports: 1 },
    { id: 3, name: "Carol Davis", email: "carol@harvard.edu", status: "pending", joinDate: "2024-01-15", reports: 0 },
  ]

  const pendingVerifications = [
    {
      id: 1,
      itemName: "iPhone 14 Pro",
      reporter: "Alice Johnson",
      claimer: "Bob Smith",
      date: "2024-01-15",
      type: "resolution",
    },
    {
      id: 2,
      itemName: "Black Wallet",
      reporter: "Carol Davis",
      claimer: "David Wilson",
      date: "2024-01-14",
      type: "resolution",
    },
    {
      id: 3,
      itemName: "Car Keys",
      reporter: "Eve Brown",
      claimer: "Frank Miller",
      date: "2024-01-13",
      type: "resolution",
    },
  ]

  const inviteCodes = [
    { id: 1, code: "HARV-2024-ABC123", createdBy: "Admin", createdDate: "2024-01-15", status: "active", usedBy: null },
    {
      id: 2,
      code: "HARV-2024-DEF456",
      createdBy: "Admin",
      createdDate: "2024-01-14",
      status: "used",
      usedBy: "Alice Johnson",
    },
    { id: 3, code: "HARV-2024-GHI789", createdBy: "Admin", createdDate: "2024-01-13", status: "expired", usedBy: null },
  ]

  const generateInviteCode = () => {
    const code = `HARV-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    setGeneratedCode(code)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 mr-3 text-green-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">{orgStats.name}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Organization Admin
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Organization Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgStats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgStats.activeReports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Items</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgStats.resolvedItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgStats.pendingVerifications}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="invites">Invite Users</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Organization Users</h2>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.reports}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="invites" className="space-y-6">
            <h2 className="text-2xl font-bold">Invite Users</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Invitations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Invitations
                  </CardTitle>
                  <CardDescription>Send direct email invitations to specific users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="inviteEmails">Email Addresses</Label>
                    <Textarea
                      id="inviteEmails"
                      placeholder="Enter email addresses (one per line)&#10;john@harvard.edu&#10;jane@harvard.edu"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inviteMessage">Custom Message (Optional)</Label>
                    <Textarea
                      id="inviteMessage"
                      placeholder="Add a personal message to the invitation..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Email Invitations
                  </Button>
                </CardContent>
              </Card>

              {/* Invite Codes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    Invite Codes
                  </CardTitle>
                  <CardDescription>Generate unique codes that can be shared with users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={generateInviteCode} className="w-full bg-transparent" variant="outline">
                    Generate New Invite Code
                  </Button>

                  {generatedCode && (
                    <Alert>
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-lg">{generatedCode}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedCode)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm mt-2">Share this code with users to join your organization.</p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label>Recent Invite Codes</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {inviteCodes.map((invite) => (
                        <div key={invite.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-mono text-sm">{invite.code}</span>
                            <Badge
                              variant={
                                invite.status === "active"
                                  ? "default"
                                  : invite.status === "used"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="ml-2 text-xs"
                            >
                              {invite.status}
                            </Badge>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(invite.code)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pending Verifications</h2>
              <Badge variant="secondary">{pendingVerifications.length} pending</Badge>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Claimer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className="font-medium">{verification.itemName}</TableCell>
                      <TableCell>{verification.reporter}</TableCell>
                      <TableCell>{verification.claimer}</TableCell>
                      <TableCell>{verification.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{verification.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
