import { useEffect, useState } from 'react';
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
import { toast } from 'react-toastify';

// Home page component for the Mill Dashboard
const MillHome = ({ userData }) => {
  // Set page title on mount
  useEffect(() => {
    document.title = "Dashboard | Home";
  }, []);

  // State to track selected paddy type (dry/wet)
  const [selectedType, setSelectedType] = useState('dry');

  // License status state
  const [licenseData, setLicenseData] = useState(null);
  const [loadingLicense, setLoadingLicense] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Sample data for dry paddy stock
  const dryPaddyData = [
    { variety: 'Nadu', stock: 1200 },
    { variety: 'Samba', stock: 800 },
    { variety: 'Red Rice', stock: 450 },
  ];

  // Sample data for wet paddy stock
  const wetPaddyData = [
    { variety: 'Nadu', stock: 600 },
    { variety: 'Samba', stock: 950 },
    { variety: 'Red Rice', stock: 300 },
  ];

  // Select chart data based on selected paddy type
  const chartData = selectedType === 'dry' ? dryPaddyData : wetPaddyData;

  // Fetch user's license data
  const fetchLicenseData = async () => {
    if (!userData?.id) return;

    try {
      setLoadingLicense(true);
      const response = await fetch(`http://localhost:5000/api/licenses/applications/${userData.id}`);

      if (response.ok) {
        const data = await response.json();
        if (data.applications && data.applications.length > 0) {
          // Get the most recent application
          setLicenseData(data.applications[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching license data:', error);
      toast.error('Failed to load license status. Please try again.', { position: 'top-right' });
    } finally {
      setLoadingLicense(false);
    }
  };

  // Load license data when component mounts
  useEffect(() => {
    fetchLicenseData();
  }, [userData?.id]);

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
  const downloadCertificate = (certificate) => {
    const certificateContent = `
GOVERNMENT OF SRI LANKA
PADDY MARKETING BOARD

MILL LICENSE

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

Issued by the Paddy Marketing Board.

Date: ${certificate.issueDate}
Place: Colombo 02
Address: Sir Chittampalam A. Gardiner Mawatha
Housing Secretariat Building
6th Floor
By the Paddy Marketing Board

${certificate.issuingOfficer}
Issuing Officer
PMB

This is an official government document. Any unauthorized reproduction is strictly prohibited.
`;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PMB_License_Certificate_${certificate.holderName.replace(/\s+/g, '_')}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Certificate downloaded successfully!', { position: 'top-right' });
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

  return (
    <div className="p-6">
      {/* Dashboard heading */}
      <h1 className="text-5xl font-bold mb-4 text-green-700">
        Welcome back, {userData?.first_name || 'Mill Owner'}!
      </h1>

      {/* Dashboard description */}
      <p className="text-xl text-gray-700 mb-6">
        {userData?.business_name && (
          <span className="block font-medium text-green-800 mb-2">
            {userData.business_name} Dashboard
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
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FileText className="mr-2" size={16} />
              Apply for License
            </button>
          </div>
        )}
      </div>

      {/* Chart type selection buttons */}
      <div className="flex space-x-4 mb-6">
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

      {/* Paddy stock bar chart */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
          {selectedType} Paddy Stock Levels by Variety
        </h2>
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
            <Tooltip formatter={(value) => [`${value} MT`, 'Stock']} />
            {/* Chart legend */}
            <Legend />
            {/* Bar for stock data */}
            <Bar dataKey="stock" fill="#38a169" name="Stock (MT)" />
          </BarChart>
        </ResponsiveContainer>
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
                onClick={() => {
                  const certificate = generateCertificate(licenseData);
                  if (certificate) downloadCertificate(certificate);
                }}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Download className="mr-2" size={20} />
                Download Certificate
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
};

export default MillHome;