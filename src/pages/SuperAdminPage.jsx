import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { OrganizationDetailModal } from '../components/OrganizationDetailModal';
import { AdminDetailModal } from '../components/AdminDetailModal';
import { 
  Users, 
  Search, 
  Shield, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Copy,
  Building2,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const { user, logout, createOrganization, createAdmin, generateInviteCode, deleteAdmin, deleteOrganization, inviteCodes } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Form data states
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    code: '',
    location: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    organizationId: ''
  });
  const [inviteFormData, setInviteFormData] = useState({
    email: '',
    role: 'user',
    organizationId: ''
  });

  // Modal states for viewing/editing details
  const [showOrgDetailModal, setShowOrgDetailModal] = useState(false);
  const [showAdminDetailModal, setShowAdminDetailModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalMode, setModalMode] = useState('view');

  // Mock data for super admin dashboard
  const [stats, setStats] = useState({
    totalOrganizations: 3,
    totalAdmins: 6,
    totalUsers: 2707,
    totalItems: 3891,
    pendingApprovals: 23,
    resolvedCases: 2156,
    activeReports: 156,
    newOrganizationsThisMonth: 1
  });

  const [organizations, setOrganizations] = useState([
    { id: 1, name: 'Central University', code: 'CU-001', location: 'City A', status: 'active', adminCount: 2, userCount: 1500 },
    { id: 2, name: 'Tech Institute', code: 'TI-002', location: 'City B', status: 'inactive', adminCount: 1, userCount: 500 },
    { id: 3, name: 'Community College', code: 'CC-003', location: 'City A', status: 'active', adminCount: 3, userCount: 700 }
  ]);

  const [admins, setAdmins] = useState([
    { id: 1, name: 'Central University Admin', email: 'admin@central.edu', organizationId: 1, organizationName: 'Central University', status: 'active', joinDate: '2024-01-10' },
    { id: 2, name: 'Tech Institute Admin', email: 'admin@tech.edu', organizationId: 2, organizationName: 'Tech Institute', status: 'active', joinDate: '2024-01-08' },
    { id: 3, name: 'Community College Admin', email: 'admin@community.edu', organizationId: 3, organizationName: 'Community College', status: 'active', joinDate: '2024-01-05' }
  ]);

  // Check if user is super admin
  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      alert('Access denied. Super Admin privileges required.');
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateOrganization = async (orgData) => {
    try {
      const result = await createOrganization(orgData);
      if (result.success) {
        alert('Organization created successfully!');
        setShowOrgModal(false);
        setOrgFormData({ name: '', code: '', location: '' });
      }
    } catch (error) {
      alert('Failed to create organization: ' + error.message);
    }
  };

  const handleCreateAdmin = async (adminData) => {
    try {
      const result = await createAdmin(adminData);
      if (result.success) {
        setAdmins(prev => [...prev, result.admin]);
        alert('Admin created successfully!');
        setShowAdminModal(false);
        setAdminFormData({ name: '', email: '', organizationId: '' });
      }
    } catch (error) {
      alert('Failed to create admin: ' + error.message);
    }
  };

  const handleGenerateInvite = async (inviteData) => {
    try {
      const result = await generateInviteCode(inviteData);
      if (result.success) {
        alert(`Invite code generated: ${result.invite.code}`);
        setShowInviteModal(false);
        setInviteFormData({ email: '', role: 'user', organizationId: '' });
      }
    } catch (error) {
      alert('Failed to generate invite: ' + error.message);
    }
  };

  const handleDeleteAdmin = async (adminId, organizationId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await deleteAdmin(adminId, organizationId);
        setAdmins(prev => prev.filter(admin => admin.id !== adminId));
        alert('Admin deleted successfully.');
      } catch (error) {
        alert('Failed to delete admin: ' + error.message);
      }
    }
  };

  const handleDeleteOrganization = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organization? This will also delete all associated admins and users.')) {
      try {
        await deleteOrganization(orgId);
        setOrganizations(prev => prev.filter(org => org.id !== orgId));
        alert('Organization deleted successfully.');
      } catch (error) {
        alert('Failed to delete organization: ' + error.message);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleOrgFormChange = (field, value) => {
    setOrgFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdminFormChange = (field, value) => {
    setAdminFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInviteFormChange = (field, value) => {
    setInviteFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewOrganization = (org) => {
    setSelectedOrganization(org);
    setModalMode('view');
    setShowOrgDetailModal(true);
  };

  const handleEditOrganization = (org) => {
    setSelectedOrganization(org);
    setModalMode('edit');
    setShowOrgDetailModal(true);
  };

  const handleSaveOrganization = (updatedOrg) => {
    setOrganizations(prev => prev.map(org => 
      org.id === updatedOrg.id ? updatedOrg : org
    ));
    setShowOrgDetailModal(false);
    alert('Organization updated successfully!');
  };

  const handleViewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setModalMode('view');
    setShowAdminDetailModal(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setModalMode('edit');
    setShowAdminDetailModal(true);
  };

  const handleSaveAdmin = (updatedAdmin) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    ));
    setShowAdminDetailModal(false);
    alert('Admin updated successfully!');
  };

  const handleViewInvite = (invite) => {
    alert(`Viewing invite details: ${invite.code}`);
  };

  const handleExportData = () => {
    alert('Export data functionality would be implemented here');
  };

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'used': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">+{stats.newOrganizationsThisMonth} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">Across all organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Lost & found items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
            <CardDescription>Latest organizations added to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.slice(0, 5).map((org) => (
                <div key={org.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-gray-500">{org.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(org.status)}>
                      {org.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{org.adminCount} admins</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common super admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('organizations')}>
                <Building2 className="w-4 h-4 mr-2" />
                Manage Organizations
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('admins')}>
                <Shield className="w-4 h-4 mr-2" />
                Manage Admins
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('invites')}>
                <Mail className="w-4 h-4 mr-2" />
                Invite Codes
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOrganizations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowOrgModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
          <CardDescription>Manage all organizations in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrganizations.map((org) => (
              <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-gray-500">Code: {org.code}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <MapPin className="w-3 h-3 mr-1" />
                      {org.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(org.status)}>
                    {org.status}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    <div>{org.adminCount} admins</div>
                    <div>{org.userCount} users</div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrganization(org)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditOrganization(org)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteOrganization(org.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdmins = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowAdminModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>Manage all organization admins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                    <p className="text-xs text-gray-400">Organization: {admin.organizationName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(admin.status)}>
                    {admin.status}
                  </Badge>
                  <span className="text-sm text-gray-500">Joined: {admin.joinDate}</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewAdmin(admin)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditAdmin(admin)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteAdmin(admin.id, admin.organizationId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvites = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Search invites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate Invite
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite Code Management</CardTitle>
          <CardDescription>Manage invite codes for organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inviteCodes.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Mail className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium">{invite.code}</p>
                    <p className="text-sm text-gray-500">{invite.email}</p>
                    <p className="text-xs text-gray-400">Organization: {invite.organizationName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(invite.status)}>
                    {invite.status}
                  </Badge>
                  <Badge variant="outline">{invite.role}</Badge>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(invite.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleViewInvite(invite)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Super Admin Panel</span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
              <span>•</span>
              <span>System Management</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Badge className="bg-yellow-100 text-yellow-800">Super Admin</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg mb-6">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'organizations' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('organizations')}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Organizations
          </Button>
          <Button
            variant={activeTab === 'admins' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('admins')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admins
          </Button>
          <Button
            variant={activeTab === 'invites' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('invites')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Invites
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'organizations' && renderOrganizations()}
        {activeTab === 'admins' && renderAdmins()}
        {activeTab === 'invites' && renderInvites()}
      </div>

      {/* Organization Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Organization</CardTitle>
              <CardDescription>Create a new organization in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                
                if (!orgFormData.name || !orgFormData.code || !orgFormData.location) {
                  alert('Please fill in all fields');
                  return;
                }
                
                handleCreateOrganization({
                  name: orgFormData.name,
                  code: orgFormData.code,
                  location: orgFormData.location
                });
              }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization Name</label>
                  <Input 
                    value={orgFormData.name}
                    onChange={(e) => handleOrgFormChange('name', e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization Code</label>
                  <Input 
                    value={orgFormData.code}
                    onChange={(e) => handleOrgFormChange('code', e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input 
                    value={orgFormData.location}
                    onChange={(e) => handleOrgFormChange('location', e.target.value)}
                    required 
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">Create Organization</Button>
                  <Button type="button" variant="outline" onClick={() => setShowOrgModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
              <CardDescription>Create a new admin for an organization</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                
                if (!adminFormData.name || !adminFormData.email || !adminFormData.organizationId) {
                  alert('Please fill in all fields');
                  return;
                }
                
                const orgId = parseInt(adminFormData.organizationId);
                const org = organizations.find(o => o.id === orgId);
                if (!org) {
                  alert('Please select a valid organization');
                  return;
                }
                
                handleCreateAdmin({
                  name: adminFormData.name,
                  email: adminFormData.email,
                  organizationId: orgId,
                  organizationName: org.name
                });
              }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Name</label>
                  <Input 
                    value={adminFormData.name}
                    onChange={(e) => handleAdminFormChange('name', e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={adminFormData.email}
                    onChange={(e) => handleAdminFormChange('email', e.target.value)}
                    type="email" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization</label>
                  <Select 
                    value={adminFormData.organizationId} 
                    onValueChange={(value) => handleAdminFormChange('organizationId', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">Create Admin</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAdminModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Generate Invite Code</CardTitle>
              <CardDescription>Create an invite code for a user or admin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                
                if (!inviteFormData.email || !inviteFormData.role || !inviteFormData.organizationId) {
                  alert('Please fill in all fields');
                  return;
                }
                
                const orgId = parseInt(inviteFormData.organizationId);
                const org = organizations.find(o => o.id === orgId);
                if (!org) {
                  alert('Please select a valid organization');
                  return;
                }
                
                handleGenerateInvite({
                  email: inviteFormData.email,
                  role: inviteFormData.role,
                  organizationId: orgId,
                  organizationName: org.name,
                  organizationCode: org.code
                });
              }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={inviteFormData.email}
                    onChange={(e) => handleInviteFormChange('email', e.target.value)}
                    type="email" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select 
                    value={inviteFormData.role} 
                    onValueChange={(value) => handleInviteFormChange('role', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization</label>
                  <Select 
                    value={inviteFormData.organizationId} 
                    onValueChange={(value) => handleInviteFormChange('organizationId', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">Generate Invite</Button>
                  <Button type="button" variant="outline" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      {showOrgDetailModal && (
        <OrganizationDetailModal
          organization={selectedOrganization}
          isOpen={showOrgDetailModal}
          onClose={() => setShowOrgDetailModal(false)}
          onSave={handleSaveOrganization}
          mode={modalMode}
        />
      )}

      {showAdminDetailModal && (
        <AdminDetailModal
          admin={selectedAdmin}
          isOpen={showAdminDetailModal}
          onClose={() => setShowAdminDetailModal(false)}
          onSave={handleSaveAdmin}
          mode={modalMode}
        />
      )}
    </div>
  );
} 