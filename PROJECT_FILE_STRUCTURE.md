# Paddy Management System - Complete File Structure

## Project Overview
This is a full-stack web application for paddy management with React.js frontend and Node.js/Express backend using MySQL database.

---

## 📁 Root Directory Structure

```
Final-project/
├── 📄 Configuration Files
│   ├── package.json              # Frontend dependencies and scripts
│   ├── package-lock.json         # Frontend dependency lock
│   ├── vite.config.js           # Vite build configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── eslint.config.js         # ESLint configuration
│   └── index.html               # Main HTML template
│
├── 📄 Documentation
│   ├── README.md                # Project overview and setup
│   ├── PROJECT_PLAN.md          # Project planning document
│   ├── SETUP_INSTRUCTIONS.md    # Setup and installation guide
│   ├── REFACTORING_SUMMARY.md   # Code refactoring history
│   ├── MILL_REGISTRATION_FEATURE.md # Mill registration feature docs
│   └── PROJECT_FILE_STRUCTURE.md # This file
│
├── 📄 Development Scripts
│   └── start-dev.bat            # Windows batch file to start dev servers
│
├── 🔧 Backend/                  # Node.js/Express API server
├── 🎨 Frontend/                 # React.js application
└── 📦 node_modules/             # Frontend dependencies
```

---

## 🔧 Backend Structure (`backend/`)

### Main Files
```
backend/
├── server.js                    # Express server entry point
├── database.js                  # Database connection manager (MySQL/SQLite)
├── database-sqlite.js           # SQLite specific implementation
├── setupDatabase.js             # Database initialization script
├── package.json                 # Backend dependencies and scripts
├── package-lock.json            # Backend dependency lock
├── paddy_management.db          # SQLite database file (if using SQLite)
└── .env                         # Environment variables (DB config, JWT secrets)
```

### Directory Structure
```
backend/
├── 📂 controllers/              # Business logic handlers
│   ├── adminController.js       # Admin operations (login, dashboard)
│   └── authController.js        # Authentication (register, login, profile)
│
├── 📂 middleware/               # Express middleware
│   └── authMiddleware.js        # JWT authentication middleware
│
├── 📂 models/                   # Database models and queries
│   ├── adminModel.js           # Admin data access layer
│   └── userModel.js            # User data access layer
│
├── 📂 routes/                   # API route definitions
│   ├── adminRoutes.js          # Admin API endpoints (/api/admin/*)
│   └── authRoutes.js           # Authentication endpoints (/api/auth/*)
│
└── 📦 node_modules/            # Backend dependencies
```

### API Endpoints
```
Authentication Routes (/api/auth/):
├── POST /register              # User registration
├── POST /login                 # User login
└── GET /profile                # Get user profile (protected)

Admin Routes (/api/admin/):
└── POST /login                 # Admin login
```

### Database Configuration
```
Environment Variables (.env):
├── DB_HOST=localhost           # Database host
├── DB_USER=root               # Database username
├── DB_PASSWORD=               # Database password
├── DB_NAME=paddy_management   # Database name
├── USE_SQLITE=false          # Use SQLite (true) or MySQL (false)
├── JWT_SECRET=               # JWT signing secret
├── JWT_EXPIRES_IN=24h       # JWT expiration time
└── PORT=5000                # Server port
```

---

## 🎨 Frontend Structure (`src/`)

### Main Files
```
src/
├── main.jsx                     # React app entry point
├── App.jsx                      # Main app component with routing
├── App.css                      # Global app styles
├── index.css                    # Global CSS including Tailwind
├── App-backup.jsx              # Backup of previous App version
└── App-Diagnostic.jsx          # Diagnostic version for troubleshooting
```

### Directory Structure
```
src/
├── 📂 components/               # React components
│   ├── 🏠 Main Pages
│   │   ├── AuthPage.jsx         # Authentication page wrapper
│   │   ├── Contact.jsx          # Contact page
│   │   ├── About.jsx            # About page
│   │   └── About-New.jsx        # Updated about page
│   │
│   ├── 🎯 Core Components
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Footer.jsx           # Site footer
│   │   ├── HeroSection.jsx      # Landing page hero
│   │   └── PageTitle.jsx        # Dynamic page titles
│   │
│   ├── 🔐 Authentication
│   │   ├── AdminLogin.jsx       # Admin login form
│   │   └── UserRegistration.jsx # User registration form
│   │
│   ├── 📊 Business Features
│   │   ├── CollectionCenters.jsx    # Collection center listings
│   │   ├── LivePaddyPrices.jsx     # Real-time price display
│   │   ├── MillDashboard.jsx       # Mill owner dashboard
│   │   ├── MillOwnerRegistration.jsx # Mill registration form
│   │   └── NewArrivals.jsx         # New arrivals display
│   │
│   ├── ✨ UI/UX Components
│   │   ├── Features.jsx            # Feature showcase
│   │   ├── Features-Enhanced.jsx   # Enhanced features
│   │   ├── LanguageSelector.jsx    # Language switching
│   │   ├── LoadingTransition.jsx   # Loading animations
│   │   ├── PageTransition.jsx      # Page transition effects
│   │   └── TestSearch.jsx          # Search functionality
│   │
│   ├── 📂 admin/                   # Admin-specific components
│   │   ├── AdminDashboard.jsx      # Main admin dashboard
│   │   ├── Sidebar.jsx             # Admin navigation sidebar
│   │   ├── PriceManagement.jsx     # Price management interface
│   │   ├── UpdatePrice.jsx         # Price update forms
│   │   ├── Reports.jsx             # Admin reports
│   │   ├── StockDashboard.jsx      # Stock management
│   │   ├── MillMap.jsx             # Geographic mill display
│   │   └── LicenseRequestManagement.jsx # License approvals
│   │
│   ├── 📂 dashboard/               # Dashboard components
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── CollectionCenterCard.jsx # Center info cards
│   │   ├── MarketPriceCard.jsx     # Price display cards
│   │   ├── MetricCard.jsx          # KPI metric cards
│   │   ├── OrderRow.jsx            # Order list items
│   │   ├── QuickActionButton.jsx   # Quick action buttons
│   │   ├── LanguageSelector.jsx    # Dashboard language selector
│   │   ├── 📂 registration/        # Registration components (empty)
│   │   └── 📂 widgets/             # Dashboard widgets (empty)
│   │
│   ├── 📂 ui/                      # Reusable UI components
│   │   └── Card.jsx                # Generic card component
│   │
│   └── 📂 user/                    # User-specific components (empty)
│
├── 📂 hooks/                       # Custom React hooks
│   ├── useDashboardData.js         # Dashboard data management
│   ├── useI18n.js                  # Internationalization hook
│   ├── useLanguage.js              # Language management
│   └── useRegistration.js          # Registration form logic
│
├── 📂 utils/                       # Utility functions
│   ├── formatters.js               # Data formatting utilities
│   └── scroll.js                   # Scroll behavior utilities
│
├── 📂 data/                        # Static data files
│   ├── collectionCenters.json      # Collection center data
│   └── paddyPrices.json           # Paddy price data
│
├── 📂 i18n/                        # Internationalization
│   ├── i18n.js                     # i18next configuration
│   └── 📂 locales/                 # Language files
│       ├── en.json                 # English translations
│       ├── si.json                 # Sinhala translations
│       └── ta.json                 # Tamil translations
│
├── 📂 assets/                      # Static assets
│   ├── logo-p.png                  # Application logo
│   ├── react.svg                   # React logo
│   └── beautiful-rainbow-nature.jpg # Background image
│
└── 📂 public/                      # Public assets
    ├── bg-1.jpg                    # Background image 1
    ├── bg-2.jpg                    # Background image 2
    ├── bg-3.jpg                    # Background image 3
    ├── bg-4.jpg                    # Background image 4
    └── bg-5.jpg                    # Background image 5
```

---

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (configurable to SQLite)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv
- **CORS**: Manual implementation with debugging

### Frontend
- **Framework**: React.js 19.1.0
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.7.1
- **Charts**: Recharts 3.1.2
- **Icons**: Lucide React 0.536.0
- **Internationalization**: i18next, react-i18next

### Development Tools
- **Linting**: ESLint 9.30.1
- **CSS Processing**: PostCSS, Autoprefixer
- **Package Manager**: npm

---

## 📋 Development Guidelines

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserRegistration.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useDashboardData.js`)
- **Utilities**: camelCase (e.g., `formatters.js`)
- **Routes**: camelCase with 'Routes' suffix (e.g., `authRoutes.js`)
- **Controllers**: camelCase with 'Controller' suffix (e.g., `authController.js`)

### Directory Organization
- **Backend**: Follows MVC pattern (Models, Views, Controllers)
- **Frontend**: Feature-based organization with shared components
- **Assets**: Separate directories for images, icons, and static files
- **Documentation**: Root-level markdown files

### API Structure
```
Base URL: http://localhost:5000/api/

Authentication:
├── POST /auth/register
├── POST /auth/login
└── GET /auth/profile

Administration:
└── POST /admin/login
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type ENUM('private', 'government') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server (or use SQLite)
- npm package manager

### Installation & Setup
1. **Clone the repository**
2. **Install frontend dependencies**: `npm install`
3. **Install backend dependencies**: `cd backend && npm install`
4. **Configure environment**: Copy `.env.example` to `.env` and update values
5. **Start development servers**: Run `start-dev.bat` or use individual commands

### Environment Setup
```env
# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=paddy_management
USE_SQLITE=false
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
PORT=5000
```

---

## 📝 Notes for Future Development

### Recommended Additions
1. **API Documentation**: Add Swagger/OpenAPI documentation
2. **Testing**: Implement unit and integration tests
3. **Validation**: Add input validation schemas (Joi/Yup)
4. **Logging**: Implement structured logging (Winston)
5. **Error Handling**: Centralized error handling middleware
6. **File Upload**: Add multer for file uploads
7. **Email Service**: Integrate email notifications
8. **Caching**: Add Redis for session management
9. **Rate Limiting**: Implement API rate limiting
10. **Monitoring**: Add performance monitoring

### Code Organization Tips
- Keep components small and focused (single responsibility)
- Use custom hooks for complex logic
- Implement proper error boundaries
- Add loading states for async operations
- Use TypeScript for better type safety
- Implement proper state management (Context/Redux)

This structure provides a solid foundation for scalable development and maintenance.