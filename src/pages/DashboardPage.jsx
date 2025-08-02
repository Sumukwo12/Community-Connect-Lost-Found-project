import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  MapPin, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Shield, 
  Building,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Bell,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const getQuickActions = () => {
    const actions = [
      {
        title: "Report Lost Item",
        description: "Report something you lost",
        icon: <MapPin className="w-6 h-6" />,
        color: "bg-red-500",
        href: "/report-lost"
      },
      {
        title: "Report Found Item",
        description: "Report something you found",
        icon: <Search className="w-6 h-6" />,
        color: "bg-green-500",
        href: "/report-found"
      },
      {
        title: "Browse Items",
        description: "Search for lost or found items",
        icon: <Eye className="w-6 h-6" />,
        color: "bg-blue-500",
        href: "/browse"
      }
    ];

    if (user?.role === 'admin') {
      actions.push(
        {
          title: "Manage Users",
          description: "View and manage users",
          icon: <Users className="w-6 h-6" />,
          color: "bg-purple-500",
          href: "/admin"
        },
        {
          title: "View Reports",
          description: "Review and manage reports",
          icon: <FileText className="w-6 h-6" />,
          color: "bg-orange-500",
          href: "/admin"
        }
      );
    }

    if (user?.role === 'super_admin') {
      actions.push(
        {
          title: "Manage Organizations",
          description: "View and manage organizations",
          icon: <Building className="w-6 h-6" />,
          color: "bg-indigo-500",
          href: "/super-admin"
        },
        {
          title: "System Settings",
          description: "Configure system settings",
          icon: <Settings className="w-6 h-6" />,
          color: "bg-gray-500",
          href: "/super-admin"
        }
      );
    }

    return actions;
  };

  const getStats = () => {
    const baseStats = [
      { title: "Total Reports", value: "156", change: "+12%", icon: <FileText className="w-5 h-5" />, color: "text-blue-600" },
      { title: "Resolved Cases", value: "89", change: "+8%", icon: <TrendingUp className="w-5 h-5" />, color: "text-green-600" },
      { title: "Active Users", value: "2,847", change: "+15%", icon: <Users className="w-5 h-5" />, color: "text-purple-600" }
    ];

    if (user?.role === 'admin') {
      baseStats.push(
        { title: "Pending Reviews", value: "23", change: "-5%", icon: <Bell className="w-5 h-5" />, color: "text-orange-600" }
      );
    }

    if (user?.role === 'super_admin') {
      baseStats.push(
        { title: "Organizations", value: "45", change: "+3%", icon: <Building className="w-5 h-5" />, color: "text-indigo-600" },
        { title: "System Admins", value: "12", change: "+2%", icon: <Shield className="w-5 h-5" />, color: "text-gray-600" }
      );
    }

    return baseStats;
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm border-b"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Activity className="w-3 h-3" />
                <span>{user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'User'}</span>
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.nav 
        className="bg-white border-b"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: <Settings className="w-4 h-4" /> }] : []),
              ...(user?.role === 'super_admin' ? [{ id: 'super-admin', label: 'Super Admin', icon: <Shield className="w-4 h-4" /> }] : [])
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                variants={tabVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              variants={itemVariants}
            >
              {getStats().map((stat, index) => (
                <motion.div
                  key={index}
                  variants={statsVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <motion.p 
                            className={`text-2xl font-bold ${stat.color}`}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600 font-medium">{stat.change}</span>
                        <span className="text-gray-500 ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getQuickActions().map((action, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Link to={action.href} className="block">
                          <div className="flex items-center space-x-4">
                            <motion.div 
                              className={`p-3 rounded-lg ${action.color} text-white`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {action.icon}
                            </motion.div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{action.title}</h3>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { action: "New report submitted", item: "iPhone 14 Pro", time: "2 hours ago", type: "lost" },
                      { action: "Item resolved", item: "Black Wallet", time: "4 hours ago", type: "found" },
                      { action: "New user registered", item: "John Doe", time: "6 hours ago", type: "user" },
                      { action: "Report updated", item: "Car Keys", time: "1 day ago", type: "lost" }
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'lost' ? 'bg-red-500' : 
                          activity.type === 'found' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'admin' && user?.role === 'admin' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Panel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Manage Users", description: "View and manage user accounts", icon: <Users className="w-6 h-6" />, color: "bg-purple-500" },
                  { title: "Review Reports", description: "Review and approve reports", icon: <FileText className="w-6 h-6" />, color: "bg-orange-500" },
                  { title: "Analytics", description: "View system analytics", icon: <BarChart3 className="w-6 h-6" />, color: "bg-blue-500" }
                ].map((action, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className={`p-3 rounded-lg ${action.color} text-white`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {action.icon}
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'super-admin' && user?.role === 'super_admin' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Super Admin Panel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Manage Organizations", description: "View and manage organizations", icon: <Building className="w-6 h-6" />, color: "bg-indigo-500" },
                  { title: "System Settings", description: "Configure system settings", icon: <Settings className="w-6 h-6" />, color: "bg-gray-500" },
                  { title: "User Management", description: "Manage all users", icon: <Users className="w-6 h-6" />, color: "bg-purple-500" }
                ].map((action, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className={`p-3 rounded-lg ${action.color} text-white`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {action.icon}
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 