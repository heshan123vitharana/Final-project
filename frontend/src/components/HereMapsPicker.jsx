import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapPinIcon, XMarkIcon, GlobeAltIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

// HERE Maps location picker - Enterprise-grade free alternative
// Get your free API key from: https://developer.here.com/
const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY || 'YOUR_HERE_API_KEY'; // Replace with your key

const HereMapsPicker = ({ isOpen, onClose, onLocationSelect, initialLocation, title = "Select Location" }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [marker, setMarker] = useState(null);

  // Load HERE Maps API dynamically when modal opens
  useEffect(() => {
    if (isOpen && !mapLoaded) {
      const loadHereMaps = async () => {
        // Check if HERE Maps is already loaded
        if (window.H) {
          setMapLoaded(true);
          return;
        }

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
        document.head.appendChild(link);

        // Load Core
        const coreScript = document.createElement('script');
        coreScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';

        coreScript.onload = () => {
          // Load Service
          const serviceScript = document.createElement('script');
          serviceScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-service.js';

          serviceScript.onload = () => {
            // Load UI
            const uiScript = document.createElement('script');
            uiScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js';

            uiScript.onload = () => {
              // Load MapEvents
              const mapEventsScript = document.createElement('script');
              mapEventsScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js';

              mapEventsScript.onload = () => setMapLoaded(true);
              document.head.appendChild(mapEventsScript);
            };
            document.head.appendChild(uiScript);
          };
          document.head.appendChild(serviceScript);
        };
        document.head.appendChild(coreScript);
      };

      loadHereMaps();
    }
  }, [isOpen, mapLoaded]);

  // Initialize map when HERE Maps is loaded
  useEffect(() => {
    if (isOpen && mapLoaded && window.H && !map && mapRef.current) {
      // Initialize the platform with API key
      const platform = new window.H.service.Platform({
        'apikey': HERE_API_KEY
      });

      // Get default map layers
      const defaultLayers = platform.createDefaultLayers();

      // Initialize map
      const newMap = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map, // You can change to satellite, terrain, etc.
        {
          zoom: 10,
          center: {
            lat: initialLocation?.lat || 7.8731, // Sri Lanka center
            lng: initialLocation?.lng || 80.7718
          }
        }
      );

      // Enable map interaction (pan, zoom)
      const UNUSED_behavior = new window.H.mapevents.Behavior();
      const UNUSED_ui = new window.H.ui.UI.createDefault(newMap);

      // Add click event listener
      newMap.addEventListener('tap', async (evt) => {
        const coord = newMap.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );

        const lat = coord.lat;
        const lng = coord.lng;

        // Remove existing marker
        if (marker) {
          newMap.removeObject(marker);
        }

        // Create new marker
        const newMarker = new window.H.map.Marker({ lat, lng });
        newMap.addObject(newMarker);
        setMarker(newMarker);

        // Get address using HERE Geocoding API
        try {
          const response = await fetch(
            `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${HERE_API_KEY}`
          );
          const data = await response.json();

          let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          if (data.items && data.items.length > 0) {
            address = data.items[0].title || data.items[0].address.label;
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
        const initialMarker = new window.H.map.Marker({
          lat: initialLocation.lat,
          lng: initialLocation.lng
        });
        newMap.addObject(initialMarker);
        setMarker(initialMarker);
        setSelectedLocation(initialLocation);
      }
    }
  }, [isOpen, mapLoaded, map, initialLocation]); // eslint-disable-line react-hooks/exhaustive-deps

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
          if (marker) {
            map.removeObject(marker);
          }

          // Add marker at current location
          const newMarker = new window.H.map.Marker({
            lat: location.lat,
            lng: location.lng
          });
          map.addObject(newMarker);
          setMarker(newMarker);

          // Center map on current location
          map.setCenter({ lat: location.lat, lng: location.lng });
          map.setZoom(15);

          // Get address for current location
          try {
            const response = await fetch(
              `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location.lat},${location.lng}&apiKey=${HERE_API_KEY}`
            );
            const data = await response.json();

            let address = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
            if (data.items && data.items.length > 0) {
              address = data.items[0].title || data.items[0].address.label;
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

  // Search for locations using HERE Geocoding
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(searchQuery)}&in=countryCode:LKA&apiKey=${HERE_API_KEY}&limit=1`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        const { lat, lng } = item.position;

        const location = {
          lat,
          lng,
          address: item.title || item.address.label
        };

        // Remove existing marker
        if (marker) {
          map.removeObject(marker);
        }

        // Add marker at search result
        const newMarker = new window.H.map.Marker({ lat, lng });
        map.addObject(newMarker);
        setMarker(newMarker);

        // Center map on search result
        map.setCenter({ lat, lng });
        map.setZoom(15);

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

  // Map layer options
  const mapLayers = [
    { id: 'normal', name: 'Normal', icon: '🗺️' },
    { id: 'satellite', name: 'Satellite', icon: '🛰️' },
    { id: 'terrain', name: 'Terrain', icon: '⛰️' },
    { id: 'hybrid', name: 'Hybrid', icon: '🌍' }
  ];

  const changeMapLayer = (layerId) => {
    if (map && window.H) {
      const platform = new window.H.service.Platform({
        'apikey': HERE_API_KEY
      });
      const defaultLayers = platform.createDefaultLayers();

      let layer;
      switch (layerId) {
        case 'satellite':
          layer = defaultLayers.raster.satellite.map;
          break;
        case 'terrain':
          layer = defaultLayers.raster.terrain.map;
          break;
        case 'hybrid':
          layer = defaultLayers.raster.satellite.map;
          break;
        default:
          layer = defaultLayers.vector.normal.map;
      }

      map.setBaseLayer(layer);
    }
  };

  // Cleanup when modal closes
  useEffect(() => {
    return () => {
      if (map) {
        map.dispose();
        setMap(null);
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
            <MapPinIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                HERE MAPS
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                25K FREE/MONTH
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

          {/* Map Layer Selector */}
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {mapLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => changeMapLayer(layer.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap text-sm"
              >
                <span>{layer.icon}</span>
                {layer.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="p-6">
          {!mapLoaded ? (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading HERE Maps...</p>
                <p className="text-sm text-gray-500 mt-1">Enterprise-grade mapping</p>
              </div>
            </div>
          ) : (
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-gray-300"
              style={{ minHeight: '400px', backgroundColor: '#ccc' }}
            />
          )}

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-purple-800">Selected Location</h4>
                  <p className="text-sm text-purple-700 mt-1">{selectedLocation.address}</p>
                  <p className="text-xs text-purple-600 mt-1">
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
            Powered by HERE Maps • Enterprise-grade • 25,000 free requests/month
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
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HereMapsPicker;
