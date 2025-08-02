import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Edit, 
  Save, 
  Eye,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export function ItemDetailModal({ item, isOpen, onClose, onSave, mode = 'view' }) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    category: item?.category || '',
    location: item?.location || '',
    date: item?.date || '',
    status: item?.status || 'pending',
    contactInfo: item?.contactInfo || '',
    reward: item?.reward || '',
    additionalNotes: item?.additionalNotes || ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave({ ...item, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (mode === 'edit') {
      setIsEditing(false);
      setFormData({
        title: item?.title || '',
        description: item?.description || '',
        category: item?.category || '',
        location: item?.location || '',
        date: item?.date || '',
        status: item?.status || 'pending',
        contactInfo: item?.contactInfo || '',
        reward: item?.reward || '',
        additionalNotes: item?.additionalNotes || ''
      });
    } else {
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {isEditing ? <Edit className="w-5 h-5 text-blue-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
            <div>
              <CardTitle>{isEditing ? 'Edit Item' : 'Item Details'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Modify item information' : 'View complete item information'}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Item Type Badge */}
          <div className="flex items-center justify-between">
            <Badge className={item.type === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {item.type}
            </Badge>
            {!isEditing && (
              <Badge className={getStatusColor(formData.status)}>
                {getStatusIcon(formData.status)}
                <span className="ml-1">{formData.status}</span>
              </Badge>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Item Title</Label>
            {isEditing ? (
              <Input
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter item title"
              />
            ) : (
              <p className="text-lg font-medium">{formData.title}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {isEditing ? (
              <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
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
            ) : (
              <p className="capitalize">{formData.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description"
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-gray-700">{formData.description}</p>
            )}
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <p>{formData.location}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              {isEditing ? (
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p>{new Date(formData.date).toLocaleDateString()}</p>
                </div>
              )}
            </div>


          {/* Contact Info and Reward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information</Label>
              {isEditing ? (
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="Email or phone number"
                />
              ) : (
                <p>{formData.contactInfo}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward">Reward (Optional)</Label>
              {isEditing ? (
                <Input
                  id="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  placeholder="e.g., $50 reward"
                />
              ) : (
                <p>{formData.reward || 'No reward offered'}</p>
              )}
            </div>
          </div>

          {/* Status (only in edit mode) */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            {isEditing ? (
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional notes"
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-gray-700">{formData.additionalNotes || 'No additional notes'}</p>
            )}
          </div>

          {/* User Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <Label className="text-sm font-medium">Reported by</Label>
            </div>
            <p className="text-sm text-gray-700">{item.user || 'Anonymous User'}</p>
          </div>

          {/* Photos Section */}
          <div className="space-y-2">
            <Label>Photos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No photos uploaded</p>
              <p className="text-xs text-gray-500">Photos would be displayed here</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 