import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, registerWithInviteCode } = useAuth();
  const [registrationType, setRegistrationType] = useState('regular'); // 'regular' or 'invite'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
    terms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return {
      isValid: Object.values(checks).every(Boolean),
      checks
    };
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password does not meet requirements';
      }
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Invite code validation (if using invite)
    if (registrationType === 'invite' && !formData.inviteCode.trim()) {
      newErrors.inviteCode = 'Invite code is required';
    }
    
    // Terms validation
    if (!formData.terms) newErrors.terms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (registrationType === 'invite') {
        await registerWithInviteCode(formData.email, formData.password, formData.inviteCode);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      alert('Registration successful! Welcome to Community Connect.');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    alert('Google signup would be implemented here. This would redirect to Google OAuth.');
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Join our community to help reunite lost items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Registration Type Toggle */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <Button
                type="button"
                variant={registrationType === 'regular' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setRegistrationType('regular')}
              >
                Regular Registration
              </Button>
              <Button
                type="button"
                variant={registrationType === 'invite' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setRegistrationType('invite')}
              >
                Invite Code
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'border-red-500 focus:border-red-500' : ''}
                  required 
                />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'border-red-500 focus:border-red-500' : ''}
                  required 
                />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                required 
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Invite Code Field */}
            {registrationType === 'invite' && (
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Invite Code</Label>
                <Input 
                  id="inviteCode" 
                  placeholder="Enter your invite code" 
                  value={formData.inviteCode}
                  onChange={handleInputChange}
                  className={errors.inviteCode ? 'border-red-500 focus:border-red-500' : ''}
                  required 
                />
                {errors.inviteCode && <p className="text-red-500 text-xs">{errors.inviteCode}</p>}
                <p className="text-xs text-gray-500">
                  Enter the invite code provided by your organization administrator.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}
                  required 
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {Object.entries(passwordValidation.checks).map(([key, isValid]) => (
                      <div
                        key={key}
                        className={`h-1 flex-1 rounded ${
                          isValid ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="grid grid-cols-2 gap-1">
                      <span className={passwordValidation.checks.length ? 'text-green-600' : 'text-gray-500'}>
                        ✓ At least 8 characters
                      </span>
                      <span className={passwordValidation.checks.uppercase ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One uppercase letter
                      </span>
                      <span className={passwordValidation.checks.lowercase ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One lowercase letter
                      </span>
                      <span className={passwordValidation.checks.number ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One number
                      </span>
                      <span className={passwordValidation.checks.special ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One special character
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}
                  required 
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-600 text-xs">✓ Passwords match</p>
              )}
            </div>
            
            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="rounded mt-1" 
                checked={formData.terms}
                onChange={handleInputChange}
                required 
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => alert('Terms of Service would be displayed here')}
                  className="text-blue-600 hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => alert('Privacy Policy would be displayed here')}
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </button>
              </Label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Separator />
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full bg-transparent"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              Continue with Google
            </Button>
            
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>

            {/* Demo Information */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-xs">
                <strong>Demo Information:</strong><br/>
                • Regular Registration: Creates a user account<br/>
                • Invite Code: Use codes like "CU2024-JOHN001" or "TI2024-SARAH001"<br/>
                • Super Admin: superadmin@system.com / super123<br/>
                • Organization Admin: admin@central.edu / admin123
              </p>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
} 