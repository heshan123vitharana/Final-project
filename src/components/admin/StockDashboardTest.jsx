import { Activity } from 'lucide-react'

const StockDashboardTest = () => {
  return (
    <div className="space-y-6">
      {/* Simple Test Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">Stock Dashboard Test</h2>
        <p className="text-sm text-gray-600">Testing basic functionality</p>
      </div>

      {/* Simple Test Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Test Status</p>
            <p className="text-2xl font-bold text-green-600">Working</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Test Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chart Area</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2" />
            <p>Chart placeholder - basic component is working</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockDashboardTest