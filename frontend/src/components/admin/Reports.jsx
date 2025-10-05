import { useState, useEffect, useCallback } from 'react'
import {
  Download,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const REGIONS = [
  'All Regions',
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province'
]

const REPORT_TYPES = [
  { id: 'licenses', name: 'License Status Report', icon: FileText },
  { id: 'stock', name: 'Stock Levels Report', icon: Package },
  { id: 'production', name: 'Production Report', icon: BarChart3 },
  { id: 'financial', name: 'Financial Report', icon: TrendingUp },
  { id: 'mills', name: 'Mill Performance Report', icon: Users }
]

const MOCK_REPORT_DATA = {
  stock: {
    summary: {
      totalStock: 20700,
      totalCapacity: 25000,
      utilizationRate: 83,
      activeMills: 8
    },
    breakdown: [
      { category: 'Private Mills', value: 12500, percentage: 60 },
      { category: 'Government Mills', value: 8200, percentage: 40 }
    ]
  },
  production: {
    summary: {
      monthlyProduction: 5240,
      dailyAverage: 169,
      targetAchievement: 87,
      qualityGrade: 'A+'
    },
    breakdown: [
      { category: 'Premium Grade', value: 2100, percentage: 40 },
      { category: 'Standard Grade', value: 2040, percentage: 39 },
      { category: 'Commercial Grade', value: 1100, percentage: 21 }
    ]
  },
  financial: {
    summary: {
      totalRevenue: 2450000,
      totalCosts: 1890000,
      profit: 560000,
      profitMargin: 23
    },
    breakdown: [
      { category: 'Processing Revenue', value: 1470000, percentage: 60 },
      { category: 'Storage Revenue', value: 735000, percentage: 30 },
      { category: 'Other Revenue', value: 245000, percentage: 10 }
    ]
  },
  mills: {
    summary: {
      totalMills: 8,
      activeMills: 7,
      averageUtilization: 83,
      topPerformer: 'Green Valley Rice Mill'
    },
    breakdown: [
      { category: 'High Performance (>85%)', value: 3, percentage: 38 },
      { category: 'Good Performance (70-85%)', value: 4, percentage: 50 },
      { category: 'Low Performance (<70%)', value: 1, percentage: 12 }
    ]
  },
  licenses: {
    summary: {
      totalApplications: 15,
      approved: 8,
      pending: 5,
      rejected: 2
    },
    breakdown: [
      { category: 'Approved', value: 8, percentage: 53 },
      { category: 'Pending', value: 5, percentage: 33 },
      { category: 'Rejected', value: 2, percentage: 14 }
    ]
  }
};

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-01-31'
  })
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMillType, setSelectedMillType] = useState('all')
  const [reportType, setReportType] = useState('licenses')
  const [isPreviewingPDF, setIsPreviewingPDF] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch real license data
  const fetchLicenseStatistics = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (dateRange.from) params.append('from', dateRange.from)
      if (dateRange.to) params.append('to', dateRange.to)
      if (selectedRegion !== 'all') params.append('region', selectedRegion)

      const response = await fetch(`http://localhost:5000/api/licenses/admin/statistics?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }

      const data = await response.json()
      console.log('License statistics:', data)

      const { overall } = data.data || {}

      if (!overall) {
        throw new Error('Statistics payload missing overall summary')
      }

      const processedData = {
        licenses: {
          summary: {
            totalApplications: overall.totalApplications || 0,
            approved: overall.approved || 0,
            pending: overall.pending || 0,
            rejected: overall.rejected || 0,
            approvalRate: overall.totalApplications > 0 ? Math.round((overall.approved / overall.totalApplications) * 100) : 0
          },
          breakdown: [
            { category: 'Approved', value: overall.approved || 0, percentage: overall.totalApplications > 0 ? Math.round((overall.approved / overall.totalApplications) * 100) : 0 },
            { category: 'Pending', value: overall.pending || 0, percentage: overall.totalApplications > 0 ? Math.round((overall.pending / overall.totalApplications) * 100) : 0 },
            { category: 'Rejected', value: overall.rejected || 0, percentage: overall.totalApplications > 0 ? Math.round((overall.rejected / overall.totalApplications) * 100) : 0 }
          ]
        }
      }

      setReportData(processedData)

    } catch (error) {
      console.error('Error fetching license statistics:', error)
      toast.error('Failed to fetch license statistics. Using fallback data.')
      // Fallback to empty data
      setReportData({
        licenses: {
          summary: {
            totalApplications: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            approvalRate: 0
          },
          breakdown: [
            { category: 'Approved', value: 0, percentage: 0 },
            { category: 'Pending', value: 0, percentage: 0 },
            { category: 'Rejected', value: 0, percentage: 0 }
          ]
        }
      })
    } finally {
      setLoading(false)
    }
  }, [dateRange, selectedRegion])

  // Load data when component mounts or filters change
  useEffect(() => {
    if (reportType === 'licenses') {
      fetchLicenseStatistics()
    } else {
      // For other report types, use mock data for now
      setReportData(MOCK_REPORT_DATA)
    }
  }, [reportType, fetchLicenseStatistics])

  const generatePDFReport = async () => {
    try {
      // Dynamic import to ensure autoTable plugin is loaded
      const { jsPDF } = await import('jspdf')
      const autoTable = await import('jspdf-autotable')

      const doc = new jsPDF()

      // Ensure autoTable is available - try multiple ways to access it
      if (typeof doc.autoTable !== 'function') {
        // Try to manually assign autoTable if it's not automatically attached
        if (autoTable.default && typeof autoTable.default === 'function') {
          doc.autoTable = autoTable.default.bind(doc)
        } else if (autoTable.autoTable && typeof autoTable.autoTable === 'function') {
          doc.autoTable = autoTable.autoTable.bind(doc)
        } else {
          console.warn('autoTable plugin not available, falling back to basic table rendering')
        }
      }

    const currentData = reportData[reportType]

    if (!currentData) {
      throw new Error('No report data available for the selected report type')
    }

    // Header with PMB branding
    doc.setFillColor(34, 197, 94) // Green color
    doc.rect(0, 0, 210, 25, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('PMB ADMIN DASHBOARD', 14, 18)
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text('Paddy Marketing Board - Sri Lanka', 14, 35)
    
    // Report details
    doc.setFontSize(12)
  const reportName = REPORT_TYPES.find(r => r.id === reportType)?.name || reportType
    doc.text(`Report: ${reportName}`, 14, 50)
    doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 14, 60)
    doc.text(`Region: ${selectedRegion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`, 14, 70)
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 80)
    
    // Add a line separator
    doc.setLineWidth(0.5)
    doc.line(14, 85, 196, 85)
    
    let yPosition = 95
    
    // Summary Section with better styling
    doc.setFontSize(16)
    doc.setTextColor(34, 197, 94)
    doc.text('EXECUTIVE SUMMARY', 14, yPosition)
    doc.setTextColor(0, 0, 0)
    yPosition += 10
    
    if (currentData && currentData.summary) {
      doc.setFontSize(11)
      Object.entries(currentData.summary).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        const formattedValue = typeof value === 'number' && value > 1000 
          ? value.toLocaleString() 
          : value
        
        doc.setFont(undefined, 'bold')
        doc.text(`${formattedKey}:`, 14, yPosition)
        doc.setFont(undefined, 'normal')
        doc.text(String(formattedValue), 80, yPosition)
        yPosition += 8
      })
    }
    
    yPosition += 10
    
    // Detailed breakdown with enhanced table using autoTable
    if (currentData && currentData.breakdown && currentData.breakdown.length > 0) {
      doc.setFontSize(16)
      doc.setTextColor(34, 197, 94)
      doc.text('DETAILED ANALYSIS', 14, yPosition)
      doc.setTextColor(0, 0, 0)
      yPosition += 5
      
      const tableData = currentData.breakdown.map(item => [
        item.category || item.name || item.mill || item.district || 'N/A',
        typeof item.value === 'number' ? item.value.toLocaleString() : (item.value || 'N/A'),
        item.percentage ? `${item.percentage}%` : (item.utilization ? `${item.utilization}%` : 'N/A')
      ])
      
      try {
        // Using autoTable method
        if (typeof doc.autoTable === 'function') {
          doc.autoTable({
            startY: yPosition + 5,
            head: [['Category', 'Value', 'Percentage/Rate']],
            body: tableData,
            theme: 'striped',
            headStyles: {
              fillColor: [34, 197, 94],
              textColor: [255, 255, 255],
              fontSize: 12,
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 10
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            },
            margin: { left: 14, right: 14 },
            columnStyles: {
              0: { cellWidth: 60 },
              1: { cellWidth: 60, halign: 'right' },
              2: { cellWidth: 40, halign: 'center' }
            }
          })
        } else {
          throw new Error('autoTable not available')
        }
      } catch (autoTableError) {
        console.error('AutoTable error:', autoTableError)
        // Fallback to basic table if autoTable fails
        doc.setFontSize(10)
        let tableY = yPosition + 15
        
        // Header
        doc.setFont(undefined, 'bold')
        doc.text('Category', 14, tableY)
        doc.text('Value', 80, tableY)
        doc.text('Percentage/Rate', 140, tableY)
        tableY += 10
        
        // Data rows
        doc.setFont(undefined, 'normal')
        tableData.forEach(row => {
          doc.text(row[0] || '', 14, tableY)
          doc.text(row[1] || '', 80, tableY)
          doc.text(row[2] || '', 140, tableY)
          tableY += 8
        })
      }
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      
      // Footer background
      doc.setFillColor(248, 250, 252)
      doc.rect(0, doc.internal.pageSize.height - 20, 210, 20, 'F')
      
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('Paddy Marketing Board (PMB) - Official Report', 14, doc.internal.pageSize.height - 10)
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10)
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 5)
    }

    return doc
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error(`PDF generation failed: ${error.message}`)
    }
  }

  const handlePreviewReport = async () => {
    if (!reportData || !reportData[reportType]) {
      toast.error('No report data available. Please refresh the data first.')
      return
    }

    try {
      setIsPreviewingPDF(true)

      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300))

      const doc = await generatePDFReport()

      if (!doc) {
        throw new Error('Failed to generate PDF document')
      }

      // Create blob and URL for preview
      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)

      // Try to open in new window
      const newWindow = window.open(pdfUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')

      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // If popup is blocked, create a download link instead
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = `PMB_${reportType}_report_preview.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.info('PDF preview downloaded (popup may have been blocked by your browser)')
      } else {
        toast.success('PDF preview opened in new window')
      }

      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000)

    } catch (error) {
      console.error('Error previewing PDF:', error)
      toast.error(`Error generating PDF preview: ${error.message}`)
    } finally {
      setIsPreviewingPDF(false)
    }
  }

  const handleDownloadReport = async (format) => {
    if (!reportData || !reportData[reportType]) {
      toast.error('No report data available. Please refresh the data first.')
      return
    }

    const filename = `PMB_${reportType}_report_${dateRange.from}_to_${dateRange.to}.${format}`

    if (format === 'pdf') {
      setIsDownloadingPDF(true)
      try {
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500))

        const doc = await generatePDFReport()

        if (!doc) {
          throw new Error('Failed to generate PDF document')
        }

        // Use the save method to trigger download
        doc.save(filename)

        // Show success notification
        toast.success('PDF downloaded successfully!')

      } catch (error) {
        console.error('Error generating PDF:', error)
        toast.error(`Error generating PDF report: ${error.message}`)
      } finally {
        setIsDownloadingPDF(false)
      }
    } else if (format === 'csv') {
      try {
        // CSV download functionality
        const csvContent = generateCSVContent()
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

        // Create download link
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', filename)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up URL after a short delay
          setTimeout(() => URL.revokeObjectURL(url), 1000)

          toast.success('CSV downloaded successfully!')
        } else {
          throw new Error('Download not supported in this browser')
        }
      } catch (error) {
        console.error('Error generating CSV:', error)
        toast.error(`Error generating CSV report: ${error.message}`)
      }
    }
  }

  const generateCSVContent = () => {
    const data = reportData[reportType]

    if (!data) {
      throw new Error('No data available for CSV export')
    }

    let csv = 'Report Type,Date Range,Region,Mill Type\n'
    csv += `"${reportType}","${dateRange.from} to ${dateRange.to}","${selectedRegion}","${selectedMillType}"\n\n`

    csv += 'Summary Metrics\n'
    csv += 'Metric,Value\n'
    if (data.summary) {
      Object.entries(data.summary).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        csv += `"${formattedKey}","${value}"\n`
      })
    }

    csv += '\nBreakdown Analysis\n'
    csv += 'Category,Value,Percentage\n'
    if (data.breakdown && Array.isArray(data.breakdown)) {
      data.breakdown.forEach(item => {
        const category = item.category || item.name || 'Unknown'
        const value = item.value || 0
        const percentage = item.percentage || 0
        csv += `"${category}","${value}","${percentage}%"\n`
      })
    }

    csv += `\nGenerated on,"${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}"\n`

    return csv
  }

  const currentReportData = reportData?.[reportType]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
        <span className="ml-2 text-gray-600">Loading report data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Generate Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline w-4 h-4 mr-1" />
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {REGIONS.map(region => {
                const value = region === 'All Regions'
                  ? 'all'
                  : region.toLowerCase().replace(/\s+/g, '-')

                return (
                  <option key={region} value={value}>
                    {region}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Mill Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mill Type
            </label>
            <select
              value={selectedMillType}
              onChange={(e) => setSelectedMillType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="private">Private Mills</option>
              <option value="government">Government Mills</option>
            </select>
          </div>

          {/* Download Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Download
            </label>
            <div className="space-y-2">
              <button
                onClick={() => handleDownloadReport('pdf')}
                disabled={isDownloadingPDF}
                className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
              >
                {isDownloadingPDF ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </>
                )}
              </button>
              <button
                onClick={() => handlePreviewReport()}
                disabled={isPreviewingPDF}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
              >
                {isPreviewingPDF ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Previewing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-1" />
                    Preview PDF
                  </>
                )}
              </button>
              <button
                onClick={() => handleDownloadReport('csv')}
                className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {REPORT_TYPES.map((type) => {
            const IconComponent = type.icon
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  reportType === type.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm font-medium block text-center">{type.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {REPORT_TYPES.find(t => t.id === reportType)?.name} Preview
          </h3>
          <div className="text-sm text-gray-600">
            Period: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              if (reportType === 'licenses') {
                fetchLicenseStatistics()
              }
            }}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        {currentReportData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(currentReportData.summary).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {typeof value === 'number' && key.toLowerCase().includes('rate') ? `${value}%` :
                   typeof value === 'number' && key.toLowerCase().includes('revenue') ? `$${value.toLocaleString()}` :
                   typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Breakdown Chart */}
        {currentReportData && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800">Breakdown Analysis</h4>
            <div className="space-y-3">
              {currentReportData.breakdown.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-32 text-sm text-gray-600">{item.category}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${Math.max(item.percentage, 5)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 w-12">{item.percentage}%</div>
                      <div className="text-sm font-medium text-gray-800 w-20 text-right">
                        {typeof item.value === 'number' && reportType === 'financial' ?
                          `$${item.value.toLocaleString()}` :
                          item.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Notes */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">Report Notes</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Data is updated in real-time from connected mill systems</li>
            <li>• All values are measured in metric tons (MT) unless otherwise specified</li>
            <li>• Percentages are calculated based on current reporting period</li>
            <li>• Historical comparison data available in detailed reports</li>
          </ul>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Monthly Stock Report - January 2025', date: '2025-01-31', type: 'Stock', size: '2.4 MB' },
            { name: 'Mill Performance Review - Q4 2024', date: '2025-01-15', type: 'Performance', size: '1.8 MB' },
            { name: 'Financial Summary - December 2024', date: '2025-01-01', type: 'Financial', size: '3.1 MB' },
            { name: 'License Applications Report - January 2025', date: '2025-01-30', type: 'License', size: '1.2 MB' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-800">{report.name}</h4>
                  <p className="text-xs text-gray-600">
                    {report.type} • {report.date} • {report.size}
                  </p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
