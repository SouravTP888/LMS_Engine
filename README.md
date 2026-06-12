# AetherLMS | AI-Powered Learning Management Automation Engine

AetherLMS is a premium, production-level, full-stack Learning Management System (LMS) designed with a futuristic dark SaaS aesthetic. It features an **Automation Engine** that automatically matches student career tracks, handles sequential module locks, tracks learning metrics (streaks, XP, badges), and generates printable certificates.

---

## ⚡ Tech Stack & Architecture
*   **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion (page transitions & micro-animations), Recharts (analytics dashboards), Lucide React (premium iconography).
*   **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), BCryptJS.
*   **Database**: MongoDB (via Mongoose) with a **fail-safe local JSON-DB fallback** (`server/data/db.json`) if no MongoDB instance is running locally.

---

## 🚀 Key Premium Features
1.  **Dual-Mode Database Layer**: If the system detects MongoDB is offline, it automatically connects to a local JSON file-based database. This ensures the app is fully functional out-of-the-box.
2.  **Sequential Locking System**: The first module of a track is unlocked by default. When a student completes all lessons in the active module (reaching 100%), the system automatically transitions the next module to `UNLOCKED` state.
3.  **Aether AI Advisor**: A floating chatbot interface that references the student's current progress percentage and provides recommendations on what to learn next, topic explanations, and skill-level study advice.
4.  **Gamification Engine**: Students earn **+50 XP** for each completed lesson. A learning streak counter updates daily, and badges (e.g. *First Step*, *Fast Learner*, *Super Streak*) are unlocked dynamically.
5.  **Verified Certificates**: A print-ready completion certificate with authority signatures and a verification hash is generated once a track reaches 100% completion.
6.  **Interactive System Analytics**: Admins can view graphical reports using Recharts, highlighting student intake growth, course popularity, module completion drops, and dropout trend graphs.

---

## 📂 Project Structure
```text
LMS/
├── server/                     # Express Backend
│   ├── config/
│   │   ├── db.js               # MongoDB connector with auto-fallback check
│   │   └── jsonDb.js           # Mongoose CRUD query simulator for JSON file
│   ├── models/                 # Unified Schemas (User, Track, Progress)
│   ├── routes/                 # API controllers (auth, tracks, progress, ai)
│   ├── services/
│   │   └── automationEngine.js # Matcher, progress calculator, streak checks
│   ├── scripts/
│   │   └── seed.js             # Data seeder (Full Stack, AI, Data Analyst tracks)
│   ├── package.json
│   └── server.js               # Express startup script
├── src/                        # React Frontend
│   ├── components/             # Reusable UI (GlassCard, Navbar, AIAdvisor, Leaderboard)
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state & lesson completion hooks
│   ├── pages/                  # Views (LandingPage, AuthPage, StudentDashboard, LessonPlayer, AdminDashboard, AnalyticsPage)
│   ├── App.jsx                 # Dynamic tab routing and page transition handlers
│   ├── main.jsx                # DOM mounter
│   └── index.css               # Tailwind CSS directives & glassmorphic utility classes
├── package.json                # Frontend package metadata
├── tailwind.config.js          # Tailwind styling tokens
└── vite.config.js              # Vite bundler options
```

---

## 🔑 Demo Credentials

### Student Account:
*   **Email**: `student@lms.com`
*   **Password**: `Password123`
*   **Attributes**: Career goal as *Full Stack Developer*, pre-assigned progress with 2 completed lessons to demonstrate the active dashboard.

### Admin Account:
*   **Email**: `admin@lms.com`
*   **Password**: `Password123`
*   **Attributes**: Grants access to the **Admin Console** and **System Analytics** tabs.

---

## ⚙️ Setup & Installation

### Step 1: Install Dependencies
Open a terminal in the root folder and install frontend components:
```bash
npm install
```

Open a second terminal inside the `server/` directory and install backend packages:
```bash
cd server
npm install
```

### Step 2: Run Development Servers

**To start the Backend Server:**
Inside the `server/` directory, run:
```bash
npm run dev
```
*Note: The server will automatically seed the initial tracks, student profile, and admin profile if the database (MongoDB or JSON) is empty.*

**To start the Frontend Client:**
Inside the root workspace folder, run:
```bash
npm run dev
```
Click the local URL outputted by Vite (usually `http://localhost:5173`) to view the application in your browser.

---

## 🛣️ API Routes Summary
*   `POST /api/auth/register` - Registers student or admin.
*   `POST /api/auth/login` - Validates credentials and yields a JWT token.
*   `GET /api/auth/me` - Profile info retrieval.
*   `GET /api/tracks` - Lists learning tracks.
*   `POST /api/tracks` - (Admin only) Creates a new track.
*   `POST /api/tracks/assign` - Assigns a track (automatically recommends depending on career goal).
*   `GET /api/progress` - Fetches progress metrics with dynamic unlocked/locked module states.
*   `POST /api/progress/complete-lesson` - Marks a lesson as completed, rewards XP, and handles unlocking transitions.
*   `GET /api/progress/leaderboard` - Returns top student rankings.
*   `GET /api/progress/certificate/:trackId` - Returns metadata for completion certificates if track is at 100%.
*   `POST /api/ai/chat` - Submits prompt to the learning assistant chatbot.
