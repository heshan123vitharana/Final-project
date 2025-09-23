# Google Maps Setup Instructions

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" and create an API key
5. (Optional) Restrict the API key to your domain for security

## 2. Configure Environment Variables

1. Create a `.env` file in the frontend folder:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
   ```

## 3. Restart Development Server

After adding the API key, restart your development server:
```bash
npm run dev
```

## 4. Features Added

- **Address Selection**: Users can click "Select Address from Map" to choose their address location
- **Mill Location Selection**: Users can click "Select Mill Location from Map" to choose their mill location
- **Interactive Map**: Click anywhere on the map to select a location
- **Current Location**: Button to use user's current GPS location
- **Address Geocoding**: Automatically converts coordinates to readable addresses
- **Form Integration**: Selected locations automatically fill the form fields

## 5. Troubleshooting

- If maps don't load, check that your API key is correct
- Make sure all required APIs are enabled in Google Cloud Console
- Check browser console for any error messages
- Ensure you're not hitting API quota limits