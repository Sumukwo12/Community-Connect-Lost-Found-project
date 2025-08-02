import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  BarChart3
} from 'lucide-react';

export function UserDetailModal({ user, isOpen, onClose, onSave, mode = 'view' }) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
    joinDate: user?.joinDate || '',
    reports: user?.reports || 0
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
    onSave({ ...user, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (mode === 'edit') {
      setIsEditing(false);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'user',
        status: user?.status || 'active',
        joinDate: user?.joinDate || '',
        reports: user?.reports || 0
      });
    } else {
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'moderator': return <BarChart3 className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {isEditing ? <Edit className="w-5 h-5 text-blue-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
            <div>
              <CardTitle>{isEditing ? 'Edit User' : 'User Details'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Modify user information' : 'View complete user information'}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User ID */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-gray-600">User ID</Label>
            <p className="text-sm font-mono">{user.id}</p>
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

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            {isEditing ? (
              <Select onValueChange={(value) => handleSelectChange('role', value)} value={formData.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={getRoleColor(formData.role)}>
                {getRoleIcon(formData.role)}
                <span className="ml-1 capitalize">{formData.role}</span>
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
                  <SelectItem value="suspended">Suspended</SelectItem>
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

          {/* Reports Count */}
          <div className="space-y-2">
            <Label htmlFor="reports">Total Reports</Label>
            {isEditing ? (
              <Input
                id="reports"
                type="number"
                value={formData.reports}
                onChange={handleInputChange}
                min="0"
              />
            ) : (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Reports Submitted</span>
                  <span className="text-2xl font-bold text-blue-600">{formData.reports}</span>
                </div>
              </div>
            )}
          </div>

          {/* User Activity Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-gray-900">Activity Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Last Active</p>
                <p className="font-medium">Today</p>
              </div>
              <div>
                <p className="text-gray-600">Reports This Month</p>
                <p className="font-medium">{Math.floor(formData.reports / 3)}</p>
              </div>
              <div>
                <p className="text-gray-600">Resolution Rate</p>
                <p className="font-medium">85%</p>
              </div>
              <div>
                <p className="text-gray-600">Account Age</p>
                <p className="font-medium">3 months</p>
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