import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Google Maps API Key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

// Google Map component
const GoogleMap = ({ center, zoom, onLocationSelect, selectedLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(newMap);

      // Add click listener to map
      newMap.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        // Use geocoding to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            onLocationSelect({ lat, lng, address });
          } else {
            onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
          }
        });
      });
    }
  }, [mapRef, map, center, zoom, onLocationSelect]);

  // Update marker when selected location changes
  useEffect(() => {
    if (map && selectedLocation) {
      if (marker) {
        marker.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        map: map,
        title: 'Selected Location',
        animation: window.google.maps.Animation.DROP,
      });

      setMarker(newMarker);
      map.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    }
  }, [map, selectedLocation, marker]);

  return <div ref={mapRef} className="w-full h-96 rounded-lg" />;
};

// Map picker component with modal
const GoogleMapPicker = ({ isOpen, onClose, onLocationSelect, initialLocation, title = "Select Location" }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 7.8731, lng: 80.7718 }); // Default to Sri Lanka

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
          // Keep default location (Sri Lanka)
        }
      );
    }
  }, [isOpen]);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Get address for current location
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const addressLocation = {
                ...location,
                address: results[0].formatted_address
              };
              setSelectedLocation(addressLocation);
            } else {
              setSelectedLocation({
                ...location,
                address: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
              });
            }
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
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
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Map Container */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Click on the map to select a location
            </p>
            <button
              onClick={handleCurrentLocation}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Use Current Location
            </button>
          </div>

          <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={(status) => {
            if (status === 'LOADING') {
              return (
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              );
            }
            if (status === 'FAILURE') {
              return (
                <div className="w-full h-96 bg-red-50 rounded-lg flex items-center justify-center">
                  <p className="text-red-600">Failed to load Google Maps</p>
                </div>
              );
            }
            return null;
          }}>
            <GoogleMap
              center={initialLocation || currentLocation}
              zoom={13}
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
          </Wrapper>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">Selected Location</h4>
                  <p className="text-sm text-green-700 mt-1">{selectedLocation.address}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapPicker;
