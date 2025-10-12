import React, { useState, useCallback, useEffect } from 'react';
import { MapPinIcon, XMarkIcon, MapIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

// Free OpenStreetMap-based location picker component
const FreeMapPicker = ({ isOpen, onClose, onLocationSelect, initialLocation, title = "Select Location" }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 7.8731, lng: 80.7718 }); // Default to Sri Lanka
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Load Leaflet dynamically when modal opens
  useEffect(() => {
    if (isOpen && !mapLoaded) {
      // Load Leaflet CSS and JS
      const loadLeaflet = async () => {
        // Check if Leaflet is already loaded
        if (window.L) {
          setMapLoaded(true);
          return;
        }

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      };

      loadLeaflet();
    }
  }, [isOpen, mapLoaded]);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (isOpen && mapLoaded && window.L && !map) {
      const mapContainer = document.getElementById('leaflet-map');
      if (mapContainer) {
        const newMap = window.L.map('leaflet-map').setView(
          [initialLocation?.lat || currentLocation.lat, initialLocation?.lng || currentLocation.lng],
          13
        );

        // Add OpenStreetMap tiles (completely free)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(newMap);

        // Add click handler
        newMap.on('click', async (e) => {
          const { lat, lng } = e.latlng;

          // Get address using free Nominatim API
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

            handleLocationSelect({ lat, lng, address });
          } catch (error) {
            console.error('Geocoding error:', error);
            handleLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
          }
        });

        setMap(newMap);

        // Set initial location if provided
        if (initialLocation) {
          setSelectedLocation(initialLocation);
        }
      }
    }
  }, [isOpen, mapLoaded, map, initialLocation, currentLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update marker when selected location changes
  useEffect(() => {
    if (map && selectedLocation) {
      // Remove existing marker
      if (marker) {
        map.removeLayer(marker);
      }

      // Add new marker
      const newMarker = window.L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(map)
        .bindPopup(selectedLocation.address || 'Selected Location');

      setMarker(newMarker);
      map.setView([selectedLocation.lat, selectedLocation.lng], 13);
    }
  }, [map, selectedLocation, marker]);

  // Get user's current location
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, [isOpen]);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) {
      console.log('✅ Confirming location selection:', selectedLocation);
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  // Auto-confirm when location is selected (optional - can be enabled)
  const autoConfirm = false; // Set to true for instant selection

  useEffect(() => {
    if (autoConfirm && selectedLocation && selectedLocation !== initialLocation) {
      console.log('🚀 Auto-confirming location selection:', selectedLocation);
      setTimeout(() => {
        onLocationSelect(selectedLocation);
        onClose();
      }, 1000); // Small delay to show selection
    }
  }, [selectedLocation, autoConfirm, initialLocation, onLocationSelect, onClose]);

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Get address for current location using free Nominatim API
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&addressdetails=1`
            );
            const data = await response.json();
            const addressLocation = {
              ...location,
              address: data.display_name || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
            };
            setSelectedLocation(addressLocation);

            // Center map on current location
            if (map) {
              map.setView([location.lat, location.lng], 15);
            }
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

  // Manual address search using free Nominatim API
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=lk&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const location = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name
        };
        setSelectedLocation(location);

        // Center map on search result
        if (map) {
          map.setView([location.lat, location.lng], 15);
        }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              FREE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a location (e.g., 'Colombo', 'Galle Road')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleCurrentLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Current Location
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              Click on the map to select a location • Powered by OpenStreetMap (Free)
            </p>
          </div>

          {!mapLoaded ? (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading free map...</p>
              </div>
            </div>
          ) : (
            <div id="leaflet-map" className="w-full h-96 rounded-lg border border-gray-300"></div>
          )}

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">✅ Location Selected</h4>
                  <p className="text-sm text-green-700 mt-1">{selectedLocation.address}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    👇 Click "Confirm Location" below to add this to your profile
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className={`px-6 py-2 rounded-lg transition-all duration-200 ${
              selectedLocation
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg animate-bounce'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedLocation ? '✅ Confirm Location' : 'Select a Location First'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeMapPicker;
