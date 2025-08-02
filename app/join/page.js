import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, ArrowLeft } from "lucide-react"

export default function JoinWithCodePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <QrCode className="w-6 h-6 mr-2" />
            Join with Invite Code
          </CardTitle>
          <CardDescription className="text-center">
            Enter the invite code provided by your organization admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="e.g., HARV-2024-ABC123"
              className="font-mono text-center text-lg"
              required
            />
          </div>

          <Alert>
            <AlertDescription>
              Each invite code can only be used once and is specific to an organization.
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full">
            Verify Code & Continue
          </Button>

          <div className="text-center text-sm space-y-2">
            <p>{"Don't have an invite code?"}</p>
            <Link href="/join/email" className="text-blue-600 hover:underline">
              Join with email invitation
            </Link>
            <p className="text-gray-500">or</p>
            <Link href="/register" className="text-blue-600 hover:underline">
              Create a general account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
