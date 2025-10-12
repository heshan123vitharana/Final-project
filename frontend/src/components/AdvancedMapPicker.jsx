import React, { useState } from 'react';
import { MapPinIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import MapboxPicker from './MapboxPicker';
import HereMapsPicker from './HereMapsPicker';
import MapTilerPicker from './MapTilerPicker';
import FreeMapPicker from './FreeMapPicker';
import SimpleLocationPicker from './SimpleLocationPicker';

// Unified advanced map picker with multiple provider options
const AdvancedMapPicker = ({ onClose, onLocationSelect, initialLocation, title = "Select Location" }) => {
  const [selectedProvider, setSelectedProvider] = useState('mapbox'); // Default to Mapbox
  const [showProviderSelect, setShowProviderSelect] = useState(false);

  // Available map providers
  const mapProviders = [
    {
      id: 'mapbox',
      name: 'Mapbox',
      description: 'Google Maps-like quality with satellite imagery',
      icon: '🗺️',
      color: 'blue',
      freeLimit: '50,000/month',
      features: ['Satellite View', '3D Buildings', 'Street Level', 'Custom Styling'],
      component: MapboxPicker
    },
    {
      id: 'here',
      name: 'HERE Maps',
      description: 'Enterprise-grade mapping with excellent geocoding',
      icon: '🌍',
      color: 'purple',
      freeLimit: '25,000/month',
      features: ['Traffic Data', 'Indoor Maps', 'Enterprise Grade', 'Nokia Quality'],
      component: HereMapsPicker
    },
    {
      id: 'maptiler',
      name: 'MapTiler',
      description: 'High-quality tiles with generous free limits',
      icon: '🗻',
      color: 'emerald',
      freeLimit: '100,000/month',
      features: ['Multiple Styles', 'High Performance', 'Generous Limits', 'Good Quality'],
      component: MapTilerPicker
    },
    {
      id: 'openstreetmap',
      name: 'OpenStreetMap',
      description: 'Completely free with no limits',
      icon: '🌐',
      color: 'green',
      freeLimit: 'Unlimited',
      features: ['No API Key', 'No Limits', 'Community Driven', '100% Free'],
      component: FreeMapPicker
    },
    {
      id: 'simple',
      name: 'Manual Entry',
      description: 'Simple text input with city presets',
      icon: '✏️',
      color: 'gray',
      freeLimit: 'Offline',
      features: ['Works Offline', 'City Presets', 'No Internet Required', 'Simple Interface'],
      component: SimpleLocationPicker
    }
  ];

  const currentProvider = mapProviders.find(p => p.id === selectedProvider);
  const SelectedComponent = currentProvider?.component;

  // Provider selection modal
  if (showProviderSelect) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Choose Map Provider</h2>
            </div>
            <button
              onClick={() => setShowProviderSelect(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Provider Options */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Choose your preferred mapping provider. All options are free with different features and limits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mapProviders.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => {
                    setSelectedProvider(provider.id);
                    setShowProviderSelect(false);
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedProvider === provider.id
                      ? `border-${provider.color}-500 bg-${provider.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{provider.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{provider.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full bg-${provider.color}-100 text-${provider.color}-800`}>
                          {provider.freeLimit}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">💡 Recommendations:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Mapbox:</strong> Best for Google Maps-like experience with satellite views</li>
                <li><strong>MapTiler:</strong> Best free limits (100K/month) with good quality</li>
                <li><strong>HERE Maps:</strong> Best for enterprise applications with traffic data</li>
                <li><strong>OpenStreetMap:</strong> Best for unlimited usage with no API key needed</li>
                <li><strong>Manual Entry:</strong> Best for offline usage or simple address input</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Selected: <strong>{currentProvider?.name}</strong>
            </div>
            <button
              onClick={() => setShowProviderSelect(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue with {currentProvider?.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main map picker with provider switcher
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Enhanced Header with Provider Switcher */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Provider Switcher */}
            <button
              onClick={() => setShowProviderSelect(true)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm`}
            >
              <span className="text-lg">{currentProvider?.icon}</span>
              <span className="font-medium">{currentProvider?.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full bg-${currentProvider?.color}-100 text-${currentProvider?.color}-800`}>
                {currentProvider?.freeLimit}
              </span>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Map Provider Info */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium text-gray-800">{currentProvider?.name}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{currentProvider?.description}</span>
            </div>
            <button
              onClick={() => setShowProviderSelect(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Change Provider
            </button>
          </div>
        </div>

        {/* Render Selected Provider Component */}
        <div className="relative">
          {SelectedComponent && (
            <SelectedComponent
              isOpen={true} // Always open since we're managing the modal state here
              onClose={onClose}
              onLocationSelect={onLocationSelect}
              initialLocation={initialLocation}
              title={title}
              // Override the modal wrapper since we're already in one
              renderAsChild={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedMapPicker;
