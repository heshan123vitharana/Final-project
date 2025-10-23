# Paddy Management System

This is a full-stack web application designed to streamline the process of managing paddy (rice) production and distribution. It connects paddy farmers, mill owners, and administrators through a unified platform, making it easier to handle everything from licensing to stock management.

## What Does This Project Do?

Imagine a digital office for the paddy industry. This project helps with:

* **Mill Licensing:** Mill owners can apply for licenses online. Admins can review these applications, and approve or reject them.
* **Price Tracking:** The system keeps track of current paddy prices, so everyone knows the fair market rate.
* **Stock Management:** Mill owners can manage their paddy stock, updating how much they have.
* **User Profiles:** Users like farmers and mill owners can have their own profiles with their information.
* **Admin Control:** A central admin has a dashboard to oversee all activities, manage users, and ensure everything runs smoothly.

## Key Features

* **User-Friendly Interface:** A clean and simple design that's easy for anyone to use.
* **Admin Dashboard:** A powerful control panel for administrators to manage the entire system.
* **Secure Authentication:** Users need to log in to access their information, keeping data safe.
* **Automated Certificate Generation:** When a license is approved, the system automatically creates a digital permit certificate.
* **Real-Time Updates:** Changes made by users or admins are reflected instantly.

## Technology Used

This project is built with modern and popular web technologies:

* **Frontend (What you see in the browser):**
  * **React:** A library for building user interfaces.
  * **Vite:** A fast tool for developing and bundling the frontend code.
  * **Tailwind CSS:** A utility-first CSS framework for creating beautiful designs quickly.

* **Backend (The server-side logic):**
  * **Node.js:** A JavaScript runtime for building the server.
  * **Express.js:** A web framework for Node.js that simplifies creating APIs.

* **Database (Where the data is stored):**
  * **MySQL:** A popular and reliable open-source relational database.

## Project Structure

The project is organized into two main parts:

```bash
/
├── backend/         # Contains all the server-side code
│   ├── controllers/ # Logic for handling requests (e.g., approving a license)
│   ├── models/      # Code for interacting with the database
│   ├── routes/      # Defines the API endpoints (e.g., /api/licenses)
│   ├── utils/       # Shared utility functions
│   └── server.js    # The main entry point for the backend server
│
├── frontend/        # Contains all the client-side code (the user interface)
│   ├── src/
│   │   ├── components/ # Reusable UI parts (e.g., buttons, forms)
│   │   ├── pages/      # The main pages of the application (e.g., Home, Dashboard)
│   │   └── App.jsx     # The main component that brings everything together
│   └── index.html   # The starting HTML file for the frontend
│
└── README.md        # This file!
```

## Getting Started

To run this project on your local machine, follow these steps.

### Prerequisites

Make sure you have the following software installed:

* [Node.js](https://nodejs.org/) (which includes `npm`)
* [MySQL](https://www.mysql.com/downloads/)

### Installation & Setup

1. **Clone the repository:**
   Open your terminal and run:

   ```bash
   git clone https://github.com/heshan123vitharana/Final-project.git
   cd Final-project
   ```

2. **Set up the Backend:**
   * Navigate to the `backend` directory:

     ```bash
     cd backend
     ```

   * Install the required packages:

     ```bash
     npm install
     ```

   * Copy `.env.example` to `.env` and update the values for your environment. At minimum you will need valid database credentials, a `JWT_SECRET`, and `ADMIN_API_KEY` (used by the live stock dashboard).

   * Set up your MySQL database. You can use the `.sql` files in the `backend` directory to create the necessary tables and add sample data.

   * (Optional) Run the mill data audit helper to verify that every mill has a district, business type, and numeric capacity:

     ```bash
     node scripts/auditMillData.js
     ```

   * (Optional) Seed realistic demo stock records across multiple districts:

     ```bash
     node add-sample-stock-data.js
     ```

   * Start the backend server:

     ```bash
     node server.js
     ```

   Your backend should now be running at `http://localhost:5000`.

3. **Set up the Frontend:**
   * Open a **new terminal** and navigate to the `frontend` directory:

     ```bash
     cd frontend
     ```

   * Install the required packages:

     ```bash
     npm install
     ```

   * Copy `.env.example` to `.env` (or `.env.local`) and provide values for `VITE_API_BASE_URL`, `VITE_ADMIN_API_KEY`, and any other keys you need (for example the Google Maps key). Make sure `VITE_ADMIN_API_KEY` matches the backend `ADMIN_API_KEY` when the secure header is enabled.

   * Start the frontend development server:

     ```bash
     npm run dev
     ```

   Your frontend should now be running at `http://localhost:5173` (or another port if 5173 is busy).

## How to Use the Application

* Open your web browser and go to the frontend URL (e.g., `http://localhost:5173`).
* **Register/Login:** Create a new account or log in as an existing user (e.g., admin, mill owner).
* **Admin Dashboard:** If you log in as an admin, you will see the dashboard where you can manage license requests and other system settings.
* **Apply for a License:** If you log in as a mill owner, you can fill out and submit a license application form.

# Final Project

This repository contains a full-stack application for Paddy Marketing Board management, including user authentication, password reset, stock reporting, notifications, gallery uploads, and more.

## Project Structure

- `backend/` - Node.js Express API, database scripts, controllers, models, routes, and utility scripts.
- `frontend/` - Vite + React app, Tailwind CSS, forms, and UI components.
- Various markdown guides for features, fixes, and implementation notes.

## Key Features

- **Authentication**: Secure login, password reset, and admin management.
- **Stock Reporting**: Real-time stock updates and reporting for mill owners.
- **Notifications**: System for sending and managing notifications.
- **Gallery Uploads**: Upload and manage images for the gallery.
- **Newsletter**: Setup and manage newsletters for users.
- **QR Scanner**: Integrated QR code scanning for quick access.
- **Certificate Management**: Issue and manage certificates for users.

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

