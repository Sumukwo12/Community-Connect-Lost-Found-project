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
  AlertTriangle, 
  Flag, 
  User, 
  Edit, 
  Save, 
  Eye,
  CheckCircle,
  Clock,
  MessageSquare,
  Calendar
} from 'lucide-react';

export function ReportDetailModal({ report, isOpen, onClose, onSave, mode = 'view' }) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    type: report?.type || '',
    item: report?.item || '',
    reporter: report?.reporter || '',
    reason: report?.reason || '',
    status: report?.status || 'pending',
    description: report?.description || '',
    adminNotes: report?.adminNotes || '',
    dateReported: report?.dateReported || ''
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
    onSave({ ...report, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (mode === 'edit') {
      setIsEditing(false);
      setFormData({
        type: report?.type || '',
        item: report?.item || '',
        reporter: report?.reporter || '',
        reason: report?.reason || '',
        status: report?.status || 'pending',
        description: report?.description || '',
        adminNotes: report?.adminNotes || '',
        dateReported: report?.dateReported || ''
      });
    } else {
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'investigating': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'dismissed': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'inappropriate': return <AlertTriangle className="w-4 h-4" />;
      case 'fake': return <Flag className="w-4 h-4" />;
      case 'duplicate': return <MessageSquare className="w-4 h-4" />;
      case 'spam': return <AlertTriangle className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'inappropriate': return 'bg-red-100 text-red-800';
      case 'fake': return 'bg-orange-100 text-orange-800';
      case 'duplicate': return 'bg-blue-100 text-blue-800';
      case 'spam': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {isEditing ? <Edit className="w-5 h-5 text-blue-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
            <div>
              <CardTitle>{isEditing ? 'Edit Report' : 'Report Details'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Modify report information' : 'View complete report information'}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report ID */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-gray-600">Report ID</Label>
            <p className="text-sm font-mono">{report.id}</p>
          </div>

          {/* Report Type and Status */}
          <div className="flex items-center justify-between">
            <Badge className={getTypeColor(formData.type)}>
              {getTypeIcon(formData.type)}
              <span className="ml-1 capitalize">{formData.type}</span>
            </Badge>
            {!isEditing && (
              <Badge className={getStatusColor(formData.status)}>
                {getStatusIcon(formData.status)}
                <span className="ml-1 capitalize">{formData.status}</span>
              </Badge>
            )}
          </div>

          {/* Reported Item */}
          <div className="space-y-2">
            <Label htmlFor="item">Reported Item</Label>
            {isEditing ? (
              <Input
                id="item"
                value={formData.item}
                onChange={handleInputChange}
                placeholder="Enter item name"
              />
            ) : (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-900">{formData.item}</p>
              </div>
            )}
          </div>

          {/* Reporter */}
          <div className="space-y-2">
            <Label htmlFor="reporter">Reporter</Label>
            {isEditing ? (
              <Input
                id="reporter"
                value={formData.reporter}
                onChange={handleInputChange}
                placeholder="Enter reporter name"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <p>{formData.reporter}</p>
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Report</Label>
            {isEditing ? (
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason for report"
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-gray-700">{formData.reason}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description"
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-gray-700">{formData.description || 'No detailed description provided'}</p>
            )}
          </div>

          {/* Date Reported */}
          <div className="space-y-2">
            <Label htmlFor="dateReported">Date Reported</Label>
            {isEditing ? (
              <Input
                id="dateReported"
                type="date"
                value={formData.dateReported}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p>{formData.dateReported}</p>
              </div>
            )}
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
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes</Label>
            {isEditing ? (
              <Textarea
                id="adminNotes"
                value={formData.adminNotes}
                onChange={handleInputChange}
                placeholder="Enter admin notes or investigation details"
                className="min-h-[100px]"
              />
            ) : (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">{formData.adminNotes || 'No admin notes yet'}</p>
              </div>
            )}
          </div>

          {/* Investigation Timeline */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-gray-900">Investigation Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Report submitted</span>
                <span className="text-gray-400">- {formData.dateReported}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Under review</span>
                <span className="text-gray-400">- {formData.dateReported}</span>
              </div>
              {formData.status === 'resolved' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Resolved</span>
                  <span className="text-gray-400">- Today</span>
                </div>
              )}
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