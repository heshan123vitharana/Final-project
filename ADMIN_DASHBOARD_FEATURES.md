# Paddy Marketing Board - Admin Dashboard Features

## Overview
The PMB Admin Dashboard is a comprehensive React.js + Tailwind CSS application that provides complete administrative control over the Paddy Marketing Board operations. The dashboard features a modern, responsive design with real-time data monitoring and interactive management tools.

## 🚀 Key Features

### 1. License Request Management
- **View incoming license requests** from mills with uploaded payment receipts
- **Accept/Reject functionality** with automated certificate generation and email notifications
- **Search and filter** capabilities for efficient request management
- **Detailed request view** with mill information, contact details, and payment receipts
- **Status tracking** (Pending, Approved, Rejected) with visual indicators
- **Rejection reason** prompt for rejected applications

### 2. Real-time Stock Monitoring Dashboard
- **Live stock levels** for Private vs Government mills
- **District-wise stock distribution** with interactive charts
- **Mill utilization rates** with visual progress bars
- **24-hour stock trend** analysis
- **Auto-refresh** every 30 seconds for real-time updates
- **Summary cards** showing total stock, capacity, utilization rate, and active mills
- **Live mill status** indicators with color-coded utilization levels

### 3. Interactive Mill Map
- **Sri Lanka map** with mill location markers
- **Click-to-view** mill details functionality
- **Filter by mill type** (Private/Government/All)
- **Mill directory** with quick access to all mills
- **Detailed mill information** including:
  - Current stock levels
  - Total capacity
  - Empty capacity
  - Utilization percentage
  - Contact information
  - Operational status

### 4. Comprehensive Reports Section
- **Multiple report types**:
  - Stock Levels Report
  - Production Report
  - Financial Report
  - Mill Performance Report
  - License Status Report
- **Downloadable reports** in PDF and CSV formats
- **Advanced filtering** by date range, region, and mill type
- **Report preview** with summary metrics and breakdown analysis
- **Recent reports** history with quick download access

### 5. Price Management System
- **Editable price list** for different paddy varieties and grades
- **Price history tracking** with change reasons
- **Add new price entries** with modal form
- **Real-time price updates** with notifications
- **Price change indicators** (increase/decrease) with percentages
- **Summary statistics** (average, highest, lowest prices)
- **Delete and edit** functionality for price management

### 6. Sidebar Navigation
- **Collapsible sidebar** with smooth animations
- **Navigation items**:
  - License Requests
  - Live Stock Dashboard
  - Mill Map
  - Reports
  - Price Management
- **Active section highlighting** with visual indicators
- **Responsive design** that adapts to different screen sizes

## 🎨 UI/UX Features

### Modern Design
- **Clean, professional interface** with green color scheme
- **Responsive layout** that works on desktop, tablet, and mobile
- **Smooth animations** and transitions
- **Interactive elements** with hover effects
- **Loading states** and visual feedback

### Data Visualization
- **Recharts integration** for interactive charts and graphs
- **Color-coded indicators** for different statuses and types
- **Progress bars** for utilization rates
- **Trend indicators** with up/down arrows
- **Real-time updates** with visual feedback

### User Experience
- **Modal dialogs** for detailed views and forms
- **Search and filter** functionality across all sections
- **Keyboard shortcuts** and accessibility features
- **Error handling** with user-friendly messages
- **Confirmation dialogs** for critical actions

## 🔧 Technical Implementation

### Frontend Stack
- **React.js 19.1.0** with modern hooks
- **Tailwind CSS 3.4.17** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **Vite** for build tooling

### Key Components
- `AdminDashboard.jsx` - Main dashboard layout and navigation
- `LicenseRequestManagement.jsx` - License request handling
- `StockDashboard.jsx` - Real-time stock monitoring
- `MillMap.jsx` - Interactive map with mill locations
- `Reports.jsx` - Report generation and management
- `PriceManagement.jsx` - Price list management

### Data Management
- **Mock data** for demonstration purposes
- **State management** with React hooks
- **Simulated API calls** for real-time updates
- **Local storage** for user preferences
- **Export functionality** for reports

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd final_project1

# Install dependencies
npm install

# Start development server
npm run dev
```

### Accessing the Admin Dashboard
1. Open the application in your browser
2. Click on "Admin Login" in the header
3. Use any credentials to log in (demo mode)
4. You'll be redirected to the admin dashboard

## 📊 Dashboard Sections

### License Requests
- View all incoming license applications
- Search by mill name, owner, or request ID
- Filter by status (Pending, Approved, Rejected)
- Approve requests with automatic certificate generation
- Reject requests with reason prompts
- View detailed request information

### Live Stock Dashboard
- Real-time stock monitoring
- Private vs Government stock comparison
- District-wise stock distribution
- Mill utilization rates
- 24-hour stock trends
- Auto-refresh every 30 seconds

### Mill Map
- Interactive Sri Lanka map
- Click on mill markers for details
- Filter by mill type
- View mill directory
- Check stock levels and capacity
- Contact information display

### Reports
- Generate various report types
- Set date ranges and filters
- Download in PDF or CSV format
- View report previews
- Access recent reports

### Price Management
- Manage paddy prices by variety and grade
- Edit prices with inline editing
- View price history and changes
- Add new price entries
- Track price trends and statistics

## 🔒 Security Features
- **Admin authentication** (demo mode)
- **Session management**
- **Input validation** for all forms
- **Confirmation dialogs** for critical actions
- **Error handling** and user feedback

## 📱 Responsive Design
- **Mobile-first approach**
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** interface elements
- **Optimized navigation** for mobile devices

## 🎯 Future Enhancements
- **Real API integration** for live data
- **Advanced analytics** and forecasting
- **Multi-language support**
- **Dark mode** theme
- **Advanced reporting** with custom filters
- **Real-time notifications** system
- **Export to Excel** functionality
- **Bulk operations** for license management

## 📞 Support
For technical support or feature requests, please contact the development team.

---

**Note**: This is a demonstration application with mock data. In production, it would be connected to real APIs and databases for live data management. 