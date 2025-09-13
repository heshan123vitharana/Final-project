import { useState, useEffect, useCallback } from 'react'
import { 
  Check, 
  X, 
  Eye, 
  Download, 
  Search, 
  Filter,
  Clock,
  AlertCircle,
  FileCheck,
  RefreshCw
} from 'lucide-react'

const LicenseRequestManagement = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [requestToReject, setRequestToReject] = useState(null)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [certificateData, setCertificateData] = useState(null)
  const [processingAction, setProcessingAction] = useState(null)

  // Fetch license applications from backend
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }

      const response = await fetch(`http://localhost:5000/api/licenses/admin/applications?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      
      // Transform backend data to match frontend expectations
      const transformedApplications = data.applications.map(app => ({
        id: app.id,
        applicationNumber: app.application_number,
        millName: app.business_name,
        ownerName: `${app.first_name} ${app.last_name}`,
        location: `${app.city || ''}, ${app.district || ''}`.replace(', ,', ',').trim().replace(/^,|,$/g, ''),
        submitDate: new Date(app.created_at).toLocaleDateString('en-CA'),
        status: app.status,
        paymentReceipt: 'receipt.pdf', // Backend stores as LONGTEXT
        email: app.email,
        phone: app.phone,
        capacity: app.mill_capacity || 'Not specified',
        type: app.business_type === 'private' ? 'Private' : 'Government',
        licenseType: app.license_type,
        comments: app.comments,
        licenseNumber: app.license_number,
        approvedDate: app.approved_date ? new Date(app.approved_date).toLocaleDateString('en-CA') : null,
        rejectedDate: app.rejected_date ? new Date(app.rejected_date).toLocaleDateString('en-CA') : null,
        rejectionReason: app.rejection_reason,
        approvalComments: app.approval_comments
      }))

      setRequests(transformedApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
      alert('Failed to fetch license applications. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchTerm])

  // Load applications on component mount and when filters change
  useEffect(() => {
    fetchApplications()
  }, [statusFilter, fetchApplications])

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchApplications()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, fetchApplications])

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.millName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const generateCertificate = (request) => {
    const commencementDate = new Date().toLocaleDateString('en-GB')
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') // 1 year from now
    const issueDate = new Date().toLocaleDateString('en-GB')
    
    return {
      licenseNumber: request.licenseNumber || `PMB/ML/${new Date().getFullYear()}/${request.applicationNumber}`,
      holderName: request.ownerName,
      holderAddress: request.location,
      businessName: request.millName,
      businessLocation: request.location,
      millCapacity: request.capacity,
      commencementDate,
      expiryDate,
      issueDate,
      issuingOfficer: 'Director General, Paddy Marketing Board'
    }
  }

  const handleApprove = async (requestId) => {
    try {
      setProcessingAction(requestId)
      const request = requests.find(req => req.id === requestId)
      if (!request) return

      const response = await fetch(`http://localhost:5000/api/licenses/admin/approve/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvedBy: 'admin', // You might want to get this from admin session
          comments: 'License approved by admin'
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to approve application')
      }

      const data = await response.json()
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'approved', 
              approvedDate: new Date().toLocaleDateString('en-CA'),
              licenseNumber: data.licenseNumber
            }
          : req
      ))

      // Generate certificate for display
      const certificate = generateCertificate({
        ...request,
        licenseNumber: data.licenseNumber
      })
      
      setCertificateData({ certificate, request })
      setShowCertificateModal(true)
      
      alert(`License approved successfully! License Number: ${data.licenseNumber}`)
      
    } catch (error) {
      console.error('Error approving application:', error)
      alert(`Failed to approve application: ${error.message}`)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleReject = (request) => {
    setRequestToReject(request)
    setShowRejectionModal(true)
  }

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      setProcessingAction(requestToReject.id)
      
      const response = await fetch(`http://localhost:5000/api/licenses/admin/reject/${requestToReject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectedBy: 'admin', // You might want to get this from admin session
          rejectionReason: rejectionReason.trim()
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to reject application')
      }

      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestToReject.id 
          ? { 
              ...req, 
              status: 'rejected', 
              rejectionReason, 
              rejectedDate: new Date().toLocaleDateString('en-CA')
            }
          : req
      ))
      
      setShowRejectionModal(false)
      setRejectionReason('')
      setRequestToReject(null)
      
      alert('License application rejected successfully.')
      
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert(`Failed to reject application: ${error.message}`)
    } finally {
      setProcessingAction(null)
    }
  }

  const downloadCertificate = (certificate, request) => {
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
Place: Colombo 02
Address: Sir Chittampalam A. Gardiner Mawatha
Housing Secretariat Building
6th Floor
By the Paddy Marketing Board

${certificate.issuingOfficer}
Issuing Officer
PMB

--------------------------------------------------
This is an official government document. Any unauthorized reproduction is strictly prohibited.
`
    
    const blob = new Blob([certificateContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `PMB_License_Certificate_${request.id}_${certificate.holderName.replace(/\s+/g, '_')}.txt`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
        <span className="ml-2 text-gray-600">Loading license applications...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Total Requests: {filteredRequests.length}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mill Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submit Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.millName}</div>
                      <div className="text-sm text-gray-500">{request.ownerName}</div>
                      <div className="text-sm text-gray-500">{request.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.submitDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.certificateNumber ? (
                      <span className="font-mono text-green-600">{request.certificateNumber}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processingAction === request.id}
                          className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                        >
                          <Check size={16} className="mr-1" />
                          {processingAction === request.id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          disabled={processingAction === request.id}
                          className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                        >
                          <X size={16} className="mr-1" />
                          {processingAction === request.id ? 'Processing...' : 'Reject'}
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && request.certificateNumber && (
                      <button
                        onClick={() => {
                          const certificate = generateCertificate(request)
                          setCertificateData({ certificate, request })
                          setShowCertificateModal(true)
                        }}
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                      >
                        <FileCheck size={16} className="mr-1" />
                        View Certificate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">License Request Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Request ID</label>
                  <p className="text-sm text-gray-900">{selectedRequest.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mill Name</label>
                  <p className="text-sm text-gray-900">{selectedRequest.millName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                  <p className="text-sm text-gray-900">{selectedRequest.ownerName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedRequest.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">{selectedRequest.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedRequest.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <p className="text-sm text-gray-900">{selectedRequest.capacity}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Receipt</label>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  <Download size={16} className="mr-1" />
                  {selectedRequest.paymentReceipt}
                </button>
              </div>
              
              {selectedRequest.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <p className="text-sm text-red-600">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>
            
            {selectedRequest.status === 'pending' && (
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    handleApprove(selectedRequest.id)
                    setShowModal(false)
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve License
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    handleReject(selectedRequest)
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject License
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Reject License Request</h3>
              <button
                onClick={() => setShowRejectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please provide a reason for rejecting this license request:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificateModal && certificateData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-green-600 flex items-center">
                <FileCheck className="mr-2" size={24} />
                License Certificate Generated
              </h3>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Certificate Display */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-8 mb-6">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">PMB</span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">GOVERNMENT OF SRI LANKA</h2>
                    <h3 className="text-xl font-semibold text-green-700">PADDY MARKETING BOARD</h3>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">LICENSE TO OPERATE RICE MILL</h1>
                <p className="text-lg font-medium text-gray-600 italic">
                  License issued under Section 10 of the Paddy Marketing Board Act No. 14 of 1971
                </p>
                <div className="mt-4 text-lg font-bold text-green-700">
                  License Number: {certificateData.certificate.licenseNumber}
                </div>
              </div>

              {/* Certificate Body */}
              <div className="space-y-4 text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold">1. Name of the License Holder:</span>
                      <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                        {certificateData.certificate.holderName}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold">2. Address of the License Holder:</span>
                      <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                        {certificateData.certificate.holderAddress}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold">3. Name of the Business and Business Location:</span>
                      <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                        {certificateData.certificate.businessName}, {certificateData.certificate.businessLocation}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold">4. Capacity of the Milling Machine/Mill:</span>
                      <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                        {certificateData.certificate.millCapacity}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold">5. Validity Period of the License:</span>
                      <div className="ml-4 mt-2 space-y-2">
                        <div>
                          <span className="font-medium">(a) Commencement Date:</span>
                          <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                            {certificateData.certificate.commencementDate}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">(b) Expiry Date:</span>
                          <div className="border-b-2 border-dotted border-gray-400 mt-1 pb-1">
                            {certificateData.certificate.expiryDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mt-8 p-4 bg-white bg-opacity-70 rounded-lg">
                  <p className="text-sm leading-relaxed text-justify">
                    This license is issued to the above-mentioned license holder by the Paddy Marketing Board to operate a business of milling, parboiling, or processing rice at the aforementioned business location, following the consideration of the application submitted by the license holder. This license is subject to the specific conditions stipulated herein.
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">CONDITIONS:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>This license is non-transferable and must be displayed prominently at the business premises.</li>
                      <li>The license holder must comply with all regulations under the Paddy Marketing Board Act.</li>
                      <li>Regular inspections may be conducted by authorized officers of the PMB.</li>
                      <li>Any changes to the business location or capacity must be reported immediately.</li>
                      <li>This license must be renewed annually before the expiry date.</li>
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="font-medium text-gray-700 mb-4">Issued by the Paddy Marketing Board.</p>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-left">
                      <div className="font-semibold">Date: {certificateData.certificate.issueDate}</div>
                      <div className="text-sm mt-2">
                        <div className="font-medium">Place: Colombo 02</div>
                        <div>Address: Sir Chittampalam A. Gardiner Mawatha</div>
                        <div>Housing Secretariat Building</div>
                        <div>6th Floor</div>
                        <div className="font-medium mt-1">By the Paddy Marketing Board</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-32 h-20 bg-red-600 bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                        <span className="text-red-600 font-bold text-lg">OFFICIAL SEAL</span>
                      </div>
                      <div className="border-t-2 border-gray-400 pt-2">
                        <div className="font-semibold text-sm">{certificateData.certificate.issuingOfficer}</div>
                        <div className="text-sm text-gray-600">Issuing Officer</div>
                        <div className="font-bold text-green-700">PMB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => downloadCertificate(certificateData.certificate, certificateData.request)}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Download className="mr-2" size={20} />
                Download Certificate
              </button>
              <button
                onClick={() => {
                  // Simulate sending email
                  alert(`Certificate sent to ${certificateData.request.email}`)
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Send via Email
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              This is an official government document. Any unauthorized reproduction is strictly prohibited.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LicenseRequestManagement
