import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, MapPin, Clock, Users, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to browse page with search term
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // If no search term, just go to browse page
      navigate('/browse');
    }
  };

  const handleLogout = () => {
    logout();
    alert('You have been logged out successfully.');
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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
      scale: 1.05,
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

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Community Connect</span>
          </motion.div>
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { to: "/browse", text: "Browse Items" },
              { to: "/report-lost", text: "Report Lost" },
              { to: "/report-found", text: "Report Found" },
              { to: "/about", text: "About" }
            ].map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={link.to} 
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  {link.text}
            </Link>
              </motion.div>
            ))}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                  Dashboard
            </Link>
              </motion.div>
            )}
            {user?.role === 'super_admin' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/super-admin" className="text-yellow-600 hover:text-yellow-700 font-medium">
                  Super Admin
            </Link>
              </motion.div>
            )}
            {user?.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-medium">
                  Admin Panel
            </Link>
              </motion.div>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            {user ? (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Welcome, {user.name}</span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-4"
        variants={itemVariants}
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Reunite Lost Items with Their Owners
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join our community platform to report lost items, help others find their belongings, and make your
            neighborhood a more connected place.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search for lost or found items..." 
                  className="pl-10 h-12 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Search
              </Button>
            </form>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
              <Link to="/report-lost">
                <MapPin className="w-4 h-4 mr-2" />
                Report Lost Item
              </Link>
            </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" asChild>
              <Link to="/report-found">
                <Search className="w-4 h-4 mr-2" />
                Report Found Item
              </Link>
            </Button>
            </motion.div>
            {user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">
                    <Users className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-white"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: "1,247", label: "Items Reunited", color: "text-blue-600" },
              { number: "3,891", label: "Active Members", color: "text-green-600" },
              { number: "156", label: "Cities Covered", color: "text-purple-600" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="space-y-2"
                variants={statsVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className={`text-3xl font-bold ${stat.color}`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-16 px-4"
        variants={itemVariants}
      >
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-red-600" />,
                title: "Report",
                description: "Report your lost item or something you found with detailed description and location.",
                bgColor: "bg-red-100"
              },
              {
                icon: <Search className="w-6 h-6 text-blue-600" />,
                title: "Search",
                description: "Browse through reported items or use our smart search to find matches.",
                bgColor: "bg-blue-100"
              },
              {
                icon: <Users className="w-6 h-6 text-green-600" />,
                title: "Connect",
                description: "Get connected with the person who found your item or help someone get theirs back.",
                bgColor: "bg-green-100"
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center h-full">
              <CardHeader>
                    <motion.div 
                      className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {card.icon}
                    </motion.div>
                    <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                      {card.description}
                </CardDescription>
              </CardContent>
            </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Items */}
      <motion.section 
        className="py-16 bg-gray-50"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Recent Reports
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "Lost", item: "iPhone 14 Pro", location: "Central Park", time: "2 hours ago", color: "red" },
              { type: "Found", item: "Black Wallet", location: "Coffee Shop", time: "4 hours ago", color: "green" },
              { type: "Lost", item: "Car Keys", location: "Mall Parking", time: "6 hours ago", color: "red" },
              { type: "Found", item: "Gold Watch", location: "Bus Station", time: "1 day ago", color: "green" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.color === "red" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.time}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{item.item}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </p>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/browse">View All Items</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-12"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Community Connect</span>
              </motion.div>
              <p className="text-gray-400">Helping communities reunite lost items with their owners.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/browse" className="hover:text-white transition-colors duration-200">
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link to="/report-lost" className="hover:text-white transition-colors duration-200">
                    Report Lost
                  </Link>
                </li>
                <li>
                  <Link to="/report-found" className="hover:text-white transition-colors duration-200">
                    Report Found
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-white transition-colors duration-200">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/safety" className="hover:text-white transition-colors duration-200">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-white transition-colors duration-200">
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-white transition-colors duration-200">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Community Connect. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
} 