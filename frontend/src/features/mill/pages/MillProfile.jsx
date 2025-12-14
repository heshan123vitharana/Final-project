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
import { validateFormWithToast, showSuccessToast, showErrorToast } from '../../../utils/validation';
import FreeMapPicker from '../../map/components/FreeMapPicker';
import SimpleLocationPicker from '../../map/components/SimpleLocationPicker';

// Sri Lankan Districts organized by provinces
const sriLankanDistricts = [
  // Western Province
  'Colombo',
  'Gampaha',
  'Kalutara',

  // Central Province
  'Kandy',
  'Matale',
  'Nuwara Eliya',

  // Southern Province
  'Galle',
  'Matara',
  'Hambantota',

  // Northern Province
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Mullaitivu',
  'Vavuniya',

  // Eastern Province
  'Ampara',
  'Batticaloa',
  'Trincomalee',

  // North Western Province
  'Kurunegala',
  'Puttalam',

  // North Central Province
  'Anuradhapura',
  'Polonnaruwa',

  // Uva Province
  'Badulla',
  'Monaragala',

  // Sabaragamuwa Province
  'Ratnapura',
  'Kegalle'
];

// Enhanced profile structure outside component to avoid dependency issues
const emptyProfile = {
  firstName: "",
  lastName: "",
  nic: "",
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
  millDistrict: "",
  millLatitude: "",
  millLongitude: "",
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

  // State for password fields
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  // State to control password visibility
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  // State for location picker modals
  const [showAddressMap, setShowAddressMap] = useState(false);
  const [showMillLocationMap, setShowMillLocationMap] = useState(false);
  const [selectedAddressLocation, setSelectedAddressLocation] = useState(null);
  const [selectedMillLocation, setSelectedMillLocation] = useState(null);
  // State for picker type (free map or simple)
  const [useSimplePicker, setUseSimplePicker] = useState(false);
  // State to track if mill is approved (has license)
  const [isApprovedMill, setIsApprovedMill] = useState(false);

  const getCurrentUserId = () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      return userData.id || userData.user_id || 1;
    } catch {
      return 1;
    }
  };


  const loadProfilePhoto = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/profile/photo/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.photoData;
      }
      return "";
    } catch {
      return "";
    }
  };

  // Check if mill has an active (approved and not expired) license
  const fetchLicenseStatus = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/license/status/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Returns { hasActiveLicense: true/false, status: 'approved'/'expired'/etc, expiryDate: '...' }
        return data.hasActiveLicense || false;
      }
      return false;
    } catch (error) {
      console.error('Error fetching license status:', error);
      return false;
    }
  };

  // Load profile data and photo from database (always fresh after login)
  useEffect(() => {
    const loadData = async () => {
      // Get userData from sessionStorage to avoid dependency issues
      const getCurrentUserData = () => {
        try {
          return JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
        } catch {
          return {};
        }
      };

      const currentUserData = getCurrentUserData();
      let initialData = {};
      let userId = currentUserData.id;

      // Try to get fresh data from API if we have a user ID
      if (userId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/profile/user/${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              console.log('Using fresh profile data from API');
              // Merge fresh API data over session data
              Object.assign(currentUserData, data.user);

              // Update session storage with fresh data to keep it in sync
              try {
                const currentSession = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
                const updatedSession = { ...currentSession, ...data.user };
                sessionStorage.setItem('millOwnerData', JSON.stringify(updatedSession));
              } catch (e) {
                console.warn('Failed to update session storage with fresh data');
              }
            }
          }
        } catch (error) {
          console.error('Error fetching fresh profile data:', error);
        }
      }

      // ALWAYS start with current user data to ensure profile reflects logged-in user
      if (userId) {
        initialData = {
          firstName: currentUserData.first_name || currentUserData.firstName || "",
          lastName: currentUserData.last_name || currentUserData.lastName || "",
          nic: currentUserData.nic || "",
          email: currentUserData.email || "",
          phoneNumber: currentUserData.phone || "",
          address: currentUserData.address || "",
          city: currentUserData.city || "",
          district: currentUserData.district || "",
          postalCode: currentUserData.postal_code || currentUserData.postalCode || "",
          businessName: currentUserData.business_name || currentUserData.businessName || "",
          businessType: currentUserData.business_type || currentUserData.businessType || "private",
          millCapacity: currentUserData.mill_capacity || currentUserData.millCapacity || "",
          millLocation: currentUserData.mill_location || currentUserData.millLocation || "",
          // Always map millDistrict from mill_district (snake_case) in backend
          millDistrict: currentUserData.mill_district || currentUserData.millDistrict || "",
          millLatitude: currentUserData.mill_latitude ?? currentUserData.millLatitude ?? "",
          millLongitude: currentUserData.mill_longitude ?? currentUserData.millLongitude ?? "",
          registrationDate: currentUserData.registration_date ?
            new Date(currentUserData.registration_date).toISOString().split('T')[0] :
            (currentUserData.created_at ? new Date(currentUserData.created_at).toISOString().split('T')[0] : ""),
          profilePhoto: "",
          password: "",
        };

        // Check license status from backend API (more reliable than userData)
        userId = getCurrentUserId(); // Ensure we have the ID via helper if needed, but userId var is already set
        const hasActiveLicense = await fetchLicenseStatus(userId);
        setIsApprovedMill(hasActiveLicense);

        // Load any saved profile customizations and merge with user data
        const savedProfile = sessionStorage.getItem("profileData");
        if (savedProfile) {
          try {
            const savedData = JSON.parse(savedProfile);
            if (savedData && typeof savedData === 'object' && 'profilePhoto' in savedData) {
              delete savedData.profilePhoto;
            }

            // Only use savedProfile for fields that might be client-side only drafts, 
            // but for core fields, prefer the fresh API/User data we just got.
            // However, the original logic prioritized savedData for some fields.
            // Let's keep original logic but populate initialData strongly first.

            initialData = {
              ...savedData,
              ...initialData, // OVERRIDE saved data with fresh API data for core fields to fix "Not set" issues
              // But wait, if user was editing and saved to session but not DB?
              // The requirement is to fix "Not set" issue. The issue is DB has data, frontend doesn't show it.
              // So API data should win for the display fields.
            };
          } catch (error) {
            console.error('Error parsing saved profile data:', error);
          }
        }
      } else {
        initialData = emptyProfile;
      }

      try {
        const userId = getCurrentUserId();
        const photoData = await loadProfilePhoto(userId);
        if (photoData) {
          initialData.profilePhoto = photoData;
        }
      } catch (error) {
        console.error('Error loading profile photo:', error);
      }

      setFormData(initialData);
      setOriginalData(initialData);

      if (initialData.millLatitude && initialData.millLongitude) {
        const latNum = Number.parseFloat(initialData.millLatitude);
        const lngNum = Number.parseFloat(initialData.millLongitude);
        if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
          setSelectedMillLocation({
            lat: latNum,
            lng: lngNum,
            address: initialData.millLocation || '',
          });
        }
      }

    };

    loadData();
  }, [userData?.id]);

  // Handle changes in profile form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle changes in password fields
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  // Toggle password visibility for a given field
  const togglePasswordVisibility = (field) => setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  // Handle address selection from map
  const handleAddressSelect = (location) => {
    setSelectedAddressLocation(location);
    const extractedInfo = extractLocationInfo(location.address);

    setFormData(prev => ({
      ...prev,
      address: location.address,
      city: prev.city || extractedInfo.city,
      district: prev.district || extractedInfo.district
    }));

    showSuccessToast('📍 Address added to your profile!');
  };

  // Handle mill location selection from map
  const handleMillLocationSelect = (location) => {
    setSelectedMillLocation(location);

    const formatCoordinate = (value) => {
      if (value === undefined || value === null) return '';
      const num = typeof value === 'number' ? value : Number.parseFloat(value);
      if (!Number.isFinite(num)) return '';
      return num.toFixed(6);
    };

    setFormData(prev => ({
      ...prev,
      millLocation: location.address || prev.millLocation,
      millLatitude: formatCoordinate(location.lat) || prev.millLatitude,
      millLongitude: formatCoordinate(location.lng) || prev.millLongitude
    }));
    showSuccessToast('🏭 Mill location added to your profile!');
  };

  // Enhanced helper function to extract location info from address
  const extractLocationInfo = (address) => {
    if (!address) return { city: '', district: '' };

    // Split by comma and clean up parts
    const parts = address.split(',').map(part => part.trim());

    let city = '';
    let district = '';

    // Look for district matches using the main sriLankanDistricts array
    for (const part of parts) {
      for (const dist of sriLankanDistricts) {
        if (part.toLowerCase().includes(dist.toLowerCase())) {
          district = dist;
          break;
        }
      }
      if (district) break;
    }

    // Extract city (usually the first substantial part that's not a street number)
    for (const part of parts) {
      if (part &&
        !part.match(/^\d/) && // Not starting with number
        !part.toLowerCase().includes('sri lanka') &&
        !part.toLowerCase().includes('road') &&
        !part.toLowerCase().includes('street') &&
        part.length > 2) {
        city = part;
        break;
      }
    }

    return { city, district };
  };

  // Upload profile photo to database
  const uploadPhotoToDatabase = async (photoData, filename, fileSize, mimeType) => {
    try {
      const userId = getCurrentUserId();

      const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/profile/upload-photo', {
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
        return true;
      } else {
        const error = await response.json();
        showErrorToast(error.message || 'Failed to upload photo');
        return false;
      }
    } catch {
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
  };

  // Enhanced save with comprehensive validation
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields - Personal and Business Information
      const requiredFields = [
        'firstName', 'lastName', 'nic', 'email', 'phoneNumber', 'address', 'city', 'district',
        'businessName', 'businessType', 'millCapacity', 'millLocation', 'millDistrict'
      ];
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
        nic: formData.nic,
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
        millDistrict: formData.millDistrict,
        millLatitude: formData.millLatitude,
        millLongitude: formData.millLongitude,
        registrationDate: formData.registrationDate
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/profile/update/${getCurrentUserId()}`, {
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

      const { profilePhoto: _profilePhoto, ...storageSafeProfile } = updatedProfile;

      try {
        sessionStorage.setItem("profileData", JSON.stringify(storageSafeProfile));
      } catch (storageError) {
        console.warn('Unable to cache profileData in sessionStorage:', storageError);
      }

      setOriginalData(updatedProfile);
      setPasswords({ current: "", new: "", confirm: "" });
      setIsEditing(false);

      showSuccessToast('Profile updated successfully!');

    } catch (error) {
      const fallbackMessage = 'Failed to update profile. Please try again.';
      const errorMessage = typeof error?.message === 'string' && error.message.trim().length > 0
        ? error.message
        : fallbackMessage;
      showErrorToast(errorMessage);
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
        Profile Management
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

        {/* Information Overview */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
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
                  <span className="text-gray-600 text-sm">Owner District</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  {formData.district || <span className="text-gray-400">Not set</span>}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">Mill District</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  {formData.millDistrict || <span className="text-gray-400">Not set</span>}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National Identity Card (NIC) *
                    {isApprovedMill && <span className="ml-2 text-xs text-amber-600">(Locked - License Approved)</span>}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleChange}
                      disabled={isApprovedMill}
                      className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isApprovedMill ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      placeholder="Enter your NIC number (e.g., 123456789V or 200012345678)"
                      pattern="^([0-9]{9}[VvXx]|[0-9]{12})$"
                      title="Enter a valid Sri Lankan NIC (9 digits + V/X or 12 digits)"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {isApprovedMill
                      ? '🔒 NIC is locked during active license period. Will be editable after license expires.'
                      : 'Enter your Sri Lankan National Identity Card number'
                    }
                  </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                      placeholder="Enter your complete address"
                      required
                    />
                    <div className="absolute right-3 top-3 flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUseSimplePicker(false);
                          setShowAddressMap(true);
                        }}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Select address from free map"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUseSimplePicker(true);
                          setShowAddressMap(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Enter address manually"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                      required
                    >
                      <option value="">Select your district</option>
                      {sriLankanDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                      {isApprovedMill && <span className="ml-2 text-xs text-amber-600">(Locked - License Approved)</span>}
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      disabled={isApprovedMill}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isApprovedMill ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
                        }`}
                      required
                    >
                      <option value="private">Private</option>
                      <option value="partnership">Partnership</option>
                      <option value="company">Company</option>
                      <option value="cooperative">Cooperative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mill Capacity *</label>
                    <input
                      type="text"
                      name="millCapacity"
                      value={formData.millCapacity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., 500 tons/day"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mill Location *
                      {isApprovedMill && <span className="ml-2 text-xs text-amber-600">(Locked - License Approved)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="millLocation"
                        value={formData.millLocation}
                        onChange={handleChange}
                        disabled={isApprovedMill}
                        className={`w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isApprovedMill ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        placeholder="Enter mill location"
                        required
                      />
                      {!isApprovedMill && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUseSimplePicker(false);
                              setShowMillLocationMap(true);
                            }}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Select mill location from free map"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUseSimplePicker(true);
                              setShowMillLocationMap(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Enter mill location manually"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Latitude *
                          {isApprovedMill && <span className="ml-2 text-xs text-amber-600">(Locked - License Approved)</span>}
                        </label>
                        <input
                          type="number"
                          name="millLatitude"
                          step="any"
                          value={formData.millLatitude}
                          onChange={handleChange}
                          disabled={isApprovedMill}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isApprovedMill ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
                            }`}
                          placeholder="e.g., 7.873100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitude *
                          {isApprovedMill && <span className="ml-2 text-xs text-amber-600">(Locked - License Approved)</span>}
                        </label>
                        <input
                          type="number"
                          name="millLongitude"
                          step="any"
                          value={formData.millLongitude}
                          onChange={handleChange}
                          disabled={isApprovedMill}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isApprovedMill ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
                            }`}
                          placeholder="e.g., 80.771800"
                          required
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                      Use the map picker or manual entry to capture precise GPS coordinates. These values power the admin mill map.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mill District *
                      {isApprovedMill && <span className="ml-2 text-xs text-amber-600">(Locked - License Approved)</span>}
                    </label>
                    <select
                      name="millDistrict"
                      value={formData.millDistrict}
                      onChange={handleChange}
                      disabled={isApprovedMill}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white ${isApprovedMill ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      required
                    >
                      <option value="">Select mill district</option>
                      {sriLankanDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {isApprovedMill
                        ? '🔒 Mill district is locked during active license period. Will be editable after license expires.'
                        : 'Select the district where your mill is located for paddy pricing'
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Date
                    {isApprovedMill && <span className="ml-2 text-xs text-amber-600">(Locked - License Approved)</span>}
                  </label>
                  <input
                    type="date"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    disabled={isApprovedMill}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isApprovedMill ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
                      }`}
                  />
                  {isApprovedMill && (
                    <p className="text-xs text-gray-500 mt-1">
                      🔒 Registration date is locked during active license period.
                    </p>
                  )}
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

        {/* Dynamic Location Pickers */}
        {!useSimplePicker ? (
          <>
            <FreeMapPicker
              isOpen={showAddressMap}
              onClose={() => setShowAddressMap(false)}
              onLocationSelect={handleAddressSelect}
              initialLocation={selectedAddressLocation}
              title="Select Address Location"
            />

            <FreeMapPicker
              isOpen={showMillLocationMap}
              onClose={() => setShowMillLocationMap(false)}
              onLocationSelect={handleMillLocationSelect}
              initialLocation={selectedMillLocation}
              title="Select Mill Location"
            />
          </>
        ) : (
          <>
            <SimpleLocationPicker
              isOpen={showAddressMap}
              onClose={() => setShowAddressMap(false)}
              onLocationSelect={handleAddressSelect}
              initialLocation={selectedAddressLocation}
              title="Enter Address Location"
            />

            <SimpleLocationPicker
              isOpen={showMillLocationMap}
              onClose={() => setShowMillLocationMap(false)}
              onLocationSelect={handleMillLocationSelect}
              initialLocation={selectedMillLocation}
              title="Enter Mill Location"
            />
          </>
        )}
      </div>
    </div >
  );
};

export default MillProfile;
