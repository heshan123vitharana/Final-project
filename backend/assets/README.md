# Assets Folder

## Logo Setup Instructions

To enable the logo in newsletter emails:

1. **Find your logo file** (e.g., `logo.png`)
2. **Rename it to:** `pmb-logo.png`
3. **Copy it to this folder:** `backend/assets/pmb-logo.png`

The newsletter system will automatically include this logo in welcome emails.

### Supported Formats:
- PNG (recommended)
- JPG/JPEG
- Recommended size: 150-200px width

### Current Location:
Your frontend logo is likely at: `frontend/public/logo.png`

**Copy command (run from backend folder):**
```bash
cp ../frontend/public/logo.png ./assets/pmb-logo.png
```

Or on Windows:
```cmd
copy ..\frontend\public\logo.png assets\pmb-logo.png
```
