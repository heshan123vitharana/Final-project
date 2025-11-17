// frontend/src/components/admin/ImageGalleryManager.jsx
import { useState } from 'react';
import { ImageIcon, Folder, Award, Users } from 'lucide-react';

// Import the new content components
import ImageGalleryContent from './image-gallery/images/ImageGalleryContent';
import CategoryManagementContent from './image-gallery/category/CategoryManagementContent';
import ServicesExcellenceContent from './image-gallery/services/ServicesExcellenceContent';
import LeadershipManagementContent from './image-gallery/leadership/LeadershipManagementContent';

/**
 * The main container for the gallery and content management sections.
 * It uses tabs to switch between different management areas like Images,
 * Categories, Services, and Leadership.
 */
const ImageGalleryManager = () => {
  // State to keep track of the currently active tab. 'images' is the default.
  const [activeTab, setActiveTab] = useState('images');

  // Configuration for the tabs. Each object defines an ID, a label for the UI,
  // and an icon component.
  const tabs = [
    { id: 'images', label: 'Image Gallery', icon: ImageIcon },
    { id: 'categories', label: 'Categories', icon: Folder },
    { id: 'services', label: 'Services & Excellence', icon: Award },
    { id: 'leadership', label: 'Leadership', icon: Users },
  ];

  /**
   * Renders the content for the currently active tab.
   * This function acts as a router to display the correct component.
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'images':
        return <ImageGalleryContent />;
      case 'categories':
        return <CategoryManagementContent />;
      case 'services':
        return <ServicesExcellenceContent />;
      case 'leadership':
        return <LeadershipManagementContent />;
      default:
        // By default, show the image gallery if the tab is unknown.
        return <ImageGalleryContent />;
    }
  };

  return (
    <div className="space-y-6">
      {/* This container holds the tab navigation and the content area. */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tab Navigation Bar */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              // Determine if the current tab is active to apply different styles.
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    isActive
                      ? 'border-green-500 text-green-600' // Active tab style
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab style
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Area */}
        <div className="p-6">
          {/* Render the component that corresponds to the active tab. */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryManager;
