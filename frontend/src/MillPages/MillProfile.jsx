import { useState, useEffect, useRef, useCallback } from "react";
import {
  UserIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowUpTrayIcon,
  BellIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { validateFormWithToast, showSuccessToast, showErrorToast } from '../utils/validation';

// Enhanced profile structure outside component to avoid dependency issues
const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  city: "",
  district: "",
  postalCode: "",
  businessName: "",
  businessType: "private",
  millCapacity: "",
  millLocation: "",
  licenseNumber: "",
  registrationDate: "",
  profilePhoto: "",
  password: "",
};

// Enhanced Mill Profile page component for Mill Dashboard
const MillProfile = ({ userData }) => {
  const fileInputRef = useRef(null);

  // Enhanced state management
  const [formData, setFormData] = useState(emptyProfile);
  const [originalData, setOriginalData] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileStats, setProfileStats] = useState({
    completeness: 0,
    lastUpdated: null,
    memberSince: null
  });

  // State for password fields
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  // State to control password visibility
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  // Calculate profile completeness percentage
  const calculateProfileCompleteness = useCallback(() => {
    const fields = Object.keys(emptyProfile).filter(key => key !== 'password');
    const filledFields = fields.filter(key => formData[key] && formData[key].toString().trim() !== '');
    const percentage = Math.round((filledFields.length / fields.length) * 100);
    
    setProfileStats(prev => ({
      ...prev,
      completeness: percentage
    }));
  }, [formData]);

  // Load profile data from sessionStorage on mount (only run once)
  useEffect(() => {
    const savedProfile = sessionStorage.getItem("profileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFormData(parsed);
      setOriginalData(parsed);
    } else if (userData) {
      // Initialize with userData if no saved profile exists
      const initialData = {
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phoneNumber: userData.phone || "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
        businessName: userData.business_name || "",
        businessType: userData.business_type || "private",
        millCapacity: "",
        millLocation: "",
        licenseNumber: "",
        registrationDate: userData.created_at ? new Date(userData.created_at).toISOString().split('T')[0] : "",
        profilePhoto: "",
        password: "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
    
    // Set member since date
    if (userData?.created_at) {
      setProfileStats(prev => ({
        ...prev,
        memberSince: new Date(userData.created_at).toLocaleDateString()
      }));
    }
  }, [userData]); // Removed calculateProfileCompleteness from dependency array

  // Separate effect to calculate profile completeness when formData changes
  useEffect(() => {
    calculateProfileCompleteness();
  }, [calculateProfileCompleteness]);

  // Handle changes in profile form fields with validation feedback
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Recalculate completeness on change
    setTimeout(calculateProfileCompleteness, 100);
  };

  // Handle changes in password fields
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  // Toggle password visibility for a given field
  const togglePasswordVisibility = (field) => setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  // Enhanced profile photo upload with validation
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showErrorToast('Please select a valid image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result });
        showSuccessToast('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Remove profile picture
  const removeProfilePicture = () => {
    setFormData({ ...formData, profilePhoto: '' });
    showSuccessToast('Profile picture removed');
  };


  // Cancel editing and revert changes
  const handleCancel = () => {
    setFormData(originalData);
    setPasswords({ current: "", new: "", confirm: "" });
    setIsEditing(false);
    calculateProfileCompleteness();
  };

  // Enhanced save with comprehensive validation
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber'];
      const { isValid } = validateFormWithToast(formData, requiredFields);
      
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      
      // Validate password fields if changing password
      if (passwords.new || passwords.confirm) {
        if (passwords.new !== passwords.confirm) {
          showErrorToast('New password and confirm password do not match');
          setIsLoading(false);
          return;
        }
        
        if (passwords.new.length < 6) {
          showErrorToast('New password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update password if changed
      if (passwords.new) {
        formData.password = passwords.new;
      }
      
      // Save updated profile
      const updatedProfile = {
        ...formData,
        lastUpdated: new Date().toISOString()
      };
      
      sessionStorage.setItem("profileData", JSON.stringify(updatedProfile));
      setOriginalData(updatedProfile);
      setPasswords({ current: "", new: "", confirm: "" });
      setIsEditing(false);
      
      // Update last updated date
      setProfileStats(prev => ({
        ...prev,
        lastUpdated: new Date().toLocaleDateString()
      }));
      
      showSuccessToast('Profile updated successfully!');
      
    } catch {
      showErrorToast('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Profile Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <IdentificationIcon className="h-8 w-8 text-green-600" />
                My Profile
              </h1>
              <p className="text-gray-600">Manage your personal and business information</p>
            </div>
            
            {/* Profile Stats Cards */}
            <div className="mt-4 md:mt-0 flex gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-700">{profileStats.completeness}%</div>
                <div className="text-xs text-green-600 font-medium">Complete</div>
              </div>
              {profileStats.memberSince && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                  <CalendarIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs text-blue-600 font-medium">Member Since</div>
                  <div className="text-xs text-blue-700">{profileStats.memberSince}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Completeness Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
              <span className="text-sm text-gray-500">{profileStats.completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileStats.completeness}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Photo Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="relative">
                <img
                  src={formData.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-green-500 shadow-lg"
                />
                {/* Profile completion indicator */}
                <div className="absolute -bottom-2 -right-2">
                  {profileStats.completeness >= 80 ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-500 bg-white rounded-full" />
                  ) : profileStats.completeness >= 50 ? (
                    <ExclamationCircleIcon className="h-8 w-8 text-yellow-500 bg-white rounded-full" />
                  ) : (
                    <XCircleIcon className="h-8 w-8 text-red-500 bg-white rounded-full" />
                  )}
                </div>
              </div>
              
              {/* Photo edit controls */}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                      title="Upload Photo"
                    >
                      <CameraIcon className="h-5 w-5" />
                    </button>
                    {formData.profilePhoto && (
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        title="Remove Photo"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            
            {/* Profile Summary */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formData.firstName || formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}`.trim() 
                  : 'Complete Your Profile'}
              </h2>
              <p className="text-green-600 font-medium mb-1">{formData.businessName || 'Business Name Not Set'}</p>
              <p className="text-gray-600 mb-4">{formData.email || 'Email Not Set'}</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">{formData.phoneNumber || 'Phone not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{formData.city && formData.district ? `${formData.city}, ${formData.district}` : 'Location not set'}</span>
                </div>
              </div>
              
              {!isEditing && (
                <div className="mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        {!isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 h-fit">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="bg-green-100 p-3 rounded-lg">
                  <UserIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">First Name</label>
                    <p className="text-gray-900 font-medium">{formData.firstName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                    <p className="text-gray-900 font-medium">{formData.lastName || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900 font-medium">{formData.email || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900 font-medium">{formData.phoneNumber || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900 font-medium">
                      {formData.address && formData.city && formData.district 
                        ? `${formData.address}, ${formData.city}, ${formData.district}${formData.postalCode ? ` - ${formData.postalCode}` : ''}` 
                        : 'Address not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 h-fit">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Business Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-gray-900 font-medium">{formData.businessName || 'Not set'}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Type</label>
                    <p className="text-gray-900 font-medium capitalize">{formData.businessType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mill Capacity</label>
                    <p className="text-gray-900 font-medium">{formData.millCapacity || 'Not set'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Mill Location</label>
                  <p className="text-gray-900 font-medium">{formData.millLocation || 'Not set'}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">License Number</label>
                    <p className="text-gray-900 font-medium">{formData.licenseNumber || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-gray-900 font-medium">
                      {formData.registrationDate 
                        ? new Date(formData.registrationDate).toLocaleDateString()
                        : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 h-fit">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <ArrowUpTrayIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Update Stock</div>
                    <div className="text-sm text-gray-500">Add new inventory records</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                    <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Check Paddy Price</div>
                    <div className="text-sm text-gray-500">View current market rates</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <BellIcon className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Notifications</div>
                    <div className="text-sm text-gray-500">Check latest updates</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Account Status</h3>
                  <p className="opacity-90">Your account is active and in good standing</p>
                  {profileStats.lastUpdated && (
                    <p className="text-sm opacity-75 mt-2">
                      Last updated: {profileStats.lastUpdated}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm opacity-75">Profile Score</div>
                      <div className="text-2xl font-bold">{profileStats.completeness}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm opacity-75">Status</div>
                      <div className="font-semibold">
                        {profileStats.completeness >= 80 ? 'Excellent' : 
                         profileStats.completeness >= 60 ? 'Good' : 
                         profileStats.completeness >= 40 ? 'Fair' : 'Needs Attention'}
                      </div>
                    </div>
                  </div>
                </div>
                <CheckCircleIcon className="h-16 w-16 opacity-20" />
              </div>
            </div>
          </div>
        ) : (
          // Enhanced Edit Profile Form
          <form onSubmit={handleSave} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                <div className="bg-green-100 p-3 rounded-lg">
                  <UserIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Business Information</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your business name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="private">Private</option>
                      <option value="partnership">Partnership</option>
                      <option value="company">Company</option>
                      <option value="cooperative">Cooperative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mill Capacity</label>
                    <input
                      type="text"
                      name="millCapacity"
                      value={formData.millCapacity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., 500 tons/day"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mill Location</label>
                  <input
                    type="text"
                    name="millLocation"
                    value={formData.millLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter mill location"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter license number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                    <input
                      type="date"
                      name="registrationDate"
                      value={formData.registrationDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <LockClosedIcon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  Leave password fields empty if you don't want to change your password.
                </p>
                
                {[
                  { field: "current", label: "Current Password", placeholder: "Enter current password" },
                  { field: "new", label: "New Password", placeholder: "Enter new password" },
                  { field: "confirm", label: "Confirm New Password", placeholder: "Confirm new password" }
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPasswords[field] ? "text" : "password"}
                        name={field}
                        value={passwords[field]}
                        onChange={handlePasswordChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder={placeholder}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      >
                        {showPasswords[field] ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Changes...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MillProfile;