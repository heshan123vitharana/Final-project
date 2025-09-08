# Final Project - Paddy Marketing Board

A full-stack web application for Sri Lanka's Paddy Marketing Board with separated frontend and backend architecture.

## 🏗️ Project Structure

```
Final-project/
├── frontend/                 # React.js Frontend Application
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx         # Main navigation and branding
│   │   │   ├── HeroSection.jsx    # Featured products and promotions
│   │   │   ├── NewArrivals.jsx    # Latest rice varieties
│   │   │   ├── Features.jsx       # Key benefits and services
│   │   │   └── Footer.jsx         # Contact info and links
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   └── index.css       # Tailwind CSS imports
│   ├── public/             # Public assets
│   │   ├── farmer.png      # Farmer illustration
│   │   ├── bg-1.jpg to bg-5.jpg  # Background images
│   │   └── ...
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── index.html          # Main HTML file
├── backend/                # Node.js Backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
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
- **MongoDB/Database** for data storage
- **RESTful API** architecture

## 🎨 Color Palette

- **Rice Gold**: `#D4AF37` - Premium quality highlight
- **Paddy Green**: `#4A6741` - Primary brand color
- **Earth Brown**: `#8B4513` - Natural earth tones
- **Fresh Green**: `#90EE90` - Growth and freshness

## Components Overview

- **Header**: Navigation menu, search functionality, cart, and mobile-responsive design
- **HeroSection**: Eye-catching banner with featured products and free delivery promotion
- **NewArrivals**: Grid display of latest rice varieties with pricing and discounts
- **Features**: Key benefits like quality assurance, farmer support, and delivery
- **Footer**: Comprehensive footer with contact information and links

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

