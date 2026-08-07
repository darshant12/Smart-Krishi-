# 🌾 SmartKrishi Share

SmartKrishi Share is a comprehensive full-stack rural resource sharing platform designed to empower farmers. It provides tools for equipment rental, an agricultural marketplace, labor hiring, and essential information like weather updates to help optimize farming operations.

![SmartKrishi Share](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

*   **🔒 Secure Authentication:** Role-based access control (Admin, Farmer, Equipment Owner) using JWT.
*   **🚜 Equipment Rental:** Browse, search, and book farming equipment. Equipment owners can list their machinery for rent.
*   **📊 User Dashboards:** Dedicated dashboards for Farmers and Admins to manage bookings, equipment, and user accounts.
*   **🛒 Crop Marketplace:** A dedicated marketplace for buying and selling crops directly (Mandi integration).
*   **🌤️ Weather Integration:** Real-time weather updates to help farmers plan their activities.
*   **📱 Responsive Design:** A beautiful, responsive interface built with React and Tailwind CSS, optimized for both mobile and desktop screens.

## 🛠️ Technology Stack

**Frontend (Client):**
*   React.js
*   React Router DOM (for routing)
*   Tailwind CSS (for styling)

**Backend (Server):**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database & ORM)
*   JSON Web Tokens (JWT) for authentication
*   Multer (for image/file uploads)
*   Bcrypt.js (for password hashing)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine. You will also need a [MongoDB](https://www.mongodb.com/) account for the database.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/darshant12/Smart-krishi-share.git
   cd Smart-krishi-share
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window, and navigate to the client folder:
   ```bash
   cd client
   npm install
   ```
   Start the React application:
   ```bash
   npm start
   ```

4. **Access the Application:**
   The frontend will be running on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## 🌐 Deployment

The application can be easily deployed on platforms like **Render.com**. 
*   **Backend:** Deploy the `server` directory as a "Web Service". Ensure all environment variables from your `.env` are added to the service configuration.
*   **Frontend:** Deploy the `client` directory as a "Static Site" (Build command: `npm install; npm run build`, Publish directory: `build`). Set a rewrite rule for `/*` to `/index.html` to support React routing.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/darshant12/Smart-krishi-share/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
