// frontend/src/utils/constants.js

/**
 * Constants for Service Types.
 * This includes different kinds of services or achievements the company offers or has.
 * Each type has a value for the database, a label for display, and an icon.
 */
export const SERVICE_TYPES = [
  { value: 'service', label: 'Service', icon: '🏢' },
  { value: 'excellence', label: 'Excellence', icon: '🏆' },
  { value: 'achievement', label: 'Achievement', icon: '🎯' },
  { value: 'certification', label: 'Certification', icon: '📜' },
];

/**
 * A list of available icons for services and other items.
 * Using a predefined list of emojis ensures consistency in the UI.
 */
export const ICON_OPTIONS = [
  '🏢', '🏭', '🌾', '🚛', '⚖️', '🔬', '📊', '💼',
  '🏆', '🥇', '⭐', '💎', '🎯', '📈', '✅', '🔒',
  '📜', '🎖️', '🏅', '🌟', '💯', '📋', '🛡️', '🎪',
];
