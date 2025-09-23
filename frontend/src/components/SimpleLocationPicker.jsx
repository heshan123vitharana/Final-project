import React, { useState, useEffect } from 'react';
import { MapPinIcon, XMarkIcon, GlobeAltIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

// Simple location picker without map - just coordinates and manual input
const SimpleLocationPicker = ({ isOpen, onClose, onLocationSelect, initialLocation, title = "Enter Location" }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [manualInput, setManualInput] = useState({
    address: initialLocation?.address || '',
    lat: initialLocation?.lat || '',
    lng: initialLocation?.lng || ''
  });

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setManualInput({
        address: initialLocation.address || '',
        lat: initialLocation.lat || '',
        lng: initialLocation.lng || ''
      });
    }
  }, [initialLocation]);

  const handleManualInputChange = (field, value) => {
    setManualInput(prev => ({ ...prev, [field]: value }));
  };

  const handleSetLocation = () => {
    const { address, lat, lng } = manualInput;

    if (!address.trim()) {
      alert('Please enter an address');
      return;
    }

    let location = { address: address.trim() };

    // If coordinates are provided, validate and use them
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);

      if (isNaN(latNum) || isNaN(lngNum)) {
        alert('Please enter valid coordinates (numbers only)');
        return;
      }

      if (latNum < -90 || latNum > 90) {
        alert('Latitude must be between -90 and 90');
        return;
      }

      if (lngNum < -180 || lngNum > 180) {
        alert('Longitude must be between -180 and 180');
        return;
      }

      location.lat = latNum;
      location.lng = lngNum;
    } else {
      // If no coordinates, set Sri Lanka center as default
      location.lat = 7.8731;
      location.lng = 80.7718;
    }

    setSelectedLocation(location);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          };

          setSelectedLocation(location);
          setManualInput({
            address: location.address,
            lat: location.lat.toString(),
            lng: location.lng.toString()
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  // Predefined Sri Lankan locations
  const sriLankanLocations = [
    { name: 'Colombo', lat: 6.9271, lng: 79.8612, address: 'Colombo, Sri Lanka' },
    { name: 'Kandy', lat: 7.2906, lng: 80.6337, address: 'Kandy, Sri Lanka' },
    { name: 'Galle', lat: 6.0535, lng: 80.2210, address: 'Galle, Sri Lanka' },
    { name: 'Jaffna', lat: 9.6615, lng: 80.0255, address: 'Jaffna, Sri Lanka' },
    { name: 'Negombo', lat: 7.2085, lng: 79.8358, address: 'Negombo, Sri Lanka' },
    { name: 'Anuradhapura', lat: 8.3114, lng: 80.4037, address: 'Anuradhapura, Sri Lanka' },
    { name: 'Trincomalee', lat: 8.5874, lng: 81.2152, address: 'Trincomalee, Sri Lanka' },
    { name: 'Batticaloa', lat: 7.7102, lng: 81.6924, address: 'Batticaloa, Sri Lanka' }
  ];

  const handleQuickSelect = (location) => {
    setSelectedLocation(location);
    setManualInput({
      address: location.address,
      lat: location.lat.toString(),
      lng: location.lng.toString()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              SIMPLE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Manual Input */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5" />
              Enter Location Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address / Location Description *
              </label>
              <textarea
                value={manualInput.address}
                onChange={(e) => handleManualInputChange('address', e.target.value)}
                placeholder="Enter full address (e.g., No. 123, Galle Road, Colombo 03)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualInput.lat}
                  onChange={(e) => handleManualInputChange('lat', e.target.value)}
                  placeholder="7.8731"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualInput.lng}
                  onChange={(e) => handleManualInputChange('lng', e.target.value)}
                  placeholder="80.7718"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSetLocation}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Set Location
              </button>
              <button
                onClick={handleGetCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <CursorArrowRaysIcon className="h-4 w-4" />
                Use Current
              </button>
            </div>
          </div>

          {/* Quick Select for Sri Lankan Cities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Select (Sri Lankan Cities)</h3>
            <div className="grid grid-cols-2 gap-2">
              {sriLankanLocations.map((location) => (
                <button
                  key={location.name}
                  onClick={() => handleQuickSelect(location)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <div className="font-medium text-gray-800">{location.name}</div>
                  <div className="text-sm text-gray-600">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Location Preview */}
          {selectedLocation && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">✅ Location Set</h4>
                  <p className="text-sm text-green-700 mt-1">{selectedLocation.address}</p>
                  {selectedLocation.lat && selectedLocation.lng && (
                    <p className="text-xs text-green-600 mt-1">
                      Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  )}
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
            {selectedLocation ? '✅ Confirm Location' : 'Enter a Location First'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleLocationPicker;