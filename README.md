# Final Project - Paddy Marketing Board

A full-stack web application for Sri Lanka's Paddy Marketing Board with separated frontend and backend architecture.

## 🏗️ Project Structure

```
Final-project/
├── frontend/                 # React.js Frontend Application
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx         # Navigation and branding
│   │   │   ├── HeroSection.jsx    # Hero section with CTA
│   │   │   ├── About-New.jsx      # About section with leadership
│   │   │   ├── Features.jsx       # Key features and services
│   │   │   ├── CollectionCenters.jsx # Collection centers map
│   │   │   ├── LivePaddyPrices.jsx # Real-time price display
│   │   │   ├── Contact.jsx        # Contact information
│   │   │   ├── Footer.jsx         # Site footer
│   │   │   ├── AdminLogin.jsx     # Admin authentication
│   │   │   ├── AuthPage.jsx       # User authentication
│   │   │   ├── MillOwnerRegistration.jsx # Mill owner registration
│   │   │   ├── PageTransition.jsx # Page animations
│   │   │   └── admin/             # Admin dashboard components
│   │   ├── MillComponents/  # Mill owner dashboard
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── i18n/           # Internationalization
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   └── index.css       # Tailwind CSS imports
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── index.html          # Main HTML file
├── backend/                # Node.js Backend API
│   ├── controllers/        # Route controllers
│   │   ├── priceController.js     # Paddy price operations (MySQL)
│   │   ├── adminController.js     # Admin operations
│   │   ├── authController.js      # Authentication
│   │   └── stockController.js     # Stock management
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   │   └── database.js    # MySQL database configuration
│   ├── database.js        # Database connection
│   ├── server.js          # Express server entry point
│   └── package.json       # Backend dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Backend Development
```bash
cd backend
npm install
npm start
```
Backend API will run on: `http://localhost:5000`

## 🔧 Technologies Used

### Frontend
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom color palette for agricultural theme
- **JavaScript (ES6+)**
- **SVG icons** and custom illustrations

### Backend
- **Node.js** server-side runtime
- **Express.js** web framework
- **MySQL** database for data storage
- **RESTful API** architecture
- **CORS** enabled for frontend communication

## 🎨 Color Palette

- **Rice Gold**: `#D4AF37` - Premium quality highlight
- **Paddy Green**: `#4A6741` - Primary brand color
- **Earth Brown**: `#8B4513` - Natural earth tones
- **Fresh Green**: `#90EE90` - Growth and freshness

## Key Features

- **Multi-User System**: Admin, Mill Owners, and public access
- **Real-Time Paddy Prices**: Live price updates from collection centers
- **Mill Owner Dashboard**: Registration, price tracking, stock management
- **Admin Panel**: User management, price updates, system administration
- **Collection Centers**: Interactive map and location information
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Database Integration**: MySQL backend with proper API endpoints

## Development Guidelines

- Follow React functional component patterns with hooks
- Use Tailwind CSS classes for all styling
- Maintain responsive design principles
- Implement accessibility best practices
- Use semantic HTML elements
- Follow JavaScript ES6+ conventions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is developed for the Paddy Marketing Board of Sri Lanka.

## Contact

For questions or support, please contact the development team.

