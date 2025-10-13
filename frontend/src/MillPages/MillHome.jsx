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
  X,
  XCircle,
  AlertCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePermitCertificate } from '../utils/certificateGenerator';

// Home page component for the Mill Dashboard
const MillHome = ({ userData }) => {
  const navigate = useNavigate();

  // State to track selected paddy type (dry/wet)
  const [selectedType, setSelectedType] = useState('dry');

  // State for license data
  const [licenseData, setLicenseData] = useState(null);
  const [loadingLicense, setLoadingLicense] = useState(false);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [showLicenseDetailsModal, setShowLicenseDetailsModal] = useState(false);

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

      const localData = localStorage.getItem('millData');
      if (localData) {
        const parsed = JSON.parse(localData);
        sessionStorage.setItem('millOwnerData', localData);
        if (parsed?.token) {
          sessionStorage.setItem('token', parsed.token);
        }
        return parsed;
      }
    } catch (error) {
      console.error("Error parsing stored mill data:", error);
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
  const fetchStockData = useCallback(async () => {
    try {
      setLoadingStock(true);
      setStockError(null);

      // Get authentication token from session storage
      const millOwnerData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      const localData = JSON.parse(localStorage.getItem('millData') || '{}');
      const token = currentUserData?.token
        || millOwnerData.token
        || localData.token
        || sessionStorage.getItem('token');

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
  }, [currentUserData?.token]);

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
  }, [fetchStockData]);

  useEffect(() => {
    if (!licenseData) {
      setShowLicenseDetailsModal(false);
    }
  }, [licenseData]);

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

  // View certificate function - Opens PDF in new window
  const viewCertificate = async (license) => {
    if (!license) {
      toast.error('License data not available');
      return;
    }

    if (!effectiveUserData) {
      toast.error('User data not available. Please refresh the page.');
      return;
    }
    
    try {
      setLoadingCertificate(true);

      const permitData = {
        permitNo: license.license_number || 'N/A',
        holderName: `${effectiveUserData?.first_name || ''} ${effectiveUserData?.last_name || ''}`.trim() || 'N/A',
        holderAddress: `${effectiveUserData?.address || ''}, ${effectiveUserData?.city || ''}, ${effectiveUserData?.district || ''}`.trim() || 'N/A',
        nic: effectiveUserData?.nic || 'N/A',
        locationAddress: `${effectiveUserData?.address || ''}, ${effectiveUserData?.city || ''}, ${effectiveUserData?.district || ''}`.trim() || 'N/A',
        storageCapacity: effectiveUserData?.mill_capacity || 'N/A',
        fee: '1000.00',
        validityStart: license.approved_date || new Date().toISOString(),
        validityEnd: new Date(new Date(license.approved_date || new Date()).setFullYear(new Date(license.approved_date || new Date()).getFullYear() + 1)).toISOString(),
        applicationDate: license.applied_date || license.created_at || new Date().toISOString(),
        receiptNo: 'N/A',
        receiptDate: license.applied_date || license.created_at || new Date().toISOString(),
        issuedDate: license.approved_date || new Date().toISOString(),
      };

      const pdfBytes = await generatePermitCertificate(permitData);
      
      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        toast.success('Certificate opened in new tab');
      } else {
        toast.error('Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error viewing certificate:', error);
      toast.error(`Failed to view certificate: ${error.message}`);
    } finally {
      setLoadingCertificate(false);
    }
  };

  // Download certificate function - Now generates PDF like admin
  const downloadCertificate = async (license) => {
    if (!license) {
      toast.error('License data not available');
      return;
    }

    if (!effectiveUserData) {
      toast.error('User data not available. Please refresh the page.');
      return;
    }
    
    try {
      setLoadingCertificate(true);

      const permitData = {
        permitNo: license.license_number || 'N/A',
        holderName: `${effectiveUserData?.first_name || ''} ${effectiveUserData?.last_name || ''}`.trim() || 'N/A',
        holderAddress: `${effectiveUserData?.address || ''}, ${effectiveUserData?.city || ''}, ${effectiveUserData?.district || ''}`.trim() || 'N/A',
        nic: effectiveUserData?.nic || 'N/A',
        locationAddress: `${effectiveUserData?.address || ''}, ${effectiveUserData?.city || ''}, ${effectiveUserData?.district || ''}`.trim() || 'N/A',
        storageCapacity: effectiveUserData?.mill_capacity || 'N/A',
        fee: '1000.00',
        validityStart: license.approved_date || new Date().toISOString(),
        validityEnd: new Date(new Date(license.approved_date || new Date()).setFullYear(new Date(license.approved_date || new Date()).getFullYear() + 1)).toISOString(),
        applicationDate: license.applied_date || license.created_at || new Date().toISOString(),
        receiptNo: 'N/A',
        receiptDate: license.applied_date || license.created_at || new Date().toISOString(),
        issuedDate: license.approved_date || new Date().toISOString(),
      };

      const pdfBytes = await generatePermitCertificate(permitData);
      
      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PMB_License_Certificate_${license.license_number}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Certificate downloaded successfully!');
      } else {
        toast.error('Failed to generate certificate');
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
    const licenseStatusDisplay = licenseData ? getStatusDisplay(licenseData.status) : null;
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
        </div>

        {loadingLicense ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading license status...</span>
          </div>
        ) : licenseData ? (
          <button
            type="button"
            onClick={() => setShowLicenseDetailsModal(true)}
            className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-5 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Current Status</p>
                  {(() => {
                    if (!licenseStatusDisplay) return null;
                    const StatusIcon = licenseStatusDisplay.icon;
                    return (
                      <span className={`mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${licenseStatusDisplay.bg} ${licenseStatusDisplay.color}`}>
                        <StatusIcon size={16} />
                        <span>{licenseStatusDisplay.text}</span>
                      </span>
                    );
                  })()}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">
                    {licenseData.status === 'approved' && licenseData.license_number ? 'License No:' : 'Application No:'}
                  </span>
                  <span className="ml-2 font-mono">
                    {licenseData.status === 'approved' && licenseData.license_number
                      ? licenseData.license_number
                      : licenseData.application_number}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Clock size={14} className="text-green-600" />
                  <span>
                    Last updated:{' '}
                    {new Date(
                      licenseData.updated_at ||
                      licenseData.approved_date ||
                      licenseData.rejected_date ||
                      licenseData.created_at
                    ).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
              <ChevronRight className="text-gray-400 mt-1" size={28} />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Click to view full license details {licenseData.status === 'approved' ? 'and access your certificate.' : 'and track your application progress.'}
            </p>
          </button>
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

      {/* License Details Modal */}
      {showLicenseDetailsModal && licenseData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Award className="text-green-600" size={24} />
                  License Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Application submitted on {new Date(licenseData.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
              <button
                onClick={() => setShowLicenseDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                {(() => {
                  const StatusIcon = getStatusDisplay(licenseData.status).icon;
                  const statusInfo = getStatusDisplay(licenseData.status);
                  return (
                    <span className={`mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon size={16} />
                      <span>{statusInfo.text}</span>
                    </span>
                  );
                })()}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Application Number</span>
                <span className="mt-2 block text-sm font-mono text-gray-800">{licenseData.application_number}</span>
              </div>

              {licenseData.status === 'approved' && licenseData.license_number && (
                <div className="bg-green-50 rounded-lg p-4">
                  <span className="block text-xs font-medium text-green-700 uppercase tracking-wide">License Number</span>
                  <span className="mt-2 block text-lg font-mono text-green-800 font-semibold">{licenseData.license_number}</span>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">License Type</span>
                <span className="mt-2 block text-sm text-gray-800">{licenseData.license_type || 'Standard Mill License'}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Applied Date</span>
                <span className="mt-2 block text-sm text-gray-800">{new Date(licenseData.created_at).toLocaleDateString('en-GB')}</span>
              </div>

              {licenseData.approved_date && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Approved Date</span>
                  <span className="mt-2 block text-sm text-gray-800">{new Date(licenseData.approved_date).toLocaleDateString('en-GB')}</span>
                </div>
              )}

              {licenseData.rejected_date && (
                <div className="bg-red-50 rounded-lg p-4 md:col-span-2">
                  <span className="block text-xs font-medium text-red-700 uppercase tracking-wide">Rejected Date</span>
                  <span className="mt-2 block text-sm text-red-700">{new Date(licenseData.rejected_date).toLocaleDateString('en-GB')}</span>
                </div>
              )}

              {licenseData.rejection_reason && (
                <div className="bg-red-50 rounded-lg p-4 md:col-span-2">
                  <span className="block text-xs font-medium text-red-700 uppercase tracking-wide">Rejection Reason</span>
                  <p className="mt-2 text-sm text-red-800 whitespace-pre-line">{licenseData.rejection_reason}</p>
                </div>
              )}
            </div>

            {licenseData.status === 'approved' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-green-800">Your license is active</p>
                    <p className="text-sm text-green-600 mt-1">Access your certificate whenever you need it.</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => viewCertificate(licenseData)}
                      disabled={loadingCertificate}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-white transition-colors ${loadingCertificate ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {loadingCertificate ? (
                        <>
                          <Clock size={16} className="mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FileText size={16} className="mr-2" />
                          View Certificate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => downloadCertificate(licenseData)}
                      disabled={loadingCertificate}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${loadingCertificate ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-green-600 text-green-700 hover:bg-green-50'}`}
                    >
                      <Download size={16} className="mr-2" />
                      {loadingCertificate ? 'Preparing...' : 'Download PDF'}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
