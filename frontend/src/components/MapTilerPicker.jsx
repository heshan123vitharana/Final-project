import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapPinIcon, XMarkIcon, GlobeAltIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

// MapTiler location picker - High-quality free alternative with generous limits
// Get your free API key from: https://cloud.maptiler.com/
const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'YOUR_MAPTILER_API_KEY'; // Replace with your key

const MapTilerPicker = ({ isOpen, onClose, onLocationSelect, initialLocation, title = "Select Location" }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load MapLibre GL JS (used by MapTiler) dynamically when modal opens
  useEffect(() => {
    if (isOpen && !mapLoaded) {
      const loadMapTiler = async () => {
        // Check if MapLibre is already loaded
        if (window.maplibregl) {
          setMapLoaded(true);
          return;
        }

        // Load CSS
        const link = document.createElement('link');
        link.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      };

      loadMapTiler();
    }
  }, [isOpen, mapLoaded]);

  // Initialize map when MapLibre is loaded
  useEffect(() => {
    if (isOpen && mapLoaded && window.maplibregl && !map && mapRef.current) {
      const newMap = new window.maplibregl.Map({
        container: mapRef.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
        center: [initialLocation?.lng || 80.7718, initialLocation?.lat || 7.8731], // Sri Lanka center
        zoom: 10,
        attributionControl: true
      });

      // Add navigation controls
      newMap.addControl(new window.maplibregl.NavigationControl(), 'top-right');

      // Add geolocate control
      const geolocate = new window.maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });
      newMap.addControl(geolocate, 'top-right');

      // Add click handler
      newMap.on('click', async (e) => {
        const { lat, lng } = e.lngLat;

        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add new marker
        const marker = new window.maplibregl.Marker({ color: '#059669' })
          .setLngLat([lng, lat])
          .addTo(newMap);

        markerRef.current = marker;

        // Get address using MapTiler Geocoding API
        try {
          const response = await fetch(
            `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_API_KEY}`
          );
          const data = await response.json();

          let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          if (data.features && data.features.length > 0) {
            address = data.features[0].place_name;
          }

          const location = { lat, lng, address };
          setSelectedLocation(location);
        } catch (error) {
          console.error('Geocoding error:', error);
          setSelectedLocation({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
        }
      });

      setMap(newMap);

      // Set initial marker if provided
      if (initialLocation) {
        const marker = new window.maplibregl.Marker({ color: '#059669' })
          .setLngLat([initialLocation.lng, initialLocation.lat])
          .addTo(newMap);
        markerRef.current = marker;
        setSelectedLocation(initialLocation);
      }
    }
  }, [isOpen, mapLoaded, map, initialLocation]);

  const UNUSED_handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Remove existing marker
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add marker at current location
          const marker = new window.maplibregl.Marker({ color: '#059669' })
            .setLngLat([location.lng, location.lat])
            .addTo(map);

          markerRef.current = marker;

          // Center map on current location
          map.flyTo({
            center: [location.lng, location.lat],
            zoom: 15
          });

          // Get address for current location
          try {
            const response = await fetch(
              `https://api.maptiler.com/geocoding/${location.lng},${location.lat}.json?key=${MAPTILER_API_KEY}`
            );
            const data = await response.json();

            let address = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
            if (data.features && data.features.length > 0) {
              address = data.features[0].place_name;
            }

            setSelectedLocation({ ...location, address });
          } catch (error) {
            console.error('Error getting address:', error);
            setSelectedLocation({
              ...location,
              address: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  // Search for locations using MapTiler Geocoding
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_API_KEY}&country=lk&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;

        const location = {
          lat,
          lng,
          address: feature.place_name
        };

        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add marker at search result
        const marker = new window.maplibregl.Marker({ color: '#059669' })
          .setLngLat([lng, lat])
          .addTo(map);

        markerRef.current = marker;

        // Fly to the location
        map.flyTo({
          center: [lng, lat],
          zoom: 15
        });

        setSelectedLocation(location);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Map style options for MapTiler
  const mapStyles = [
    { id: 'streets', name: 'Streets', icon: '🏙️', url: 'streets/style.json' },
    { id: 'satellite', name: 'Satellite', icon: '🛰️', url: 'satellite/style.json' },
    { id: 'hybrid', name: 'Hybrid', icon: '🌍', url: 'hybrid/style.json' },
    { id: 'outdoor', name: 'Outdoor', icon: '🌲', url: 'outdoor/style.json' },
    { id: 'winter', name: 'Winter', icon: '❄️', url: 'winter/style.json' },
    { id: 'topo', name: 'Topo', icon: '🗻', url: 'topo/style.json' }
  ];

  const changeMapStyle = (styleUrl) => {
    if (map) {
      map.setStyle(`https://api.maptiler.com/maps/${styleUrl}?key=${MAPTILER_API_KEY}`);
    }
  };

  // Cleanup when modal closes
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">
                MAPTILER
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                100K FREE/MONTH
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search locations in Sri Lanka..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Current Location */}
            <button
              onClick={handleCurrentLocation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CursorArrowRaysIcon className="h-4 w-4" />
              Current Location
            </button>
          </div>

          {/* Map Style Selector */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => changeMapStyle(style.url)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap text-sm"
              >
                <span>{style.icon}</span>
                {style.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="p-6">
          {!mapLoaded ? (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading MapTiler...</p>
                <p className="text-sm text-gray-500 mt-1">High-quality mapping with generous limits</p>
              </div>
            </div>
          ) : (
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-gray-300"
              style={{ minHeight: '400px' }}
            />
          )}

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-emerald-800">Selected Location</h4>
                  <p className="text-sm text-emerald-700 mt-1">{selectedLocation.address}</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Powered by MapTiler • High-quality tiles • 100,000 free requests/month
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTilerPicker;
