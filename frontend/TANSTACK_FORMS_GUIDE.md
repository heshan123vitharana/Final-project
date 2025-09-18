# TanStack Form Implementation Guide

This guide explains how to use the TanStack Form implementations in the Paddy Marketing Board application with comprehensive inline validations.

## Overview

We've implemented TanStack Form to provide:
- **Real-time validation** with immediate feedback
- **Inline error messages** with visual indicators
- **Custom validation hooks** for reusable validation logic
- **Multi-step form support** with step-by-step validation
- **Sri Lankan specific validations** (NIC, phone numbers, districts)

## Components Created

### 1. TanStackMillLogin.jsx
**Purpose**: Enhanced login form with email and password validation

**Features**:
- Email format validation
- Password length validation
- Real-time error feedback
- Visual error indicators

**Usage**:
```jsx
import TanStackMillLogin from './components/TanStackMillLogin'

<TanStackMillLogin
  onLoginSuccess={(user) => console.log('Logged in:', user)}
  onGoToSignUp={() => console.log('Go to signup')}
  onExit={() => console.log('Exit')}
/>
```

### 2. TanStackMillRegistration.jsx
**Purpose**: Multi-step registration form with progressive validation

**Features**:
- 3-step registration process
- Step-by-step validation gates
- NIC, phone, and business registration validation
- Progress bar with visual feedback

**Usage**:
```jsx
import TanStackMillRegistration from './components/TanStackMillRegistration'

<TanStackMillRegistration
  userData={initialUserData}
  onRegistrationComplete={(data) => console.log('Registration done:', data)}
  onBack={() => console.log('Back pressed')}
/>
```

### 3. TanStackProfileForm.jsx
**Purpose**: Comprehensive profile management form

**Features**:
- File upload with image preview
- Complex field validation
- Business information validation
- Address and location validation

**Usage**:
```jsx
import TanStackProfileForm from './components/TanStackProfileForm'

<TanStackProfileForm
  initialData={profileData}
  onSave={(formData) => console.log('Profile saved:', formData)}
  onCancel={() => console.log('Cancelled')}
/>
```

### 4. useFormValidation.js Hook
**Purpose**: Reusable validation functions for consistent form validation

**Key Validators**:
- `validators.required(fieldName)` - Required field validation
- `validators.email()` - Email format validation
- `validators.password(minLength, requirements)` - Password strength validation
- `validators.nicSriLanka()` - Sri Lankan NIC validation
- `validators.phoneSriLanka()` - Sri Lankan phone number validation
- `validators.businessRegistration()` - Business registration validation
- `validators.number(min, max, fieldName)` - Number range validation

**Usage**:
```jsx
import { useFormValidation } from '../hooks/useFormValidation'

const { validators, commonValidations } = useFormValidation()

// Use in TanStack Form field
<form.Field
  name="email"
  validators={{
    onChange: commonValidations.emailRequired(),
    onBlur: commonValidations.emailRequired(),
  }}
  children={(field) => (
    // Your input component
  )}
/>
```

## Common Validation Patterns

### 1. Required Field with Custom Message
```jsx
<form.Field
  name="businessName"
  validators={{
    onChange: validators.required('Business name'),
    onBlur: validators.required('Business name'),
  }}
  children={(field) => (
    <FormField field={field} label="Business Name" />
  )}
/>
```

### 2. Email Validation
```jsx
<form.Field
  name="email"
  validators={{
    onChange: commonValidations.emailRequired(),
    onBlur: commonValidations.emailRequired(),
  }}
  children={(field) => (
    <FormField field={field} label="Email Address" type="email" />
  )}
/>
```

### 3. Strong Password Validation
```jsx
<form.Field
  name="password"
  validators={{
    onChange: validators.password(8, {
      uppercase: true,
      lowercase: true,
      number: true,
      special: true
    }),
    onBlur: validators.password(8, {
      uppercase: true,
      lowercase: true,
      number: true,
      special: true
    }),
  }}
  children={(field) => (
    <FormField field={field} label="Password" type="password" />
  )}
/>
```

### 4. Sri Lankan NIC Validation
```jsx
<form.Field
  name="nicNumber"
  validators={{
    onChange: commonValidations.nicRequired(),
    onBlur: commonValidations.nicRequired(),
  }}
  children={(field) => (
    <FormField 
      field={field} 
      label="NIC Number" 
      placeholder="921234567V or 199212345678" 
    />
  )}
/>
```

### 5. Number with Range Validation
```jsx
<form.Field
  name="millCapacity"
  validators={{
    onChange: validators.number(1, 10000, 'Mill capacity'),
    onBlur: validators.number(1, 10000, 'Mill capacity'),
  }}
  children={(field) => (
    <FormField 
      field={field} 
      label="Mill Capacity (tons)" 
      type="number" 
    />
  )}
/>
```

## Custom FormField Component

The `FormField` component provides consistent styling and error handling:

```jsx
const FormField = ({ field, label, type = "text", placeholder = "", required = true, options = null }) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    
    {/* Input/Select/Textarea based on type */}
    <input
      type={type}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-lg ${
        field.state.meta.errors.length > 0
          ? 'border-red-300 bg-red-50'
          : 'border-gray-200 focus:ring-green-500'
      }`}
    />
    
    {/* Error Message */}
    {field.state.meta.errors.length > 0 && (
      <div className="text-red-600 text-xs flex items-center space-x-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>{field.state.meta.errors[0]}</span>
      </div>
    )}
  </div>
)
```

## Form Submission Pattern

```jsx
const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  },
  onSubmit: async ({ value }) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      })
      const result = await response.json()
      
      if (response.ok) {
        // Handle success
        onSuccess(result)
      } else {
        // Handle API errors
        handleApiError(result)
      }
    } catch (error) {
      // Handle network errors
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  },
})
```

## Form Subscribe for Dynamic UI

```jsx
<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
  children={([canSubmit, isSubmitting]) => (
    <button
      type="submit"
      disabled={!canSubmit || isSubmitting}
      className="btn-primary"
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  )}
/>
```

## Benefits of This Implementation

1. **Real-time Feedback**: Users get immediate validation feedback
2. **Consistent UX**: All forms follow the same validation patterns
3. **Reusable Code**: Validation logic is centralized and reusable
4. **Type Safety**: Better type inference with TanStack Form
5. **Performance**: Optimized re-renders with fine-grained subscriptions
6. **Accessibility**: Proper error announcements and form labeling
7. **Sri Lankan Context**: Validations tailored for local requirements

## Testing the Implementation

Use the `TanStackFormDemo` component to test all form implementations:

```jsx
import TanStackFormDemo from './components/TanStackFormDemo'

// In your app
<TanStackFormDemo />
```

This provides a complete demonstration of all form features with easy switching between different form types.

## Migration from Old Forms

To migrate existing forms:

1. Install TanStack Form: `npm install @tanstack/react-form`
2. Replace form state management with `useForm`
3. Convert input fields to `form.Field` components
4. Apply appropriate validators from `useFormValidation`
5. Use `FormField` component for consistent styling
6. Test validation behavior thoroughly

The new implementation provides a much better user experience with immediate feedback and consistent validation patterns across the entire application.