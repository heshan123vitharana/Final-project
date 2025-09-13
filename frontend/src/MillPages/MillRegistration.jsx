import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Test upload state
  const [testFile, setTestFile] = useState(null);

  // File input refs
  const paymentReceiptRef = useRef(null);
  const brDocumentRef = useRef(null);
  const testFileRef = useRef(null);

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

  // Improved file upload handler with better error detection
  const handleFileUpload = async (fileInputRef, fieldName) => {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting ${fieldName} upload process`);

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
        console.log(`📂 File dialog change event for ${fieldName}`);
        dialogClosed = true;

        const files = e.target.files;
        console.log(`📁 Files object:`, files);
        console.log(`📁 Files length:`, files?.length);

        if (!files || files.length === 0) {
          console.log(`❌ No file selected for ${fieldName} (user cancelled or no files)`);
          cleanup();
          resolve(null);
          return;
        }

        const file = files[0];
        console.log(`✅ File selected for ${fieldName}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });

        fileProcessed = true;

        // Validate file
        if (file.size > 10 * 1024 * 1024) {
          console.error(`❌ File too large: ${file.size} bytes`);
          cleanup();
          reject(new Error(`File size must be less than 10MB`));
          return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
          console.error(`❌ Invalid file type: ${file.type}`);
          cleanup();
          reject(new Error(`File must be JPG, PNG, or PDF`));
          return;
        }

        console.log(`🔄 Reading file: ${file.name}`);

        // Read file
        const reader = new FileReader();
        reader.onload = () => {
          console.log(`✅ File read successfully: ${reader.result?.length} characters`);
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

          console.log(`✅ ${fieldName} upload completed successfully`);
          cleanup();
          resolve(fileData);
        };

        reader.onerror = () => {
          console.error(`❌ Error reading file:`, reader.error);
          cleanup();
          reject(new Error(`Error reading file: ${reader.error?.message || 'Unknown error'}`));
        };

        reader.readAsDataURL(file);
      };

      // Handle dialog cancellation (focus back to window)
      const handleWindowFocus = () => {
        setTimeout(() => {
          if (!fileProcessed && dialogClosed) {
            console.log(`⚠️ File dialog was cancelled for ${fieldName}`);
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
          console.log('Cleanup error (non-critical):', error.message);
        }
      };

      // Add focus listener to detect dialog cancellation
      window.addEventListener('focus', handleWindowFocus);

      // Add input to DOM and trigger
      document.body.appendChild(fileInput);

      // Small delay to ensure proper DOM attachment
      setTimeout(() => {
        console.log(`🔍 Triggering file dialog for ${fieldName}`);
        fileInput.click();
      }, 50);

      // Timeout fallback
      setTimeout(() => {
        if (!dialogClosed) {
          console.log(`⏰ File dialog timeout for ${fieldName}`);
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
            setHistory(historyData.applications || []);
          } else {
            setHistory([]);
          }
        } catch (historyError) {
          setHistory([]);
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

      console.log('🚀 Submitting License Application');
      console.log('👤 User ID:', userId);
      console.log('📋 License Type:', formData.licenseType);
      console.log('💳 Payment Receipt:', {
        hasData: !!formData.paymentReceipt?.data,
        name: formData.paymentReceipt?.name,
        size: formData.paymentReceipt?.size,
        type: formData.paymentReceipt?.type
      });
      console.log('📄 BR Document:', {
        hasData: !!formData.brDocument?.data,
        name: formData.brDocument?.name,
        size: formData.brDocument?.size,
        type: formData.brDocument?.type
      });
      console.log('💬 Comments:', formData.comments);

      // Make API call to submit license application
      console.log('📡 Making API call to http://localhost:5000/api/licenses/apply');
      const response = await fetch('http://localhost:5000/api/licenses/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ API Error:', error);
        throw new Error(error.message || 'Failed to submit license application');
      }

      const result = await response.json();
      console.log('✅ API Success:', result);
      
      // Add to history
      const newApplication = {
        id: result.applicationId,
        application_number: result.applicationNumber,
        applied_date: new Date().toISOString().split('T')[0],
        status: result.status,
        created_at: new Date().toISOString()
      };
      
      setHistory(prev => [newApplication, ...prev]);
      
      alert(`License application submitted successfully! Application Number: ${result.applicationNumber}`);
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

      {/* DIRECT DOM FILE UPLOAD TEST */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">🔧 Direct DOM File Upload Test</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Method 3: Pure DOM Approach</p>
              <button
                onClick={() => {
                  console.log('🚀 Starting pure DOM file upload test...');

                  // Create input completely outside React
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*,application/pdf';
                  input.style.display = 'none';

                  // Add to body immediately
                  document.body.appendChild(input);

                  // Set up event listener using addEventListener
                  input.addEventListener('change', function(event) {
                    console.log('📂 DOM change event fired');
                    console.log('Event:', event);
                    console.log('Target:', event.target);
                    console.log('Files:', event.target.files);

                    const files = event.target.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      console.log('✅ DOM file captured:', file.name, file.size);

                      // Update React state
                      setTestFile({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        source: 'DOM'
                      });

                      alert(`File captured: ${file.name}`);
                    } else {
                      console.log('❌ No files in DOM event');
                      alert('No files captured');
                    }

                    // Clean up
                    document.body.removeChild(input);
                  });

                  // Trigger file dialog
                  console.log('🔍 Triggering DOM file dialog...');
                  input.click();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
              >
                📁 Test DOM Upload
              </button>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Method 4: Visible Input + Manual Check</p>
              <input
                id="manualFileInput"
                type="file"
                accept="image/*,application/pdf"
                className="w-full p-2 border rounded text-sm"
              />
              <button
                onClick={() => {
                  console.log('🔍 Manual check button clicked');
                  const input = document.getElementById('manualFileInput');
                  console.log('Input element:', input);
                  console.log('Input files:', input.files);

                  if (input.files && input.files.length > 0) {
                    const file = input.files[0];
                    console.log('✅ Manual file found:', file.name);
                    setTestFile({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      source: 'manual'
                    });
                    alert(`Manual file found: ${file.name}`);
                  } else {
                    console.log('❌ No manual files found');
                    alert('No files found in input');
                  }
                }}
                className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm w-full"
              >
                Check for Files
              </button>
            </div>
          </div>

          <div className="bg-white p-3 rounded border">
            <p className="text-sm font-medium">Status:</p>
            {testFile ? (
              <div className="text-xs mt-1 text-green-700">
                <p>✅ File captured successfully!</p>
                <p><strong>Name:</strong> {testFile.name}</p>
                <p><strong>Size:</strong> {Math.round(testFile.size / 1024)}KB</p>
                <p><strong>Type:</strong> {testFile.type}</p>
                <p><strong>Method:</strong> {testFile.source}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-1">No file captured yet</p>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Instructions:</strong> Try Method 3 first (DOM approach). If that fails, try Method 4:
            select a file in the visible input, then click "Check for Files".
          </p>
        </div>
      </div>

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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    Mill Information (Auto-populated)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mill Name</label>
                      <input
                        type="text"
                        value={profileData.businessName || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={`${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={profileData.phone || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* License Type Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  License Type Selection
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose License Type</label>
                  <select
                    value={formData.licenseType}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseType: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="Standard Mill License">Standard Mill License - Basic Operations</option>
                    <option value="Premium Mill License">Premium Mill License - Advanced Features</option>
                    <option value="Industrial Mill License">Industrial Mill License - Large Scale Operations</option>
                  </select>
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
                      Payment Receipt * (Required)
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          console.log('🚀 Starting Payment Receipt upload...');
                          await handleFileUpload(paymentReceiptRef, 'paymentReceipt');
                          console.log('✅ Payment Receipt uploaded successfully!');
                        } catch (error) {
                          console.error('❌ Payment Receipt upload failed:', error);
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
                          console.log('🚀 Starting BR Document upload...');
                          await handleFileUpload(brDocumentRef, 'brDocument');
                          console.log('✅ BR Document uploaded successfully!');
                        } catch (error) {
                          console.error('❌ BR Document upload failed:', error);
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

              {/* Debug Section - TEMPORARY */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">🔧 Debug Information</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>Payment Receipt: {formData.paymentReceipt ? '✅ Loaded' : '❌ Not loaded'}</p>
                  <p>BR Document: {formData.brDocument ? '✅ Loaded' : '❌ Not loaded'}</p>
                  <p>Form Valid: {(formData.paymentReceipt && formData.brDocument) ? '✅ Ready to submit' : '❌ Missing files'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log('🐛 DEBUG - Current Form State:', {
                      hasPaymentReceipt: !!formData.paymentReceipt,
                      hasbrDocument: !!formData.brDocument,
                      paymentReceiptDetails: formData.paymentReceipt ? {
                        name: formData.paymentReceipt.name,
                        size: formData.paymentReceipt.size,
                        type: formData.paymentReceipt.type,
                        hasData: !!formData.paymentReceipt.data,
                        dataLength: formData.paymentReceipt.data?.length || 0
                      } : null,
                      brDocumentDetails: formData.brDocument ? {
                        name: formData.brDocument.name,
                        size: formData.brDocument.size,
                        type: formData.brDocument.type,
                        hasData: !!formData.brDocument.data,
                        dataLength: formData.brDocument.data?.length || 0
                      } : null,
                      licenseType: formData.licenseType,
                      comments: formData.comments
                    });
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Print Debug Info
                </button>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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