import { useEffect, useState } from 'react';
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
    console.log('🔄 Complete Profile button clicked!');
    console.log('🔄 Current location:', window.location.href);
    console.log('🔄 Navigating to Profile section...');
    
    // Use relative navigation like the sidebar does
    navigate('../profile');
    console.log('✅ Navigation to profile completed');
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
        console.log('📊 Fetching real profile data from API for user:', userId);
        
        // Fetch profile data from API using new completeness endpoint
        try {
          const response = await fetch(`http://localhost:5000/api/completeness/check/${userId}`);
          if (response.ok) {
            const apiData = await response.json();
            console.log('✅ NEW API Profile data received:', apiData);
            
            setProfileData(apiData.user || {});
            setProfileCompleteness(apiData.completeness || 0);
            setMissingFields(apiData.missingFields || []);
            setFieldStatus(apiData.fieldStatus || null);
            setCanApplyForLicense(apiData.canApplyForLicense || false);
            
            console.log(`📊 Real profile completeness from API: ${apiData.completeness}%`);
            console.log(`🔍 Missing fields from API:`, apiData.missingFields);
            console.log(`✅ Can apply for license:`, apiData.canApplyForLicense);
            console.log(`📋 Field status:`, apiData.fieldStatus);
          }
        } catch (apiError) {
          console.error('Error fetching from API:', apiError);
        }
        
        // Load license history (static data)
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
        
      } catch (error) {
        console.error('Error loading data:', error);
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
                console.error('Error getting user ID from session:', error);
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
            console.error('Error refreshing profile data:', error);
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