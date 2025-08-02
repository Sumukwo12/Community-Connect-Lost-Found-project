import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { UserManagementModal } from '../components/UserManagementModal';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { UserDetailModal } from '../components/UserDetailModal';
import { ReportDetailModal } from '../components/ReportDetailModal';
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
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, logout, generateInviteCode, inviteCodes } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [inviteFormData, setInviteFormData] = useState({
    email: '',
    role: 'user'
  });

  // Modal states for viewing/editing details
  const [showItemModal, setShowItemModal] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalMode, setModalMode] = useState('view');

  // Mock data for admin dashboard (organization-specific)
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalItems: 3891,
    pendingApprovals: 23,
    resolvedCases: 2156,
    activeReports: 156,
    newUsersToday: 12
  });

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@central.edu', role: 'user', status: 'active', joinDate: '2024-01-15', reports: 5 },
    { id: 2, name: 'Jane Smith', email: 'jane@central.edu', role: 'user', status: 'active', joinDate: '2024-01-14', reports: 3 },
    { id: 3, name: 'Bob Johnson', email: 'bob@central.edu', role: 'user', status: 'suspended', joinDate: '2024-01-10', reports: 0 },
    { id: 4, name: 'Alice Brown', email: 'alice@central.edu', role: 'moderator', status: 'active', joinDate: '2024-01-08', reports: 12 },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@central.edu', role: 'user', status: 'active', joinDate: '2024-01-05', reports: 2 }
  ]);

  const [items, setItems] = useState([
    { id: 1, title: 'iPhone 14 Pro', type: 'Lost', status: 'pending', user: 'John Doe', date: '2024-01-15', location: 'Central Park' },
    { id: 2, title: 'Black Wallet', type: 'Found', status: 'approved', user: 'Jane Smith', date: '2024-01-14', location: 'Coffee Shop' },
    { id: 3, title: 'Car Keys', type: 'Lost', status: 'resolved', user: 'Bob Johnson', date: '2024-01-10', location: 'Mall Parking' },
    { id: 4, title: 'Gold Watch', type: 'Found', status: 'pending', user: 'Alice Brown', date: '2024-01-08', location: 'Bus Station' },
    { id: 5, title: 'AirPods Pro', type: 'Lost', status: 'approved', user: 'Charlie Wilson', date: '2024-01-05', location: 'Gym' }
  ]);

  const [reports, setReports] = useState([
    { id: 1, type: 'inappropriate', item: 'iPhone 14 Pro', reporter: 'User123', reason: 'Spam content', status: 'pending' },
    { id: 2, type: 'fake', item: 'Diamond Ring', reporter: 'User456', reason: 'Suspicious listing', status: 'investigating' },
    { id: 3, type: 'duplicate', item: 'Car Keys', reporter: 'User789', reason: 'Multiple listings', status: 'resolved' }
  ]);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUserAction = (userId, action) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: action === 'suspend' ? 'suspended' : 'active' }
        : user
    ));
    alert(`User ${action === 'suspend' ? 'suspended' : 'activated'} successfully.`);
  };

  const handleItemAction = (itemId, action) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: action }
        : item
    ));
    alert(`Item ${action} successfully.`);
  };

  const handleReportAction = (reportId, action) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: action }
        : report
    ));
    alert(`Report ${action} successfully.`);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      ));
      alert('User updated successfully.');
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...userData,
        joinDate: new Date().toISOString().split('T')[0],
        reports: 0
      };
      setUsers(prev => [...prev, newUser]);
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + 1,
        newUsersToday: prev.newUsersToday + 1
      }));
      alert('User created successfully.');
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1
      }));
      alert('User deleted successfully.');
    }
  };

  const handleGenerateInvite = async (inviteData) => {
    try {
      const result = await generateInviteCode({
        ...inviteData,
        organizationId: user.organizationId,
        organizationName: user.organizationName,
        organizationCode: user.organizationName.split(' ').map(word => word[0]).join('') + '2024'
      });
      if (result.success) {
        alert(`Invite code generated: ${result.invite.code}`);
        setShowInviteModal(false);
        setInviteFormData({ email: '', role: 'user' });
      }
    } catch (error) {
      alert('Failed to generate invite: ' + error.message);
    }
  };

  const handleInviteFormChange = (field, value) => {
    setInviteFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleBulkImport = () => {
    alert('Bulk import functionality would be implemented here');
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setModalMode('view');
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    setShowItemModal(true);
  };

  const handleSaveItem = (updatedItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setShowItemModal(false);
    alert('Item updated successfully!');
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      alert('Item deleted successfully.');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUserDetail(user);
    setModalMode('view');
    setShowUserDetailModal(true);
  };

  const handleSaveUserDetail = (updatedUser) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setShowUserDetailModal(false);
    alert('User updated successfully!');
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModalMode('view');
    setShowReportModal(true);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setModalMode('edit');
    setShowReportModal(true);
  };

  const handleSaveReport = (updatedReport) => {
    setReports(prev => prev.map(report => 
      report.id === updatedReport.id ? updatedReport : report
    ));
    setShowReportModal(false);
    alert('Report updated successfully!');
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(report => report.id !== reportId));
      alert('Report deleted successfully.');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const organizationInvites = inviteCodes.filter(invite => 
    invite.organizationId === user?.organizationId
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle>{user?.organizationName}</CardTitle>
              <CardDescription>Organization Dashboard</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{stats.newUsersToday} today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">{stats.activeReports} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedCases}</div>
            <p className="text-xs text-muted-foreground">Successfully reunited</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReports}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersToday}</div>
            <p className="text-xs text-muted-foreground">Recent registrations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions and item reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'pending' ? 'bg-yellow-500' : 
                      item.status === 'approved' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">by {item.user}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('users')}>
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('items')}>
                <Search className="w-4 h-4 mr-2" />
                Review Items
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('reports')}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Handle Reports
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('invites')}>
                <Mail className="w-4 h-4 mr-2" />
                Invite Codes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Search users..."
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
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">Joined: {user.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                  <Badge variant="outline">{user.role}</Badge>
                  <span className="text-sm text-gray-500">{user.reports} reports</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleUserAction(user.id, user.status === 'suspended' ? 'activate' : 'suspend')}>
                      {user.status === 'suspended' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
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

  const renderItems = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Search items..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleBulkImport}>
          <Upload className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Management</CardTitle>
          <CardDescription>Review and manage reported items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.user}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <div className="flex space-x-1">
                    {item.status === 'pending' && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleItemAction(item.id, 'approved')}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleItemAction(item.id, 'rejected')}>
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
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

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Search reports..."
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
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Management</CardTitle>
          <CardDescription>Handle user reports and complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{report.item}</p>
                    <p className="text-sm text-gray-500">Reported by {report.reporter}</p>
                    <p className="text-xs text-gray-400">Reason: {report.reason}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <Badge variant="outline">{report.type}</Badge>
                  <div className="flex space-x-1">
                    {report.status === 'pending' && (
                      <Button variant="ghost" size="sm" onClick={() => handleReportAction(report.id, 'investigating')}>
                        <Clock className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleReportAction(report.id, 'resolved')}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
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
          <CardDescription>Manage invite codes for your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organizationInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Mail className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium">{invite.code}</p>
                    <p className="text-sm text-gray-500">{invite.email}</p>
                    <p className="text-xs text-gray-400">Role: {invite.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(invite.status)}>
                    {invite.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(invite.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => alert(`Viewing invite details: ${invite.code}`)}>
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

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>Configure organization settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Auto-approve items</label>
                <Select defaultValue="disabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Moderation level</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Email notifications</label>
                <Select defaultValue="enabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">User registration</label>
                <Select defaultValue="enabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
              <span>•</span>
              <span>{user?.organizationName}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
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
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('users')}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === 'items' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('items')}
          >
            <Search className="w-4 h-4 mr-2" />
            Items
          </Button>
          <Button
            variant={activeTab === 'reports' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('reports')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button
            variant={activeTab === 'invites' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('invites')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Invites
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'items' && renderItems()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'invites' && renderInvites()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserManagementModal
          user={editingUser}
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {showItemModal && (
        <ItemDetailModal
          item={selectedItem}
          isOpen={showItemModal}
          onClose={() => setShowItemModal(false)}
          onSave={handleSaveItem}
          mode={modalMode}
        />
      )}

      {showUserDetailModal && (
        <UserDetailModal
          user={selectedUserDetail}
          isOpen={showUserDetailModal}
          onClose={() => setShowUserDetailModal(false)}
          onSave={handleSaveUserDetail}
          mode={modalMode}
        />
      )}

      {showReportModal && (
        <ReportDetailModal
          report={selectedReport}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSave={handleSaveReport}
          mode={modalMode}
        />
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
                
                if (!inviteFormData.email || !inviteFormData.role) {
                  alert('Please fill in all fields');
                  return;
                }
                
                handleGenerateInvite({
                  email: inviteFormData.email,
                  role: inviteFormData.role
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
    </div>
  );
} 