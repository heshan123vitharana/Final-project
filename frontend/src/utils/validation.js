import toast from 'react-hot-toast';

// Calculate password strength
const calculatePasswordStrength = (validations) => {
  const passed = Object.values(validations).filter(v => v).length;
  if (passed <= 2) return { level: 'weak', color: 'red', percentage: 33 };
  if (passed <= 3) return { level: 'medium', color: 'yellow', percentage: 66 };
  return { level: 'strong', color: 'green', percentage: 100 };
};

// Password validation utility
export const validatePassword = (password) => {
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const errors = [];
  if (!validations.length) errors.push('at least 8 characters');
  if (!validations.uppercase) errors.push('one uppercase letter (A-Z)');
  if (!validations.lowercase) errors.push('one lowercase letter (a-z)');
  if (!validations.number) errors.push('one number (0-9)');
  if (!validations.special) errors.push('one special character (!@#$%^&*)');

  return {
    isValid: errors.length === 0,
    message: errors.length > 0 ? `Password must contain ${errors.join(', ')}` : '',
    strength: calculatePasswordStrength(validations),
    validations
  };
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
    minLength: 8,
    message: 'Password must be at least 8 characters long',
    validate: (value) => {
      const validations = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };

      const errors = [];
      if (!validations.length) errors.push('at least 8 characters');
      if (!validations.uppercase) errors.push('one uppercase letter');
      if (!validations.lowercase) errors.push('one lowercase letter');
      if (!validations.number) errors.push('one number');
      if (!validations.special) errors.push('one special character');

      return {
        isValid: errors.length === 0,
        message: errors.length > 0 ? `Password must contain ${errors.join(', ')}` : '',
        strength: calculatePasswordStrength(validations)
      };
    }
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
    pattern: /^\+947[0-8]\d{7}$/,
    message: 'Please enter a valid Sri Lankan phone number in international format (+94771234567)'
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
  },
  nic: {
    required: true,
    pattern: /^([0-9]{9}[vVxX]|[0-9]{12})$/,
    message: 'Please enter a valid Sri Lankan NIC (e.g., 123456789V or 199012345678)'
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

  // Special password validation
  if (fieldName === 'password' && rule.validate) {
    return rule.validate(value);
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
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export const showInfoToast = (message) => {
  toast(message);
};

export const showWarningToast = (message) => {
  toast(message, {
    icon: '⚠️',
  });
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
