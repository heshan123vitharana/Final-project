# Paddy Management System - Setup Instructions

## Quick Start

### Option 1: Using the Batch Script (Windows)
1. Double-click `start-dev.bat` to start both servers automatically

### Option 2: Manual Setup
1. **Start Backend Server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend Server:**
   ```bash
   npm install
   npm run dev
   ```

## Access URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Features Completed

### Backend Features ✅
- User registration and authentication
- JWT token-based security
- SQLite database (automatically set up)
- Password hashing with bcrypt
- Admin authentication system
- RESTful API endpoints

### Frontend Features ✅
- Responsive authentication pages
- User registration form
- Login functionality
- Multi-language support (English, Sinhala, Tamil)
- Modern UI with Tailwind CSS
- Protected routes with middleware

### Available API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires JWT token)

#### Admin
- `POST /api/admin/login` - Admin login

## Authentication Flow

1. **Registration:** Users can register with business details
2. **Login:** Returns JWT token for authenticated requests
3. **Protected Routes:** Frontend validates tokens for accessing protected areas

## Database

The system uses SQLite by default for easy setup. The database file (`paddy_management.db`) is created automatically in the backend folder.

### Default Admin Credentials
- **Username:** admin01
- **Email:** admin@paddy.lk
- **Password:** admin123

## Environment Configuration

Backend environment variables (`.env`):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=paddy_management
PORT=5000
JWT_SECRET=My$ecretKey123!@#
JWT_EXPIRES_IN=24h
USE_SQLITE=true
```

## Troubleshooting

### Port Already in Use
If you get port errors:
- Backend (5000): Change `PORT` in `.env`
- Frontend (5173): Change port in `vite.config.js`

### Database Issues
- SQLite is used by default for easy setup
- Database file is created automatically
- No additional database setup required

### Dependencies
Make sure to run `npm install` in both the root directory and backend directory.

## Next Steps

The authentication system is fully functional. You can now:
1. Register new users through the frontend
2. Login with registered credentials
3. Access protected routes with JWT tokens
4. Extend the API with additional business logic
5. Customize the frontend for your specific needs

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, SQLite
- **Authentication:** JWT, bcrypt
- **Database:** SQLite (development), MySQL (production ready)