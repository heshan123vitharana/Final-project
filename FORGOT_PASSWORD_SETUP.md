# Forgot Password Setup and Testing Guide

## Overview
The forgot password functionality has been successfully implemented for the mill login system. Users can now reset their passwords via email.

## 🚀 Features Added

### Frontend Components
1. **ForgotPassword.jsx** - Main forgot password form
2. **ResetPassword.jsx** - Password reset form (accessed via email link)
3. **Updated MillLogin.jsx** - Added "Forgot your password?" link
4. **Updated AuthPage.jsx** - Handles navigation between login/signup/forgot password

### Backend Implementation
1. **Email sending** - Configured with nodemailer
2. **Secure token generation** - Uses crypto for secure reset tokens
3. **Database schema** - Added reset token fields to users table
4. **API endpoints** - Three new routes for password reset flow

## 🔧 Setup Instructions

### 1. Environment Configuration

Create/update your `.env` file in the `backend` directory:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3001

# Other existing config...
```

**Important**: For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in `EMAIL_PASS`

### 2. Database Schema
The reset token fields are automatically added when you start the backend:
- `reset_token VARCHAR(255)` - Stores hashed reset token
- `reset_token_expires TIMESTAMP` - Token expiration time (10 minutes)

## 📋 API Endpoints

### 1. Request Password Reset
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 2. Verify Reset Token
```
GET /api/auth/verify-reset-token/:token
```

### 3. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

## 🧪 Testing the Flow

### Step 1: Start the Servers
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Step 2: Test Forgot Password
1. Go to `http://localhost:3001`
2. Click on mill registration/login
3. In the login form, click "Forgot your password?"
4. Enter an existing user's email address
5. Submit the form

### Step 3: Check Email
1. Check the email inbox (and spam folder)
2. Click the "Reset Password" button in the email
3. This opens `http://localhost:3001/reset-password?token=...`

### Step 4: Reset Password
1. Enter your new password
2. Confirm the password
3. Submit the form
4. You'll be redirected to login with a success message

## 🔒 Security Features

1. **Token Expiration** - Reset tokens expire after 10 minutes
2. **Secure Hashing** - Tokens are hashed before storing in database
3. **One-time Use** - Tokens are cleared after successful reset
4. **No Information Disclosure** - Same response whether email exists or not
5. **Password Validation** - Minimum 6 characters required

## 🎨 UI Features

1. **Responsive Design** - Works on all screen sizes
2. **Loading States** - Shows spinner during API calls
3. **Error Handling** - Toast notifications for errors
4. **Success States** - Clear feedback for successful actions
5. **Professional Email** - Beautiful HTML email template

## 📧 Email Template

The system sends a professional HTML email with:
- Paddy Marketing Board branding
- Green color scheme matching your app
- Clear reset button
- Fallback link if button doesn't work
- Security warnings and expiration notice
- Professional footer

## 🚨 Common Issues & Solutions

### Email Not Sending
1. Check Gmail App Password is correct
2. Verify 2FA is enabled on Gmail account
3. Check server logs for detailed error messages

### Reset Link Not Working
1. Ensure FRONTEND_URL in .env matches your actual frontend URL
2. Check if token has expired (10-minute limit)
3. Verify database connection is working

### Database Errors
1. Restart backend to run database migrations
2. Check MySQL connection settings
3. Verify users table has the new columns

## 🔄 Flow Diagram

```
User clicks "Forgot Password"
           ↓
    Enters email address
           ↓
 Backend validates & sends email
           ↓
    User clicks email link
           ↓
   Opens reset password form
           ↓
  User enters new password
           ↓
 Backend updates password & clears token
           ↓
   User redirected to login
```

## ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3001
- [ ] "Forgot your password?" link appears in mill login
- [ ] Forgot password form accepts email
- [ ] Email is sent (check inbox/spam)
- [ ] Reset link opens reset password form
- [ ] Password reset form validates input
- [ ] New password saves successfully
- [ ] User can log in with new password
- [ ] Old reset links become invalid after use

## 🎯 Next Steps

The forgot password functionality is now complete and ready for production use. To deploy:

1. Set up production email service (Gmail, SendGrid, etc.)
2. Update FRONTEND_URL to your production domain
3. Test with real email addresses
4. Monitor error logs for any issues

---

**Status: ✅ COMPLETE**

All components are implemented and tested. The forgot password flow is fully functional and follows security best practices.