import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';
import {
  Award,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

// Home page component for the Mill Dashboard
const MillHome = ({ userData }) => {
  const navigate = useNavigate();

  // State to track selected paddy type (dry/wet)
  const [selectedType, setSelectedType] = useState('dry');

  // State for license data
  const [licenseData, setLicenseData] = useState(null);
  const [loadingLicense, setLoadingLicense] = useState(false);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState('');
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  // Add stock data state
  const [stockData, setStockData] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [stockError, setStockError] = useState(null);

  const effectiveUserData = useMemo(() => {
    if (userData) return userData;

    try {
      const sessionData = sessionStorage.getItem('millOwnerData');
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
    }

    return null;
  }, [userData]);

  // Get current user data (memoized) - using effectiveUserData as base
  const currentUserData = useMemo(() => {
    return effectiveUserData || {};
  }, [effectiveUserData]);

  // Set page title on mount and when user changes
  useEffect(() => {
    const userName = currentUserData?.first_name || userData?.first_name || 'Mill Owner';
    document.title = `Dashboard | Welcome ${userName}`;
  }, [currentUserData?.first_name, userData?.first_name]);

  // Process stock data for chart display
  const processStockData = (rawData, condition) => {
    const filtered = rawData.filter(item => item.paddy_condition === condition);

    // Group by paddy type and sum quantities
    const grouped = filtered.reduce((acc, item) => {
      // Map database paddy types to display names
      let variety = item.paddy_type;
      if (variety === 'Nadu - White') variety = 'Nadu White';
      if (variety === 'Nadu - Red') variety = 'Nadu Red';
      if (variety === 'Kiri Samba') variety = 'Kiri Samba';

      if (!acc[variety]) {
        acc[variety] = 0;
      }
      acc[variety] += parseFloat(item.total_quantity);
      return acc;
    }, {});

    // Convert to chart format
    return Object.entries(grouped).map(([variety, stock]) => ({
      variety,
      stock: Math.round(stock * 100) / 100 // Round to 2 decimal places
    }));
  };

  // Select chart data based on selected paddy type
  const chartData = processStockData(stockData, selectedType === 'dry' ? 'Dry' : 'Wet');

  const getCurrentUserId = () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      return userData.id || userData.user_id || 1;
    } catch (error) {
      console.error('Error getting user ID from session:', error);
      return 1;
    }
  };

  const loadProfilePhoto = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/photo/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.photoData;
      }
      return "";
    } catch {
      return "";
    }
  };

  // Fetch stock summary from API
  const fetchStockData = async () => {
    try {
      setLoadingStock(true);
      setStockError(null);

      // Get authentication token from session storage
      const millOwnerData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      const token = millOwnerData.token || sessionStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/stock/summary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStockData(result.data || []);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch stock data');
      }
    } catch (error) {
      console.error('Stock data fetch failed:', error);
      setStockError(error.message);
      // Set empty data so chart shows "No data available"
      setStockData([]);
    } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      setLoadingPhoto(true);
      try {
        const userId = getCurrentUserId();
        const photoData = await loadProfilePhoto(userId);
        if (photoData) {
          setProfilePhoto(photoData);
        }
      } catch (error) {
        console.error('Error loading profile photo:', error);
      } finally {
        setLoadingPhoto(false);
      }
    };

    fetchProfilePhoto();
  }, [userData?.id]);

  // Load stock data when component mounts
  useEffect(() => {
    fetchStockData();
  }, []);

  // Fetch user's license data
  const fetchLicenseData = useCallback(async () => {
    // Get current user data from session to ensure we have the latest user ID
    const getCurrentUserData = () => {
      try {
        return JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      } catch {
        return userData || {};
      }
    };

    const currentUser = getCurrentUserData();
    const userId = currentUser?.id || userData?.id;

    if (!userId) {
      return;
    }

    try {
      setLoadingLicense(true);
      const response = await fetch(`http://localhost:5000/api/licenses/applications/${userId}`);

      if (response.ok) {
        const data = await response.json();
        if (data.applications && data.applications.length > 0) {
          setLicenseData(data.applications[0]);
        } else {
          setLicenseData(null);
        }
      }
    } catch {
      toast.error('Failed to load license status. Please try again.');
    } finally {
      setLoadingLicense(false);
    }
  }, [userData]);

  // Load license data when component mounts
  useEffect(() => {
    fetchLicenseData();
  }, [fetchLicenseData]);

  // Generate certificate data for approved licenses
  const generateCertificate = (applicationData) => {
    if (!applicationData || applicationData.status !== 'approved') return null;

    return {
      licenseNumber: applicationData.license_number,
      holderName: `${applicationData.first_name} ${applicationData.last_name}`,
      holderAddress: `${applicationData.address}, ${applicationData.city}, ${applicationData.district} ${applicationData.postal_code}`,
      businessName: applicationData.business_name,
      businessLocation: `${applicationData.mill_location}`,
      millCapacity: applicationData.mill_capacity,
      commencementDate: new Date(applicationData.approved_date).toLocaleDateString('en-GB'),
      expiryDate: new Date(new Date(applicationData.approved_date).getTime() + (365 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB'),
      issueDate: new Date(applicationData.approved_date).toLocaleDateString('en-GB'),
      issuingOfficer: 'Director General'
    };
  };

  // Download certificate function
  const downloadCertificate = async (applicationId) => {
    try {
      setLoadingCertificate(true);

      // Fetch certificate data from the unified endpoint
      const response = await fetch(`http://localhost:5000/api/licenses/certificate/${applicationId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to retrieve certificate' }));
        throw new Error(errorData.message || 'Failed to retrieve certificate');
      }

      const data = await response.json();

      if (data.success && data.certificate) {
        const certificate = data.certificate;

        // Generate formatted certificate content using server data
        const certificateContent = `
GOVERNMENT OF SRI LANKA
PADDY MARKETING BOARD

LICENSE TO OPERATE RICE MILL

License issued under Section 10 of the Paddy Marketing Board Act No. 14 of 1971

License Number: ${certificate.licenseNumber}

1. Name of the License Holder: ${certificate.holderName}
2. Address of the License Holder: ${certificate.holderAddress}
3. Name of the Business and Business Location: ${certificate.businessName}, ${certificate.businessLocation}
4. Capacity of the Milling Machine/Mill: ${certificate.millCapacity}
5. Validity Period of the License:
   (a) Commencement Date: ${certificate.commencementDate}
   (b) Expiry Date: ${certificate.expiryDate}

This license is issued to the above-mentioned license holder by the Paddy Marketing Board to operate a business of milling, parboiling, or processing rice at the aforementioned business location, following the consideration of the application submitted by the license holder. This license is subject to the specific conditions stipulated herein.

CONDITIONS:
1. This license is non-transferable and must be displayed prominently at the business premises.
2. The license holder must comply with all regulations under the Paddy Marketing Board Act.
3. Regular inspections may be conducted by authorized officers of the PMB.
4. Any changes to the business location or capacity must be reported immediately.
5. This license must be renewed annually before the expiry date.

Issued by the Paddy Marketing Board.

Date: ${certificate.issueDate}
Place: ${certificate.issuedAt}
Address: ${certificate.officeAddress}

${certificate.issuingOfficer}
Issuing Officer
PMB

This is an official government document. Any unauthorized reproduction is strictly prohibited.
`;

        // Download as text file (for now - can be enhanced to download PDF)
        const blob = new Blob([certificateContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PMB_License_Certificate_${certificate.holderName.replace(/\s+/g, '_')}.txt`;
        link.click();
        window.URL.revokeObjectURL(url);

        toast.success('Certificate downloaded successfully!');
      } else {
        toast.error(data.message || 'Certificate not available');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error(`Failed to download certificate: ${error.message}`);
    } finally {
      setLoadingCertificate(false);
    }
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Approved' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending Review' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Rejected' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100', text: 'No Application' };
    }
  };


  try {
    if (!effectiveUserData) {
      return (
        <div className="p-6 text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Loading Dashboard...</h2>
            <p>Please wait while we load your dashboard.</p>
            <p className="mt-2 text-sm">
              If this persists, please <a href="/" className="text-blue-600 underline">return to home</a> and log in again.
            </p>
          </div>
        </div>
      );
    }

    return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard heading with real profile */}
      <div className="flex items-center mb-6">
        <div className="mr-4 relative">
          {loadingPhoto && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          )}
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-4 border-green-300 shadow-lg bg-white"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-4 border-green-300 shadow-lg bg-white"
            />
          )}
        </div>
        <div>
          <h1 className="text-5xl font-bold text-green-700">
            Welcome back, {currentUserData?.first_name || userData?.first_name || 'Mill Owner'}!
          </h1>
          {(currentUserData?.isFirstLogin || userData?.isFirstLogin) && (
            <p className="text-orange-600 font-medium mt-2">
              🚀 Complete your profile to unlock all features
            </p>
          )}
        </div>
      </div>

      {/* Dashboard description */}
      <p className="text-xl text-gray-700 mb-6">
        {(currentUserData?.business_name || userData?.business_name) && (
          <span className="block font-medium text-green-800 mb-2">
            {currentUserData?.business_name || userData?.business_name} Dashboard
          </span>
        )}
        Use the sidebar to navigate through the system and manage mill operations effectively.
      </p>

      {/* License Status Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Award className="mr-3 text-green-600" size={28} />
            License Status
          </h2>
          {licenseData && licenseData.status === 'approved' && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="mr-2" size={16} />
              View Certificate
            </button>
          )}
        </div>

        {loadingLicense ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading license status...</span>
          </div>
        ) : licenseData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                {(() => {
                  const StatusIcon = getStatusDisplay(licenseData.status).icon;
                  return <StatusIcon className={`mr-2 ${getStatusDisplay(licenseData.status).color}`} size={20} />;
                })()}
                <span className="font-semibold text-gray-700">Status</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusDisplay(licenseData.status).bg} ${getStatusDisplay(licenseData.status).color}`}>
                {getStatusDisplay(licenseData.status).text}
              </span>
            </div>

            {/* Application Number */}
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Application Number</span>
              <span className="text-lg font-mono text-gray-900">{licenseData.application_number}</span>
            </div>

            {/* License Number (if approved) */}
            {licenseData.status === 'approved' && licenseData.license_number && (
              <div className="bg-green-50 rounded-lg p-4">
                <span className="block text-sm font-medium text-green-700 mb-1">License Number</span>
                <span className="text-lg font-mono text-green-800 font-bold">{licenseData.license_number}</span>
              </div>
            )}

            {/* Application Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Applied Date</span>
              <span className="text-sm text-gray-900">{new Date(licenseData.created_at).toLocaleDateString('en-GB')}</span>
            </div>

            {/* Approval Date (if approved) */}
            {licenseData.status === 'approved' && licenseData.approved_date && (
              <div className="bg-green-50 rounded-lg p-4">
                <span className="block text-sm font-medium text-green-700 mb-1">Approved Date</span>
                <span className="text-sm text-green-800">{new Date(licenseData.approved_date).toLocaleDateString('en-GB')}</span>
              </div>
            )}

            {/* License Type */}
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">License Type</span>
              <span className="text-sm text-gray-900">{licenseData.license_type || 'Standard Mill License'}</span>
            </div>

            {/* Rejection Reason (if rejected) */}
            {licenseData.status === 'rejected' && licenseData.rejection_reason && (
              <div className="bg-red-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
                <span className="block text-sm font-medium text-red-700 mb-1">Rejection Reason</span>
                <span className="text-sm text-red-800">{licenseData.rejection_reason}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No License Application Found</h3>
            <p className="text-gray-600 mb-4">You haven't submitted a license application yet.</p>
            <button
              onClick={() => navigate('/mill/register')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="mr-2" size={16} />
              Apply for License
            </button>
          </div>
        )}
      </div>

      {/* Chart type selection buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedType('dry')}
            className={`px-4 py-2 rounded font-semibold border ${
              selectedType === 'dry'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-700 border-green-600'
            }`}
          >
            Dry Paddy
          </button>
          <button
            onClick={() => setSelectedType('wet')}
            className={`px-4 py-2 rounded font-semibold border ${
              selectedType === 'wet'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-700 border-green-600'
            }`}
          >
            Wet Paddy
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchStockData}
          disabled={loadingStock}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loadingStock ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh Data
        </button>
      </div>

      {/* Paddy stock bar chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {selectedType} Paddy Stock Levels by Variety
          </h2>
          <div className="text-sm text-gray-600">
            Total Varieties: {chartData.length} |
            Total Stock: {chartData.reduce((sum, item) => sum + item.stock, 0).toFixed(2)} MT
          </div>
        </div>

        {loadingStock ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading stock data...</p>
            </div>
          </div>
        ) : stockError ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Failed to load stock data</p>
              <p className="text-gray-600 text-sm mb-4">{stockError}</p>
              <button
                onClick={fetchStockData}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedType} paddy stock found</h3>
              <p className="text-gray-600 mb-4">Add some stock entries to see the chart data</p>
              <button
                onClick={() => navigate('/mill/update-stock')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Stock Entry
              </button>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              {/* Grid lines */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* X-axis for paddy variety */}
              <XAxis dataKey="variety" />
              {/* Y-axis for stock levels */}
              <YAxis
                label={{ value: 'Stock (MT)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              {/* Tooltip on hover */}
              <Tooltip
                formatter={(value) => [`${value} MT`, 'Stock']}
                labelFormatter={(label) => `Variety: ${label}`}
              />
              {/* Chart legend */}
              <Legend />
              {/* Bar for stock data */}
              <Bar
                dataKey="stock"
                fill={selectedType === 'dry' ? "#38a169" : "#3182ce"}
                name={`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Paddy Stock (MT)`}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Certificate Viewing Modal */}
      {showCertificateModal && licenseData && licenseData.status === 'approved' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">License Certificate</h3>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {(() => {
              const certificate = generateCertificate(licenseData);
              if (!certificate) return null;

              return (
                <div className="border-4 border-green-800 p-8 bg-gradient-to-br from-green-50 to-white">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="text-2xl font-bold text-green-800 mb-2">
                      GOVERNMENT OF SRI LANKA
                    </div>
                    <div className="text-xl font-bold text-green-700 mb-4">
                      PADDY MARKETING BOARD
                    </div>
                    <div className="text-lg font-bold text-black mb-4 border-b-2 border-green-600 pb-2">
                      MILL LICENSE
                    </div>
                    <p className="text-sm text-gray-700">
                      License issued under Section 10 of the Paddy Marketing Board Act No. 14 of 1971
                    </p>
                    <div className="mt-4 text-lg font-bold text-green-700">
                      License Number: {certificate.licenseNumber}
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="space-y-6 text-sm">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <span className="font-semibold">1. Name of the License Holder:</span>
                        <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                          {certificate.holderName}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold">2. Address of the License Holder:</span>
                        <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                          {certificate.holderAddress}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold">3. Name of the Business and Business Location:</span>
                        <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                          {certificate.businessName}, {certificate.businessLocation}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <span className="font-semibold">4. Capacity of the Milling Machine/Mill:</span>
                        <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                          {certificate.millCapacity}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold">5. Validity Period of the License:</span>
                        <div className="ml-4 mt-2 space-y-2">
                          <div>
                            <span className="font-medium">(a) Commencement Date:</span>
                            <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                              {certificate.commencementDate}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">(b) Expiry Date:</span>
                            <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                              {certificate.expiryDate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-justify text-xs leading-relaxed pt-4">
                      This license is issued to the above-mentioned license holder by the Paddy Marketing Board to operate a business of milling, parboiling, or processing rice at the aforementioned business location, following the consideration of the application submitted by the license holder. This license is subject to the specific conditions stipulated herein.
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t-2 border-green-600">
                    <div className="text-center text-sm mb-4">
                      <div className="font-semibold">Issued by the Paddy Marketing Board.</div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <div className="font-semibold">Date: {certificate.issueDate}</div>
                        <div className="text-sm mt-2">
                          <div className="font-medium">Place: Colombo 02</div>
                          <div>Address: Sir Chittampalam A. Gardiner Mawatha</div>
                          <div>Housing Secretariat Building</div>
                          <div>6th Floor</div>
                          <div className="font-medium mt-1">By the Paddy Marketing Board</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-24 h-16 border-2 border-dashed border-green-600 flex items-center justify-center mb-2">
                          <span className="text-red-600 font-bold text-lg">OFFICIAL SEAL</span>
                        </div>
                        <div className="border-t-2 border-gray-400 pt-2">
                          <div className="font-semibold text-sm">{certificate.issuingOfficer}</div>
                          <div className="text-sm text-gray-600">Issuing Officer</div>
                          <div className="font-bold text-green-700">PMB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    This is an official government document. Any unauthorized reproduction is strictly prohibited.
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => downloadCertificate(licenseData.id)}
                disabled={loadingCertificate}
                className={`flex-1 ${loadingCertificate ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center`}
              >
                <Download className="mr-2" size={20} />
                {loadingCertificate ? 'Downloading...' : 'Download Certificate'}
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  } catch (error) {
    console.error("MillHome rendering error:", error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold">Error in MillHome Component</h2>
          <p>Error: {error.message}</p>
          <p>Check console for details</p>
        </div>
      </div>
    );
  }
};

export default MillHome;