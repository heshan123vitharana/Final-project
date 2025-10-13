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
import { 
  fetchLicenseApplications, 
  updateLicenseStatus as apiUpdateLicenseStatus, 
  fetchDocument 
} from '../../api/licenseApi';

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

const createEmptyDocument = () => ({
  data: null,
  loading: false,
  error: null,
  applicationNumber: null,
  filename: null,
  mimeType: null,
  uploadedAt: null
})

const createDocumentState = () => ({
  payment_receipt: createEmptyDocument(),
  br_document: createEmptyDocument()
});

// Document Viewer Component
const DocumentViewer = ({ documentType, documentState, onRetry }) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  const rawDocumentData = documentState?.data
  const documentSrc = typeof rawDocumentData === 'string'
    ? rawDocumentData
    : rawDocumentData?.documentData || rawDocumentData?.data || ''

  const effectiveMimeType = documentState?.mimeType || (typeof documentSrc === 'string' && documentSrc.startsWith('data:')
    ? documentSrc.split(';')[0].replace('data:', '')
    : undefined)

  const formattedUploadedAt = useMemo(() => {
    if (!documentState?.uploadedAt) {
      return null
    }

    const parsed = new Date(documentState.uploadedAt)
    if (Number.isNaN(parsed.getTime())) {
      return documentState.uploadedAt
    }

    return parsed.toLocaleString()
  }, [documentState?.uploadedAt])

  const resolvedSrc = useMemo(() => {
    if (!documentSrc) {
      return ''
    }

    if (typeof documentSrc === 'string' && documentSrc.startsWith('data:')) {
      return documentSrc
    }

    if (effectiveMimeType && typeof documentSrc === 'string') {
      return `data:${effectiveMimeType};base64,${documentSrc}`
    }

    return documentSrc
  }, [documentSrc, effectiveMimeType])

  const isPdf = showPdfViewer || (effectiveMimeType?.includes('pdf'))

  useEffect(() => {
    setShowPdfViewer(false)
  }, [resolvedSrc])

  const handleImageError = () => {
    if (!showPdfViewer && documentSrc) {
      setShowPdfViewer(true)
    }
  }

  const handleDownload = () => {
    if (!resolvedSrc) return

    const link = document.createElement('a')
    const extension = isPdf ? 'pdf' : (documentState?.mimeType?.split('/')?.[1] || 'jpg')
    const filename = documentState?.filename || `${documentType}_${Date.now()}`
    const normalizedFilename = filename.toLowerCase().endsWith(`.${extension.toLowerCase()}`)
      ? filename
      : `${filename}.${extension}`
    link.href = resolvedSrc
    link.download = normalizedFilename
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

  if (!resolvedSrc) {
    return (
      <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500">
        No document uploaded.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600 font-medium">
            {documentType === 'payment_receipt' ? 'Payment Receipt' : 'Business Registration Document'}
          </span>
          {documentState?.applicationNumber && (
            <span className="text-xs text-gray-500 mt-1">
              Application: {documentState.applicationNumber}
            </span>
          )}
          {documentState?.filename && (
            <span className="text-xs text-gray-500">File: {documentState.filename}</span>
          )}
          {formattedUploadedAt && (
            <span className="text-xs text-gray-500">Uploaded: {formattedUploadedAt}</span>
          )}
          {documentState?.mimeType && (
            <span className="text-xs text-gray-500">Type: {documentState.mimeType}</span>
          )}
        </div>
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
            src={resolvedSrc}
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
            src={resolvedSrc}
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
  const [viewedRequests, setViewedRequests] = useState({})

  const getProcessingKey = useCallback((action, id) => `${action}${id ? `-${id}` : ''}`, [])
  const startProcessing = useCallback((action, id) => {
    setProcessingAction(getProcessingKey(action, id))
  }, [getProcessingKey])
  const stopProcessing = useCallback(() => {
    setProcessingAction(null)
  }, [])
  const isProcessing = useCallback((action, id) => processingAction === getProcessingKey(action, id), [processingAction, getProcessingKey])

  const resetDocuments = useCallback(() => setDocuments(() => createDocumentState()), [])

  const buildPermitData = useCallback((request) => ({
    permitNo: request.certificateNumber,
    holderName: request.ownerName,
    holderAddress: request.location,
    nic: 'N/A',
    locationAddress: request.location,
    storageCapacity: request.capacity,
    fee: '1000.00',
    validityStart: request.approvedDate,
    validityEnd: new Date(new Date(request.approvedDate).setFullYear(new Date(request.approvedDate).getFullYear() + 1)).toISOString(),
    applicationDate: request.submitDate,
    receiptNo: 'N/A',
    receiptDate: request.submitDate,
    issuedDate: new Date().toISOString(),
  }), [])

  const selectedDocumentsReady = useMemo(() => {
    if (!selectedRequest) {
      return false
    }

    const receipt = documents.payment_receipt
    const brDoc = documents.br_document

    const receiptReady = Boolean(receipt?.data) && !receipt?.loading && !receipt?.error
    const brReady = Boolean(brDoc?.data) && !brDoc?.loading && !brDoc?.error

    return receiptReady && brReady
  }, [selectedRequest, documents])

  const updateLicenseStatus = useCallback(async (applicationId, status, details) => {
    startProcessing(status, applicationId);
    try {
      const updatedApplication = await apiUpdateLicenseStatus(applicationId, status, details);
      return mapApplicationToRequest(updatedApplication);
    } finally {
      stopProcessing();
    }
  }, [startProcessing, stopProcessing]);

  const fetchLicenseRequests = useCallback(async (signal) => {
    setIsLoading(true)
    setError(null)

    try {
      const applications = await fetchLicenseApplications(signal)
      const safeApplications = Array.isArray(applications) ? applications : []
      const mapped = safeApplications.map(mapApplicationToRequest)
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
      const docResponse = await fetchDocument(request.applicationId, documentType);
      let docData = docResponse?.documentData || docResponse?.data || docResponse;

      if (docData && typeof docData === 'object' && docData.type === 'Buffer' && Array.isArray(docData.data)) {
        try {
          const uint8Array = new Uint8Array(docData.data)
          let binary = ''
          const chunkSize = 0x8000

          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, i + chunkSize)
            binary += String.fromCharCode.apply(null, chunk)
          }

          docData = btoa(binary)
        } catch (bufferError) {
          console.error('Failed to convert buffer to base64:', bufferError)
          throw new Error('Unable to read document data')
        }
      }
      let inferredMimeType

      if (typeof docData === 'string') {
        if (docData.startsWith('data:')) {
          inferredMimeType = docData.split(';')[0].replace('data:', '')
        } else if (docData.startsWith('JVBERi0')) {
          inferredMimeType = 'application/pdf'
        } else if (docData.startsWith('/9j/')) {
          inferredMimeType = 'image/jpeg'
        } else if (docData.startsWith('iVBOR')) {
          inferredMimeType = 'image/png'
        }
      }

      const metadata = {
        applicationNumber: docResponse?.applicationNumber || request.applicationNumber,
        filename: docResponse?.filename || `${documentType}-${request.applicationNumber || request.applicationId}`,
        mimeType: docResponse?.mimeType || inferredMimeType,
        uploadedAt: docResponse?.uploadedAt || docResponse?.uploaded_at || docResponse?.createdAt || docResponse?.created_at || null
      };

      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          data: docData,
          loading: false,
          error: null,
          ...metadata
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

  useEffect(() => {
    if (!selectedRequest || !selectedDocumentsReady) {
      return
    }

    setViewedRequests(prev => {
      if (prev[selectedRequest.applicationId]) {
        return prev
      }

      return {
        ...prev,
        [selectedRequest.applicationId]: true
      }
    })
  }, [selectedRequest, selectedDocumentsReady])

  const handleDownloadCertificate = useCallback(async (request) => {
    startProcessing('download', request.id)
    try {
      const permitData = buildPermitData(request)
      const pdfBytes = await generatePermitCertificate(permitData)

      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Permit_Certificate_${request.id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('PDF generation failed.')
      }
    } catch (err) {
      console.error('Error generating or downloading certificate:', err)
      alert('Could not download the certificate. Please try again.')
    } finally {
      stopProcessing()
    }
  }, [buildPermitData, startProcessing, stopProcessing])

  const handleViewCertificate = useCallback(async (request) => {
    startProcessing('view', request.id)
    try {
      const permitData = buildPermitData(request)
      const pdfBytes = await generatePermitCertificate(permitData)

      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => window.URL.revokeObjectURL(url), 1000)
      } else {
        throw new Error('PDF generation failed.')
      }
    } catch (err) {
      console.error('Error generating or viewing certificate:', err)
      alert('Could not open the certificate. Please try again.')
    } finally {
      stopProcessing()
    }
  }, [buildPermitData, startProcessing, stopProcessing])

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

  const clearViewedFlag = useCallback((applicationId) => {
    setViewedRequests(prev => {
      if (!prev[applicationId]) {
        return prev
      }

      const next = { ...prev }
      delete next[applicationId]
      return next
    })
  }, [])

  const handleApprove = async (request, source = 'table') => {
    if (!request) return

    const hasReviewedDocuments = viewedRequests[request.applicationId] ||
      (selectedRequest?.applicationId === request.applicationId && selectedDocumentsReady)

    if (!hasReviewedDocuments) {
      setSelectedRequest(request)
      setShowModal(true)
      alert('Review the submitted documents before approving this license.')
      return
    }

    const certificateNumber = `PMB/ML/${new Date().getFullYear()}/${request.applicationId}`

    try {
      await updateLicenseStatus(request.applicationId, 'approved', {
        certificateNumber,
        approvalComments: 'License approved by admin.',
      })

      setLicenseRequests(prev => prev.filter(req =>
        req.applicationId !== request.applicationId
      ))

      clearViewedFlag(request.applicationId)

      if (source === 'modal') {
        setShowModal(false)
        resetDocuments()
        setSelectedRequest(null)
      }

      alert(`License approved! Certificate ${certificateNumber} generated and email sent to ${request.email}`)
    } catch (error) {
      console.error('Failed to approve license:', error)
      alert(`Failed to approve license: ${error.message}`)
    }
  }

  const handleReject = (request) => {
    setSelectedRequest(request)
    setModalOpen(true)
  }

  const confirmReject = async () => {
    if (rejectionReason.trim() && selectedRequest) {
      try {
        await updateLicenseStatus(selectedRequest.applicationId, 'rejected', {
          rejectionReason,
        });

        setLicenseRequests(prev => prev.filter(req =>
          req.applicationId !== selectedRequest.applicationId
        ));

        clearViewedFlag(selectedRequest.applicationId)
        
        setModalOpen(false);
        setRejectionReason('');
        setSelectedRequest(null);
        resetDocuments()
        
        alert('License rejected and notification email sent to mill owner.');
      } catch (error) {
        console.error('Failed to reject license:', error);
        alert(`Failed to reject license: ${error.message}`);
      }
    }
  };

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
      <div className="bg-white rounded-lg shadow-sm">
        <div>
          <table className="w-full table-fixed" style={{tableLayout:'fixed'}}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] truncate">Request ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[220px] truncate">Mill Information</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] truncate">Submit Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[110px] truncate">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px] truncate">Certificate No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px] truncate">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate" style={{wordBreak:'break-all'}}>{request.id}</td>
                  <td className="px-4 py-3">
                    <div className="truncate" style={{maxWidth:'200px'}}>
                      <div className="text-sm font-medium text-gray-900 truncate">{request.millName}</div>
                      <div className="text-sm text-gray-500 truncate">{request.ownerName}</div>
                      <div className="text-xs text-gray-500 truncate" style={{maxWidth:'180px'}}>{request.location}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate">{new Date(request.submitDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate">
                    {request.certificateNumber ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-green-700 font-semibold bg-green-50 px-2 py-1 rounded border border-green-200 truncate">{request.certificateNumber}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      title={request.status === 'approved' && request.certificateNumber ? 'View details and certificate' : 'View details'}
                    >
                      <Eye size={16} className="mr-1" />
                      <span className="whitespace-nowrap">
                        {request.status === 'approved' && request.certificateNumber ? 'View & Certificate' : 'View'}
                      </span>
                    </button>
                    {request.status === 'approved' && request.certificateNumber && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadCertificate(request)
                        }}
                        disabled={isProcessing('download', request.id)}
                        className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50 disabled:cursor-wait"
                        title="Download certificate PDF"
                      >
                        {isProcessing('download', request.id) ? (
                          <>
                            <Clock size={16} className="mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download size={16} className="mr-1" />
                            Download
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
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold">License Request Details</h3>
                {selectedRequest.status === 'approved' && selectedRequest.certificateNumber && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check size={12} className="mr-1" />
                    Certificate Available
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedRequest(null)
                }}
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
                <div className="flex flex-col min-w-0">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-xs text-gray-900 whitespace-pre-line break-words" style={{minWidth:'180px',maxWidth:'100%',wordBreak:'break-word'}}>{selectedRequest.location}</p>
                </div>
                <div className="flex flex-col min-w-[120px] justify-center">
                  <span className="block text-sm font-medium text-gray-700">Type: <span className="font-normal text-gray-800">{selectedRequest.type}</span></span>
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
                <DocumentViewer
                  documentType="payment_receipt"
                  documentState={documents.payment_receipt}
                  onRetry={() => loadDocument(selectedRequest, 'payment_receipt')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Registration</label>
                <DocumentViewer
                  documentType="br_document"
                  documentState={documents.br_document}
                  onRetry={() => loadDocument(selectedRequest, 'br_document')}
                />
              </div>
              
              {selectedRequest.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <p className="text-sm text-red-600">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {selectedRequest.status === 'approved' && selectedRequest.certificateNumber && (
                <div className="border-t border-green-200 pt-4 mt-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Check className="text-white" size={24} />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-green-800">License Certificate</p>
                          <p className="text-xs text-green-600">Official PMB License Document</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewCertificate(selectedRequest)}
                        disabled={isProcessing('view', selectedRequest.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait shadow-sm"
                      >
                        {isProcessing('view', selectedRequest.id) ? (
                          <>
                            <Clock size={16} className="mr-2 animate-spin" />
                            Opening...
                          </>
                        ) : (
                          <>
                            <Eye size={16} className="mr-2" />
                            View Certificate
                          </>
                        )}
                      </button>
                    </div>
                    <div className="border-t border-green-200 pt-3 mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">Certificate Number:</span>
                        <span className="text-sm font-mono font-semibold text-green-700 bg-white px-3 py-1 rounded border border-green-200">{selectedRequest.certificateNumber}</span>
                      </div>
                      {selectedRequest.approvedDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Approved Date:</span>
                          <span className="text-sm text-green-700">{new Date(selectedRequest.approvedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}
                      {selectedRequest.approvalComments && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs font-medium text-gray-600 mb-1">Admin Comments:</p>
                          <p className="text-sm text-gray-700 italic">{selectedRequest.approvalComments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {selectedRequest.status === 'pending' && (
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleApprove(selectedRequest, 'modal')}
                  className={`flex-1 bg-green-600 text-white px-4 py-2 rounded-lg transition-colors ${!selectedDocumentsReady ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                  disabled={isProcessing('approved', selectedRequest.applicationId) || !selectedDocumentsReady}
                  title={selectedDocumentsReady ? 'Approve license' : 'Review documents before approving'}
                >
                  {isProcessing('approved', selectedRequest.applicationId) ? 'Approving...' : 'Approve License'}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    handleReject(selectedRequest)
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  disabled={isProcessing('rejected', selectedRequest.applicationId)}
                >
                  {isProcessing('rejected', selectedRequest.applicationId) ? 'Rejecting...' : 'Reject License'}
                </button>
              </div>
            )}
            {selectedRequest.status === 'pending' && !selectedDocumentsReady && (
              <p className="text-xs text-red-600 mt-2">
                Review both the payment receipt and business registration documents before approving this license.
              </p>
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
                disabled={!rejectionReason.trim() || isProcessing('rejected', selectedRequest?.applicationId)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing('rejected', selectedRequest?.applicationId) ? 'Confirming...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LicenseRequestManagement
