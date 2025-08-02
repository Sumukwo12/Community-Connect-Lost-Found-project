import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ReportFoundPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    foundLocation: '',
    dateFound: '',
    contactInfo: '',
    terms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
    
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.foundLocation.trim()) newErrors.foundLocation = 'Found location is required';
    if (!formData.dateFound) newErrors.dateFound = 'Date found is required';
    if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact information is required';
    if (!formData.terms) newErrors.terms = 'You must agree to the community guidelines';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only JPG, JPEG, or PNG files.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length !== fileArray.length) {
      return; // Some files were invalid
    }

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call with file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just log the data and redirect
      console.log('Found item report:', formData);
      console.log('Uploaded files:', uploadedFiles.map(f => f.name));
      alert('Found item reported successfully! (Demo mode)');
      navigate('/browse');
    } catch (error) {
      console.error('Report error:', error);
      alert('Failed to report found item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Save form data to localStorage for draft functionality
    const draftData = {
      ...formData,
      uploadedFiles: uploadedFiles.map(f => ({ name: f.name, id: f.id }))
    };
    localStorage.setItem('foundItemDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Found Item</h1>
          <p className="text-gray-600">Help reunite found items with their owners by providing detailed information.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-green-600" />
                Found Item Details
              </CardTitle>
              <CardDescription>Fill out this form to report an item you found to the community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input 
                    id="itemName" 
                    placeholder="e.g., Black Wallet" 
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className={errors.itemName ? 'border-red-500' : ''}
                    required 
                  />
                  {errors.itemName && <p className="text-red-500 text-xs">{errors.itemName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={handleSelectChange} value={formData.category}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="bags">Bags & Wallets</SelectItem>
                      <SelectItem value="keys">Keys</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="pets">Pets</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description including color, brand, size, distinctive features, etc."
                  className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foundLocation">Found Location *</Label>
                  <Input 
                    id="foundLocation" 
                    placeholder="e.g., Central Park, NYC" 
                    value={formData.foundLocation}
                    onChange={handleInputChange}
                    className={errors.foundLocation ? 'border-red-500' : ''}
                    required 
                  />
                  {errors.foundLocation && <p className="text-red-500 text-xs">{errors.foundLocation}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFound">Date Found *</Label>
                  <Input 
                    id="dateFound" 
                    type="date" 
                    value={formData.dateFound}
                    onChange={handleInputChange}
                    className={errors.dateFound ? 'border-red-500' : ''}
                    required 
                  />
                  {errors.dateFound && <p className="text-red-500 text-xs">{errors.dateFound}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information *</Label>
                <Input 
                  id="contactInfo" 
                  placeholder="Your email or phone number" 
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  className={errors.contactInfo ? 'border-red-500' : ''}
                  required 
                />
                {errors.contactInfo && <p className="text-red-500 text-xs">{errors.contactInfo}</p>}
              </div>

              <div className="space-y-2">
                <Label>Upload Photos (Optional)</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop photos of the found item'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 10MB each</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-transparent"
                    onClick={handleFileUpload}
                  >
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* File Preview Section */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Photos ({uploadedFiles.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="rounded" 
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required 
                />
                <Label htmlFor="terms" className="text-sm">
                  I confirm that the information provided is accurate and I agree to the community guidelines.
                </Label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? 'Reporting...' : 'Report Found Item'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 bg-transparent"
                  onClick={handleSaveDraft}
                >
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
} 