const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock profile completeness endpoint
app.get('/api/licenses/profile-check/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Mock user data with incomplete profile to test real data
  const mockUser = {
    id: parseInt(userId),
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@mill.lk',
    phone: '0771234567',
    business_name: '', // Missing business name
    business_type: '', // Missing business type
    has_photo: 0 // Missing photo
  };
  
  // Calculate completeness (same logic as backend)
  const profileFields = [
    mockUser.first_name, mockUser.last_name, mockUser.email, mockUser.phone,
    mockUser.business_name, mockUser.business_type
  ];
  const filledFields = profileFields.filter(field => field && field.toString().trim() !== '').length;
  const completeness = Math.round(((filledFields + (mockUser.has_photo ? 1 : 0)) / (profileFields.length + 1)) * 100);
  
  // Get missing fields
  const missingFields = [];
  if (!mockUser.first_name) missingFields.push('First Name');
  if (!mockUser.last_name) missingFields.push('Last Name');
  if (!mockUser.email) missingFields.push('Email');
  if (!mockUser.phone) missingFields.push('Phone');
  if (!mockUser.business_name) missingFields.push('Business Name');
  if (!mockUser.business_type) missingFields.push('Business Type');
  if (!mockUser.has_photo) missingFields.push('Profile Photo');
  
  console.log(`📊 Mock API: User ${userId} completeness: ${completeness}%`);
  console.log(`🔍 Mock API: Missing fields:`, missingFields);
  
  res.status(200).json({
    message: 'Profile completeness checked',
    user: {
      id: mockUser.id,
      firstName: mockUser.first_name,
      lastName: mockUser.last_name,
      email: mockUser.email,
      phone: mockUser.phone,
      businessName: mockUser.business_name,
      businessType: mockUser.business_type,
      hasPhoto: !!mockUser.has_photo,
      createdAt: new Date().toISOString()
    },
    completeness,
    canApplyForLicense: completeness === 100,
    missingFields
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Mock server running on http://localhost:${PORT}`);
  console.log(`📊 Profile completeness endpoint: GET /api/licenses/profile-check/:userId`);
});