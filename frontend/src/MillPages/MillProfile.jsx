import { useState, useEffect, useRef } from "react";
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
  const [_profileStats, setProfileStats] = useState({
    completeness: 0,
    lastUpdated: null,
    memberSince: null,
    fieldStatus: null,
    missingFields: []
  });

  // State for password fields
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  // State to control password visibility
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  // Get actual user ID from session data
  const getCurrentUserId = () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      return userData.id || userData.user_id || 1; // fallback to 1 for development
    } catch (error) {
      console.error('Error getting user ID from session:', error);
      return 1; // fallback to 1 for development
    }
  };

  // Use API to get real profile completeness percentage (for onChange events)
  const calculateProfileCompleteness = async () => {
    try {
      const userId = getCurrentUserId();
      const response = await fetch(`http://localhost:5000/api/licenses/profile-check/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfileStats(prev => ({
          ...prev,
          completeness: data.completeness,
          fieldStatus: data.fieldStatus,
          missingFields: data.missingFields || []
        }));
        console.log(`📊 Profile completeness updated for user ${userId}: ${data.completeness}%`);
      }
    } catch (error) {
      console.error('Error fetching profile completeness:', error);
    }
  };

  // Debounced version to prevent too many API calls
  const debouncedCalculateCompleteness = useRef(null);

  // Create debounced function
  const debounceCompleteness = () => {
    if (debouncedCalculateCompleteness.current) {
      clearTimeout(debouncedCalculateCompleteness.current);
    }
    debouncedCalculateCompleteness.current = setTimeout(() => {
      calculateProfileCompleteness();
    }, 500); // Wait 500ms before making API call
  };

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

  // Load profile data and photo from database (always fresh after login)
  useEffect(() => {
    const loadData = async () => {
      // Get userData from sessionStorage to avoid dependency issues
      const getCurrentUserData = () => {
        try {
          return JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
        } catch (error) {
          console.error('Error getting userData from session:', error);
          return {};
        }
      };
      
      const currentUserData = getCurrentUserData();
      
      // Start with sessionStorage or userData as fallback
      const savedProfile = sessionStorage.getItem("profileData");
      let initialData = {};

      if (savedProfile) {
        initialData = JSON.parse(savedProfile);
        console.log('📦 Profile data loaded from sessionStorage');
      } else if (currentUserData) {
        // Initialize with userData if no saved profile exists
        initialData = {
          firstName: currentUserData.first_name || "",
          lastName: currentUserData.last_name || "",
          email: currentUserData.email || "",
          phoneNumber: currentUserData.phone || "",
          address: "",
          city: "",
          district: "",
          postalCode: "",
          businessName: currentUserData.business_name || "",
          businessType: currentUserData.business_type || "private",
          millCapacity: "",
          millLocation: "",
          licenseNumber: "",
          registrationDate: currentUserData.created_at ? new Date(currentUserData.created_at).toISOString().split('T')[0] : "",
          profilePhoto: "",
          password: "",
        };
        console.log('👤 Profile data initialized from userData');
      }

      // ALWAYS load fresh profile photo from database (important after login)
      try {
        const userId = getCurrentUserId();
        const photoData = await loadProfilePhoto(userId);
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
      
      // Calculate profile completeness after loading data (inline to avoid dependency issues)
      try {
        const userId = getCurrentUserId();
        const response = await fetch(`http://localhost:5000/api/licenses/profile-check/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfileStats(prev => ({
            ...prev,
            completeness: data.completeness,
            fieldStatus: data.fieldStatus,
            missingFields: data.missingFields || []
          }));
          console.log(`📊 Profile completeness for user ${userId}: ${data.completeness}%`);
        }
      } catch (error) {
        console.error('Error fetching profile completeness:', error);
      }
      
      // Set member since date if userData is available
      if (currentUserData?.created_at) {
        setProfileStats(prev => ({
          ...prev,
          memberSince: new Date(currentUserData.created_at).toLocaleDateString()
        }));
      }
    };

    loadData();
  }, []); // Empty dependency array to run only once on mount

  // Handle changes in profile form fields with validation feedback
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Use debounced completeness calculation
    debounceCompleteness();
  };

  // Handle changes in password fields
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  // Toggle password visibility for a given field
  const togglePasswordVisibility = (field) => setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  // Upload profile photo to database
  const uploadPhotoToDatabase = async (photoData, filename, fileSize, mimeType) => {
    try {
      // Use actual user ID from session
      const userId = getCurrentUserId();
      
      console.log('Uploading photo with data:', {
        userId: userId,
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
          userId: userId,
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
  


  // Cancel editing and revert changes
  const handleCancel = () => {
    setFormData(originalData);
    setPasswords({ current: "", new: "", confirm: "" });
    setIsEditing(false);
    // No need to recalculate completeness when just reverting data
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
      
      // Make API call to update profile in database
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        postalCode: formData.postalCode,
        businessName: formData.businessName,
        businessType: formData.businessType,
        millCapacity: formData.millCapacity,
        millLocation: formData.millLocation,
        licenseNumber: formData.licenseNumber,
        registrationDate: formData.registrationDate
      };

      const response = await fetch(`http://localhost:5000/api/profile/update/${userData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      
      // Update local state with API response
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

  // Missing function aliases to match JSX calls
  const handlePhotoUpload = handlePhotoChange;
  const handleCancelEdit = handleCancel;
  const handleSaveProfile = handleSave;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        👤 Profile Management
      </h1>

      {/* Profile Overview Card */}
      <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center z-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              )}
              <img
                src={formData.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                alt="Profile"
                className="w-24 h-24 rounded-lg object-cover border-2 border-green-200 shadow-lg bg-white"
              />
              {/* Photo Upload Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-all duration-200 group"
                title="Change profile photo"
              >
                <CameraIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                {formData.firstName && formData.lastName ? 
                  `${formData.firstName} ${formData.lastName}` : 
                  'Complete Your Profile'
                }
              </h2>
              <div className="flex items-center gap-4 text-gray-600">
                {formData.businessName && (
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{formData.businessName}</span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span className="text-sm">{formData.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Information Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-700 flex items-center gap-3 mb-4">
            <UserIcon className="h-5 w-5 text-green-600" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 text-sm">Email</span>
              </div>
              <span className="text-slate-900 font-medium text-sm">
                {formData.email || <span className="text-slate-400">Not set</span>}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 text-sm">Phone</span>
              </div>
              <span className="text-slate-900 font-medium text-sm">
                {formData.phoneNumber || <span className="text-slate-400">Not set</span>}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 text-sm">City</span>
              </div>
              <span className="text-slate-900 font-medium text-sm">
                {formData.city || <span className="text-slate-400">Not set</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Business Information Card */}
          <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-700 flex items-center gap-3 mb-4">
              <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
              Business Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">Business Type</span>
                </div>
                <span className="text-gray-900 font-medium text-sm capitalize">
                  {formData.businessType || <span className="text-gray-400">Not set</span>}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">Mill Capacity</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  {formData.millCapacity ? `${formData.millCapacity} tons/day` : <span className="text-gray-400">Not set</span>}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">District</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  {formData.district || <span className="text-gray-400">Not set</span>}
                </span>
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
            <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <UserIcon className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-700">Personal Information</h3>
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
            <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-700">Business Information</h3>
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
            <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <LockClosedIcon className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-700">Change Password</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-sm text-gray-600 bg-green-50 p-4 rounded-lg border border-green-200">
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  );
};

export default MillProfile;