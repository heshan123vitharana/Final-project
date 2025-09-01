import { useState } from 'react'
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  BarChart3,
  TrendingUp,
  Users,
  Package
} from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-01-31'
  })
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMillType, setSelectedMillType] = useState('all')
  const [reportType, setReportType] = useState('stock')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const regions = [
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

  const reportTypes = [
    { id: 'stock', name: 'Stock Levels Report', icon: Package },
    { id: 'production', name: 'Production Report', icon: BarChart3 },
    { id: 'financial', name: 'Financial Report', icon: TrendingUp },
    { id: 'mills', name: 'Mill Performance Report', icon: Users },
    { id: 'licenses', name: 'License Status Report', icon: FileText }
  ]

  // Mock report data
  const reportData = {
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
  }

  const generatePDFReport = () => {
    const doc = new jsPDF()
    const currentData = reportData[reportType]
    
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
    const reportName = reportTypes.find(r => r.id === reportType)?.name || reportType
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
      
      // Using autoTable method
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
  }

  const handlePreviewReport = async () => {
    try {
      setIsGeneratingPDF(true)
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const doc = generatePDFReport()
      
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
        
        // Show notification
        alert('PDF preview downloaded (popup may have been blocked by your browser)')
      }
      
      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000)
      
    } catch (error) {
      console.error('Error previewing PDF:', error)
      alert('Error generating PDF preview. Please check console for details.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDownloadReport = async (format) => {
    const filename = `PMB_${reportType}_report_${dateRange.from}_to_${dateRange.to}.${format}`
    
    if (format === 'pdf') {
      setIsGeneratingPDF(true)
      try {
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const doc = generatePDFReport()
        
        // Use the save method to trigger download
        doc.save(filename)
        
        // Show success notification
        showSuccessNotification('PDF downloaded successfully!')
        
      } catch (error) {
        console.error('Error generating PDF:', error)
        alert(`Error generating PDF report: ${error.message}. Please try again.`)
      } finally {
        setIsGeneratingPDF(false)
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
          URL.revokeObjectURL(url)
          
          showSuccessNotification('CSV downloaded successfully!')
        }
      } catch (error) {
        console.error('Error generating CSV:', error)
        alert('Error generating CSV report. Please try again.')
      }
    }
  }

  const showSuccessNotification = (message) => {
    // Create and show success notification
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          ${message}
        </div>
      </div>
    `
    document.body.appendChild(notification)
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  const generateCSVContent = () => {
    const data = reportData[reportType]
    let csv = 'Report Type,Date Range,Region,Mill Type\n'
    csv += `${reportType},${dateRange.from} to ${dateRange.to},${selectedRegion},${selectedMillType}\n\n`
    
    csv += 'Summary Metrics\n'
    Object.entries(data.summary).forEach(([key, value]) => {
      csv += `${key},${value}\n`
    })
    
    csv += '\nBreakdown\n'
    csv += 'Category,Value,Percentage\n'
    data.breakdown.forEach(item => {
      csv += `${item.category},${item.value},${item.percentage}\n`
    })
    
    return csv
  }

  const currentReportData = reportData[reportType]

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
              {regions.map(region => (
                <option key={region} value={region.toLowerCase().replace(/\s+/g, '-')}>
                  {region}
                </option>
              ))}
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
                disabled={isGeneratingPDF}
                className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
              >
                {isGeneratingPDF ? (
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
                disabled={isGeneratingPDF}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
              >
                {isGeneratingPDF ? (
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
          {reportTypes.map((type) => {
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
            {reportTypes.find(t => t.id === reportType)?.name} Preview
          </h3>
          <div className="text-sm text-gray-600">
            Period: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
          </div>
        </div>

        {/* Summary Cards */}
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

        {/* Breakdown Chart */}
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
                        style={{ width: `${item.percentage}%` }}
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
