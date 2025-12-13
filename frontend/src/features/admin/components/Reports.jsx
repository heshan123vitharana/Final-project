import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  Download,
  FileText,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Eye
} from 'lucide-react'

const REGION_OPTIONS = [
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

const REPORTS_WITH_EMPTY_STATE = ['production', 'financial', 'mills', 'licenses']
const MANUAL_REPORT_TYPES = new Set(['production', 'financial', 'mills', 'licenses'])

const normalizeRegionLabel = (value) => {
  if (!value || value === 'all' || value === 'All' || value === 'all-regions') {
    return 'All Regions'
  }
  const normalized = value.toLowerCase()
  const match = REGION_OPTIONS.find(region => region.toLowerCase().replace(/\s+/g, '-') === normalized)
  if (match) {
    return match
  }
  return value.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

const STOCK_VARIANT_LABELS = {
  total: 'Stock Report - Total Stock',
  private: 'Stock Report - Private Mills',
  government: 'Stock Report - Government Mills',
  'by-district': 'Stock Report - District Breakdown',
  combined: 'Stock Report - Complete Overview'
}

const STOCK_REPORT_OPTIONS = [
  {
    id: 'total',
    label: 'Total Stock',
    description: 'All mills combined',
    icon: Package
  },
  {
    id: 'private',
    label: 'Private Mills',
    description: 'Private sector only',
    icon: Users
  },
  {
    id: 'government',
    label: 'Government Mills',
    description: 'Government sector only',
    icon: BarChart3
  },
  {
    id: 'by-district',
    label: 'By District',
    description: 'District breakdown',
    icon: Filter
  },
  {
    id: 'combined',
    label: 'Complete Overview',
    description: 'Includes all categories in a single report',
    icon: TrendingUp
  }
]

const resolveReportDisplayName = (type, variant, reportTypes) => {
  if (type === 'stock') {
    return STOCK_VARIANT_LABELS[variant] || 'Stock Levels Report'
  }
  return reportTypes.find(r => r.id === type)?.name || type
}

// Mock report data for fallback - moved outside component to prevent re-creation on re-renders
const mockReportData = {
  stock: {
    summary: {},
    breakdown: []
  },
  production: {
    summary: {},
    breakdown: []
  },
  financial: {
    summary: {},
    breakdown: []
  },
  mills: {
    summary: {},
    breakdown: []
  },
  licenses: {
    summary: {},
    breakdown: []
  }
}

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-01-31'
  })
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMillType, setSelectedMillType] = useState('all')
  const [reportType, setReportType] = useState('licenses')
  const [selectedStockVariant, setSelectedStockVariant] = useState('combined')
  const [, setIsGeneratingPDF] = useState(false)
  const [reportData, setReportData] = useState(mockReportData)
  const [loading, setLoading] = useState(false)
  const [generatedReports, setGeneratedReports] = useState([])
  const skipNextFetchRef = useRef(false)

  const regions = REGION_OPTIONS

  const selectedStockOption = useMemo(() => {
    return STOCK_REPORT_OPTIONS.find(option => option.id === selectedStockVariant) || null
  }, [selectedStockVariant])
  const SelectedStockIcon = selectedStockOption?.icon || BarChart3

  const reportTypes = useMemo(() => ([
    { id: 'stock', name: 'Stock Levels Report', icon: Package },
    { id: 'production', name: 'Production Report', icon: BarChart3 },
    { id: 'financial', name: 'Financial Report', icon: TrendingUp },
    { id: 'mills', name: 'Mill Performance Report', icon: Users },
    { id: 'licenses', name: 'License Status Report', icon: FileText },
    { id: 'regional_submission', name: 'Regional Submissions', icon: Eye }
  ]), [])

  const addGeneratedReport = useCallback((entry) => {
    setGeneratedReports(prev => [entry, ...prev])
  }, [])

  const showSuccessNotification = useCallback((message) => {
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
  }, [])

  const fetchReportData = useCallback(async (type, options = {}) => {
    const {
      dateRange: customDateRange,
      region: customRegion,
      millType: customMillType,
      addToGenerated = true,
      showToast = true
    } = options

    setLoading(true)

    try {
      const effectiveDateRange = customDateRange || dateRange
      const effectiveRegion = typeof customRegion !== 'undefined' ? customRegion : selectedRegion
      const effectiveMillType = typeof customMillType !== 'undefined' ? customMillType : selectedMillType
      const regionLabel = normalizeRegionLabel(effectiveRegion)

      const params = new URLSearchParams({
        reportType: type,
        from: effectiveDateRange?.from || '',
        to: effectiveDateRange?.to || '',
        region: regionLabel
      })

      const response = await fetch(`http://localhost:5000/api/admin/reports?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch report data: ${response.statusText}`)
      }

      const data = await response.json()

      setReportData(prevData => ({
        ...prevData,
        [type]: data
      }))

      const generatedAt = new Date().toISOString()
      const reportName = resolveReportDisplayName(type, null, reportTypes)

      if (addToGenerated) {
        addGeneratedReport({
          id: Date.now(),
          name: reportName,
          reportType: type,
          variant: null,
          data,
          filters: {
            dateRange: effectiveDateRange,
            region: effectiveRegion,
            regionLabel,
            millType: effectiveMillType
          },
          generatedAt
        })
      }

      if (showToast) {
        showSuccessNotification(`${reportName} generated successfully!`)
      }

      return data
    } catch (error) {
      console.error('Error generating report:', error)
      setReportData(prevData => ({
        ...prevData,
        [type]: mockReportData[type] || { summary: {}, breakdown: [] }
      }))
      return null
    } finally {
      setLoading(false)
    }
  }, [dateRange, selectedRegion, selectedMillType, addGeneratedReport, reportTypes, showSuccessNotification])

  const handleManualReportGenerate = useCallback(async () => {
    if (!reportType) {
      return
    }
    const data = await fetchReportData(reportType)
    if (data === null) {
      alert('Unable to generate this report right now. Please try again later.')
    }
  }, [fetchReportData, reportType])

  const handleGenerateStockReport = async (stockReportType) => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;
      const regionLabel = normalizeRegionLabel(selectedRegion);

      const params = new URLSearchParams({
        reportType: stockReportType
      });

      // Add district filter if selected
      if (regionLabel && regionLabel !== 'All Regions') {
        params.append('district', regionLabel);
      }

      const headers = adminApiKey ? { 'x-admin-key': adminApiKey } : {};
      const response = await fetch(`${apiBaseUrl}/api/admin/generate-stock-report?${params.toString()}`, { headers });

      if (!response.ok) {
        throw new Error(`Failed to generate stock report: ${response.statusText}`);
      }

      const result = await response.json();
      const generatedAt = result.generatedAt || new Date().toISOString();
      const baseEntry = {
        reportType: 'stock',
        variant: stockReportType,
        filters: {
          dateRange: null,
          region: selectedRegion,
          regionLabel,
          millType: selectedMillType
        },
        generatedAt
      };
      const toastLabel = resolveReportDisplayName('stock', stockReportType, reportTypes)

      // Format the data for display
      if (stockReportType === 'combined') {
        // For combined report, show all data sections
        const formattedData = {
          summary: {
            totalStock: result.data.total.summary.totalStock || 0,
            privateStock: result.data.private.summary.totalStock || 0,
            governmentStock: result.data.government.summary.totalStock || 0,
            totalDistricts: result.data.byDistrict.summary.totalDistricts || 0,
            totalMills: result.data.total.summary.totalMills || 0
          },
          breakdown: [
            {
              category: 'Total Stock',
              value: result.data.total.summary.totalStock || 0,
              percentage: 100
            },
            {
              category: 'Private Mills Stock',
              value: result.data.private.summary.totalStock || 0,
              percentage: result.data.total.summary.totalStock > 0
                ? ((result.data.private.summary.totalStock / result.data.total.summary.totalStock) * 100).toFixed(2)
                : 0
            },
            {
              category: 'Government Mills Stock',
              value: result.data.government.summary.totalStock || 0,
              percentage: result.data.total.summary.totalStock > 0
                ? ((result.data.government.summary.totalStock / result.data.total.summary.totalStock) * 100).toFixed(2)
                : 0
            },
            ...result.data.byDistrict.breakdown.map(d => ({
              category: d.district,
              value: parseFloat(d.totalStock || 0),
              percentage: result.data.byDistrict.summary.totalStock > 0
                ? ((d.totalStock / result.data.byDistrict.summary.totalStock) * 100).toFixed(2)
                : 0
            }))
          ]
        };

        setReportData(prevData => ({
          ...prevData,
          stock: formattedData
        }));

        showSuccessNotification(`${toastLabel} generated successfully!`);

        addGeneratedReport({
          id: Date.now(),
          name: resolveReportDisplayName('stock', stockReportType, reportTypes),
          data: formattedData,
          ...baseEntry
        });
      } else if (stockReportType === 'by-district') {
        const formattedData = {
          summary: result.data.summary,
          breakdown: result.data.breakdown.map(d => ({
            category: d.district,
            value: parseFloat(d.totalStock || 0),
            percentage: result.data.summary.totalStock > 0
              ? ((d.totalStock / result.data.summary.totalStock) * 100).toFixed(2)
              : 0,
            mills: d.totalMills,
            privateStock: parseFloat(d.privateStock || 0),
            governmentStock: parseFloat(d.governmentStock || 0)
          }))
        };

        setReportData(prevData => ({
          ...prevData,
          stock: formattedData
        }));

        showSuccessNotification(`${toastLabel} generated successfully!`);

        addGeneratedReport({
          id: Date.now(),
          name: resolveReportDisplayName('stock', stockReportType, reportTypes),
          data: formattedData,
          ...baseEntry
        });
      } else {
        // For single category reports (total, private, government)
        const formattedData = {
          summary: result.data.summary,
          breakdown: [
            {
              category: stockReportType.charAt(0).toUpperCase() + stockReportType.slice(1) + ' Stock',
              value: result.data.summary.totalStock || 0,
              percentage: 100
            }
          ]
        };

        setReportData(prevData => ({
          ...prevData,
          stock: formattedData
        }));

        showSuccessNotification(`${toastLabel} generated successfully!`);

        addGeneratedReport({
          id: Date.now(),
          name: resolveReportDisplayName('stock', stockReportType, reportTypes),
          data: formattedData,
          ...baseEntry
        });
      }

    } catch (error) {
      console.error('Error generating stock report:', error);
      alert(`Error generating stock report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRegionalSubmissions = async () => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      // Normalize selectedRegion to match 'region' query param expected by backend if any (though backend uses 'district')
      const regionLabel = normalizeRegionLabel(selectedRegion);
      let url = `${apiBaseUrl}/api/admin/regional-reports`;
      if (regionLabel && regionLabel !== 'All Regions') {
        url += `?district=${encodeURIComponent(regionLabel)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch regional reports: ${response.statusText}`);
      }

      const result = await response.json();
      const reports = result.data || [];

      // Transform for display
      const formattedData = {
        summary: {
          totalReports: reports.length,
          latestSubmission: reports.length > 0 ? new Date(reports[0].created_at).toLocaleDateString() : 'N/A'
        },
        breakdown: reports.map(r => ({
          category: r.district,
          officer: r.officer_name,
          date: new Date(r.created_at).toLocaleString(),
          type: r.report_type,
          value: 'View Details',
          rawData: r
        }))
      };

      setReportData(prevData => ({
        ...prevData,
        regional_submission: formattedData
      }));

      showSuccessNotification('Regional Submissions loaded successfully!');

      // Also add to generated list for history
      addGeneratedReport({
        id: Date.now(),
        name: 'Regional Submissions',
        reportType: 'regional_submission',
        variant: null,
        data: formattedData,
        filters: {
          region: selectedRegion,
          regionLabel
        },
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error fetching regional reports:', error);
      alert(`Error fetching regional reports: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType === 'stock') {
      setSelectedStockVariant('combined')
    }
  }, [reportType])

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false
      return
    }

    if (reportType === 'stock' || MANUAL_REPORT_TYPES.has(reportType)) {
      return
    }

    if (reportType === 'regional_submission') {
      handleGenerateRegionalSubmissions();
      return;
    }

    fetchReportData(reportType)
  }, [reportType, fetchReportData])

  const generatePDFReport = async (options = {}) => {
    if (typeof jsPDF !== 'function') {
      console.error('jsPDF constructor not available')
      return null
    }

    const doc = new jsPDF()

    const applyAutoTable = (tableOptions) => {
      if (typeof doc.autoTable === 'function') {
        if (doc.autoTable.length <= 1) {
          doc.autoTable(tableOptions)
        } else {
          const { head, body, ...legacyOptions } = tableOptions
          doc.autoTable(head, body, legacyOptions)
        }
        return true
      }

      if (typeof autoTable === 'function') {
        try {
          autoTable(doc, tableOptions)
          return true
        } catch (invokeError) {
          console.warn('Direct autoTable invocation failed', invokeError)
        }
      }

      console.error('autoTable plugin not loaded properly')
      return false
    }

    const { customData, customReportType, customFilters, customTitle, variant, generatedAt } = options
    const targetReportType = customReportType || reportType
    const fallbackData = (reportData && reportData[targetReportType]) ? reportData[targetReportType] : { summary: {}, breakdown: [] }
    const currentData = customData || fallbackData
    const filters = customFilters || {
      dateRange: { from: dateRange.from, to: dateRange.to },
      region: selectedRegion,
      regionLabel: normalizeRegionLabel(selectedRegion),
      millType: selectedMillType
    }
    const reportName = customTitle || resolveReportDisplayName(targetReportType, variant, reportTypes)
    const periodFrom = filters?.dateRange?.from || ''
    const periodTo = filters?.dateRange?.to || ''
    const regionDisplay = filters?.regionLabel || normalizeRegionLabel(filters?.region)
    const millTypeDisplay = filters?.millType || 'All'
    const generatedDisplay = generatedAt ? new Date(generatedAt).toLocaleString() : `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`

    doc.setFillColor(34, 197, 94)
    doc.rect(0, 0, 210, 25, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('PMB ADMIN DASHBOARD', 14, 18)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text('Paddy Marketing Board - Sri Lanka', 14, 35)

    doc.setFontSize(12)
    doc.text(`Report: ${reportName}`, 14, 50)
    doc.text(`Period: ${periodFrom && periodTo ? `${periodFrom} to ${periodTo}` : 'N/A'}`, 14, 60)
    doc.text(`Region: ${regionDisplay}`, 14, 70)
    doc.text(`Mill Type: ${millTypeDisplay}`, 14, 80)
    doc.text(`Generated: ${generatedDisplay}`, 14, 90)

    doc.setLineWidth(0.5)
    doc.line(14, 95, 196, 95)

    let yPosition = 105

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

    if (currentData && currentData.breakdown && currentData.breakdown.length > 0) {
      doc.setFontSize(16)
      doc.setTextColor(34, 197, 94)
      doc.text('DETAILED ANALYSIS', 14, yPosition)
      doc.setTextColor(0, 0, 0)
      yPosition += 5

      const breakdownHeaders = ['Category', 'Value', 'Percentage/Rate']
      const tableData = currentData.breakdown.map(item => {
        const valueDisplay = typeof item.value === 'number' ? item.value.toLocaleString() : (item.value || 'N/A')
        const percentageDisplay = item.percentage ? `${item.percentage}%` : (item.utilization ? `${item.utilization}%` : 'N/A')
        return [item.category || item.name || item.mill || item.district || 'N/A', valueDisplay, percentageDisplay]
      })

      let tableOptions
      try {
        tableOptions = {
          startY: yPosition + 5,
          head: [breakdownHeaders],
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
        }

        const tableApplied = applyAutoTable(tableOptions)
        if (!tableApplied) {
          throw new Error('Unable to apply autoTable with resolved module signatures')
        }
      } catch (autoTableError) {
        console.error('AutoTable error with options:', tableOptions, autoTableError)
        doc.setFontSize(10)
        let tableY = yPosition + 15

        doc.setFont(undefined, 'bold')
        doc.text('Category', 14, tableY)
        doc.text('Value', 80, tableY)
        doc.text('Percentage/Rate', 140, tableY)
        tableY += 10

        doc.setFont(undefined, 'normal')
        tableData.forEach(row => {
          doc.text(row[0] || '', 14, tableY)
          doc.text(row[1] || '', 80, tableY)
          doc.text(row[2] || '', 140, tableY)
          tableY += 8
        })
      }
    }

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFillColor(248, 250, 252)
      doc.rect(0, doc.internal.pageSize.height - 20, 210, 20, 'F')

      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('Paddy Marketing Board (PMB) - Official Report', 14, doc.internal.pageSize.height - 10)
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10)
      doc.text(`Generated on ${generatedDisplay}`, doc.internal.pageSize.width - 70, doc.internal.pageSize.height - 5)
    }

    return doc
  }


  const generateCSVContent = (options = {}) => {
    const { customData, customReportType, customFilters, variant } = options
    const activeReportType = customReportType || reportType
    const data = customData || ((reportData && reportData[activeReportType]) ? reportData[activeReportType] : { summary: {}, breakdown: [] })
    const filters = customFilters || {
      dateRange: { from: dateRange.from, to: dateRange.to },
      region: selectedRegion,
      regionLabel: normalizeRegionLabel(selectedRegion),
      millType: selectedMillType
    }
    const reportName = resolveReportDisplayName(activeReportType, variant, reportTypes)
    const periodFrom = filters?.dateRange?.from || ''
    const periodTo = filters?.dateRange?.to || ''
    const regionText = filters?.regionLabel || normalizeRegionLabel(filters?.region)
    const millTypeText = filters?.millType || 'All'

    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) {
        return '""'
      }
      return `"${String(value).replace(/"/g, '""')}"`
    }

    let csv = `Report Name,${escapeCsvValue(reportName)}\n`
    csv += `Period,${escapeCsvValue(periodFrom && periodTo ? `${periodFrom} to ${periodTo}` : 'N/A')}\n`
    csv += `Region,${escapeCsvValue(regionText)}\n`
    csv += `Mill Type,${escapeCsvValue(millTypeText)}\n\n`

    csv += 'Summary Metrics\n'
    Object.entries(data.summary || {}).forEach(([key, value]) => {
      csv += `${escapeCsvValue(key)},${escapeCsvValue(value)}\n`
    })

    const breakdown = data.breakdown || []
    if (breakdown.length > 0) {
      const fields = []
      breakdown.forEach(item => {
        Object.keys(item).forEach(field => {
          if (!fields.includes(field)) {
            fields.push(field)
          }
        })
      })
      const orderedFields = ['category', 'value', 'percentage', ...fields.filter(field => !['category', 'value', 'percentage'].includes(field))]
      csv += '\nBreakdown\n'
      csv += orderedFields.map(escapeCsvValue).join(',') + '\n'
      breakdown.forEach(item => {
        const row = orderedFields.map(field => escapeCsvValue(item[field] ?? ''))
        csv += row.join(',') + '\n'
      })
    }

    return csv
  }

  const handleViewGeneratedReport = async (savedReport) => {
    if (!savedReport) {
      return
    }
    const filters = savedReport.filters || {}
    const hasCachedData = Boolean(savedReport.data)
    skipNextFetchRef.current = hasCachedData

    if (filters.dateRange) {
      setDateRange(filters.dateRange)
    }
    if (typeof filters.region !== 'undefined') {
      setSelectedRegion(filters.region)
    }
    if (typeof filters.millType !== 'undefined') {
      setSelectedMillType(filters.millType)
    }

    setReportType(savedReport.reportType)

    const fallbackData = savedReport.data || mockReportData[savedReport.reportType] || { summary: {}, breakdown: [] }
    setReportData(prev => ({
      ...prev,
      [savedReport.reportType]: fallbackData
    }))

    showSuccessNotification(`Loaded ${savedReport.name}`)

    if (!hasCachedData) {
      await fetchReportData(savedReport.reportType, {
        dateRange: filters.dateRange,
        region: filters.region,
        millType: filters.millType,
        addToGenerated: false,
        showToast: false
      })
    }

    try {
      setIsGeneratingPDF(true)
      const doc = await generatePDFReport({
        customData: fallbackData,
        customReportType: savedReport.reportType,
        customFilters: filters,
        customTitle: savedReport.name,
        variant: savedReport.variant,
        generatedAt: savedReport.generatedAt
      })

      if (!doc) {
        alert('Unable to generate preview for this report right now. Please try again later.')
        return
      }

      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const newWindow = window.open(pdfUrl, '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes')

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const safeName = savedReport.name ? savedReport.name.replace(/[^a-z0-9]+/gi, '_') : 'report'
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = `${safeName || 'report'}_preview.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert('PDF preview downloaded (popup may have been blocked by your browser).')
      }

      setTimeout(() => URL.revokeObjectURL(pdfUrl), 15000)
    } catch (error) {
      console.error('Error previewing saved report:', error)
      alert('Error opening saved report preview. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDownloadGeneratedReport = async (savedReport, format) => {
    if (!savedReport) {
      return
    }
    const fileNameBase = savedReport.name.replace(/[^a-z0-9]+/gi, '_').replace(/_{2,}/g, '_').replace(/^_+|_+$/g, '') || 'report'

    if (format === 'pdf') {
      setIsGeneratingPDF(true)
      try {
        const doc = await generatePDFReport({
          customData: savedReport.data,
          customReportType: savedReport.reportType,
          customFilters: savedReport.filters,
          customTitle: savedReport.name,
          variant: savedReport.variant,
          generatedAt: savedReport.generatedAt
        })
        if (!doc) {
          alert('Unable to generate PDF for the saved report right now. Please try again later.')
          return
        }
        doc.save(`${fileNameBase}.pdf`)
        showSuccessNotification('PDF downloaded successfully!')
      } catch (error) {
        console.error('Error generating saved PDF:', error)
        alert('Error generating PDF for saved report. Please try again.')
      } finally {
        setIsGeneratingPDF(false)
      }
    }

    if (format === 'csv') {
      try {
        const csvContent = generateCSVContent({
          customData: savedReport.data,
          customReportType: savedReport.reportType,
          customFilters: savedReport.filters,
          variant: savedReport.variant
        })
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `${fileNameBase}.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          showSuccessNotification('CSV downloaded successfully!')
        }
      } catch (error) {
        console.error('Error generating saved CSV:', error)
        alert('Error generating CSV for saved report. Please try again.')
      }
    }
  }

  const currentReportData = (reportData && reportData[reportType]) ? reportData[reportType] : { summary: {}, breakdown: [] }
  const summaryEntries = Object.entries(currentReportData.summary || {})
  const breakdownItems = currentReportData.breakdown || []
  const shouldRenderEmptyState = REPORTS_WITH_EMPTY_STATE.includes(reportType)
  const hasSummaryData = summaryEntries.length > 0
  const hasBreakdownData = breakdownItems.length > 0

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10 h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-600">Loading Report Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                className={`p-4 rounded-lg border-2 transition-colors ${reportType === type.id
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

      {/* Custom Stock Report Generator - Only show when stock report is selected */}
      {reportType === 'stock' && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-6 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-green-600" />
            Custom Stock Report Generator
          </h3>

          <div className="bg-white rounded-lg p-6 space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Generate detailed stock reports with custom filters and breakdowns
            </p>

            {/* Stock Report Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {STOCK_REPORT_OPTIONS.map(option => {
                const IconComponent = option.icon
                const isActive = selectedStockVariant === option.id
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setSelectedStockVariant(option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors flex flex-col space-y-2 ${isActive
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                  >
                    <IconComponent className={`w-8 h-8 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{option.label}</span>
                    <span className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                      {option.description}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* District Filter for Stock Reports */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by District (Optional)
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Districts</option>
                {regions.filter(r => r !== 'All Regions').map(region => {
                  const optionValue = region.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <option key={region} value={optionValue}>
                      {region}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Combined Report Button */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <button
                type="button"
                onClick={() => handleGenerateStockReport(selectedStockVariant)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <SelectedStockIcon className="w-5 h-5" />
                <span>Generate Report</span>
              </button>
              <p className="text-xs text-indigo-600 mt-2 text-center">
                {selectedStockOption ? `${selectedStockOption.label} • ${selectedStockOption.description}` : 'Select a stock report option above.'}
              </p>
            </div>
          </div>
        </div>
      )}

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

        {reportType !== 'stock' && MANUAL_REPORT_TYPES.has(reportType) && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleManualReportGenerate}
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 rounded-md font-semibold text-white transition-colors ${loading ? 'bg-green-400 cursor-not-allowed opacity-70' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        )}

        {/* Summary Cards */}
        {!hasSummaryData && shouldRenderEmptyState ? (
          <p className="text-sm text-gray-500 italic mb-6">No summary data available for this report yet.</p>
        ) : hasSummaryData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {summaryEntries.map(([key, value]) => (
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
        ) : null}

        {/* Breakdown Chart */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-800">Breakdown Analysis</h4>
          <div className="space-y-3">
            {!hasBreakdownData && shouldRenderEmptyState ? (
              <p className="text-sm text-gray-500 italic">No breakdown data available for this report yet.</p>
            ) : hasBreakdownData ? (
              breakdownItems.map((item, index) => (
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
              ))
            ) : null}
          </div>
        </div>

        {/* Custom Table for Regional Submissions */}
        {reportType === 'regional_submission' && hasBreakdownData && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {breakdownItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.officer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      <button onClick={() => {
                        // Simple alert for now, ideally a modal
                        const r = item.rawData;
                        const summary = typeof r.report_data === 'string' ? JSON.parse(r.report_data) : r.report_data;
                        alert(`Report Details for ${item.category}:\n\nTotal Stock: ${summary?.summary?.totalStock || 'N/A'}\nStart Date: ${new Date(r.created_at).toLocaleDateString()}`);
                      }}>
                        View Data
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Reports</h3>
        {generatedReports.length === 0 ? (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500">
            Generate a report to see it listed here for quick viewing and downloads.
          </div>
        ) : (
          <div className="space-y-3">
            {generatedReports.map(report => {
              const label = resolveReportDisplayName(report.reportType, report.variant, reportTypes)
              const generatedTime = report.generatedAt ? new Date(report.generatedAt).toLocaleString() : ''
              const regionText = report.filters?.regionLabel || normalizeRegionLabel(report.filters?.region)
              const periodText = report.filters?.dateRange ? `${report.filters.dateRange.from} to ${report.filters.dateRange.to}` : 'Live snapshot'
              return (
                <div key={report.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">{report.name}</h4>
                      <p className="text-xs text-gray-600">
                        {label} • {periodText} • {regionText} • {generatedTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                    <button
                      onClick={() => handleViewGeneratedReport(report)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadGeneratedReport(report, 'pdf')}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownloadGeneratedReport(report, 'csv')}
                      className="px-3 py-1.5 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      CSV
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
