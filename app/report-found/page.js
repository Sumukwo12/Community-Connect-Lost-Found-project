import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Upload } from "lucide-react"

export default function ReportFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Found Item</h1>
          <p className="text-gray-600">Help someone get their lost item back by reporting what you found.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-green-600" />
              Found Item Details
            </CardTitle>
            <CardDescription>
              Provide details about the item you found to help reunite it with its owner.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input id="itemName" placeholder="e.g., Black Leather Wallet" required />
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
                placeholder="Describe the item without revealing sensitive details that only the owner would know"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foundLocation">Found Location *</Label>
                <Input id="foundLocation" placeholder="e.g., Coffee Shop on Main St" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFound">Date Found *</Label>
                <Input id="dateFound" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentLocation">Current Location *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Where is the item now?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="with-me">I have it with me</SelectItem>
                  <SelectItem value="police-station">Turned in to police station</SelectItem>
                  <SelectItem value="lost-found">At a lost & found office</SelectItem>
                  <SelectItem value="business">Left at the business where I found it</SelectItem>
                  <SelectItem value="other">Other (specify in notes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input id="contactInfo" placeholder="Your email or phone number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional information that might help identify the owner"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Photos (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload photos of the found item (avoid showing sensitive details)
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                <Button variant="outline" className="mt-2 bg-transparent">
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Privacy & Safety Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Don't include sensitive information like ID numbers or addresses</li>
                <li>• Meet in public places when returning items</li>
                <li>• Ask the claimant to describe unique features to verify ownership</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded" required />
              <Label htmlFor="terms" className="text-sm">
                I confirm that I found this item and agree to the community guidelines.
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                Report Found Item
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
