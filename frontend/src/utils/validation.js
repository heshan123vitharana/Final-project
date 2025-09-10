import { toast } from 'react-toastify';

// Toast configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters long'
  },
  firstName: {
    required: true,
    minLength: 2,
    message: 'First name must be at least 2 characters long'
  },
  lastName: {
    required: true,
    minLength: 2,
    message: 'Last name must be at least 2 characters long'
  },
  phoneNumber: {
    required: true,
    pattern: /^[+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  businessName: {
    required: true,
    minLength: 2,
    message: 'Business name must be at least 2 characters long'
  },
  businessType: {
    required: true,
    message: 'Please select a business type'
  },
  confirmPassword: {
    required: true,
    message: 'Please confirm your password'
  }
};

// Individual field validators
export const validateField = (fieldName, value, additionalData = {}) => {
  const rule = validationRules[fieldName];
  if (!rule) return { isValid: true };

  // Required validation
  if (rule.required && (!value || value.toString().trim() === '')) {
    return {
      isValid: false,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: true };
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return {
      isValid: false,
      message: rule.message
    };
  }

  // Min length validation
  if (rule.minLength && value.length < rule.minLength) {
    return {
      isValid: false,
      message: rule.message
    };
  }

  // Special validation for confirmPassword
  if (fieldName === 'confirmPassword') {
    if (value !== additionalData.password) {
      return {
        isValid: false,
        message: 'Passwords do not match'
      };
    }
  }

  return { isValid: true };
};

// Form validator
export const validateForm = (formData, requiredFields) => {
  const errors = {};
  let isFormValid = true;

  requiredFields.forEach(fieldName => {
    const validation = validateField(fieldName, formData[fieldName], formData);
    if (!validation.isValid) {
      errors[fieldName] = validation.message;
      isFormValid = false;
    }
  });

  return { isValid: isFormValid, errors };
};

// Toast notification helpers
export const showSuccessToast = (message) => {
  toast.success(message, toastConfig);
};

export const showErrorToast = (message) => {
  toast.error(message, toastConfig);
};

export const showInfoToast = (message) => {
  toast.info(message, toastConfig);
};

export const showWarningToast = (message) => {
  toast.warn(message, toastConfig);
};

// Form validation with toast notifications
export const validateFormWithToast = (formData, requiredFields) => {
  const { isValid, errors } = validateForm(formData, requiredFields);
  
  if (!isValid) {
    // Show the first error in a toast
    const firstError = Object.values(errors)[0];
    showErrorToast(firstError);
  }
  
  return { isValid, errors };
};

// API error handler with toast
export const handleApiError = (error, result) => {
  if (result?.errors) {
    // Handle array of errors
    if (Array.isArray(result.errors)) {
      result.errors.forEach(err => showErrorToast(err));
    } else {
      showErrorToast(result.errors);
    }
  } else if (result?.message) {
    showErrorToast(result.message);
  } else if (error?.message) {
    showErrorToast(error.message);
  } else {
    showErrorToast('An unexpected error occurred. Please try again.');
  }
};

// Network error handler
export const handleNetworkError = () => {
  showErrorToast('Network error. Please check your connection and try again.');
};

// Success handlers
export const handleLoginSuccess = (userType = 'User') => {
  showSuccessToast(`Welcome back! ${userType} login successful.`);
};

export const handleRegistrationSuccess = () => {
  showSuccessToast('Account created successfully! Welcome to our platform.');
};

export const handleLogoutSuccess = (userType = 'User') => {
  showSuccessToast(`${userType} logged out successfully. See you next time!`);
};