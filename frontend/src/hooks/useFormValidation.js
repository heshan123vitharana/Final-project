import { useMemo, useState, useCallback } from 'react'

/**
 * Custom hook for common form validations using TanStack Form
 * Provides reusable validation functions with consistent error messages
 */
export const useFormValidation = () => {
  
  const validators = useMemo(() => ({
    // Required field validation
    required: (fieldName = 'This field') => (value) => {
      if (!value || value.toString().trim() === '') {
        return `${fieldName} is required`
      }
      return undefined
    },

    // Email validation
    email: () => (value) => {
      if (!value) return 'Email is required'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
      return undefined
    },

    // Password validation with customizable requirements
    password: (minLength = 6, requirements = {}) => (value) => {
      if (!value) return 'Password is required'
      
      if (value.length < minLength) {
        return `Password must be at least ${minLength} characters long`
      }
      
      if (requirements.uppercase && !/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter'
      }
      
      if (requirements.lowercase && !/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter'
      }
      
      if (requirements.number && !/\d/.test(value)) {
        return 'Password must contain at least one number'
      }
      
      if (requirements.special && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return 'Password must contain at least one special character'
      }
      
      return undefined
    },

    // Confirm password validation
    confirmPassword: (originalPassword) => (value) => {
      if (!value) return 'Please confirm your password'
      if (value !== originalPassword) {
        return 'Passwords do not match'
      }
      return undefined
    },

    // Sri Lankan NIC validation
    nicSriLanka: () => (value) => {
      if (!value) return 'NIC number is required'
      // Sri Lankan NIC validation (old format: 9 digits + V/X, new format: 12 digits)
      const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/
      if (!nicRegex.test(value)) {
        return 'Please enter a valid NIC number (e.g., 921234567V or 199212345678)'
      }
      return undefined
    },

    // Phone number validation (Sri Lankan format)
    phoneSriLanka: () => (value) => {
      if (!value) return 'Contact number is required'
      
      // Remove spaces, dashes, and other formatting
      const cleanPhone = value.replace(/[\s\-()]/g, '')
      
      // Sri Lankan mobile number patterns:
      // Local format: 0XXXXXXXXX (10 digits, starts with 0)
      // International format: +94XXXXXXXXX (12 characters, starts with +94)
      // Valid mobile prefixes: 070, 071, 072, 074, 075, 076, 077, 078
      
      // Check for international format (+94XXXXXXXXX)
      if (cleanPhone.startsWith('+94')) {
        if (cleanPhone.length !== 12) {
          return 'International format should be 12 characters (+94XXXXXXXXX)'
        }
        const mobilePrefix = cleanPhone.substring(3, 6) // Get XXX after +94
        const validPrefixes = ['70', '71', '72', '74', '75', '76', '77', '78']
        if (!validPrefixes.includes(mobilePrefix)) {
          return 'Invalid mobile prefix. Use 70, 71, 72, 74, 75, 76, 77, or 78'
        }
        // Check if remaining digits are numbers
        if (!/^\+94[7][0-8][0-9]{7}$/.test(cleanPhone)) {
          return 'Please enter a valid Sri Lankan mobile number (+94XXXXXXXXX)'
        }
      }
      // Check for local format (0XXXXXXXXX)
      else if (cleanPhone.startsWith('0')) {
        if (cleanPhone.length !== 10) {
          return 'Local format should be 10 digits (0XXXXXXXXX)'
        }
        const mobilePrefix = cleanPhone.substring(1, 3) // Get XX after 0
        const validPrefixes = ['70', '71', '72', '74', '75', '76', '77', '78']
        if (!validPrefixes.includes(mobilePrefix)) {
          return 'Invalid mobile prefix. Use 070, 071, 072, 074, 075, 076, 077, or 078'
        }
        // Check if all characters after 0 are numbers
        if (!/^0[7][0-8][0-9]{7}$/.test(cleanPhone)) {
          return 'Please enter a valid Sri Lankan mobile number (0XXXXXXXXX)'
        }
      }
      // Check for format without country code or leading zero (XXXXXXXXX)
      else if (/^[7][0-8][0-9]{7}$/.test(cleanPhone) && cleanPhone.length === 9) {
        const mobilePrefix = cleanPhone.substring(0, 2) // Get XX from start
        const validPrefixes = ['70', '71', '72', '74', '75', '76', '77', '78']
        if (!validPrefixes.includes(mobilePrefix)) {
          return 'Invalid mobile prefix. Use 70, 71, 72, 74, 75, 76, 77, or 78'
        }
      }
      else {
        return 'Please enter a valid Sri Lankan mobile number (0771234567 or +94771234567)'
      }
      
      return undefined
    },

    // Phone number validation (Sri Lankan format - International ONLY)
    phoneSriLankaInternational: () => (value) => {
      if (!value) return 'Phone number is required'
      
      // Remove spaces, dashes, and other formatting
      const cleanPhone = value.replace(/[\s\-()]/g, '')
      
      // Only accept international format: +94XXXXXXXXX (12 characters total)
      if (!cleanPhone.startsWith('+94')) {
        return 'Please enter phone number in international format (+94XXXXXXXXX)'
      }
      
      if (cleanPhone.length !== 12) {
        return 'International format should be +94 followed by 9 digits (+94XXXXXXXXX)'
      }
      
      // Valid mobile prefixes for Sri Lankan numbers: 70-78
      const number = cleanPhone.slice(3) // Remove +94
      if (!/^7[0-8]\d{7}$/.test(number)) {
        return 'Invalid Sri Lankan mobile number format. Use +94 followed by 70-78 and 7 more digits'
      }
      
      return undefined
    },

    // Number validation with min/max
    number: (min = null, max = null, fieldName = 'This field') => (value) => {
      if (!value) return `${fieldName} is required`
      
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        return 'Please enter a valid number'
      }
      
      if (min !== null && numValue < min) {
        return `${fieldName} must be at least ${min}`
      }
      
      if (max !== null && numValue > max) {
        return `${fieldName} must not exceed ${max}`
      }
      
      return undefined
    },

    // Business registration number validation
    businessRegistration: () => (value) => {
      if (!value) return 'Business registration number is required'
      if (value.length < 5) {
        return 'Business registration number should be at least 5 characters'
      }
      // Add more specific validation as needed
      return undefined
    },

    // URL validation
    url: () => (value) => {
      if (!value) return undefined // Optional field
      try {
        new URL(value)
        return undefined
      } catch {
        return 'Please enter a valid URL'
      }
    },

    // Date validation (not in future, minimum age, etc.)
    date: (options = {}) => (value) => {
      if (!value) {
        return options.required ? 'Date is required' : undefined
      }
      
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return 'Please enter a valid date'
      }
      
      if (options.notFuture && date > new Date()) {
        return 'Date cannot be in the future'
      }
      
      if (options.minimumAge) {
        const minDate = new Date()
        minDate.setFullYear(minDate.getFullYear() - options.minimumAge)
        if (date > minDate) {
          return `Must be at least ${options.minimumAge} years old`
        }
      }
      
      return undefined
    },

    // File validation
    file: (options = {}) => (value) => {
      if (!value) {
        return options.required ? 'File is required' : undefined
      }
      
      if (options.maxSize && value.size > options.maxSize) {
        const maxSizeMB = Math.round(options.maxSize / (1024 * 1024) * 100) / 100
        return `File size must be less than ${maxSizeMB}MB`
      }
      
      if (options.allowedTypes && !options.allowedTypes.includes(value.type)) {
        return `File type must be one of: ${options.allowedTypes.join(', ')}`
      }
      
      return undefined
    },

    // Custom async validation (for checking if email/username exists)
    async: (validationFn, errorMessage = 'Validation failed') => async (value) => {
      if (!value) return undefined
      
      try {
        const isValid = await validationFn(value)
        return isValid ? undefined : errorMessage
      } catch {
        return 'Validation error occurred'
      }
    },

    // Multiple field validation (cross-field validation)
    conditional: (condition, validator) => (value, formState) => {
      if (condition(formState)) {
        return validator(value)
      }
      return undefined
    }
  }), [])

  // Helper function to combine multiple validators
  const combineValidators = (...validators) => (value, formState) => {
    for (const validator of validators) {
      const error = validator(value, formState)
      if (error) return error
    }
    return undefined
  }

  // Common validation combinations
  const commonValidations = useMemo(() => ({
    // Email field with required validation
    emailRequired: () => combineValidators(
      validators.required('Email'),
      validators.email()
    ),

    // Strong password validation
    strongPassword: () => combineValidators(
      validators.required('Password'),
      validators.password(8, {
        uppercase: true,
        lowercase: true,
        number: true,
        special: true
      })
    ),

    // Required phone number for Sri Lanka
    phoneRequired: () => combineValidators(
      validators.required('Phone number'),
      validators.phoneSriLanka()
    ),

    // Required NIC for Sri Lanka
    nicRequired: () => combineValidators(
      validators.required('NIC number'),
      validators.nicSriLanka()
    ),

    // Positive number validation
    positiveNumber: (fieldName = 'This field') => combineValidators(
      validators.required(fieldName),
      validators.number(0.01, null, fieldName)
    ),

    // Required file upload with size limit
    requiredFile: (maxSizeMB = 10) => combineValidators(
      validators.required('File'),
      validators.file({
        required: true,
        maxSize: maxSizeMB * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      })
    )
  }), [validators])

  return {
    validators,
    combineValidators,
    commonValidations
  }
}

/**
 * Hook for debounced validation (useful for async validations)
 */
export const useDebouncedValidation = (validationFn, delay = 500) => {
  const [timer, setTimer] = useState(null)
  
  return useCallback((value) => {
    if (timer) {
      clearTimeout(timer)
    }
    
    return new Promise((resolve) => {
      const newTimer = setTimeout(async () => {
        const result = await validationFn(value)
        resolve(result)
      }, delay)
      
      setTimer(newTimer)
    })
  }, [validationFn, delay, timer])
}

export default useFormValidation