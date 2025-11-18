import React, { useState, useEffect, useRef, useMemo } from 'react';
import centersData from '../../../data/collectionCenters.json';

const DISTRICT_TO_PROVINCE = {
  Colombo: 'Western',
  Gampaha: 'Western',
  Kalutara: 'Western',
  Kandy: 'Central',
  Matale: 'Central',
  'Nuwara Eliya': 'Central',
  Galle: 'Southern',
  Matara: 'Southern',
  Hambantota: 'Southern',
  Jaffna: 'Northern',
  Kilinochchi: 'Northern',
  Mannar: 'Northern',
  Vavuniya: 'Northern',
  Mullaitivu: 'Northern',
  Trincomalee: 'Eastern',
  Batticaloa: 'Eastern',
  Ampara: 'Eastern',
  Kurunegala: 'North Western',
  Puttalam: 'North Western',
  Anuradhapura: 'North Central',
  Polonnaruwa: 'North Central',
  Badulla: 'Uva',
  Monaragala: 'Uva',
  Ratnapura: 'Sabaragamuwa',
  Kegalle: 'Sabaragamuwa'
};

const BUSINESS_TYPE_SERVICES = {
  'rice mill': ['Cleaning', 'Drying', 'Hulling', 'Quality Testing'],
  'paddy storage': ['Storage', 'Inventory Management', 'Quality Testing'],
  'processing center': ['Cleaning', 'Drying', 'Processing', 'Packaging'],
  'export hub': ['Quality Certification', 'Packaging', 'Logistics Coordination'],
  'collection center': ['Storage', 'Quality Testing', 'Farmer Support'],
  'agro service': ['Farmer Advisory', 'Quality Testing', 'Processing'],
};

const normalizeDistrictName = (district) => {
  if (!district) {
    return null;
  }

  return String(district)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const getProvinceForDistrict = (district) => {
  const normalized = normalizeDistrictName(district);
  if (!normalized) {
    return null;
  }

  return DISTRICT_TO_PROVINCE[normalized] || null;
};

const categorizeCapacity = (rawCapacity) => {
  if (rawCapacity === null || rawCapacity === undefined) {
    return { label: 'Not specified', display: 'Not specified' };
  }

  const rawString = String(rawCapacity).trim();

  if (!rawString) {
    return { label: 'Not specified', display: 'Not specified' };
  }

  const numeric = Number.parseFloat(rawString.replace(/[^0-9.]/g, ''));

  if (!Number.isFinite(numeric)) {
    return { label: 'Custom', display: rawString };
  }

  if (numeric >= 4000) {
    return { label: 'Large', display: rawString.includes('MT') ? rawString : `${numeric} MT/month` };
  }

  if (numeric >= 2500) {
    return { label: 'Medium', display: rawString.includes('MT') ? rawString : `${numeric} MT/month` };
  }

  return { label: 'Small', display: rawString.includes('MT') ? rawString : `${numeric} MT/month` };
};

const inferServices = (businessType) => {
  if (!businessType) {
    return ['Storage', 'Quality Testing'];
  }

  const lookupKey = String(businessType).toLowerCase();
  return BUSINESS_TYPE_SERVICES[lookupKey] || ['Storage', 'Quality Testing'];
};

const buildContactName = (firstName, lastName, businessName) => {
  const fullName = [firstName, lastName]
    .filter((part) => part && String(part).trim() !== '')
    .join(' ')
    .trim();

  if (fullName) {
    return fullName;
  }

  if (businessName && String(businessName).trim() !== '') {
    return `${businessName} Team`;
  }

  return 'Operations Team';
};

const buildCenterKey = (center) => {
  if (!center) {
    return null;
  }

  if (center.licenseNumber && center.licenseNumber !== 'N/A') {
    return `license:${String(center.licenseNumber).toLowerCase()}`;
  }

  const lat = center.coordinates?.lat;
  const lng = center.coordinates?.lng;

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `geo:${lat.toFixed(4)}:${lng.toFixed(4)}`;
  }

  return `name:${String(center.name || '').toLowerCase()}|district:${String(center.district || '').toLowerCase()}`;
};

const normalizeApprovedMill = (mill) => {
  if (!mill) {
    return null;
  }

  const district = normalizeDistrictName(mill.district) || 'Unknown';
  const province = getProvinceForDistrict(district) || 'Unknown Province';
  const { label: capacityLabel, display: capacityDisplay } = categorizeCapacity(mill.millCapacity);
  const services = inferServices(mill.businessType);
  const manager = buildContactName(mill.contactFirstName, mill.contactLastName, mill.name);
  const addressParts = [mill.millLocation, mill.city, mill.address]
    .filter((value) => value && String(value).trim() !== '');
  const address = addressParts.length ? addressParts.join(', ') : 'Address not provided';
  const latitude = Number.isFinite(mill.latitude) ? mill.latitude : Number.parseFloat(mill.latitude);
  const longitude = Number.isFinite(mill.longitude) ? mill.longitude : Number.parseFloat(mill.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  const approvedDate = mill.approvedDate ? new Date(mill.approvedDate) : null;
  const approvedYear = approvedDate && !Number.isNaN(approvedDate.getTime()) ? String(approvedDate.getFullYear()) : '—';
  const displayName = mill.name && String(mill.name).trim() !== ''
    ? mill.name
    : mill.licenseNumber
      ? `Licensed Mill ${mill.licenseNumber}`
      : 'Licensed Mill';

  const identifier = mill.id ? `mill-${mill.id}` : mill.licenseNumber ? `license-${String(mill.licenseNumber).toLowerCase()}` : `mill-${Date.now()}`;

  return {
    id: identifier,
    name: displayName,
    district,
    province,
    address,
    phone: mill.phone || 'N/A',
    email: mill.email || 'N/A',
    status: 'Active',
    capacity: capacityLabel,
    capacityMT: capacityDisplay,
    operatingHours: '6:00 AM - 6:00 PM',
    services,
    established: approvedYear,
    rating: null,
    coordinates: hasCoordinates ? { lat: latitude, lng: longitude } : null,
    manager,
    licenseNumber: mill.licenseNumber || 'N/A',
    businessType: mill.businessType || 'Mill',
    source: 'live',
    approvedDate: mill.approvedDate || null,
  };
};

const normalizeStaticCenter = (center) => {
  if (!center) {
    return null;
  }

  const district = normalizeDistrictName(center.district) || 'Unknown';
  const province = center.province || getProvinceForDistrict(district) || 'Unknown Province';

  return {
    ...center,
    district,
    province,
    address: center.address || 'Address not provided',
    phone: center.phone || 'N/A',
    email: center.email || 'N/A',
    status: center.status || 'Active',
    capacity: center.capacity || 'Not specified',
    capacityMT: center.capacityMT || center.capacity || 'Not specified',
    operatingHours: center.operatingHours || 'Not specified',
    services: Array.isArray(center.services) ? center.services : (center.services ? [center.services] : []),
    established: center.established || '—',
    rating: typeof center.rating === 'number' ? center.rating : null,
    coordinates: center.coordinates || null,
    manager: center.manager || 'Operations Team',
    licenseNumber: center.licenseNumber || 'N/A',
    businessType: center.businessType || 'Collection Center',
    source: 'static',
  };
};

const formatTimestamp = (value) => {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
};

const CollectionCenters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showAllCenters, setShowAllCenters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [liveCenters, setLiveCenters] = useState([]);
  const [UNUSED_loadingLiveCenters, setLoadingLiveCenters] = useState(false);
  const [UNUSED_liveCentersError, setLiveCentersError] = useState(null);
  const districtRef = useRef(null);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('collection-centers');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Close district dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (showDistrictDropdown && districtRef.current && !districtRef.current.contains(e.target)) {
        setShowDistrictDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [showDistrictDropdown]);

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const defaultBackend = (import.meta?.env?.VITE_BACKEND_URL || import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const candidateEndpoints = Array.from(
      new Set([
        '/api/admin/approved-mills',
        `${defaultBackend}/api/admin/approved-mills`,
      ])
    );

    const fetchLiveCenters = async () => {
      if (isFetching) {
        return;
      }

      isFetching = true;

      try {
        if (isMounted) {
          setLoadingLiveCenters(true);
          setLiveCentersError(null);
        }

        let mills = [];
        let lastError = null;

        for (const endpoint of candidateEndpoints) {
          try {
            const response = await fetch(endpoint);

            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.toLowerCase().includes('application/json')) {
              throw new Error(`Unexpected content-type: ${contentType}`);
            }

            const payload = await response.json();
            mills = Array.isArray(payload?.mills)
              ? payload.mills
              : Array.isArray(payload)
                ? payload
                : [];
            lastError = null;
            break;
          } catch (innerError) {
            lastError = innerError;
          }
        }

        if (lastError) {
          throw lastError;
        }

        if (isMounted) {
          setLiveCenters(mills);
        }
      } catch (error) {
        console.error('CollectionCenters: failed to fetch live centers', error);
        if (isMounted) {
          setLiveCentersError(error.message || 'Failed to load collection centers');
        }
      } finally {
        if (isMounted) {
          setLoadingLiveCenters(false);
        }
        isFetching = false;
      }
    };

    fetchLiveCenters();
    const intervalId = setInterval(fetchLiveCenters, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const staticCenters = useMemo(
    () => centersData.map(normalizeStaticCenter).filter(Boolean),
    []
  );

  const normalizedLiveCenters = useMemo(
    () => liveCenters.map(normalizeApprovedMill).filter(Boolean),
    [liveCenters]
  );

  const centers = useMemo(() => {
    const map = new Map();

    const register = (center) => {
      if (!center) {
        return;
      }

      const key = buildCenterKey(center) || `center-${center.id ?? Math.random().toString(36).slice(2)}`;
      map.set(key, { ...center, renderKey: key });
    };

    staticCenters.forEach(register);
    normalizedLiveCenters.forEach(register);

    return Array.from(map.values());
  }, [staticCenters, normalizedLiveCenters]);

  // Extract unique values for filters
  const districts = useMemo(
    () => [...new Set(centers.map((c) => c?.district).filter(Boolean))].sort(),
    [centers]
  );
  const provinces = useMemo(
    () => [...new Set(centers.map((c) => c?.province).filter(Boolean))].sort(),
    [centers]
  );
  const capacityTypes = useMemo(
    () => [...new Set(centers.map((c) => c?.capacity).filter(Boolean))].sort(),
    [centers]
  );
  const statusTypes = useMemo(
    () => [...new Set(centers.map((c) => c?.status).filter(Boolean))].sort(),
    [centers]
  );
  const allServices = useMemo(
    () => [...new Set(centers.flatMap((c) => Array.isArray(c?.services) ? c.services : []).filter(Boolean))].sort(),
    [centers]
  );

  // Filter and sort centers - FIXED VERSION
  const getFilteredCenters = () => {
    let filtered = centers;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(center =>
        center.name.toLowerCase().includes(search) ||
        center.district.toLowerCase().includes(search) ||
        center.province.toLowerCase().includes(search) ||
        center.address.toLowerCase().includes(search) ||
        center.manager.toLowerCase().includes(search) ||
        center.services.some(service => service.toLowerCase().includes(search))
      );
    }

    // Apply other filters
    if (selectedDistrict) {
      filtered = filtered.filter(center => center.district === selectedDistrict);
    }
    if (selectedProvince) {
      filtered = filtered.filter(center => center.province === selectedProvince);
    }
    if (selectedStatus) {
      filtered = filtered.filter(center => center.status === selectedStatus);
    }
    if (selectedCapacity) {
      filtered = filtered.filter(center => center.capacity === selectedCapacity);
    }
    if (selectedService) {
      filtered = filtered.filter(center => center.services.includes(selectedService));
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'district':
          return a.district.localeCompare(b.district);
        case 'capacity': {
          const parseCap = (s) => {
            if (!s) return 0;
            const m = String(s).match(/(\d+(?:\.\d+)?)\s*MT/i);
            return m ? parseFloat(m[1]) : 0;
          };
          return parseCap(b.capacityMT) - parseCap(a.capacityMT);
        }
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'established':
          return String(a.established || '').localeCompare(String(b.established || ''));
        default:
          return 0;
      }
    });

    return showAllCenters ? filtered : filtered.slice(0, 6);
  };

  const filteredCenters = getFilteredCenters();

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedProvince('');
    setSelectedStatus('');
    setSelectedCapacity('');
    setSelectedService('');
    setShowAllCenters(false);
  };

  const handleViewAllCenters = () => {
    setShowAllCenters(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Under Maintenance': return 'bg-orange-500';
      case 'Inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status border color
  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Active': return 'border-green-400';
      case 'Under Maintenance': return 'border-orange-400';
      case 'Inactive': return 'border-red-400';
      default: return 'border-gray-400';
    }
  };

  // Add Center feature removed as requested

  return (
    <section id="collection-centers" className="relative min-h-screen py-20">
      {/* Professional Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 overflow-hidden pointer-events-none"></div>
  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-green-500/15 pointer-events-none"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight tracking-tight">
            Collection <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Centers</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Discover our {centers.length} collection centers across Sri Lanka with advanced search and filtering
          </p>
          {/* Hidden: Live licenses synced badge */}
        </div>

        {/* Enhanced Search and Filter Section */}
  <div className={`relative z-20 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12 shadow-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Search Bar with Real-time Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by center name, district, province, manager, or services..."
                className="w-full px-6 py-4 pl-14 text-lg bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-2xl focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {/* District Filter */}
            <div className="relative" ref={districtRef}>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">📍 District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>

              <div className="mt-2 flex items-center gap-2">
                  {/* Removed '+ Add District' button as requested */}
                {selectedDistrict && (
                  <span className="text-xs text-emerald-200">Selected: {selectedDistrict}</span>
                )}
              </div>

              {showDistrictDropdown && (
                <div className="absolute z-50 mt-2 w-full max-h-64 overflow-auto bg-white text-gray-800 rounded-xl shadow-xl border border-emerald-200 pointer-events-auto">
                  {districts.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setSelectedDistrict(d); setShowDistrictDropdown(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-emerald-50 ${selectedDistrict === d ? 'bg-emerald-100 font-semibold' : ''}`}
                    >
                      {d}
                    </button>
                  ))}
                  <div className="border-t">
                    <button
                      type="button"
                      onClick={() => { setSelectedDistrict(''); setShowDistrictDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">🗺️ Province</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">⚡ Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Status</option>
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">📦 Capacity</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Capacities</option>
                {capacityTypes.map(capacity => (
                  <option key={capacity} value={capacity}>{capacity}</option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">🔧 Services</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Services</option>
                {allServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-emerald-200 font-semibold mb-2 text-sm">📊 Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="name">Name</option>
                <option value="district">District</option>
                <option value="capacity">Capacity</option>
                <option value="rating">Rating</option>
                <option value="established">Established</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 rounded-xl transition-all duration-300 hover:scale-105"
              >
                🗑️ Clear Filters
              </button>
              
              <button
                onClick={handleViewAllCenters}
                className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-xl transition-all duration-300 hover:scale-105"
              >
                👁️ View All Centers
              </button>

              {/* Show All toggle in filters as requested */}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-emerald-100 text-sm">
                <input type="checkbox" checked={showAllCenters} onChange={(e) => setShowAllCenters(e.target.checked)} className="accent-emerald-500" />
                Show all centers
              </label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 rounded-xl border border-white/20 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-emerald-200 hover:bg-white/10'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-emerald-200 hover:bg-white/10'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Results Counter */}
            <div className="text-emerald-200 font-semibold">
              {filteredCenters.length} of {centers.length} centers
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {filteredCenters.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-emerald-500/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Centers Found</h3>
              <p className="text-emerald-200 mb-6">Try adjusting your search criteria or filters</p>
              <button
                onClick={clearAllFilters}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <>
              {/* Centers Grid/List */}
              <div className={`${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'space-y-6'
              } mb-12`}>
                {filteredCenters.map((center, index) => {
                  const services = Array.isArray(center.services) ? center.services : [];
                  const maxServices = viewMode === 'list' ? 6 : 4;
                  const overflowServices = Math.max(services.length - maxServices, 0);

                  return (
                    <div 
                      key={center.renderKey || center.id || index} 
                      className={`group ${viewMode === 'list' ? 'flex' : ''} bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl hover:border-white/30 transition-all duration-300 hover:-translate-y-1 transform`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Center Content */}
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-6`}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                            {center.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-emerald-200 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{center.district}, {center.province}</span>
                          </div>
                            <p className="text-xs text-emerald-100/70 leading-relaxed">{center.address}</p>
                        </div>
                        
                        {/* Status & Rating */}
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`${getStatusColor(center.status)} bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBorderColor(center.status)}`}>
                            {center.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${center.source === 'live' ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/40' : 'bg-white/10 text-emerald-200 border border-white/10'}`}>
                            {center.source === 'live' ? 'Live License' : 'Reference Data'}
                          </span>
                          <div className="flex items-center space-x-1 bg-black/20 px-2 py-1 rounded-full">
                            <svg className={`w-4 h-4 ${typeof center.rating === 'number' ? 'text-yellow-400' : 'text-emerald-200'} fill-current`} viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-white">{typeof center.rating === 'number' ? center.rating.toFixed(1) : '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center Details */}
                      <div className="border-t border-white/20 my-4 pt-4">
                        <h4 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3">Center Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-emerald-300/70">Capacity</p>
                            <p className="font-semibold text-white">{center.capacity} ({center.capacityMT})</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-300/70">Manager</p>
                            <p className="font-semibold text-white">{center.manager}</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-300/70">Operating Hours</p>
                            <p className="font-semibold text-white">{center.operatingHours}</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-300/70">Established</p>
                            <p className="font-semibold text-white">{center.established}</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-300/70">License</p>
                            <p className="font-semibold text-white">{center.licenseNumber && center.licenseNumber !== 'N/A' ? center.licenseNumber : 'Not assigned'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-300/70">{center.source === 'live' ? 'Approved On' : 'Last Update'}</p>
                            <p className="font-semibold text-white">{center.source === 'live' ? (formatTimestamp(center.approvedDate) || '—') : (center.established || '—')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="my-4">
                        <h4 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {services.slice(0, maxServices).map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-500/20 text-emerald-100 rounded-lg text-xs font-medium">
                              {service}
                            </span>
                          ))}
                          {overflowServices > 0 && (
                            <span className="px-2 py-1 bg-black/20 text-gray-300 rounded-lg text-xs font-medium">
                              +{overflowServices} more
                            </span>
                          )}
                          {services.length === 0 && (
                            <span className="px-2 py-1 bg-black/20 text-gray-300 rounded-lg text-xs font-medium">
                              Services not listed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="border-t border-white/20 pt-4 mt-4">
                        <div className="grid grid-cols-3 gap-2">
                          <a
                            href={`tel:${center.phone.replace(/\s+/g, '')}`}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-center bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            Call
                          </a>
                          <a
                            href={`mailto:${center.email}`}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-center bg-indigo-500/80 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            Email
                          </a>
                          <a
                            href={`https://www.google.com/maps?q=${encodeURIComponent(center.address)}${center.coordinates ? `@${center.coordinates.lat},${center.coordinates.lng},15z` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-3 py-2 text-center bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l6-3m-6 3V7m0 10l-6-3m6 3l6-3"></path></svg>
                            Directions
                          </a>
                        </div>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {!showAllCenters && filteredCenters.length >= 6 && (
                <div className="text-center">
                  <button
                    onClick={handleViewAllCenters}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                  >
                    View All {centers.length} Centers
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

  {/* Add Center feature removed as requested */}
    </section>
  );
};

export default CollectionCenters;
