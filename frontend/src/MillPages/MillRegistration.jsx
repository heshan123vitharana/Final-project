import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProfileCompletenessBar from '../components/ProfileCompletenessBar';

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

  // State for current license status
  const [currentLicense, setCurrentLicense] = useState(null);
  const [hasActiveLicense, setHasActiveLicense] = useState(false);

  // State for profile completeness and user data
  const [profileData, setProfileData] = useState(null);
  const [canApplyForLicense, setCanApplyForLicense] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [fieldStatus, setFieldStatus] = useState(null);
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

  // License type options with payment amounts
  const licenseTypes = [
    {
      id: 'standard',
      name: 'Standard Mill License',
      description: 'Basic Operations - Small to medium scale milling',
      price: 15000,
      features: ['Basic milling operations', 'Up to 50 MT/day capacity', 'Standard support', '1-year validity']
    },
    {
      id: 'premium',
      name: 'Premium Mill License',
      description: 'Advanced Features - Medium to large scale operations',
      price: 35000,
      features: ['Advanced milling features', 'Up to 200 MT/day capacity', 'Priority support', '2-year validity', 'Quality certifications']
    },
    {
      id: 'industrial',
      name: 'Industrial Mill License',
      description: 'Large Scale Operations - Industrial level milling',
      price: 75000,
      features: ['Industrial scale operations', 'Unlimited capacity', '24/7 premium support', '3-year validity', 'Export certifications', 'Advanced monitoring']
    }
  ];

  // Get current license type data
  const getCurrentLicenseType = () => {
    return licenseTypes.find(type => type.name === formData.licenseType) || licenseTypes[0];
  };


  // File input refs
  const paymentReceiptRef = useRef(null);
  const brDocumentRef = useRef(null);

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
  // Note: This is now handled by API, but kept for fallback
  
  // Handle navigation to profile with refresh
  const handleCompleteProfile = () => {
    navigate('../profile');
  };

  // File upload handler using direct DOM manipulation
  const handleFileUpload = async (fileInputRef, fieldName) => {
    return new Promise((resolve, reject) => {
      // Create a new input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,application/pdf';
      fileInput.style.position = 'absolute';
      fileInput.style.left = '-9999px';
      fileInput.style.opacity = '0';
      fileInput.style.pointerEvents = 'none';

      let dialogClosed = false;
      let fileProcessed = false;

      // Handle file selection
      fileInput.onchange = (e) => {
        dialogClosed = true;
        const files = e.target.files;

        if (!files || files.length === 0) {
          cleanup();
          resolve(null);
          return;
        }

        const file = files[0];
        fileProcessed = true;

        // Validate file
        if (file.size > 10 * 1024 * 1024) {
          cleanup();
          reject(new Error(`File size must be less than 10MB`));
          return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
          cleanup();
          reject(new Error(`File must be JPG, PNG, or PDF`));
          return;
        }

        // Read file
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = {
            data: reader.result,
            name: file.name,
            size: file.size,
            type: file.type
          };

          // Update form data
          setFormData(prev => ({
            ...prev,
            [fieldName]: fileData
          }));

          cleanup();
          resolve(fileData);
        };

        reader.onerror = () => {
          cleanup();
          reject(new Error(`Error reading file: ${reader.error?.message || 'Unknown error'}`));
        };

        reader.readAsDataURL(file);
      };

      // Handle dialog cancellation (focus back to window)
      const handleWindowFocus = () => {
        setTimeout(() => {
          if (!fileProcessed && dialogClosed) {
            cleanup();
            resolve(null);
          }
        }, 100);
      };

      const cleanup = () => {
        try {
          if (document.body.contains(fileInput)) {
            document.body.removeChild(fileInput);
          }
          window.removeEventListener('focus', handleWindowFocus);
        } catch (error) {
          // Silent cleanup error handling
        }
      };

      // Add focus listener to detect dialog cancellation
      window.addEventListener('focus', handleWindowFocus);

      // Add input to DOM and trigger
      document.body.appendChild(fileInput);

      // Small delay to ensure proper DOM attachment
      setTimeout(() => {
        fileInput.click();
      }, 50);

      // Timeout fallback
      setTimeout(() => {
        if (!dialogClosed) {
          cleanup();
          reject(new Error('File dialog timeout'));
        }
      }, 30000); // 30 second timeout
    });
  };

  // Load data on component mount - self-contained to avoid dependency issues
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get user data from sessionStorage - same logic as MillProfile
        const getCurrentUserId = () => {
          try {
            const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
            return userData.id || userData.user_id || 1; // fallback to 1 for development
          } catch (error) {
            console.error('Error getting user ID from session:', error);
            return 1; // fallback to 1 for development
          }
        };
        
        const userId = getCurrentUserId();
        
        // Fetch profile data from API using profile-check endpoint
        try {
          const response = await fetch(`http://localhost:5000/api/licenses/profile-check/${userId}`);
          if (response.ok) {
            const apiData = await response.json();
            setProfileData(apiData.user || {});
            setProfileCompleteness(apiData.completeness || 0);
            setMissingFields(apiData.missingFields || []);
            setFieldStatus(apiData.fieldStatus || null);
            setCanApplyForLicense(apiData.canApplyForLicense || false);
          }
        } catch (apiError) {
          // Silent error handling
        }
        
        // Load license history from API
        try {
          const historyResponse = await fetch(`http://localhost:5000/api/licenses/applications/${userId}`);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            const applications = historyData.applications || [];
            setHistory(applications);

            // Find current active or most recent license
            const activeLicense = applications.find(app => app.status === 'approved');
            const mostRecentLicense = applications.length > 0 ? applications[0] : null;

            if (activeLicense) {
              setCurrentLicense(activeLicense);
              setHasActiveLicense(true);
            } else if (mostRecentLicense) {
              setCurrentLicense(mostRecentLicense);
              setHasActiveLicense(false);
            } else {
              setCurrentLicense(null);
              setHasActiveLicense(false);
            }
          } else {
            setHistory([]);
            setCurrentLicense(null);
            setHasActiveLicense(false);
          }
        } catch (historyError) {
          setHistory([]);
          setCurrentLicense(null);
          setHasActiveLicense(false);
        }
        
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []); // Empty dependency array - self-contained logic

  // Add effect to refresh completeness when user returns from profile page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh profile completeness directly without function dependency
        (async () => {
          try {
            setLoading(true);
            const getCurrentUserId = () => {
              try {
                const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
                return userData.id || userData.user_id || 1;
              } catch (error) {
                return 1;
              }
            };
            
            const userId = getCurrentUserId();
            const response = await fetch(`http://localhost:5000/api/licenses/profile-check/${userId}`);
            if (response.ok) {
              const apiData = await response.json();
              setProfileData(apiData.user || {});
              setProfileCompleteness(apiData.completeness);
              setMissingFields(apiData.missingFields || []);
              setCanApplyForLicense(apiData.canApplyForLicense);
            }

            // Also refresh license status
            const historyResponse = await fetch(`http://localhost:5000/api/licenses/applications/${userId}`);
            if (historyResponse.ok) {
              const historyData = await historyResponse.json();
              const applications = historyData.applications || [];
              setHistory(applications);

              const activeLicense = applications.find(app => app.status === 'approved');
              const mostRecentLicense = applications.length > 0 ? applications[0] : null;

              if (activeLicense) {
                setCurrentLicense(activeLicense);
                setHasActiveLicense(true);
              } else if (mostRecentLicense) {
                setCurrentLicense(mostRecentLicense);
                setHasActiveLicense(false);
              } else {
                setCurrentLicense(null);
                setHasActiveLicense(false);
              }
            }
          } catch (error) {
            // Silent error handling
          } finally {
            setLoading(false);
          }
        })();
      }
    };

    const handleFocus = () => {
      // Window gained focus, refresh profile completeness
      handleVisibilityChange();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // No dependencies needed since logic is self-contained


  // Submit license application to backend API
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!formData.paymentReceipt || !formData.brDocument) {
      setError('Please upload both Payment Receipt and BR Document');
      return;
    }

    try {
      setSubmitLoading(true);
      setError('');

      // Get current user ID
      const getCurrentUserId = () => {
        try {
          const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
          return userData.id || userData.user_id || 1;
        } catch (error) {
          return 1;
        }
      };

      const userId = getCurrentUserId();

      // Prepare application data
      const applicationData = {
        userId: userId,
        licenseType: formData.licenseType,
        paymentReceipt: formData.paymentReceipt,
        brDocument: formData.brDocument,
        comments: formData.comments
      };

      // Make API call to submit license application
      const response = await fetch('http://localhost:5000/api/licenses/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit license application');
      }

      const result = await response.json();
      
      // Add to history
      const newApplication = {
        id: result.applicationId,
        application_number: result.applicationNumber,
        applied_date: new Date().toISOString().split('T')[0],
        status: result.status,
        created_at: new Date().toISOString()
      };

      setHistory(prev => [newApplication, ...prev]);

      // Update current license status
      setCurrentLicense(newApplication);
      setHasActiveLicense(newApplication.status === 'approved');
      
      toast.success(`License application submitted successfully! Application Number: ${result.applicationNumber}`, {
        position: 'top-right',
        autoClose: 5000
      });
      handleCloseForm();
    } catch (error) {

      // More user-friendly error messages
      let errorMessage = 'Error while submitting application. Please try again.';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      } else if (error.message.includes('already have a pending')) {
        errorMessage = 'You already have a pending license application. Please wait for it to be processed.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
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
          {currentLicense && (
            <span className={`ml-2 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              currentLicense.status === 'approved' ? 'bg-green-100 text-green-700' :
              currentLicense.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentLicense.status.charAt(0).toUpperCase() + currentLicense.status.slice(1)}
            </span>
          )}
        </button>
        {showStatusSection && (
          <div className="mt-4 text-gray-700">
            {currentLicense ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Application Number:</strong> {currentLicense.application_number || currentLicense.id}</p>
                    <p><strong>Apply Date:</strong> {currentLicense.applied_date ?
                      new Date(currentLicense.applied_date).toLocaleDateString() :
                      new Date(currentLicense.created_at).toLocaleDateString()}</p>
                    <p><strong>License Type:</strong> {currentLicense.license_type || 'Standard Mill License'}</p>
                  </div>
                  <div>
                    <p><strong>Status:</strong>
                      <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        currentLicense.status === 'approved' ? 'bg-green-100 text-green-700' :
                        currentLicense.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {currentLicense.status.charAt(0).toUpperCase() + currentLicense.status.slice(1)}
                      </span>
                    </p>

                    {currentLicense.status === 'approved' && (
                      <>
                        <p><strong>License Number:</strong> {currentLicense.license_number || 'Generating...'}</p>
                        <p><strong>Approved Date:</strong> {currentLicense.approved_date ?
                          new Date(currentLicense.approved_date).toLocaleDateString() :
                          'Processing...'}</p>
                      </>
                    )}

                    {currentLicense.status === 'rejected' && (
                      <>
                        <p><strong>Rejected Date:</strong> {currentLicense.rejected_date ?
                          new Date(currentLicense.rejected_date).toLocaleDateString() :
                          'Processing...'}</p>
                        <p><strong>Rejection Reason:</strong> {currentLicense.rejection_reason || 'Not specified'}</p>
                      </>
                    )}

                    {currentLicense.status === 'pending' && (
                      <p><strong>Status:</strong> Your application is under review. You will be notified once processed.</p>
                    )}
                  </div>
                </div>

                {/* Comments if any */}
                {currentLicense.approval_comments && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p><strong>Admin Comments:</strong> {currentLicense.approval_comments}</p>
                  </div>
                )}

                {/* Certificate buttons only for approved licenses */}
                {currentLicense.status === 'approved' && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={handleViewCertificate}
                    >
                      View Certificate
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={handleDownloadCertificate}
                    >
                      Download Certificate
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No License Applications</h3>
                  <p className="text-gray-600">You haven't submitted any license applications yet. Complete your profile and apply for a license to see status information here.</p>
                </div>
              </div>
            )}
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
            {/* Profile completeness check - Enhanced with ProfileCompletenessBar */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <ProfileCompletenessBar
                completeness={profileCompleteness}
                fieldStatus={fieldStatus}
                missingFields={missingFields}
                showDetails={true}
                size="medium"
                showActions={!canApplyForLicense}
                onCompleteProfile={handleCompleteProfile}
              />
              
              {canApplyForLicense && (
                <div className="bg-green-50 border border-green-200 p-3 rounded mt-4">
                  <p className="text-green-800 font-medium">✅ Profile Complete!</p>
                  <p className="text-green-700 text-sm">You can now apply for a mill license.</p>
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

      {/* Modern License Application Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {formType} Mill License Application
              </h2>
              <p className="text-green-100 mt-2">Please fill out all required information and upload necessary documents</p>
            </div>

            {error && (
              <div className="m-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-8">
              {/* Mill Information Section */}
              {profileData && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Mill Information (Auto-populated from your profile)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mill/Business Name</label>
                      <input
                        type="text"
                        value={profileData.businessName || profileData.business_name || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                      <input
                        type="text"
                        value={profileData.businessType || profileData.business_type || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={`${profileData.firstName || profileData.first_name || ''} ${profileData.lastName || profileData.last_name || ''}`.trim()}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={profileData.phone || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                      <input
                        type="text"
                        value={profileData.nic || profileData.nicNumber || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <h4 className="text-md font-semibold text-gray-800 mt-6 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={profileData.address || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={profileData.city || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        value={profileData.district || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Mill Specific Information */}
                  <h4 className="text-md font-semibold text-gray-800 mt-6 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Mill Specifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mill Capacity</label>
                      <input
                        type="text"
                        value={profileData.millCapacity || profileData.mill_capacity || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mill Location</label>
                      <input
                        type="text"
                        value={profileData.millLocation || profileData.mill_location || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Registration Information */}
                  {(profileData.registrationDate || profileData.registration_date) && (
                    <>
                      <h4 className="text-md font-semibold text-gray-800 mt-6 mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 1m7-1l1 1m-6 6l-1-1m2 2h4m-6 0a2 2 0 002 2v1a2 2 0 002 2h2a2 2 0 002-2v-1a2 2 0 002-2m-6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2z" />
                        </svg>
                        Registration Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                          <input
                            type="text"
                            value={profileData.registrationDate || new Date(profileData.registration_date).toLocaleDateString('en-GB') || ''}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Status</label>
                          <input
                            type="text"
                            value={canApplyForLicense ? 'Profile Complete - Ready for License Application' : 'Profile Incomplete'}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${canApplyForLicense ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
                            readOnly
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                    <p className="text-blue-800 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      All information above is automatically populated from your profile. If any details need to be updated, please update your profile first.
                    </p>
                  </div>
                </div>
              )}

              {/* License Type Selection Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  License Type Selection
                </h3>

                {/* License Type Selection Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  {licenseTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        formData.licenseType === type.name
                          ? 'border-green-600 bg-green-50 shadow-md'
                          : 'border-gray-300 bg-white hover:border-green-400 hover:shadow-sm'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, licenseType: type.name }))}
                    >
                      {/* Selection Indicator */}
                      {formData.licenseType === type.name && (
                        <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      <div className="text-center">
                        <h4 className={`font-semibold text-lg mb-2 ${
                          formData.licenseType === type.name ? 'text-green-800' : 'text-gray-800'
                        }`}>
                          {type.name}
                        </h4>

                        <p className={`text-sm mb-3 ${
                          formData.licenseType === type.name ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {type.description}
                        </p>

                        <div className={`text-2xl font-bold mb-3 ${
                          formData.licenseType === type.name ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          Rs. {type.price.toLocaleString()}
                        </div>

                        <div className="space-y-1">
                          {type.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className={`text-xs flex items-center justify-center ${
                              formData.licenseType === type.name ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected License Details */}
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Selected License Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">License Type:</span>
                      <p className="text-green-700 font-semibold">{getCurrentLicenseType().name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment Amount:</span>
                      <p className="text-green-700 font-bold text-lg">Rs. {getCurrentLicenseType().price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="font-medium text-gray-700">Features Included:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {getCurrentLicenseType().features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Please ensure you upload the payment receipt for <strong>Rs. {getCurrentLicenseType().price.toLocaleString()}</strong> when submitting your application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Required Documents
                </h3>
                <p className="text-sm text-gray-600 mb-4">Please upload clear, readable copies of the following documents (JPG, PNG, or PDF format, max 10MB each):</p>

                {/* WORKING FILE UPLOADS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Receipt Upload - WORKING */}
                  <div className="bg-white p-4 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Receipt * (Required - Rs. {getCurrentLicenseType().price.toLocaleString()})
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await handleFileUpload(paymentReceiptRef, 'paymentReceipt');
                        } catch (error) {
                          setError(`Payment receipt upload failed: ${error.message}`);
                        }
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      📁 Select Payment Receipt
                    </button>
                    <input ref={paymentReceiptRef} type="file" style={{ display: 'none' }} />

                    {formData.paymentReceipt && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700 font-medium">
                          ✅ {formData.paymentReceipt.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {Math.round(formData.paymentReceipt.size / 1024)}KB | Type: {formData.paymentReceipt.type}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* BR Document Upload - WORKING */}
                  <div className="bg-white p-4 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration (BR) Document * (Required)
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await handleFileUpload(brDocumentRef, 'brDocument');
                        } catch (error) {
                          setError(`BR document upload failed: ${error.message}`);
                        }
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      📄 Select BR Document
                    </button>
                    <input ref={brDocumentRef} type="file" style={{ display: 'none' }} />

                    {formData.brDocument && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700 font-medium">
                          ✅ {formData.brDocument.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {Math.round(formData.brDocument.size / 1024)}KB | Type: {formData.brDocument.type}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Additional Comments (Optional)
                </h3>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Please provide any additional information, special requests, or comments regarding your license application..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows="4"
                />
              </div>


              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <p>* Required fields must be completed before submission</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    disabled={submitLoading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || !formData.paymentReceipt || !formData.brDocument}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                  >
                    {submitLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Application...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Submit Application
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MillRegistration;