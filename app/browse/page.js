import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Filter } from "lucide-react"

export default function BrowsePage() {
  const items = [
    {
      id: 1,
      type: "Lost",
      title: "iPhone 14 Pro - Space Black",
      description: "Lost my iPhone 14 Pro in Space Black color. Has a clear case with a blue PopSocket.",
      location: "Central Park, NYC",
      date: "2024-01-15",
      category: "Electronics",
      reward: "$100",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      type: "Found",
      title: "Black Leather Wallet",
      description: "Found a black leather wallet near the subway station. Contains some cards.",
      location: "Union Square Station",
      date: "2024-01-14",
      category: "Bags & Wallets",
      reward: null,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      type: "Lost",
      title: "Golden Retriever - Max",
      description: "My golden retriever Max went missing. He's very friendly and responds to his name.",
      location: "Brooklyn Bridge Park",
      date: "2024-01-13",
      category: "Pets",
      reward: "$500",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      type: "Found",
      title: "Silver Watch",
      description: "Found a silver watch with a leather strap at the coffee shop.",
      location: "Starbucks on 5th Ave",
      date: "2024-01-12",
      category: "Jewelry",
      reward: null,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      type: "Lost",
      title: "Car Keys with BMW Keychain",
      description: "Lost my car keys with a BMW keychain and house keys attached.",
      location: "Shopping Mall Parking",
      date: "2024-01-11",
      category: "Keys",
      reward: "$50",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      type: "Found",
      title: "Red Backpack",
      description: "Found a red backpack with school supplies inside at the bus stop.",
      location: "Main St Bus Stop",
      date: "2024-01-10",
      category: "Bags & Wallets",
      reward: null,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Lost & Found Items</h1>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search items, locations, or descriptions..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="bags">Bags & Wallets</SelectItem>
                  <SelectItem value="keys">Keys</SelectItem>
                  <SelectItem value="pets">Pets</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="lost">Lost Only</SelectItem>
                  <SelectItem value="found">Found Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Showing {items.length} items</p>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="location">By Location</SelectItem>
              <SelectItem value="reward">By Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={item.type === "Lost" ? "destructive" : "default"}
                    className={item.type === "Lost" ? "bg-red-600" : "bg-green-600"}
                  >
                    {item.type}
                  </Badge>
                </div>
                {item.reward && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {item.reward}
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Items
          </Button>
        </div>
      </div>
    </div>
  )
}
