# 🆓 Free Advanced Maps Setup Guide

This guide will help you set up advanced mapping alternatives to Google Maps that are **completely free** or have generous free tiers.

## 🌟 Available Options (Ranked by Quality)

| Provider | Free Limit | Quality | Setup Time | Best For |
|----------|------------|---------|------------|----------|
| **Mapbox** | 50,000/month | ⭐⭐⭐⭐⭐ | 2 min | Google Maps replacement |
| **MapTiler** | 100,000/month | ⭐⭐⭐⭐ | 2 min | High usage applications |
| **HERE Maps** | 25,000/month | ⭐⭐⭐⭐⭐ | 3 min | Enterprise applications |
| **OpenStreetMap** | Unlimited | ⭐⭐⭐ | 0 min | No setup needed |
| **Manual Entry** | Unlimited | ⭐⭐ | 0 min | Offline applications |

---

## 🚀 Quick Setup Instructions

### 1. Mapbox (Recommended - Most Google Maps-like)

**Free Tier:** 50,000 map loads per month (more than enough for most apps)

1. **Go to:** [https://account.mapbox.com/auth/signup/](https://account.mapbox.com/auth/signup/)
2. **Sign up** with your email (no credit card required)
3. **Copy your access token** from the dashboard
4. **Add to your `.env` file:**
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV0dTJmIn0.your-token-here
   ```

**Features:**
- ✅ Satellite imagery
- ✅ 3D buildings
- ✅ Street-level detail
- ✅ Custom map styles
- ✅ Excellent geocoding

---

### 2. MapTiler (Best Free Limits)

**Free Tier:** 100,000 map loads per month (highest free limit)

1. **Go to:** [https://cloud.maptiler.com/register/](https://cloud.maptiler.com/register/)
2. **Sign up** with your email
3. **Go to:** Account → Keys
4. **Copy your API key**
5. **Add to your `.env` file:**
   ```env
   VITE_MAPTILER_API_KEY=your-key-here
   ```

**Features:**
- ✅ Multiple map styles
- ✅ High-quality tiles
- ✅ Good performance
- ✅ Generous free limits

---

### 3. HERE Maps (Enterprise Grade)

**Free Tier:** 25,000 requests per month

1. **Go to:** [https://developer.here.com/sign-up](https://developer.here.com/sign-up)
2. **Sign up** for a developer account
3. **Create a new project**
4. **Generate an API key**
5. **Add to your `.env` file:**
   ```env
   VITE_HERE_API_KEY=your-key-here
   ```

**Features:**
- ✅ Enterprise-grade quality
- ✅ Excellent geocoding
- ✅ Traffic data
- ✅ Indoor maps
- ✅ Nokia quality

---

### 4. OpenStreetMap (100% Free Forever)

**Free Tier:** Unlimited (no API key needed!)

**No setup required!** This option works immediately with no API key.

**Features:**
- ✅ Completely free
- ✅ No API limits
- ✅ No registration required
- ✅ Community-driven data

---

### 5. Manual Entry (Offline)

**Free Tier:** Unlimited (works offline)

**No setup required!** Simple text input with Sri Lankan city presets.

**Features:**
- ✅ Works offline
- ✅ No internet required
- ✅ City quick-select
- ✅ Coordinates support

---

## ⚙️ Environment Variables Setup

Create a `.env` file in your project root and add the API keys you want to use:

```env
# Mapbox (50K free/month)
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV0dTJmIn0.your-token

# MapTiler (100K free/month)
VITE_MAPTILER_API_KEY=your-maptiler-key-here

# HERE Maps (25K free/month)
VITE_HERE_API_KEY=your-here-key-here

# No keys needed for OpenStreetMap and Manual Entry!
```

## 🔄 How to Switch Between Providers

The system automatically detects which API keys you have and shows available options:

1. **Click the provider selector** in the map picker
2. **Choose your preferred provider** from the list
3. **The system remembers your choice** for future use

## 💡 Recommendations

### For Development/Testing:
- **OpenStreetMap**: No setup, unlimited usage

### For Small Applications:
- **Mapbox**: Best quality, 50K free requests
- **MapTiler**: Highest free limits (100K)

### For Enterprise Applications:
- **HERE Maps**: Professional grade, excellent geocoding

### For Offline Applications:
- **Manual Entry**: Works without internet

## 🔧 Implementation in Your Code

Update your `MillProfile.jsx` to use the advanced picker:

```jsx
import AdvancedMapPicker from '../components/AdvancedMapPicker';

// Replace the existing map picker with:
<AdvancedMapPicker
  isOpen={showAddressMap}
  onClose={() => setShowAddressMap(false)}
  onLocationSelect={handleAddressSelect}
  initialLocation={selectedAddressLocation}
  title="Select Address Location"
/>
```

## ❓ Troubleshooting

### "Map not loading"
1. Check your API key is correct
2. Verify the key is in your `.env` file
3. Restart your development server
4. Try OpenStreetMap option (no key required)

### "Geocoding not working"
1. Ensure API key has geocoding permissions
2. Check your monthly usage limits
3. Try a different provider

### "No search results"
1. Make sure you're searching for locations in Sri Lanka
2. Try broader search terms (e.g., "Colombo" instead of "123 Main St")
3. Use the manual entry option as backup

## 📊 Cost Comparison

| Provider | Google Maps | Our Free Options |
|----------|-------------|------------------|
| **Setup Cost** | Credit card required | No credit card needed |
| **Monthly Cost** | $7/1000 requests | $0 for thousands of requests |
| **Geocoding** | $5/1000 requests | Free with all providers |
| **Map Loads** | $7/1000 loads | Free (25K-100K per month) |
| **Annual Savings** | $0 | $840+ per year |

## 🎉 You're All Set!

Your application now has access to high-quality, free mapping alternatives that rival Google Maps in functionality while saving you money. Choose the provider that best fits your needs and enjoy unlimited location picking!

---

**Need Help?** Check the provider documentation:
- [Mapbox Docs](https://docs.mapbox.com/)
- [MapTiler Docs](https://docs.maptiler.com/)
- [HERE Docs](https://developer.here.com/documentation)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)