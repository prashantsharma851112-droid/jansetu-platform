# 🏛️ JanSetu — Civic Issue Reporting & Resolution Platform Walkthrough

JanSetu ("Bridging Citizens & Governance") is fully built and production-ready! The application includes a Node.js + Express + MongoDB Atlas backend, real-time WebSockets, Leaflet spatial maps, and 3 distinct UI dashboard experiences for Citizens, Field Workers, and City Administrators.

---

## 🎨 Dashboards & UI Highlights

### 🏙️ 1. Citizen Portal
- **5-Step Animated Complaint Wizard**:
  - **Category Picker**: 12 dynamic visual cards with custom icons and department tags.
  - **Photo Upload**: Multi-file dropzone with instant image preview.
  - **Pin-Drop Location**: Leaflet map pin placement + Geolocation button + auto reverse-geocoding via OpenStreetMap.
  - **Urgency Selector**: Pill radio selectors (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  - **Confetti & Ticket ID**: Celebratory burst on submission + instant tracking code generation (`JS-2026-XXXXXX`).
- **My Complaints & Nearby Feed**:
  - Community upvoting system ("Support Issue").
  - Courier-style vertical animated timeline showing stage progress (*Submitted ➔ Assigned ➔ In Progress ➔ Under Review ➔ Resolved*).
  - Rating & feedback star modal for closed tickets.

### 🛠️ 2. Worker Operations Portal
- **Task Center**: Filter between **My Assigned Tasks** and **Department Pool (Unassigned)**.
- **Self-Claim Action**: 1-click claim ticket feature from pool.
- **Proof of Work Modal**:
  - Update stage with work notes.
  - Mandatory **After Photo** proof upload before marking ticket as *Resolved*.
- **Performance Counter Header**: Tracks total assigned, pending, and resolved counts.

### 📊 3. Executive Admin Command Center
- **Executive Analytics**: Real-time KPI counter cards, Recharts category pie chart, and ward-wise bar charts.
- **Spatial Heatmap**: Leaflet dark-mode map showing city-wide issue density color-coded by urgency.
- **Dynamic Category Manager**: Add or edit complaint categories, default departments, and hex colors.
- **Worker Provisioning**: Create field staff accounts and assign departments/areas.
- **Master Complaint Table**: Filter, search, manually reassign tickets, toggle SLA escalation, and export CSV reports.

---

## 🚀 Running the Project Locally

### 1. Configure MongoDB Atlas URI
In `backend/.env`, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jansetu?retryWrites=true&w=majority
```

### 2. Seed Database & Start Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

### 3. Start Frontend App
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🔑 Quick Demo Credentials

Use the **One-Click Demo Role** buttons on the Login page to instantly fill credentials:

- 👑 **Admin**: `admin@jansetu.gov.in` / `Admin@123`
- 🛠️ **Worker**: `worker1@jansetu.gov.in` / `Worker@123`
- 👤 **Citizen**: `citizen1@gmail.com` / `Citizen@123`
