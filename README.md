# 🏛️ JanSetu — Civic Issue Reporting & Resolution Platform

JanSetu ("Bridging Citizens & Governance") is a full-stack, production-ready civic issue reporting and resolution platform. It allows citizens to report municipal problems (broken roads, water leaks, electricity faults, garbage, drainage, etc.) using pin-drop mapping, track progress in real time via animated vertical courier-style timelines, and enables municipal workers and admins to resolve and manage complaints.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**: 3 unique dashboard experiences:
   - 🏙️ **Citizen Dashboard**: Deep Teal civic theme, 5-step animated wizard form (Category -> Photos -> Leaflet Pin Drop + Auto Reverse Geocoding -> Details -> Confetti & Complaint Code generation), My Complaints list, Nearby public issues feed with 1-click upvoting, star rating feedback modal for resolved issues.
   - 🛠️ **Worker Dashboard**: Operational Amber/Emerald theme, My Assigned Tasks vs Available Department Pool, Proof-of-work stage updater with mandatory resolution photo, resolution stats.
   - 📊 **Executive Admin Command Center**: High-contrast Slate/Indigo dark theme, Recharts analytics, Leaflet spatial heatmap, dynamic category editor, worker account manager, SLA overdue escalation, and 1-click CSV report export.

2. **Real-time WebSockets**: Socket.io live status updates, timeline progress, and in-app notifications.

3. **Leaflet & OpenStreetMap Integration**: Interactive map pin drop with reverse geocoding to auto-fill street addresses and pincodes.

4. **MongoDB Atlas Backend**: Node.js + Express + Mongoose models + JWT Auth + Multer file uploads.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas Connection URI (or local MongoDB database)

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure your environment variables in backend/.env
# Paste your MongoDB Atlas URI:
# MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/jansetu?retryWrites=true&w=majority

# Seed Database with Admin, 15 Field Workers, 20 Citizens, 12 Categories, and 50 Complaints
npm run seed

# Start Backend Server (Runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

---

## 🔒 Strict Production Access & Security Model

- **Citizen Accounts**: Public registration is strictly restricted to Citizen accounts (`/register`).
- **Worker Accounts**: Field worker accounts CANNOT be created publicly; they must be provisioned and assigned by the Master Admin inside the Admin Command Center (`Field Staff Accounts` tab).
- **Master Admin Account**: Initialized securely via `npm run seed` using `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in `.env`.

---

## 📁 Project Structure

```
comrade/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js)
│   │   ├── models/ (User, Category, Complaint, Feedback, Notification)
│   │   ├── middleware/ (auth.js, upload.js)
│   │   ├── controllers/ (auth, complaint, worker, admin, notification)
│   │   ├── routes/ (auth, complaint, category, worker, admin, notification)
│   │   ├── sockets/ (socketHandler.js)
│   │   ├── seed.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env.example
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ (common, map, complaint, citizen, worker, admin)
│   │   ├── context/ (AuthContext, SocketContext)
│   │   ├── pages/ (LandingPage, Login, Register, CitizenDashboard, WorkerDashboard, AdminDashboard)
│   │   ├── services/ (api.js)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```
