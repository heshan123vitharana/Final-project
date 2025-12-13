import { useEffect, useMemo, useState } from 'react'
import { MapPin, Factory, Info, RefreshCw, Phone, Mail, Ruler } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

const createMarkerIcon = (hexColor = '#16a34a') =>
  L.divIcon({
    className: 'mill-marker',
    html: `<span style="background:${hexColor};border:2px solid #fff;border-radius:9999px;display:block;height:18px;width:18px;box-shadow:0 0 0 2px rgba(0,0,0,0.15);"></span>`,
    iconSize: [18, 18]
  })

const MAP_CENTER = [7.8731, 80.7718]
const MAP_ZOOM = 7.3

const getTypeColor = (type) => {
  if (!type) return '#6b7280'
  return type.toLowerCase() === 'government' ? '#2563eb' : '#16a34a'
}

const MillMap = ({ apiUrl = 'http://localhost:5000/api/admin/approved-mills' }) => {
  const [mills, setMills] = useState([])
  const [selectedMillId, setSelectedMillId] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [filterDistrict, setFilterDistrict] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const selectedMill = useMemo(
    () => mills.find((mill) => mill.id === selectedMillId) || null,
    [mills, selectedMillId]
  )

  const districts = useMemo(() => {
    const unique = new Set()
    mills.forEach((mill) => {
      if (mill.district) {
        unique.add(mill.district)
      }
    })
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [mills])

  const filteredMills = useMemo(() => {
    return mills.filter((mill) => {
      const typeMatches =
        filterType === 'all' || (mill.businessType || '').toLowerCase() === filterType
      const districtMatches =
        filterDistrict === 'all' || (mill.district || '').toLowerCase() === filterDistrict
      return typeMatches && districtMatches
    })
  }, [mills, filterType, filterDistrict])

  const fetchMills = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterType !== 'all') params.append('businessType', filterType)
      if (filterDistrict !== 'all') params.append('district', filterDistrict)

      const query = params.toString()
      const token = localStorage.getItem('token')

      const response = await fetch(
        query
          ? `${apiUrl}?${query}`
          : apiUrl,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Approved mills API not found. Restart the backend after updating routes.')
        }
        throw new Error('Failed to load mills')
      }

      const data = await response.json()
      if (Array.isArray(data.mills)) {
        setMills(data.mills)
      } else {
        setMills([])
      }
    } catch (err) {
      console.error('Error fetching approved mills:', err)
      setError(err.message || 'Unable to load mills')
      setMills([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMills()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchMills()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterDistrict])

  const handleMarkerClick = (millId) => {
    setSelectedMillId(millId)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Approved Mill Locator</h2>
            <p className="text-sm text-gray-600">
              Live map of mills with approved licenses. Filters update the data feed automatically.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="typeFilter">
                Type
              </label>
              <select
                id="typeFilter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="private">Private</option>
                <option value="government">Government</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="districtFilter">
                District
              </label>
              <select
                id="districtFilter"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All</option>
                {districts.map((district) => (
                  <option key={district} value={district.toLowerCase()}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={fetchMills}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-green-400 hover:text-green-600"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getTypeColor('private') }}
            ></span>
            Private Mills
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getTypeColor('government') }}
            ></span>
            Government Mills
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Info size={16} />
            Markers show approved mills with valid coordinates only
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="h-[480px]">
            <MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredMills.map((mill) => (
                <Marker
                  key={mill.id}
                  position={[mill.latitude, mill.longitude]}
                  icon={createMarkerIcon(getTypeColor(mill.businessType))}
                  eventHandlers={{ click: () => handleMarkerClick(mill.id) }}
                >
                  <Popup className="w-64">
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">{mill.name}</h3>
                        <p className="text-xs text-gray-500">{mill.district || 'Unknown District'}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                          {mill.businessType || 'Unknown'}
                        </span>
                        {mill.licenseNumber && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                            {mill.licenseNumber}
                          </span>
                        )}
                      </div>
                      {mill.millCapacity && (
                        <p className="flex items-center gap-2 text-xs text-gray-600">
                          <Ruler size={14} /> {mill.millCapacity}
                        </p>
                      )}
                      <div className="space-y-1 text-xs text-gray-600">
                        <p className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{mill.millLocation || 'Exact address not provided'}</span>
                        </p>
                        <p>
                          Coordinates: {mill.latitude.toFixed(5)}, {mill.longitude.toFixed(5)}
                        </p>
                        {mill.approvedDate && (
                          <p>
                            Approved:{' '}
                            {new Date(mill.approvedDate).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        {mill.phone && (
                          <p className="flex items-center gap-2">
                            <Phone size={14} /> {mill.phone}
                          </p>
                        )}
                        {mill.email && (
                          <p className="flex items-center gap-2">
                            <Mail size={14} /> {mill.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-white py-3 text-sm text-gray-500">
              <RefreshCw className="animate-spin" size={16} /> Loading mills...
            </div>
          )}
          {error && (
            <div className="border-t border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Mill Directory ({filteredMills.length})
            </h3>
            <span className="text-xs text-gray-500">Click a row to focus the marker</span>
          </div>

          <div className="space-y-3 overflow-y-auto">
            {filteredMills.map((mill) => (
              <button
                key={mill.id}
                type="button"
                onClick={() => setSelectedMillId(mill.id)}
                className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${selectedMillId === mill.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <Factory
                    className="mt-0.5 h-4 w-4"
                    color={getTypeColor(mill.businessType)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {mill.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {(mill.district || 'Unknown').toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                        {mill.businessType || 'Unknown'}
                      </span>
                      {mill.licenseNumber && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                          {mill.licenseNumber}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Lat {mill.latitude.toFixed(5)} • Lng {mill.longitude.toFixed(5)}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {!filteredMills.length && !isLoading && !error && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                No mills match the current filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedMill && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          <p className="font-medium">Selected Mill Snapshot</p>
          <p>Name: {selectedMill.name}</p>
          <p>District: {selectedMill.district || 'Unknown'}</p>
          <p>
            Coordinates: {selectedMill.latitude.toFixed(5)}, {selectedMill.longitude.toFixed(5)}
          </p>
        </div>
      )}
    </div>
  )
}

export default MillMap
