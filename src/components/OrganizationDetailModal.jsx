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
  Building2, 
  MapPin, 
  Users, 
  Edit, 
  Save, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react';

export function OrganizationDetailModal({ organization, isOpen, onClose, onSave, mode = 'view' }) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    code: organization?.code || '',
    location: organization?.location || '',
    status: organization?.status || 'active',
    description: organization?.description || '',
    adminCount: organization?.adminCount || 0,
    userCount: organization?.userCount || 0,
    createdAt: organization?.createdAt || '',
    contactEmail: organization?.contactEmail || '',
    website: organization?.website || ''
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
    onSave({ ...organization, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (mode === 'edit') {
      setIsEditing(false);
      setFormData({
        name: organization?.name || '',
        code: organization?.code || '',
        location: organization?.location || '',
        status: organization?.status || 'active',
        description: organization?.description || '',
        adminCount: organization?.adminCount || 0,
        userCount: organization?.userCount || 0,
        createdAt: organization?.createdAt || '',
        contactEmail: organization?.contactEmail || '',
        website: organization?.website || ''
      });
    } else {
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {isEditing ? <Edit className="w-5 h-5 text-blue-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
            <div>
              <CardTitle>{isEditing ? 'Edit Organization' : 'Organization Details'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Modify organization information' : 'View complete organization information'}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization ID */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-gray-600">Organization ID</Label>
            <p className="text-sm font-mono">{organization.id}</p>
          </div>

          {/* Organization Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Organization Code</Label>
            {isEditing ? (
              <Input
                id="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter organization code"
              />
            ) : (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-mono font-medium text-blue-900">{formData.code}</p>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter organization name"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <p className="text-lg font-medium">{formData.name}</p>
              </div>
            )}
          </div>

          {/* Location */}
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

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={getStatusColor(formData.status)}>
                {getStatusIcon(formData.status)}
                <span className="ml-1 capitalize">{formData.status}</span>
              </Badge>
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
                placeholder="Enter organization description"
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-gray-700">{formData.description || 'No description provided'}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              {isEditing ? (
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Enter contact email"
                />
              ) : (
                <p>{formData.contactEmail || 'No contact email'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              {isEditing ? (
                <Input
                  id="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Enter website URL"
                />
              ) : (
                <p>{formData.website || 'No website'}</p>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminCount">Number of Admins</Label>
              {isEditing ? (
                <Input
                  id="adminCount"
                  type="number"
                  value={formData.adminCount}
                  onChange={handleInputChange}
                  min="0"
                />
              ) : (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-900">Admins</span>
                    <span className="text-2xl font-bold text-purple-600">{formData.adminCount}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="userCount">Number of Users</Label>
              {isEditing ? (
                <Input
                  id="userCount"
                  type="number"
                  value={formData.userCount}
                  onChange={handleInputChange}
                  min="0"
                />
              ) : (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Users</span>
                    <span className="text-2xl font-bold text-green-600">{formData.userCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Created Date */}
          <div className="space-y-2">
            <Label htmlFor="createdAt">Created Date</Label>
            {isEditing ? (
              <Input
                id="createdAt"
                type="date"
                value={formData.createdAt}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p>{formData.createdAt}</p>
              </div>
            )}
          </div>

          {/* Organization Activity Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-gray-900">Activity Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Items</p>
                <p className="font-medium">{formData.userCount * 3}</p>
              </div>
              <div>
                <p className="text-gray-600">Active Reports</p>
                <p className="font-medium">{Math.floor(formData.userCount * 0.1)}</p>
              </div>
              <div>
                <p className="text-gray-600">Resolution Rate</p>
                <p className="font-medium">92%</p>
              </div>
              <div>
                <p className="text-gray-600">Last Activity</p>
                <p className="font-medium">Today</p>
              </div>
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