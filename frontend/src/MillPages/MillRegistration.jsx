import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const MillRegistration = () => {
  const navigate = useNavigate();
  
  // Set page title on mount
  useEffect(() => { document.title = "Dashboard | Mill Registration"; }, []);

  // State for toggling sections
  const [showApplySection, setShowApplySection] = useState(false);
  const [showStatusSection, setShowStatusSection] = useState(false);
  const [showHistorySection, setShowHistorySection] = useState(false);

  // State for showing the form and its type (Apply/Renew)
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');

  // State for licence history and filters
  const [history, setHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // State for profile completeness and user data
  const [profileData, setProfileData] = useState(null);
  const [canApplyForLicense, setCanApplyForLicense] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    licenseType: 'Standard Mill License',
    comments: '',
    paymentReceipt: null,
    brDocument: null
  });

  // Test user ID for development
  const testUserId = 1;

  // Toggle section visibility
  const toggleApplySection = () => setShowApplySection(!showApplySection);
  const toggleStatusSection = () => setShowStatusSection(!showStatusSection);
  const toggleHistorySection = () => setShowHistorySection(!showHistorySection);

  // Open and close form handlers
  const handleOpenForm = (type) => { setFormType(type); setShowForm(true); };
  const handleCloseForm = () => { 
    setFormType(''); 
    setShowForm(false);
    setFormData({
      licenseType: 'Standard Mill License',
      comments: '',
      paymentReceipt: null,
      brDocument: null
    });
    setError('');
  };

  // Calculate profile completeness directly from profile data
  const calculateCompletenessFromProfile = useCallback((profile) => {
    if (!profile) return { completeness: 0, missingFields: ['Complete your profile first'], canApply: false };
    
    const requiredFields = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phoneNumber', label: 'Phone' },
      { key: 'businessName', label: 'Business Name' },
      { key: 'businessType', label: 'Business Type' },
      { key: 'profilePhoto', label: 'Profile Photo' }
    ];

    const filledFields = requiredFields.filter(field => 
      profile[field.key] && profile[field.key].toString().trim() !== ''
    );

    const missingFields = requiredFields
      .filter(field => !profile[field.key] || profile[field.key].toString().trim() === '')
      .map(field => field.label);

    const completeness = Math.round((filledFields.length / requiredFields.length) * 100);
    
    return {
      completeness,
      missingFields,
      canApply: completeness === 100
    };
  }, []);

  // Load profile data from database and calculate completeness (same as MillProfile component)
  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use same database API as MillProfile component
      const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      const testUserId = userData.user?.id || 1;
      
      console.log('📊 Fetching profile completeness from database for user:', testUserId);
      
      // Use real database API call like MillProfile component
      const response = await fetch(`http://localhost:5000/api/licenses/profile-check/${testUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Extract profile data and completeness from database response
        const completeness = data.completeness || data.currentCompleteness || 0;
        const missingFields = data.missingFields || [];
        const canApply = completeness === 100;
        
        // Set the real database values
        setProfileCompleteness(completeness);
        setMissingFields(missingFields);
        setCanApplyForLicense(canApply);
        
        // If user data is available, set it as profile data
        if (data.user) {
          setProfileData({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phoneNumber: data.user.phone,
            businessName: data.user.businessName,
            businessType: data.user.businessType,
            profilePhoto: data.user.hasPhoto ? 'has-photo' : ''
          });
        }
        
        console.log(`📊 Profile completeness (from database): ${completeness}%`);
        console.log(`🔍 Missing fields:`, missingFields);
        console.log(`✅ Can apply for license:`, canApply);
        
      } else {
        console.error('Failed to fetch profile completeness:', response.status);
        
        // Fallback to sessionStorage calculation only if API fails
        console.log('📊 Falling back to sessionStorage calculation');
        const savedProfile = sessionStorage.getItem("profileData");
        
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          const { completeness, missingFields, canApply } = calculateCompletenessFromProfile(profile);
          setProfileData(profile);
          setProfileCompleteness(completeness);
          setMissingFields(missingFields);
          setCanApplyForLicense(canApply);
          console.log(`📊 Profile completeness (fallback): ${completeness}%`);
        } else {
          setProfileCompleteness(0);
          setCanApplyForLicense(false);
          setMissingFields(['Complete your profile first']);
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load profile data from database');
      
      // Fallback to sessionStorage on error
      try {
        console.log('📊 Using sessionStorage fallback due to database error');
        const savedProfile = sessionStorage.getItem("profileData");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          const { completeness, missingFields, canApply } = calculateCompletenessFromProfile(profile);
          setProfileData(profile);
          setProfileCompleteness(completeness);
          setMissingFields(missingFields);
          setCanApplyForLicense(canApply);
          console.log(`📊 Profile completeness (error fallback): ${completeness}%`);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setProfileCompleteness(0);
        setCanApplyForLicense(false);
        setMissingFields(['Unable to load profile data']);
      }
    } finally {
      setLoading(false);
    }
  }, [calculateCompletenessFromProfile]);

  // Handle navigation to profile with refresh
  const handleCompleteProfile = () => {
    navigate('profile');
  };

  // Use static license history data (since API is not working)
  const loadLicenseHistory = useCallback(() => {
    const dummyHistory = [
      { 
        id: 1, 
        application_number: 'ML20251001', 
        applied_date: '2025-05-01', 
        status: 'approved',
        created_at: '2025-05-01T10:00:00.000Z'
      },
      { 
        id: 2, 
        application_number: 'ML20251015', 
        applied_date: '2025-06-15', 
        status: 'pending',
        created_at: '2025-06-15T14:30:00.000Z'
      },
      { 
        id: 3, 
        application_number: 'ML20251020', 
        applied_date: '2025-07-10', 
        status: 'rejected',
        created_at: '2025-07-10T09:15:00.000Z'
      }
    ];
    
    setHistory(dummyHistory);
    console.log('📜 License history loaded (demo data)');
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadProfileData();
    loadLicenseHistory();
  }, [loadProfileData, loadLicenseHistory]);

  // Add effect to refresh completeness when user returns from profile page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh profile completeness
        loadProfileData();
      }
    };

    const handleFocus = () => {
      // Window gained focus, refresh profile completeness
      loadProfileData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadProfileData]);

  // Handle file selection
  const handleFileSelect = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError(`${fieldName} file size should be less than 10MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError(`${fieldName} must be an image (JPG, PNG) or PDF file`);
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [fieldName]: {
          data: reader.result,
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
    };
    reader.readAsDataURL(file);
    setError('');
  };

  // Submit license application (demo version)
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!formData.paymentReceipt || !formData.brDocument) {
      setError('Please upload both Payment Receipt and BR Document');
      return;
    }

    try {
      setSubmitLoading(true);
      setError('');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate demo application number
      const applicationNumber = `ML${Date.now()}`;
      
      // Add to history (demo)
      const newApplication = {
        id: Date.now(),
        application_number: applicationNumber,
        applied_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      setHistory(prev => [newApplication, ...prev]);
      
      alert(`License application submitted successfully! Application Number: ${applicationNumber}`);
      handleCloseForm();
      console.log('📝 Demo license application submitted');
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Error while submitting application');
    } finally {
      setSubmitLoading(false);
    }
  };

  // View and download certificate handlers
  const handleViewCertificate = () => { window.open('/certificates/sample-certificate.pdf', '_blank'); };
  const handleDownloadCertificate = () => {
    const link = document.createElement('a');
    link.href = '/certificates/sample-certificate.pdf';
    link.download = 'Licence_Certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter licence history based on status and date range
  const filteredHistory = history.filter(item => {
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    const itemDate = new Date(item.applied_date || item.created_at);
    const matchFromDate = fromDate ? itemDate >= new Date(fromDate) : true;
    const matchToDate = toDate ? itemDate <= new Date(toDate) : true;
    return matchStatus && matchFromDate && matchToDate;
  });

  if (loading) {
    return (
      <div className="p-6 bg-green-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-green-700">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6 text-green-700 border-b-4 border-green-300 pb-2">
        🏭 Mill Registration
      </h1>

      {/* Status of Licence Section */}
      <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
        <button onClick={toggleStatusSection} className="text-lg font-semibold text-green-700 hover:text-green-800 flex items-center gap-2">
          {showStatusSection ? '▼' : '▶'} Status of Licence
        </button>
        {showStatusSection && (
          <div className="mt-4 text-gray-700">
            <p><strong>Apply Date:</strong> 2025-08-01</p>
            <p><strong>Status:</strong> Approved</p>
            <p><strong>Deadline:</strong> 2026-08-01</p>
            <div className="mt-4 flex space-x-4">
              {/* View and Download Certificate buttons */}
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleViewCertificate}>View Certificate</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleDownloadCertificate}>Download Certificate</button>
            </div>
          </div>
        )}
      </div>

      {/* Apply / Renew Licence Section */}
      <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
        <button onClick={toggleApplySection} className="text-lg font-semibold text-green-700 hover:text-green-800 flex items-center gap-2">
          {showApplySection ? '▼' : '▶'} Apply Licence
        </button>
        {showApplySection && (
          <div className="mt-4 space-y-4">
            {/* Profile completeness check */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Profile Completeness</h3>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      profileCompleteness === 100 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${profileCompleteness}%` }}
                  ></div>
                </div>
                <span className={`font-bold ${
                  profileCompleteness === 100 ? 'text-green-600' : 'text-yellow-600'
                }`}>{profileCompleteness}%</span>
              </div>
              
              {!canApplyForLicense && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                  <p className="text-yellow-800 font-medium mb-2">Profile must be 100% complete to apply for license</p>
                  <p className="text-yellow-700 text-sm mb-2">Missing fields:</p>
                  <ul className="text-yellow-700 text-sm list-disc list-inside">
                    {missingFields.map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {canApplyForLicense && (
              <>
                {/* Licence requirements list */}
                <ul className="list-disc list-inside text-gray-700">
                  <li>Must be a registered mill.</li>
                  <li>Provide accurate contact and address details.</li>
                  <li>No pending violations or penalties.</li>
                  <li>Agree to terms and conditions.</li>
                </ul>
                {/* Apply and Renew buttons */}
                <div className="flex space-x-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => handleOpenForm('Apply')}>Apply Licence</button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => handleOpenForm('Renew')}>Renew Licence</button>
                </div>
              </>
            )}

            {!canApplyForLicense && (
              <div className="text-center py-4">
                <p className="text-red-600 font-medium">Please complete your profile to apply for a mill license</p>
                <button 
                  onClick={handleCompleteProfile}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Licence History Section */}
      <div className="bg-white shadow-md border border-green-200 rounded-lg p-4 mb-6">
        <button onClick={toggleHistorySection} className="text-lg font-semibold text-green-700 hover:text-green-800 flex items-center gap-2">
          {showHistorySection ? '▼' : '▶'} View Licence History
        </button>
        {showHistorySection && (
          <div className="mt-4">
            {/* Filters for history */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From Date</label>
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border rounded w-full p-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">To Date</label>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border rounded w-full p-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded w-full p-2">
                  <option value="">All</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Licence history table */}
            <div className="overflow-x-auto rounded-lg border border-green-200">
              <table className="w-full table-auto">
                <thead className="bg-green-200 text-green-900">
                  <tr>
                    <th className="border px-4 py-2">Application Number</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render filtered history or show no records message */}
                  {filteredHistory.length > 0 ? filteredHistory.map((item, index) => {
                    const displayDate = item.applied_date ? 
                      new Date(item.applied_date).toLocaleDateString() : 
                      new Date(item.created_at).toLocaleDateString();
                    
                    return (
                      <tr key={item.id} className={`text-center ${index % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-green-100 transition`}>
                        <td className="border px-4 py-2 font-medium">{item.application_number || item.id}</td>
                        <td className="border px-4 py-2">{displayDate}</td>
                        <td className="border px-4 py-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'approved' ? 'bg-green-100 text-green-700' :
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Apply / Renew Licence Form Section */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md border border-green-200 p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 text-green-700">{formType} Licence Form</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            {/* Auto-populated profile data */}
            {profileData && (
              <div className="bg-gray-50 p-4 rounded border mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Mill Information (Auto-populated)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mill Name</label>
                    <input 
                      type="text" 
                      value={profileData.businessName || ''} 
                      className="w-full p-2 border rounded bg-gray-100" 
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                    <input 
                      type="text" 
                      value={`${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()} 
                      className="w-full p-2 border rounded bg-gray-100" 
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      value={profileData.email || ''} 
                      className="w-full p-2 border rounded bg-gray-100" 
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input 
                      type="text" 
                      value={profileData.phone || ''} 
                      className="w-full p-2 border rounded bg-gray-100" 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* License type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
              <select 
                value={formData.licenseType}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseType: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Standard Mill License">Standard Mill License</option>
                <option value="Premium Mill License">Premium Mill License</option>
                <option value="Industrial Mill License">Industrial Mill License</option>
              </select>
            </div>

            {/* Document uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Receipt *
                </label>
                <input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileSelect(e, 'paymentReceipt')}
                  className="w-full p-2 border rounded"
                  required
                />
                {formData.paymentReceipt && (
                  <p className="text-sm text-green-600 mt-1">✓ {formData.paymentReceipt.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Registration (BR) Document *
                </label>
                <input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileSelect(e, 'brDocument')}
                  className="w-full p-2 border rounded"
                  required
                />
                {formData.brDocument && (
                  <p className="text-sm text-green-600 mt-1">✓ {formData.brDocument.name}</p>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments (Optional)</label>
              <textarea 
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Any additional information or special requests..."
                className="w-full p-2 border rounded" 
                rows="4" 
              />
            </div>

            {/* Submit and Cancel buttons */}
            <div className="flex space-x-4">
              <button 
                type="submit" 
                disabled={submitLoading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Submitting...' : 'Submit Application'}
              </button>
              <button 
                type="button" 
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700" 
                onClick={handleCloseForm}
                disabled={submitLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MillRegistration;