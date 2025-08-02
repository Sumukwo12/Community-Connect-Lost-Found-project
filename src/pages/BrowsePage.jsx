import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ItemDetailModal } from '../components/ItemDetailModal';
import apiService from '../services/api';

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Fetch items from API
  const fetchItems = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getItems({
        page: pagination.page,
        limit: pagination.limit,
        ...params
      });

      setItems(response.items);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.message || 'Failed to load items');
      
      // Fallback to mock data if API is not available
      const mockItems = [
        {
          id: 1,
          type: 'lost',
          title: 'iPhone 14 Pro',
          description: 'Lost my iPhone 14 Pro at Central Park. It has a black case and a cracked screen protector. The phone has a distinctive red phone case and contains important photos.',
          location: 'Central Park, New York',
          date: '2024-01-15',
          status: 'active',
          reward: 100,
          category: 'electronics',
          contactInfo: 'john.doe@email.com',
          additionalNotes: 'Please contact if found. Reward will be increased for quick return.',
          user: 'John Doe',
          image: 'https://via.placeholder.com/300x200?text=iPhone+14+Pro'
        },
        {
          id: 2,
          type: 'found',
          title: 'Black Wallet',
          description: 'Found a black leather wallet near the coffee shop entrance. Contains ID and credit cards. The wallet has a small tear on the side.',
          location: 'Starbucks Coffee Shop',
          date: '2024-01-14',
          status: 'resolved',
          reward: 50,
          category: 'bags',
          contactInfo: 'sarah.smith@email.com',
          additionalNotes: 'Wallet has been claimed by owner.',
          user: 'Sarah Smith',
          image: 'https://via.placeholder.com/300x200?text=Black+Wallet'
        },
        {
          id: 3,
          type: 'lost',
          title: 'Car Keys',
          description: 'Lost my car keys with a red keychain at the mall parking lot. Please help! The keys have a Toyota logo and a red keychain with a small bell.',
          location: 'Mall Parking Lot',
          date: '2024-01-13',
          status: 'active',
          reward: 75,
          category: 'keys',
          contactInfo: 'mike.wilson@email.com',
          additionalNotes: 'Desperately need these keys back. Will offer additional reward.',
          user: 'Mike Wilson',
          image: 'https://via.placeholder.com/300x200?text=Car+Keys'
        },
        {
          id: 4,
          type: 'found',
          title: 'Gold Necklace',
          description: 'Found a beautiful gold necklace with a small pendant near the fountain. It appears to be real gold.',
          location: 'City Center Fountain',
          date: '2024-01-12',
          status: 'pending',
          reward: 0,
          category: 'jewelry',
          contactInfo: 'lisa.jones@email.com',
          additionalNotes: 'Please provide proof of ownership to claim.',
          user: 'Lisa Jones',
          image: 'https://via.placeholder.com/300x200?text=Gold+Necklace'
        },
        {
          id: 5,
          type: 'lost',
          title: 'Laptop Bag',
          description: 'Lost my laptop bag containing a MacBook Pro and important documents. The bag is black with a silver zipper.',
          location: 'University Library',
          date: '2024-01-11',
          status: 'active',
          reward: 200,
          category: 'bags',
          contactInfo: 'david.brown@email.com',
          additionalNotes: 'Contains important work files. Please return immediately.',
          user: 'David Brown',
          image: 'https://via.placeholder.com/300x200?text=Laptop+Bag'
        }
      ];
      
      setItems(mockItems);
      setPagination({
        page: 1,
        limit: 10,
        total: mockItems.length,
        pages: 1
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveItem = (updatedItem) => {
    // Update the item in the list
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading items</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchItems()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Browse Items</h1>
                <p className="text-sm text-gray-600">Find lost items or report found ones</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild>
                <Link to="/report-lost">Report Lost Item</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/report-found">Report Found Item</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {items.length} item{items.length !== 1 ? 's' : ''} found
            </h2>
            {pagination.pages > 1 && (
              <div className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="h-full hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={item.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(item.title)}`} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(item.title)}`;
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={item.type === 'lost' ? 'destructive' : 'default'}
                      className="capitalize"
                    >
                      {item.type}
                    </Badge>
                    <Badge 
                      variant={item.status === 'resolved' ? 'secondary' : 'default'}
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {item.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between">
                      {item.reward > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          Reward: ${item.reward}
                        </span>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => {
                    setPagination(prev => ({ ...prev, page: prev.page - 1 }));
                    fetchItems({ page: pagination.page - 1 });
                  }}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => {
                    setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                    fetchItems({ page: pagination.page + 1 });
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {items.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">No lost or found items have been reported yet.</p>
              <div className="flex justify-center space-x-2">
                <Button asChild>
                  <Link to="/report-lost">Report Lost Item</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/report-found">Report Found Item</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        mode="view"
      />
    </div>
  );
} 