import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Check,
  X,
  Eye,
  Download,
  Search,
  Filter,
  Clock,
  AlertCircle,
  RefreshCcw
} from 'lucide-react'
import { generatePermitCertificate } from '../../utils/certificateGenerator';
const API_BASE_URL = 'http://localhost:5000/api/licenses';

const mapApplicationToRequest = (application) => {
  const ownerName = [application.first_name, application.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  const locationParts = [application.address, application.city, application.district]
    .filter(Boolean)
    .map((part) => part.trim())
    .filter(Boolean);

  const applicationNumber = application.application_number || `ML-${application.id}`;

  return {
    id: applicationNumber,
    applicationId: application.id,
    applicationNumber,
    licenseType: application.license_type,
    status: (application.status || 'pending').toLowerCase(),
    submitDate: application.created_at,
    approvedDate: application.approved_date,
    rejectedDate: application.rejected_date,
    rejectionReason: application.rejection_reason,
    certificateNumber: application.license_number,
    approvalComments: application.approval_comments,
    millName: application.business_name || 'N/A',
    ownerName: ownerName || 'N/A',
    email: application.email || 'N/A',
    phone: application.phone || 'N/A',
    location: locationParts.length ? locationParts.join(', ') : 'N/A',
    capacity: application.mill_capacity || 'N/A',
    type: application.business_type || 'N/A',
    raw: application
  };
};

const createDocumentState = () => ({
  payment_receipt: { data: null, loading: false, error: null },
  br_document: { data: null, loading: false, error: null }
});

// Document Viewer Component
const DocumentViewer = ({ documentType, documentState, onRetry }) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  const documentSrc = documentState?.data || ''
  const isPdf = showPdfViewer || documentSrc.includes('application/pdf')

  useEffect(() => {
    setShowPdfViewer(false)
  }, [documentSrc])

  const handleImageError = () => {
    if (!showPdfViewer && documentSrc) {
      setShowPdfViewer(true)
    }
  }

  const handleDownload = () => {
    if (!documentSrc) return

    const link = document.createElement('a')
    const extension = isPdf ? 'pdf' : 'jpg'
    link.href = documentSrc
    link.download = `${documentType}_${Date.now()}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (documentState?.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
        <Clock className="animate-spin text-green-600 mb-2" size={20} />
        <p className="text-sm text-gray-600">Loading document...</p>
      </div>
    )
  }

  if (documentState?.error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-center text-sm text-red-600 space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <AlertCircle size={18} />
          <span>{documentState.error}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-100"
          >
            <RefreshCcw size={14} className="mr-1" />
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (!documentSrc) {
    return (
      <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500">
        No document uploaded.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {documentType === 'payment_receipt' ? 'Payment Receipt' : 'BR Document'}
        </span>
        <button
          onClick={handleDownload}
          className="text-blue-600 hover:text-blue-800 text-sm underline inline-flex items-center"
        >
          <Download size={14} className="mr-1" />
          Download
        </button>
      </div>

      {isPdf ? (
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={documentSrc.startsWith('data:application/pdf') ? documentSrc : documentSrc.replace('data:image/jpeg;base64,', 'data:application/pdf;base64,')}
            width="100%"
            height="480px"
            style={{ border: 'none' }}
            title={`${documentType} PDF Viewer`}
            onError={() => {
              console.log('PDF failed to load')
            }}
          />
          <p className="text-xs text-gray-500 px-4 py-2 bg-gray-50 border-t border-gray-200">
            If the document doesn't display properly, try downloading it.
          </p>
        </div>
      ) : (
        <div>
          <img
            src={documentSrc}
            alt={documentType === 'payment_receipt' ? 'Payment Receipt' : 'BR Document'}
            className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
            style={{ maxHeight: '480px' }}
            onError={handleImageError}
          />
          {!showPdfViewer && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click download if the image doesn't display properly
            </p>
          )}
        </div>
      )}
    </div>
  )
}

const LicenseRequestManagement = () => {
  const [licenseRequests, setLicenseRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processingAction, setProcessingAction] = useState(null) // For loading indicators
  const [documents, setDocuments] = useState(() => createDocumentState())

  const getProcessingKey = useCallback((action, id) => `${action}${id ? `-${id}` : ''}`, [])
  const startProcessing = useCallback((action, id) => {
    setProcessingAction(getProcessingKey(action, id))
  }, [getProcessingKey])
  const stopProcessing = useCallback(() => {
    setProcessingAction(null)
  }, [])
  const isProcessing = useCallback((action, id) => processingAction === getProcessingKey(action, id), [processingAction, getProcessingKey])

  const resetDocuments = useCallback(() => setDocuments(() => createDocumentState()), [])

  const fetchLicenseRequests = useCallback(async (signal) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/applications`,
        signal ? { signal } : undefined
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to load license applications')
      }

      const data = await response.json()
      const applications = Array.isArray(data.applications) ? data.applications : []
      const mapped = applications.map(mapApplicationToRequest)
      setLicenseRequests(mapped)
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching license requests:', err)
        setError(err.message || 'Failed to load license applications')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDocument = useCallback(async (request, documentType) => {
    if (!request?.applicationId) {
      return
    }

    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        loading: true,
        error: null
      }
    }))

    try {
      const response = await fetch(`${API_BASE_URL}/document/${request.applicationId}/${documentType}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to load document')
      }

      const result = await response.json()
      let docData = typeof result.documentData === 'string' ? result.documentData.trim() : null

      if (docData && !docData.startsWith('data:')) {
        const looksPdf = docData.startsWith('JVBER') || docData.includes('JVBER')
        const prefix = looksPdf ? 'data:application/pdf;base64,' : 'data:image/jpeg;base64,'
        docData = `${prefix}${docData}`
      }

      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          data: docData,
          loading: false,
          error: null
        }
      }))
    } catch (err) {
      console.error(`Error loading ${documentType}:`, err)
      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          loading: false,
          error: err.message || 'Failed to load document'
        }
      }))
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetchLicenseRequests(controller.signal)

    return () => {
      controller.abort()
    }
  }, [fetchLicenseRequests])

  useEffect(() => {
    if (showModal && selectedRequest) {
      resetDocuments()
      loadDocument(selectedRequest, 'payment_receipt')
      loadDocument(selectedRequest, 'br_document')
    }
  }, [showModal, selectedRequest, resetDocuments, loadDocument])

  useEffect(() => {
    if (!showModal) {
      resetDocuments()
    }
  }, [showModal, resetDocuments])

  const handleDownloadCertificate = async (request) => {
    setProcessingAction(request.id);
    try {
      // Prepare data for the new certificate generator
      const permitData = {
        permitNo: request.certificateNumber,
        holderName: request.ownerName,
        holderAddress: request.location,
        nic: 'N/A', // This data is not in the mock object
        locationAddress: request.location,
        storageCapacity: request.capacity,
        fee: '1000.00', // Example fee
        validityStart: request.approvedDate,
        validityEnd: new Date(new Date(request.approvedDate).setFullYear(new Date(request.approvedDate).getFullYear() + 1)).toISOString(),
        applicationDate: request.submitDate,
        receiptNo: 'N/A', // This data is not in the mock object
        receiptDate: request.submitDate,
        issuedDate: new Date().toISOString(),
      };

      // Generate the PDF using the new utility function
      const pdfBytes = await generatePermitCertificate(permitData);

      if (pdfBytes) {
        // Create a blob and trigger the download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Permit_Certificate_${request.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('PDF generation failed.');
      }
    } catch (err) {
      console.error("Error generating or downloading certificate:", err);
      alert('Could not download the certificate. Please try again.');
    } finally {
      setProcessingAction(null);
    }
  };

  const filteredRequests = useMemo(() => {
    return licenseRequests.filter(request => {
      const term = searchTerm.trim().toLowerCase()
      const matchesSearch = !term ||
        request.millName.toLowerCase().includes(term) ||
        request.ownerName.toLowerCase().includes(term) ||
        (request.id || '').toLowerCase().includes(term)
      const matchesStatus = filter === 'All' || request.status === filter
      return matchesSearch && matchesStatus
    })
  }, [licenseRequests, searchTerm, filter])

  const handleApprove = (requestId) => {
    const request = licenseRequests.find(req => req.id === requestId)
    if (!request) return

    const certificateNumber = `PMB/ML/${new Date().getFullYear()}/${request.id}`;
    
    // Update request status
    setLicenseRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved', 
            approvedDate: new Date().toISOString().split('T')[0],
            certificateNumber: certificateNumber
          }
        : req
    ))
    
    // Simulate email sending
    setTimeout(() => {
      alert(`License approved! Certificate ${certificateNumber} generated and email sent to ${request.email}`)
    }, 1000)
  }

  const handleReject = (request) => {
    setSelectedRequest(request)
    setModalOpen(true)
  }

  const confirmReject = () => {
    if (rejectionReason.trim()) {
      setLicenseRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: 'rejected', rejectionReason, rejectedDate: new Date().toISOString().split('T')[0] }
          : req
      ))
      
      setModalOpen(false)
      setRejectionReason('')
      setSelectedRequest(null)
      
      // Simulate email notification
      alert('License rejected and notification email sent to mill owner.')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'approved': return <Check size={16} />
      case 'rejected': return <X size={16} />
      default: return <AlertCircle size={16} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
        <Clock className="animate-spin text-green-600 mb-4" size={32} />
        <p className="text-gray-600">Loading license requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertCircle className="text-red-500" size={40} />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Unable to load license requests</h3>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
          <button
            onClick={() => fetchLicenseRequests()}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <RefreshCcw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
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
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button
              onClick={() => fetchLicenseRequests()}
              className="flex items-center px-3 py-2 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50"
            >
              <RefreshCcw size={16} className={`mr-2 ${processingAction === 'refresh' ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
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
                          className="text-green-600 hover:text-green-900 inline-flex items-center"
                        >
                          <Check size={16} className="mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && request.certificateNumber && (
                      <button
                        onClick={() => handleDownloadCertificate(request)}
                        disabled={processingAction === request.id}
                        className="text-purple-600 hover:text-purple-900 inline-flex items-center disabled:opacity-50 disabled:cursor-wait"
                      >
                        {processingAction === request.id ? (
                          <>
                            <Clock size={16} className="mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download size={16} className="mr-1" />
                            Download Certificate
                          </>
                        )}
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
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="capitalize">{selectedRequest.status}</span>
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
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Reject License Request</h3>
              <button
                onClick={() => setModalOpen(false)}
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
                onClick={() => setModalOpen(false)}
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
    </div>
  )
}

export default LicenseRequestManagement
