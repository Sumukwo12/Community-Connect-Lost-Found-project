import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Upload } from "lucide-react"

export default function ReportLostPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Lost Item</h1>
          <p className="text-gray-600">Provide as much detail as possible to help others identify your lost item.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Lost Item Details
            </CardTitle>
            <CardDescription>Fill out this form to report your lost item to the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input id="itemName" placeholder="e.g., iPhone 14 Pro" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="bags">Bags & Wallets</SelectItem>
                    <SelectItem value="keys">Keys</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="pets">Pets</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description including color, brand, size, distinctive features, etc."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastSeen">Last Seen Location *</Label>
                <Input id="lastSeen" placeholder="e.g., Central Park, NYC" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateLost">Date Lost *</Label>
                <Input id="dateLost" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Reward (Optional)</Label>
              <Input id="reward" placeholder="e.g., $50 reward" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input id="contactInfo" placeholder="Your email or phone number" required />
            </div>

            <div className="space-y-2">
              <Label>Upload Photos (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop photos of your lost item</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                <Button variant="outline" className="mt-2 bg-transparent">
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded" required />
              <Label htmlFor="terms" className="text-sm">
                I confirm that the information provided is accurate and I agree to the community guidelines.
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                Report Lost Item
              </Button>
              <Button type="button" variant="outline" className="flex-1 bg-transparent">
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
