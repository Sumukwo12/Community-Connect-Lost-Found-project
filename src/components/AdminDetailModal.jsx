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
  Shield, 
  Mail, 
  Building2, 
  Edit, 
  Save, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  BarChart3
} from 'lucide-react';

export function AdminDetailModal({ admin, isOpen, onClose, onSave, mode = 'view' }) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    organizationName: admin?.organizationName || '',
    role: admin?.role || 'admin',
    status: admin?.status || 'active',
    joinDate: admin?.joinDate || '',
    permissions: admin?.permissions || [],
    contactInfo: admin?.contactInfo || '',
    notes: admin?.notes || ''
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
    onSave({ ...admin, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (mode === 'edit') {
      setIsEditing(false);
      setFormData({
        name: admin?.name || '',
        email: admin?.email || '',
        organizationName: admin?.organizationName || '',
        role: admin?.role || 'admin',
        status: admin?.status || 'active',
        joinDate: admin?.joinDate || '',
        permissions: admin?.permissions || [],
        contactInfo: admin?.contactInfo || '',
        notes: admin?.notes || ''
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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'moderator': return <BarChart3 className="w-4 h-4" />;
      case 'super_admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'super_admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {isEditing ? <Edit className="w-5 h-5 text-blue-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
            <div>
              <CardTitle>{isEditing ? 'Edit Admin' : 'Admin Details'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Modify admin information' : 'View complete admin information'}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Admin ID */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-gray-600">Admin ID</Label>
            <p className="text-sm font-mono">{admin.id}</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <p className="text-lg font-medium">{formData.name}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <p>{formData.email}</p>
              </div>
            )}
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization</Label>
            {isEditing ? (
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                placeholder="Enter organization name"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <p>{formData.organizationName}</p>
              </div>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            {isEditing ? (
              <Select onValueChange={(value) => handleSelectChange('role', value)} value={formData.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={getRoleColor(formData.role)}>
                {getRoleIcon(formData.role)}
                <span className="ml-1 capitalize">{formData.role.replace('_', ' ')}</span>
              </Badge>
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

          {/* Join Date */}
          <div className="space-y-2">
            <Label htmlFor="joinDate">Join Date</Label>
            {isEditing ? (
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p>{formData.joinDate}</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            {isEditing ? (
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Phone number or additional contact info"
              />
            ) : (
              <p>{formData.contactInfo || 'No contact information provided'}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter admin notes"
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-gray-700">{formData.notes || 'No notes available'}</p>
            )}
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2">
              {['user_management', 'item_management', 'report_management', 'invite_management'].map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={permission}
                    checked={formData.permissions.includes(permission)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          permissions: [...prev.permissions, permission]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          permissions: prev.permissions.filter(p => p !== permission)
                        }));
                      }
                    }}
                    disabled={!isEditing}
                    className="rounded"
                  />
                  <Label htmlFor={permission} className="text-sm capitalize">
                    {permission.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Activity Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-gray-900">Activity Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Users Managed</p>
                <p className="font-medium">1,250</p>
              </div>
              <div>
                <p className="text-gray-600">Items Reviewed</p>
                <p className="font-medium">3,891</p>
              </div>
              <div>
                <p className="text-gray-600">Reports Handled</p>
                <p className="font-medium">156</p>
              </div>
              <div>
                <p className="text-gray-600">Last Active</p>
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