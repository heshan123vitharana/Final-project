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

  // Test user ID for development
  const testUserId = 1;

  // Load profile photo from database (use working port 5001)
  const loadProfilePhoto = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/photo/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.photoData;
      } else if (response.status === 404) {
        // No profile photo found, that's okay
        return "";
      } else {
        console.error('Failed to load profile photo:', response.status);
        return "";
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
      return "";
    }
  };

  // Update profile completeness from database
  const updateCompletenessFromDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/licenses/profile-check/${testUserId}`);
      if (response.ok) {
        const data = await response.json();
        setProfileStats(prev => ({
          ...prev,
          completeness: data.completeness
        }));
      }
    } catch (error) {
      console.error('Error fetching profile completeness:', error);
    }
  };

  // Load profile data and photo from database (always fresh after login)
  useEffect(() => {
    const loadData = async () => {
      // Start with sessionStorage or userData as fallback
      const savedProfile = sessionStorage.getItem("profileData");
      let initialData = {};

      if (savedProfile) {
        initialData = JSON.parse(savedProfile);
        console.log('📦 Profile data loaded from sessionStorage');
      } else if (userData) {
        // Initialize with userData if no saved profile exists
        initialData = {
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
        console.log('👤 Profile data initialized from userData');
      }

      // ALWAYS load fresh profile photo from database (important after login)
      try {
        const photoData = await loadProfilePhoto(testUserId);
        if (photoData) {
          initialData.profilePhoto = photoData;
          console.log('📸 Profile photo loaded fresh from database');
        } else {
          console.log('📸 No profile photo found for user');
        }
      } catch (error) {
        console.log('⚠️ Profile photo load failed:', error);
      }

      setFormData(initialData);
      setOriginalData(initialData);
    };

    loadData();
    
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

  // Upload profile photo to database
  const uploadPhotoToDatabase = async (photoData, filename, fileSize, mimeType) => {
    try {
      // Use consistent test user ID
      
      console.log('Uploading photo with data:', {
        userId: testUserId,
        filename,
        fileSize,
        mimeType,
        photoDataLength: photoData ? photoData.length : 0
      });

      const response = await fetch('http://localhost:5000/api/profile/upload-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId,
          photoData: photoData,
          filename: filename,
          fileSize: fileSize,
          mimeType: mimeType
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Photo uploaded successfully:', result.message);
        return true;
      } else {
        const error = await response.json();
        console.error('Upload failed:', error.message);
        showErrorToast(error.message || 'Failed to upload photo');
        return false;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      showErrorToast('Failed to upload photo. Please try again.');
      return false;
    }
  };

  // Enhanced profile photo upload with validation and database storage
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showErrorToast('Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)');
        return;
      }

      // Check if user is logged in
      console.log('userData:', userData);
      console.log('userData.id:', userData?.id);
      
      // Show loading state
      setIsLoading(true);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Upload to database
        const uploadSuccess = await uploadPhotoToDatabase(
          reader.result,
          file.name,
          file.size,
          file.type
        );

        if (uploadSuccess) {
          setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
          showSuccessToast('Profile picture uploaded successfully!');
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        showErrorToast('Failed to load image. Please try again.');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Delete profile photo from database
  const deletePhotoFromDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/photo/${userData?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Photo deleted successfully:', result.message);
        return true;
      } else {
        const error = await response.json();
        console.error('Delete failed:', error.message);
        showErrorToast(error.message || 'Failed to delete photo');
        return false;
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      showErrorToast('Failed to delete photo. Please try again.');
      return false;
    }
  };

  // Remove profile picture with confirmation and database deletion
  const removeProfilePicture = async () => {
    if (formData.profilePhoto) {
      if (!userData?.id) {
        showErrorToast('Please login to delete profile photo');
        return;
      }

      setIsLoading(true);
      const deleteSuccess = await deletePhotoFromDatabase();
      
      if (deleteSuccess) {
        setFormData(prev => ({ ...prev, profilePhoto: '' }));
        showSuccessToast('Profile picture removed successfully');
      }
      setIsLoading(false);
    }
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
          
          {/* Profile Completeness Bar - Same as MillRegistration */}
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Profile Completeness</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    profileStats.completeness === 100 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${profileStats.completeness}%` }}
                ></div>
              </div>
              <span className={`font-bold ${
                profileStats.completeness === 100 ? 'text-green-600' : 'text-yellow-600'
              }`}>{profileStats.completeness}%</span>
            </div>
            
            {profileStats.completeness < 100 && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                <p className="text-yellow-800 font-medium mb-2">Complete your profile to unlock all features</p>
                <p className="text-yellow-700 text-sm mb-2">Missing information may limit your access to certain services.</p>
                <div className="mt-2">
                  <span className="text-yellow-700 text-sm">Completion: {profileStats.completeness}% of required fields</span>
                </div>
              </div>
            )}
            
            {profileStats.completeness === 100 && (
              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <p className="text-green-800 font-medium">✅ Profile Complete!</p>
                <p className="text-green-700 text-sm">You have access to all platform features.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modern Profile Header with Background */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Background Banner */}
          <div 
            className="h-48 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9)), url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 border border-white/30"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            )}
          </div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8 -mt-20 relative z-10">
            {/* Profile Picture */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center z-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                <img
                  src={formData.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {formData.firstName || formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}`.trim() 
                  : 'Mill Owner'}
              </h2>
              <p className="text-blue-600 font-medium text-sm mb-3">
                {formData.businessName || 'Rice Mill Business'}
              </p>
              
              {/* Social/Contact Icons */}
              <div className="flex justify-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </div>
            
            {/* Photo Controls (only visible when editing or no photo) */}
            {(isEditing || !formData.profilePhoto) && (
              <div className="flex justify-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  title="Upload Photo"
                >
                  <CameraIcon className="h-4 w-4" />
                  <span>{formData.profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
                {formData.profilePhoto && (
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    disabled={isLoading}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove Photo"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Email</span>
                  <span className="text-gray-900 font-medium">
                    {formData.email || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Phone</span>
                  <span className="text-gray-900 font-medium">
                    {formData.phoneNumber || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">City</span>
                  <span className="text-gray-900 font-medium">
                    {formData.city || 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
              Business Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Business Type</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {formData.businessType || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Mill Capacity</span>
                  <span className="text-gray-900 font-medium">
                    {formData.millCapacity ? `${formData.millCapacity} tons/day` : 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">District</span>
                  <span className="text-gray-900 font-medium">
                    {formData.district || 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile viewing mode (not editing) */}
        {!isEditing ? (
          <div className="mt-6">
            {/* Modern profile design is complete above */}
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