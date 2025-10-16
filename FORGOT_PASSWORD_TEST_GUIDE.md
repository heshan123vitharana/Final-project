# Quick Test Guide - Forgot Password Feature

## 🚀 How to Test

### Step 1: Start Servers

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Step 2: Test Forgot Password

1. **Open browser**: http://localhost:3001/auth

2. **Click**: "Forgot your password?" link (below password field)

3. **Enter email**: Use an existing mill owner email from your database
   - Example: If you registered as a mill owner, use that email

4. **Click**: "Send Reset Link" button

5. **Check success message**: Should say "Check Your Email"

### Step 3: Check Email

1. **Open Gmail**: Tashindudasanayake2@gmail.com

2. **Look for email**:
   - **Subject**: "Password Reset Request - Paddy Marketing Board"
   - **From**: Tashindudasanayake2@gmail.com
   - Check **Spam folder** if not in inbox

3. **Email should have**:
   - Green gradient header
   - Your name: "Hello [First Name] [Last Name]"
   - Big green "Reset Password" button
   - Alternative clickable link
   - "Expires in 10 minutes" warning

### Step 4: Reset Password

1. **Click**: "Reset Password" button in email

2. **Should open**: http://localhost:3001/reset-password?token=xxxxx

3. **Enter**:
   - New Password (minimum 6 characters)
   - Confirm Password (must match)

4. **Click**: "Reset Password" button

5. **Success message**: "Password reset successfully!"

### Step 5: Login with New Password

1. **Redirected to**: Login page

2. **Enter**:
   - Your email
   - Your new password

3. **Click**: "Sign in"

4. **Should**: Successfully log in to mill dashboard

## ✅ What Should Happen

### If Everything Works:
- ✅ Email arrives within seconds
- ✅ Reset link opens password form
- ✅ New password saves successfully
- ✅ Login works with new password

### Common Issues & Solutions:

**❌ Email not received?**
- Check spam folder
- Wait 1-2 minutes
- Check backend console for errors
- Verify email exists in database

**❌ "Token expired" error?**
- Tokens expire in 10 minutes
- Request new reset link
- Use it immediately

**❌ "Invalid token" error?**
- Token may have been used already
- Request new reset link
- Don't click link twice

**❌ Password reset fails?**
- Check password meets requirements (6+ characters)
- Ensure passwords match
- Check backend console for errors

## 🔍 Backend Console Logs

You should see:
```
📧 Forgot password request for: user@example.com
✅ Reset email sent successfully
```

## 📧 Email Example

**Subject**: Password Reset Request - Paddy Marketing Board

**Body**:
```
Hello John Doe,

We received a request to reset your password for your 
Paddy Marketing Board account.

[Reset Password Button]

If the button doesn't work, use this link:
http://localhost:3001/reset-password?token=abc123...

Important: This link expires in 10 minutes.

If you didn't request this, ignore this email.
```

## 🐛 Debugging

### Check if email exists in database:
```sql
SELECT id, email, first_name, last_name 
FROM users 
WHERE email = 'your@email.com';
```

### Check if reset token was created:
```sql
SELECT email, reset_token, reset_token_expires 
FROM users 
WHERE email = 'your@email.com';
```

### Clear old tokens:
```sql
UPDATE users 
SET reset_token = NULL, reset_token_expires = NULL 
WHERE reset_token IS NOT NULL;
```

## 🎯 Test Checklist

- [ ] Login page shows "Forgot your password?" link
- [ ] Clicking link opens forgot password page
- [ ] Entering email shows success message
- [ ] Email received in inbox (or spam)
- [ ] Email has reset button and link
- [ ] Clicking button opens reset password page
- [ ] Can enter new password
- [ ] Password confirmation works
- [ ] Password reset succeeds
- [ ] Can login with new password
- [ ] Old password no longer works

## 🎉 Success Indicators

1. **Email sent**: Backend logs show "✅ Reset email sent"
2. **Email received**: Inbox has professional looking email
3. **Token valid**: Reset page loads without errors
4. **Password changed**: "Success" message appears
5. **Login works**: Can access dashboard with new password

## 💡 Tips

- Use a real email address you can access
- Don't wait too long (10 minute expiry)
- Check spam folder first
- Keep backend console open to see errors
- Test with multiple accounts

---

**Ready to test?** Start the servers and follow Step 1! 🚀
