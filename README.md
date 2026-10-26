# 🏠 HostelHub – Smart Hostel Bed Booking & Allocation System

> **A Full-Stack MERN College Mini-Project & Production-Ready Web Application**  
> *"Find. Book. Get Approved. Stay."*

---

## 📌 1. Project Overview

**HostelHub** is a full-stack web application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) designed to modernize student accommodation management. Unlike traditional hostel websites with static tables and dummy forms, HostelHub implements an interactive, architectural **Visual Bed Map** where students can see the exact layout of rooms and book specific beds in real-time.

The application features a strict **Role-Based Access Control (RBAC)** architecture with completely segregated workflows for **Students** and **Hostel Owners**.

---

## 🚀 2. Signature Features

### 🏢 1. Role-First Entry Page
- The application does **not** directly display a login form.
- The user is greeted by a role selection portal asking: **"Who are you?"**
  - **👨🎓 STUDENT**: Find hostels, explore blueprints, and book preferred beds.
  - **🏠 HOSTEL OWNER**: Manage hostels, rooms, floors, and approve booking requests.

### 🛏️ 2. Interactive Visual Bed Map
Beds are rendered inside blueprint-style room floor plans with live color-coded status badges:
- **🟢 AVAILABLE (Emerald Green)**: Clickable by students to book.
- **🟡 PENDING APPROVAL (Amber / Yellow)**: Locked while awaiting owner review.
- **🔴 OCCUPIED (Rose / Red)**: Currently allocated to a student.
- **⚪ MAINTENANCE (Slate / Gray)**: Temporarily out of service.

### 🔄 3. Strict Bed Allocation Workflow
1. **Student Books Bed**: Bed state transitions from `available` (🟢) ➔ `pending` (🟡).
2. **Owner Approves Request**: Bed state transitions from `pending` (🟡) ➔ `occupied` (🔴), and booking status becomes `approved`.
3. **Owner Rejects Request**: Bed reverts from `pending` (🟡) ➔ `available` (🟢).
4. **Owner Vacates Bed**: Bed transitions from `occupied` (🔴) ➔ `available` (🟢), and booking is marked `completed`.

### 🧠 4. Smart Bed Recommendation Engine
A transparent, rule-based matching engine that evaluates available beds against student preferences and outputs a **Match Score (0 - 100%)**:
- **Budget Match**: 30 points
- **Hostel Preference**: 25 points
- **Room Type Match**: 20 points
- **Floor Level Match**: 10 points
- **Facility / Amenity Match**: 15 points

### 🔄 5. In-Stay Room Change Requests
Allocated students can request a room change via the **My Room** portal. The owner reviews the swap request; upon approval, the database automatically releases the old bed back to Available (🟢) and assigns the new bed as Occupied (🔴).

### 📊 6. Owner Analytics & Recharts Reports
- Total Beds, Occupied Beds, Available Beds, Pending Requests counters.
- Live occupancy percentage progress bar.
- Room-wise bed occupancy comparison (`BarChart`).
- Bed status distribution & booking outcome breakdown (`PieChart`).

---

## 🛠️ 3. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom color tokens & micro-animations
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios with JWT request/response interceptors
- **State Management**: React Context API (`AuthContext`, `NotificationContext`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Zero-Setup Database Engine**: Includes automatic embedded `mongodb-memory-server` fallback if local MongoDB is offline!
- **Logging**: Morgan HTTP logger & custom error handling middleware

---

## 📂 4. Project Folder Structure

```text
FSD/
├── client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Footer, BedCard, RoomLayoutMap, BookingModal, OccupantModal
│   │   │   └── owner/               # OwnerSidebar, OwnerHeader, AddRoomModal
│   │   ├── context/                 # AuthContext, NotificationContext
│   │   ├── layouts/                 # StudentLayout, OwnerLayout
│   │   ├── pages/
│   │   │   ├── auth/                # StudentLogin, StudentRegister, OwnerLogin, OwnerRegister
│   │   │   ├── student/             # StudentDashboard, HostelSearchPage, HostelDetailsPage,
│   │   │   │                        # RoomBedsPage, MyBookingsPage, MyRoomPage, SmartRecommendationsPage
│   │   │   ├── owner/               # OwnerDashboard, OwnerHostelPage, OwnerRoomsPage,
│   │   │   │                        # OwnerBookingsPage, OwnerRoomChangesPage, OwnerReportsPage, OwnerSettingsPage
│   │   │   ├── common/              # NotFoundPage, UnauthorizedPage
│   │   │   └── RoleSelectionPage.jsx
│   │   ├── services/                # api.js (Axios instance with JWT interceptors)
│   │   ├── App.jsx                  # Main router with RBAC routes
│   │   ├── main.jsx                 # React root entrypoint
│   │   └── index.css                # Tailwind base & custom animations
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express.js Backend
│   ├── config/                      # db.js (MongoDB Atlas / local connection with auto-fallback)
│   ├── controllers/                 # authController, hostelController, roomController,
│   │                                # bedController, bookingController, roomChangeController,
│   │                                # notificationController, reportController
│   │   models/                      # User, StudentProfile, OwnerProfile, Hostel,
│   │                                # Room, Bed, Booking, RoomChangeRequest, Notification
│   │   routes/                      # Express REST API routes
│   │   middleware/                  # auth.js (verifyToken, isStudent, isOwner), errorHandler.js
│   │   utils/                       # jwt.js, seed.js, seedRunner.js
│   ├── server.js                    # Express app entrypoint
│   ├── .env.example
│   └── package.json
│
├── .env.example                     # Root environment template
└── README.md
```

---

## 🔑 5. Demo Credentials

The database comes pre-seeded with realistic data:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **👨🎓 Student** | `student@example.com` | `Student@123` | Lokesh Kumar (2nd Year CSE) |
| **🏠 Owner** | `owner@example.com` | `Owner@123` | Ramesh Reddy (Sri Sai Grand Residency) |
| **👨🎓 Student 2** | `priya@example.com` | `Student@123` | Priya Sharma (3rd Year IT) |
| **🏠 Owner 2** | `sharma@example.com` | `Owner@123` | Vikram Sharma (Greenwood Luxury Living) |

---

## ⚙️ 6. Installation & Running Locally

### Prerequisites
- Node.js (v18.x or newer recommended; v24 supported)
- npm (v9.x or newer)
- MongoDB (Optional: The application automatically boots an embedded in-memory database if MongoDB is not locally running)

### Step 1: Clone or Navigate to the Workspace
```bash
cd c:/Users/lukka/OneDrive/Desktop/FSD
```

### Step 2: Configure Environment Variables
Copy `.env.example` in `server`:
```bash
cd server
cp .env.example .env
```
Default `.env` settings:
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hostelhub
JWT_SECRET=hostelhub_super_secret_jwt_key_2026_secure
NODE_ENV=development
```

### Step 3: Start the Backend Server
```bash
cd server
npm install
npm run seed     # (Optional: Seeds demo data; automatically run if DB is empty)
npm start        # Or 'npm run dev'
```
*Backend runs on `http://localhost:5000`*

### Step 4: Start the Frontend Client
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🧪 7. Complete Demonstration Walkthrough

Follow this exact scenario during project evaluation:

1. Open `http://localhost:5173/` in your browser.
2. Select **"Continue as Student"**.
3. Log in with `student@example.com` / `Student@123` (or click the quick demo prefill button).
4. View the personalized greeting on the **Student Dashboard**.
5. Click **"Find Hostel"** in the navigation bar.
6. Click **"View Hostel"** on **"Sri Sai Grand Residency"**.
7. Scroll down to **Room 101** and click **"View Beds"**.
8. Observe the architectural room blueprint:
   - **Bed 1**: 🔴 Occupied
   - **Bed 2**: 🟢 Available
   - **Bed 3**: 🟢 Available
   - **Bed 4**: ⚪ Maintenance
9. Click **Bed 2 (🟢 Available)** to open the booking confirmation modal.
10. Click **"Confirm Bed Booking"**.
11. Observe that **Bed 2 immediately switches to 🟡 Pending Approval**.
12. Click **Logout** in the top right corner.
13. Select **"Continue as Owner"**.
14. Log in with `owner@example.com` / `Owner@123`.
15. Navigate to **"Booking Requests"** from the sidebar.
16. See the pending request from **Lokesh Kumar for Room 101 (Bed 2)**.
17. Click **"APPROVE"**.
18. Navigate to **"Rooms & Beds"**, open **Room 101**, and verify that **Bed 2 is now 🔴 OCCUPIED**.
19. Log back in as **Student** and open **"My Room"** to verify the confirmed allocation.

---

## 📡 8. REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/student/register` – Register student account
- `POST /api/auth/student/login` – Student authentication
- `POST /api/auth/owner/register` – Register owner and initial hostel
- `POST /api/auth/owner/login` – Owner authentication
- `GET  /api/auth/me` – Retrieve authenticated session and role data

### Hostels (`/api/hostels`)
- `GET  /api/hostels` – Search & filter hostels by city, price, gender, facilities
- `GET  /api/hostels/:id` – Fetch hostel details and all associated rooms
- `POST /api/hostels` – Create new hostel (Owner only)
- `PUT  /api/hostels/:id` – Update hostel profile (Owner only)
- `POST /api/hostels/recommendations` – Smart 100-point rule-based bed matcher

### Rooms & Beds (`/api/rooms`, `/api/beds`)
- `GET  /api/rooms/hostel/:hostelId` – Get all rooms for a hostel
- `POST /api/rooms` – Create room & auto-generate beds based on capacity (Owner)
- `GET  /api/beds/room/:roomId` – Fetch beds for visual map
- `GET  /api/beds/hostel/:hostelId/matrix` – Complete floor & room bed layout matrix
- `PUT  /api/beds/:id/status` – Update bed status (Available ⇄ Maintenance)
- `PUT  /api/beds/:id/vacate` – Vacate occupied bed & mark allocation completed

### Bookings & Allocations (`/api/bookings`)
- `POST /api/bookings` – Submit new bed booking request (Student)
- `GET  /api/bookings/my` – Student's booking history
- `GET  /api/bookings/my-room` – Student's current room, bed & roommates
- `GET  /api/bookings/owner` – Owner's booking requests queue
- `PUT  /api/bookings/:id/approve` – Approve request (Bed becomes Occupied)
- `PUT  /api/bookings/:id/reject` – Reject request (Bed reverts to Available)
- `PUT  /api/bookings/:id/cancel` – Cancel pending booking (Student)

### Room Changes & Analytics (`/api/room-changes`, `/api/reports`)
- `POST /api/room-changes` – Submit room swap request (Student)
- `GET  /api/room-changes/owner` – Owner review list of room change requests
- `PUT  /api/room-changes/:id/approve` – Approve swap (Reassigns both beds)
- `GET  /api/reports/owner` – Analytics, occupancy rates, and Recharts dataset

---

## 🔮 9. Future Enhancements

The following features can be added in future iterations:
- Razorpay / Stripe payment gateway integration for monthly rent payments.
- Automated email and SMS notifications via Nodemailer / Twilio.
- QR-code check-in / check-out scanner at the hostel reception.
- Socket.IO real-time websocket bed status updates across multiple browser tabs.
- Native mobile application using React Native.
