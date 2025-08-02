import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([
    {
      id: 1,
      name: 'Central University',
      code: 'CU2024',
      location: 'New York, NY',
      adminCount: 3,
      userCount: 1250,
      status: 'active'
    },
    {
      id: 2,
      name: 'Tech Institute',
      code: 'TI2024',
      location: 'San Francisco, CA',
      adminCount: 2,
      userCount: 890,
      status: 'active'
    },
    {
      id: 3,
      name: 'Community College',
      code: 'CC2024',
      location: 'Chicago, IL',
      adminCount: 1,
      userCount: 567,
      status: 'active'
    }
  ]);

  const [inviteCodes, setInviteCodes] = useState([
    {
      id: 1,
      code: 'CU2024-JOHN001',
      organizationId: 1,
      organizationName: 'Central University',
      email: 'john@central.edu',
      role: 'user',
      status: 'pending',
      createdAt: '2024-01-15',
      expiresAt: '2024-02-15'
    },
    {
      id: 2,
      code: 'TI2024-SARAH001',
      organizationId: 2,
      organizationName: 'Tech Institute',
      email: 'sarah@tech.edu',
      role: 'user',
      status: 'pending',
      createdAt: '2024-01-14',
      expiresAt: '2024-02-14'
    }
  ]);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    if (email === 'superadmin@system.com' && password === 'super123') {
      const userData = {
        id: 1,
        email: 'superadmin@system.com',
        name: 'Super Administrator',
        role: 'super_admin',
        organizationId: null,
        organizationName: 'System Wide',
        permissions: ['manage_all_organizations', 'manage_all_admins', 'view_all_data']
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else if (email === 'admin@central.edu' && password === 'admin123') {
      const userData = {
        id: 2,
        email: 'admin@central.edu',
        name: 'Central University Admin',
        role: 'admin',
        organizationId: 1,
        organizationName: 'Central University',
        permissions: ['manage_organization_users', 'verify_resolutions', 'view_organization_data']
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else if (email === 'admin@tech.edu' && password === 'admin123') {
      const userData = {
        id: 3,
        email: 'admin@tech.edu',
        name: 'Tech Institute Admin',
        role: 'admin',
        organizationId: 2,
        organizationName: 'Tech Institute',
        permissions: ['manage_organization_users', 'verify_resolutions', 'view_organization_data']
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else if (email === 'demo@example.com' && password === 'password') {
      const userData = {
        id: 4,
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'user',
        organizationId: 1,
        organizationName: 'Central University',
        permissions: ['report_items', 'view_items']
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would create the user in the database
    const newUser = {
      id: Date.now(),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      role: 'user',
      organizationId: userData.organizationId || 1,
      organizationName: userData.organizationName || 'Central University',
      permissions: ['report_items', 'view_items']
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const registerWithInviteCode = async (inviteCode, userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find the invite code
    const invite = inviteCodes.find(inv => inv.code === inviteCode && inv.status === 'pending');
    if (!invite) {
      throw new Error('Invalid or expired invite code');
    }
    
    // Create user with organization info from invite
    const newUser = {
      id: Date.now(),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      role: invite.role,
      organizationId: invite.organizationId,
      organizationName: invite.organizationName,
      permissions: invite.role === 'admin' 
        ? ['manage_organization_users', 'verify_resolutions', 'view_organization_data']
        : ['report_items', 'view_items']
    };
    
    // Mark invite as used
    setInviteCodes(prev => prev.map(inv => 
      inv.id === invite.id ? { ...inv, status: 'used' } : inv
    ));
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const createOrganization = async (orgData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newOrg = {
      id: Date.now(),
      name: orgData.name,
      code: orgData.code,
      location: orgData.location,
      adminCount: 0,
      userCount: 0,
      status: 'active'
    };
    
    setOrganizations(prev => [...prev, newOrg]);
    return { success: true, organization: newOrg };
  };

  const createAdmin = async (adminData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAdmin = {
      id: Date.now(),
      email: adminData.email,
      name: adminData.name,
      role: 'admin',
      organizationId: adminData.organizationId,
      organizationName: adminData.organizationName,
      permissions: ['manage_organization_users', 'verify_resolutions', 'view_organization_data']
    };
    
    // Update organization admin count
    setOrganizations(prev => prev.map(org => 
      org.id === adminData.organizationId 
        ? { ...org, adminCount: org.adminCount + 1 }
        : org
    ));
    
    return { success: true, admin: newAdmin };
  };

  const generateInviteCode = async (inviteData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const code = `${inviteData.organizationCode}-${inviteData.email.split('@')[0].toUpperCase()}${Date.now().toString().slice(-3)}`;
    
    const newInvite = {
      id: Date.now(),
      code: code,
      organizationId: inviteData.organizationId,
      organizationName: inviteData.organizationName,
      email: inviteData.email,
      role: inviteData.role,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days
    };
    
    setInviteCodes(prev => [...prev, newInvite]);
    return { success: true, invite: newInvite };
  };

  const deleteAdmin = async (adminId, organizationId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update organization admin count
    setOrganizations(prev => prev.map(org => 
      org.id === organizationId 
        ? { ...org, adminCount: Math.max(0, org.adminCount - 1) }
        : org
    ));
    
    return { success: true };
  };

  const deleteOrganization = async (orgId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOrganizations(prev => prev.filter(org => org.id !== orgId));
    return { success: true };
  };

  const value = {
    user,
    login,
    register,
    registerWithInviteCode,
    logout,
    loading,
    organizations,
    inviteCodes,
    createOrganization,
    createAdmin,
    generateInviteCode,
    deleteAdmin,
    deleteOrganization
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 