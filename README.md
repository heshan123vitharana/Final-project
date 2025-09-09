# Admin Dashboard

A clean, focused React.js admin dashboard for the Paddy Marketing Board with modern UI components and real-time monitoring capabilities.

## Features

- **License Request Management** - View and manage mill license applications
- **Live Stock Dashboard** - Real-time stock monitoring with charts
- **Interactive Mill Map** - Sri Lanka map with mill locations
- **Reports Generation** - Various administrative reports with export
- **Price Management** - Manage paddy prices by variety and grade
- **Responsive Design** - Works on desktop, tablet, and mobile

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the admin dashboard.

## Project Structure

```
├── src/
│   ├── components/
│   │   └── admin/          # Admin dashboard components
│   ├── App.jsx             # Main application
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json            # Dependencies
└── README.md              # This file
```

## Tech Stack

- React 19.1.0
- Tailwind CSS 3.4.17
- Vite (build tool)
- Lucide React (icons)
- Recharts (data visualization)

## Admin Components

- `AdminDashboard.jsx` - Main dashboard layout
- `Sidebar.jsx` - Navigation sidebar
- `LicenseRequestManagement.jsx` - License handling
- `StockDashboard.jsx` - Stock monitoring
- `MillMap.jsx` - Interactive map
- `Reports.jsx` - Report generation
- `PriceManagement.jsx` - Price management
- `UpdatePrice.jsx` - Price update forms