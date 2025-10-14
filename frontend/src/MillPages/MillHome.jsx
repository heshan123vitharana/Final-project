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
  ChevronRight,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePermitCertificate } from '../utils/certificateGenerator';

// Allow admins to tweak report polling cadence via optional env override
const REPORT_REFRESH_INTERVAL_MS = (() => {
  const raw = import.meta.env.VITE_MILL_REPORT_REFRESH_INTERVAL_MS;
  const parsed = raw ? Number(raw) : 60000;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60000;
})();

// Home page component for the Mill Dashboard
const MillHome = ({ userData }) => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

  const [reportHistory, setReportHistory] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportNotes, setReportNotes] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

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

  const getAuthToken = useCallback(() => {
    try {
      const sessionValue = sessionStorage.getItem('millOwnerData');
      const localValue = localStorage.getItem('millData');

      const sessionData = sessionValue ? JSON.parse(sessionValue) : {};
      const localData = localValue ? JSON.parse(localValue) : {};

      return currentUserData?.token
        || sessionData?.token
        || localData?.token
        || sessionStorage.getItem('token')
        || null;
    } catch (error) {
      console.error('Error retrieving mill auth token:', error);
      return null;
    }
  }, [currentUserData]);

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

  const currentStockTotal = useMemo(() => {
    if (!Array.isArray(stockData) || stockData.length === 0) {
      return 0;
    }

    return stockData.reduce((sum, item) => {
      const rawValue = item?.total_quantity ?? item?.stock ?? 0;
      const numeric = parseFloat(rawValue);
      return Number.isFinite(numeric) ? sum + numeric : sum;
    }, 0);
  }, [stockData]);

  const getCurrentUserId = () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      return userData.id || userData.user_id || 1;
    } catch (error) {
      console.error('Error getting user ID from session:', error);
      return 1;
    }
  };

  const loadProfilePhoto = useCallback(async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/profile/photo/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.photoData;
      }
      return "";
    } catch {
      return "";
    }
  }, [apiBaseUrl]);

  // Fetch stock summary from API
  const fetchStockData = useCallback(async () => {
    try {
      setLoadingStock(true);
      setStockError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiBaseUrl}/api/stock/summary`, {
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
      setStockData([]);
    } finally {
      setLoadingStock(false);
    }
  }, [apiBaseUrl, getAuthToken]);

  const fetchReportHistory = useCallback(async () => {
    try {
      setLoadingReports(true);
      setReportError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiBaseUrl}/api/stock/reports?limit=5`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to load submitted reports');
      }

      const result = await response.json();
      setReportHistory(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('Report history fetch failed:', error);
      setReportError(error.message);
      setReportHistory([]);
    } finally {
      setLoadingReports(false);
    }
  }, [apiBaseUrl, getAuthToken]);

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
  }, [loadProfilePhoto, userData?.id]);

  // Load stock data when component mounts
  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  useEffect(() => {
    fetchReportHistory();
  }, [fetchReportHistory]);

    useEffect(() => {
      const interval = setInterval(() => {
        fetchReportHistory();
      }, REPORT_REFRESH_INTERVAL_MS);

      return () => clearInterval(interval);
    }, [fetchReportHistory]);

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchReportHistory();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [fetchReportHistory]);

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
  const response = await fetch(`${apiBaseUrl}/api/licenses/applications/${userId}`);

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
  }, [apiBaseUrl, userData]);

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

  const handleSendReport = async () => {
    try {
      setSendingReport(true);
      setReportError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error('Missing authentication token');
      }

      const payload = {
        reportType: 'stock-update',
        periodStart: periodStart || null,
        periodEnd: periodEnd || null,
        notes: reportNotes || ''
      };

      const response = await fetch(`${apiBaseUrl}/api/stock/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to send stock report');
      }

      await response.json();

      toast.success('Stock report sent to admin successfully.');
      setShowReportModal(false);
      setReportNotes('');
      setPeriodStart('');
      setPeriodEnd('');
      fetchReportHistory();
    } catch (error) {
      console.error('Send stock report error:', error);
      setReportError(error.message);
      toast.error(`Failed to send stock report: ${error.message}`);
    } finally {
      setSendingReport(false);
    }
  };

  const openReportModal = () => {
    const today = new Date();
    const defaultEnd = today.toISOString().slice(0, 10);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);
    const defaultStart = startDate.toISOString().slice(0, 10);

    setReportError(null);
    setPeriodEnd((prev) => prev || defaultEnd);
    setPeriodStart((prev) => prev || defaultStart);
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setReportError(null);
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

  const formatReportType = (type) => {
    if (!type) return 'Stock Report';
    return type
      .split(/[-_\s]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getReportStatusStyles = (status) => {
    switch (status) {
      case 'acknowledged':
        return { label: 'Acknowledged', className: 'bg-green-100 text-green-700' };
      case 'rejected':
        return { label: 'Rejected', className: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Submitted', className: 'bg-blue-100 text-blue-700' };
    }
  };

  const formatDateTime = (value) => {
    if (!value) {
      return 'Not available';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };
  
  const formatDateLabel = (value) => {
    if (!value) {
      return null;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toLocaleDateString('en-GB');
  };

  const formatReportPeriod = (report) => {
    const formatDate = (input) => {
      if (!input) {
        return null;
      }

      const parsed = new Date(input);
      if (Number.isNaN(parsed.getTime())) {
        return null;
      }

      return parsed.toLocaleDateString('en-GB');
    };

    const startLabel = formatDate(report?.period_start);
    const endLabel = formatDate(report?.period_end);

    if (startLabel && endLabel) {
      return `${startLabel} → ${endLabel}`;
    }

    if (startLabel) {
      return `From ${startLabel}`;
    }

    if (endLabel) {
      return `Up to ${endLabel}`;
    }

    return 'Latest update';
  };

  const licenseValidity = useMemo(() => {
    if (!licenseData || licenseData.status !== 'approved') {
      return null;
    }

    const referenceValue = licenseData.approved_date || licenseData.updated_at || licenseData.created_at;
    if (!referenceValue) {
      return null;
    }

    const startDate = new Date(referenceValue);
    if (Number.isNaN(startDate.getTime())) {
      return null;
    }

    let endDate = null;

    if (licenseData.valid_until) {
      const parsedValidUntil = new Date(licenseData.valid_until);
      if (!Number.isNaN(parsedValidUntil.getTime())) {
        endDate = parsedValidUntil;
      }
    }

    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const dayMs = 1000 * 60 * 60 * 24;
    const absoluteDiff = Math.abs(diffMs);
    const daysRemaining = diffMs >= 0
      ? Math.ceil(absoluteDiff / dayMs)
      : -Math.ceil(absoluteDiff / dayMs);

    let daysLabel = null;
    if (absoluteDiff < dayMs) {
      daysLabel = diffMs >= 0 ? 'Expires today' : 'Expired today';
    } else if (daysRemaining > 0) {
      daysLabel = `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`;
    } else if (daysRemaining < 0) {
      const overdueDays = Math.abs(daysRemaining);
      daysLabel = `Expired ${overdueDays} day${overdueDays === 1 ? '' : 's'} ago`;
    }

    return {
      startDate,
      endDate,
      isExpired: diffMs < 0,
      daysRemaining,
      daysLabel
    };
  }, [licenseData]);

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
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <header className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
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
                  {(currentUserData?.business_name || userData?.business_name) && (
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600 mb-1">
                      {currentUserData?.business_name || userData?.business_name}
                    </p>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {currentUserData?.first_name || userData?.first_name || 'Mill Owner'}!
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Use the tools below to keep your stock information accurate and your license up to date.
                  </p>
                  {(currentUserData?.isFirstLogin || userData?.isFirstLogin) && (
                    <p className="text-orange-600 font-medium mt-2">
                      🚀 Complete your profile to unlock all features
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={fetchStockData}
                  disabled={loadingStock}
                  className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingStock ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh Data
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/mill/update-stock')}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Stock Entry
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-6">
            <section>
              <div className="bg-white border border-green-100 shadow-lg rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                    <Award className="text-green-600" size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">License Status</h2>
                    <p className="text-[11px] text-gray-500">Stay informed about your mill license progress.</p>
                  </div>
                </div>

                {loadingLicense ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">Loading license status...</span>
                  </div>
                ) : licenseData ? (
                  <button
                    type="button"
                    onClick={() => setShowLicenseDetailsModal(true)}
                    className="w-full text-left bg-white/60 hover:bg-green-50 border border-green-100 rounded-xl p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Current Status</p>
                          {(() => {
                            if (!licenseStatusDisplay) return null;
                            const StatusIcon = licenseStatusDisplay.icon;
                            return (
                              <span className={`mt-1 inline-flex items-center space-x-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${licenseStatusDisplay.bg} ${licenseStatusDisplay.color}`}>
                                <StatusIcon size={14} />
                                <span>{licenseStatusDisplay.text}</span>
                              </span>
                            );
                          })()}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">
                            {licenseData.status === 'approved' && licenseData.license_number ? 'License No:' : 'Application No:'}
                          </span>
                          <span className="ml-2 font-mono">
                            {licenseData.status === 'approved' && licenseData.license_number
                              ? licenseData.license_number
                              : licenseData.application_number}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                          <Clock size={12} className="text-green-600" />
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
                        {licenseData.status === 'approved' && (
                          <div className="mt-1 space-y-1 text-[11px]">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <CheckCircle size={12} className="text-green-600" />
                              <span>
                                {licenseValidity?.isExpired ? 'Expired on' : 'Valid until'}{' '}
                                {licenseValidity?.endDate ? formatDateLabel(licenseValidity.endDate) : 'Calculating...'}
                              </span>
                            </div>
                            {licenseValidity?.daysLabel && (
                              <div className={`flex items-center gap-1.5 font-semibold ${licenseValidity.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                                {licenseValidity.isExpired ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                                <span>{licenseValidity.daysLabel}</span>
                              </div>
                            )}
                            {licenseValidity?.isExpired && (
                              <span className="block text-[11px] text-amber-700">
                                Renew your license from the Mill Registration page to restore active status.
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                        <ChevronRight className="text-gray-400" size={16} />
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-gray-500">
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
            </section>
          </div>

          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {selectedType} Paddy Stock Levels by Variety
                </h2>
                <p className="text-sm text-gray-500">
                  Total Varieties: {chartData.length} | Total Stock: {chartData.reduce((sum, item) => sum + item.stock, 0).toFixed(2)} MT
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-lg border border-green-600 overflow-hidden">
                  <button
                    onClick={() => setSelectedType('dry')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedType === 'dry' ? 'bg-green-600 text-white' : 'bg-white text-green-700'
                    }`}
                  >
                    Dry Paddy
                  </button>
                  <button
                    onClick={() => setSelectedType('wet')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedType === 'wet' ? 'bg-green-600 text-white' : 'bg-white text-green-700'
                    }`}
                  >
                    Wet Paddy
                  </button>
                </div>
                <button
                  onClick={fetchStockData}
                  disabled={loadingStock}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingStock ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh Stock
                </button>
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variety" />
                  <YAxis
                    label={{ value: 'Stock (MT)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} MT`, 'Stock']}
                    labelFormatter={(label) => `Variety: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="stock"
                    fill={selectedType === 'dry' ? "#38a169" : "#3182ce"}
                    name={`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Paddy Stock (MT)`}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>

        {/* Stock Reporting Section */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <section className="bg-white rounded-2xl shadow-sm border border-green-100 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Send className="text-green-600" size={20} />
                  Share Stock Update with Admin
                </h2>
                <p className="text-sm text-gray-600">
                  Send a snapshot of your latest stock levels to the central administration team. This keeps the district-wide dashboard up to date and helps the PMB respond quickly to stock needs.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                  <li>Summary includes total entries, quantity, value, and variety breakdown.</li>
                  <li>Admin can acknowledge or request follow-up directly from your submission.</li>
                  <li>Use the note to highlight urgent updates or issues the PMB should know about.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 min-w-[230px]">
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Current Total Stock</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {currentStockTotal.toFixed(2)} <span className="text-sm font-semibold text-green-700">MT</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {loadingReports ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      ) : (
                        <button
                          type="button"
                          onClick={fetchReportHistory}
                          className="text-xs text-green-700 font-semibold hover:underline"
                        >
                          Refresh log
                        </button>
                      )}
                    </div>
                  </div>
                  {reportError && (
                    <p className="mt-2 text-xs text-red-600">{reportError}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={openReportModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <Send size={16} className="-ml-1" />
                  Send Stock Report
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">Recent submissions</h3>
              {loadingReports ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-sm text-gray-600">Loading report history...</span>
                </div>
              ) : reportHistory.length === 0 ? (
                <div className="border border-dashed border-green-200 rounded-xl p-5 text-center">
                  <p className="text-sm text-gray-600">No stock reports submitted yet. Send your first report to keep the admin team informed.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {reportHistory.map((report) => {
                    const statusStyles = getReportStatusStyles(report.status);
                    const reportSummary = report.summary?.totals || report.totals;

                    return (
                      <article
                        key={report.id}
                        className="rounded-xl border border-green-100 bg-white px-4 py-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatReportType(report.report_type)}
                              <span className="ml-2 text-xs font-medium text-gray-500">
                                {formatReportPeriod(report)}
                              </span>
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span className="inline-flex items-center gap-1">
                                <span className="font-semibold text-gray-700">Quantity:</span>
                                {reportSummary?.quantityKg?.toFixed ? reportSummary.quantityKg.toFixed(2) : Number(reportSummary?.quantityKg || 0).toFixed(2)} MT
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="font-semibold text-gray-700">Entries:</span>
                                {reportSummary?.entries ?? 0}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="font-semibold text-gray-700">Submitted:</span>
                                {formatDateTime(report.created_at)}
                              </span>
                            </div>
                            {report.notes && (
                              <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                                <span className="font-semibold text-gray-700 mr-2">Note:</span>
                                {report.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles.className}`}>
                              {statusStyles.label}
                            </span>
                            {report.updated_at && (
                              <span className="text-[11px] text-gray-400">Updated {formatDateTime(report.updated_at)}</span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Report Submission Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
              <header className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Send className="text-green-600" size={18} />
                    Submit Stock Report to Admin
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Review your reporting window and add an optional note before sending.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeReportModal}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X size={22} />
                </button>
              </header>

              <form
                className="px-6 py-5 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSendReport();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-gray-700">
                    <span className="font-semibold">Period start</span>
                    <input
                      type="date"
                      value={periodStart}
                      max={periodEnd || undefined}
                      onChange={(event) => setPeriodStart(event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-gray-700">
                    <span className="font-semibold">Period end</span>
                    <input
                      type="date"
                      value={periodEnd}
                      min={periodStart || undefined}
                      onChange={(event) => setPeriodEnd(event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="flex flex-col gap-2 text-sm text-gray-700">
                    <span className="font-semibold">Add note (optional)</span>
                    <textarea
                      rows={4}
                      value={reportNotes}
                      onChange={(event) => setReportNotes(event.target.value)}
                      placeholder="Highlight urgent updates, quality issues, or requests for transport."
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    The generated report already includes totals and variety stats. Use this note to provide extra context for the admin team.
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-gray-800">What will be shared:</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                      • Total entries per paddy type & condition
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                      • Overall quantity & value totals
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                      • Mill profile & capacity snapshot
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">A copy of this submission will show up in your recent reports list above.</span>
                </div>

                {reportError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {reportError}
                  </div>
                )}

                <footer className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                    disabled={sendingReport}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors ${sendingReport ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={sendingReport}
                  >
                    {sendingReport ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="-ml-1" />
                        Send report now
                      </>
                    )}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        )}

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

              {licenseData.status === 'approved' && (
                <div className="bg-emerald-50 rounded-lg p-4 md:col-span-2">
                  <span className="block text-xs font-medium text-emerald-700 uppercase tracking-wide">License Validity</span>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Valid from{' '}
                      <strong>{formatDateLabel(licenseValidity?.startDate || licenseData.approved_date) || 'Not available'}</strong>
                    </span>
                    <span>
                      Valid until{' '}
                      <strong>{licenseValidity?.endDate ? formatDateLabel(licenseValidity.endDate) : 'Not available'}</strong>
                    </span>
                  </div>
                  {licenseValidity?.daysLabel && (
                    <p className={`mt-2 text-sm font-semibold ${licenseValidity.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                      {licenseValidity.daysLabel}
                    </p>
                  )}
                  {licenseValidity?.isExpired && (
                    <p className="mt-1 text-sm text-amber-700">Submit a renewal request from the Mill Registration page to restore your license.</p>
                  )}
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
                    <p className={`text-base font-semibold ${licenseValidity?.isExpired ? 'text-red-700' : 'text-green-800'}`}>
                      {licenseValidity?.isExpired ? 'Your license has expired' : 'Your license is active'}
                    </p>
                    <p className={`text-sm mt-1 ${licenseValidity?.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                      {licenseValidity?.isExpired
                        ? 'Submit a renewal request from the Mill Registration page to continue operations.'
                        : 'Access your certificate whenever you need it.'}
                    </p>
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
                    {licenseValidity?.isExpired && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowLicenseDetailsModal(false);
                          navigate('/mill/register');
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-amber-500 text-amber-700 transition-colors hover:bg-amber-50"
                      >
                        Renew License
                      </button>
                    )}
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
