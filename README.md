# 🌾 SmartKrishi Share

> **A full-stack agricultural resource-sharing platform built to empower Indian farmers** — equipment rental, live mandi prices, crop marketplace, weather updates, and role-based dashboards, all in one place.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔒 **Secure Auth** | JWT-based login & registration with role-based access (Farmer / Admin) |
| 🚜 **Equipment Rental** | List, search, and book farming equipment with photo uploads |
| 📊 **Dashboards** | Dedicated dashboards for Farmers and Admins |
| 📋 **Booking Management** | Request, approve, reject bookings with real-time status tracking |
| 🛒 **Crop Marketplace** | Browse local produce listings (Vegetables, Fruits, Flowers) |
| 📈 **Live Mandi Prices** | Real-time AGMARKNET commodity prices from across India |
| 🌤️ **Weather Updates** | Real-time weather data to help farmers plan their activities |
| 📱 **Responsive UI** | Mobile-first design with Tailwind CSS and smooth animations |

---

## 🛠️ Technology Stack

**Frontend**
- React 18 + React Router DOM v6
- Tailwind CSS 3
- Context API (Auth + Equipment state)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose (MongoDB Atlas)
- JWT (jsonwebtoken) for authentication
- Bcrypt.js for password hashing
- Multer for image/file uploads
- AGMARKNET API integration for live mandi prices

---

OPEN the App https://smart-krishi-3-djhd.onrender.com


## 📁 Project Structure

```
Smart-Krishi/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Layout, DashboardLayout, ProtectedRoute, Footer
│   │   ├── context/        # AuthContext, EquipmentContext
│   │   └── pages/          # All route pages
│   └── package.json
│
├── server/                 # Express backend
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose models (User, Equipment, Booking)
│   ├── routes/             # API routes (auth, equipment, bookings, mandi)
│   ├── uploads/            # Uploaded equipment photos (auto-created)
│   └── index.js
│
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

---

### 1. Clone the Repository

```bash
git clone https://github.com/darshant12/Smart-Krishi-.git
cd Smart-Krishi-
```

---

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5001
JWT_SECRET=your_super_secret_key_here
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smartkrishi?retryWrites=true&w=majority
DATA_GOV_API_KEY=your_data_gov_api_key   # optional — fallback data used if missing
```

> **MongoDB URI:** Get yours from [MongoDB Atlas](https://cloud.mongodb.com) → Connect → Drivers → copy connection string.

Start the backend:

```bash
node index.js
# or for auto-restart on changes:
npx nodemon index.js
```

The server starts on **http://localhost:5001**

A default admin account is seeded automatically on first run:
- **Email:** `admin@example.com`
- **Password:** `admin123`

---

### 3. Set Up the Frontend

Open a **new terminal**:

```bash
cd client
npm install
npm start
```

The app starts on [**http://localhost:3000**](https://smart-krishi-3-djhd.onrender.com)

---

### 4. Access the Application

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main application |
| http://localhost:3000/login | Login page |
| http://localhost:3000/register | Register a new farmer account |
| http://localhost:3000/farmer-dashboard | Farmer dashboard (requires login) |
| http://localhost:3000/admin-dashboard | Admin dashboard (admin only) |
| http://localhost:5001/api/equipment | Equipment API |
| http://localhost:5001/api/mandi | Live mandi prices API |

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin123` |
| Farmer | Register at `/register` | *(your choice)* |

---

## 📸 Equipment Photo Upload

When adding equipment:
1. Go to **Farmer Dashboard → Add Equipment**
2. Fill in name, type, rate, contact, and location
3. Choose a photo (`.jpg`, `.png`, `.webp`)
4. Click **Add Equipment**

Photos are stored in `server/uploads/` and served at `http://localhost:5001/uploads/<filename>`.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Equipment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get all equipment listings |
| POST | `/api/equipment` | Add new equipment (auth required, multipart/form-data) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a booking request |
| GET | `/api/bookings/requester` | Get bookings made by logged-in user |
| GET | `/api/bookings/owner` | Get booking requests for owner's equipment |
| PUT | `/api/bookings/:id/status` | Approve or reject a booking |

### Mandi
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mandi` | Get live/fallback mandi prices |
| GET | `/api/mandi?commodity=tomato&state=Maharashtra` | Filter by commodity/state |

---

## 🌐 Deployment

### Backend (Render / Railway)
1. Create a new **Web Service**
2. Set root to `server/`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all `.env` variables in the dashboard

### Frontend (Vercel / Netlify)
1. Set root to `client/`
2. Build command: `npm run build`
3. Publish directory: `build`
4. Add rewrite rule: `/* → /index.html`
5. Update the `proxy` in `client/package.json` to your deployed backend URL

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ for Indian farmers 🌾</p>
