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

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-01-31'
  })
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMillType, setSelectedMillType] = useState('all')
  const [reportType, setReportType] = useState('stock')

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

  const handleDownloadReport = (format) => {
    const filename = `${reportType}_report_${dateRange.from}_to_${dateRange.to}.${format}`
    
    if (format === 'pdf') {
      // Simulate PDF download
      alert(`Downloading PDF report: ${filename}`)
    } else if (format === 'csv') {
      // Simulate CSV download
      const csvContent = generateCSVContent()
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(url)
    }
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
                className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
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
