# UniPlacement 
### AI-Driven Campus Placement Intelligence Platform

---

## Project Structure

```
uniplacement/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── cloudinary.js          # File upload config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── companyController.js
│   │   ├── applicationController.js
│   │   ├── analyticsController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT + RBAC
│   │   ├── errorMiddleware.js     # Centralized error handler
│   │   └── validateMiddleware.js  # Joi validation schemas
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js             # Embeds Role + Update schemas
│   │   └── Application.js         # With timeline tracking
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── aiRoutes.js
│   │   └── analyticsRoutes.js
│   ├── services/
│   │   ├── aiService.js           # OpenAI integration layer
│   │   └── pdfService.js          # PDF parsing
│   ├── scripts/
│   │   └── seed.js                # DB seed with demo data
│   ├── utils/
│   │   ├── jwt.js
│   │   └── response.js
│   ├── server.js                  # Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── app/
    │   ├── layout.jsx             # Root layout with AuthProvider
    │   ├── page.jsx               # Landing page
    │   ├── globals.css
    │   ├── auth/
    │   │   ├── login/page.jsx
    │   │   └── register/page.jsx
    │   ├── admin/
    │   │   ├── layout.jsx         # Admin route guard
    │   │   ├── dashboard/page.jsx
    │   │   ├── companies/page.jsx
    │   │   ├── applications/page.jsx
    │   │   ├── students/page.jsx
    │   │   └── analytics/page.jsx
    │   └── student/
    │       ├── layout.jsx         # Student route guard
    │       ├── dashboard/page.jsx
    │       ├── companies/page.jsx
    │       ├── applications/page.jsx
    │       ├── ai-resume/page.jsx
    │       ├── interview-prep/page.jsx
    │       └── profile/page.jsx
    ├── components/
    │   └── shared/
    │       └── Sidebar.jsx
    ├── lib/
    │   ├── api.js                 # Axios client + all API calls
    │   ├── auth-context.jsx       # Auth state + hooks
    │   └── utils.js
    ├── package.json
    ├── tailwind.config.js
    ├── next.config.js
    └── .env.local.example
```

---

## Local Setup Guide

### Prerequisites

Make sure you have installed:
- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **npm** v9+ (comes with Node.js)
- **Git** → [git-scm.com](https://git-scm.com)

---

### Step 1 — Clone / Open the project

If you created the project manually (these files), just `cd` into it:
```bash
cd uniplacement
```

---

### Step 2 — Set up the Backend

```bash
cd backend
npm install
```

Copy the environment file and fill in your values:
```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
PORT=5000
NODE_ENV=development

# Get from MongoDB Atlas → https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/uniplacement

# Generate random 32+ char strings
JWT_SECRET=your_super_secret_jwt_key_here_atleast_32_chars
JWT_REFRESH_SECRET=another_super_secret_refresh_key_here

# Get from https://cloudinary.com → Settings → API Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_openai_api_key_here

# Admin account created during seed
ADMIN_SEED_EMAIL=admin@uniplacement.ai
ADMIN_SEED_PASSWORD=Admin@123456
```

**Seed the database** with demo data:
```bash
npm run seed
```

This creates:
- 1 Admin account
- 3 Student accounts
- 3 Companies (Google, Microsoft, Infosys) with roles

**Start the backend server:**
```bash
npm run dev
# Server runs on http://localhost:5000
# Test: http://localhost:5000/api/health
```

---

### Step 3 — Set up the Frontend

Open a **new terminal tab**:

```bash
cd frontend
npm install
```

Copy and configure environment:
```bash
cp .env.local.example .env.local
```

`.env.local` should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=UniPlacement AI
```

**Start the frontend:**
```bash
npm run dev
# Runs on http://localhost:3000
```

---

### Step 4 — Open the App

Visit **http://localhost:3000**

<<<<<<< HEAD
#### Demo Login Credentials

| Role    | Email                    | Password      |
|---------|--------------------------|---------------|
| Admin   | admin@uniplacement.ai    | Admin@123456  |
| Student | arjun@student.edu        | Student@123   |
| Student | priya@student.edu        | Student@123   |
| Student | rahul@student.edu        | Student@123   |

---
=======
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6

## External Services Setup

### MongoDB Atlas (Free Tier)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user (username + password)
4. Add IP `0.0.0.0/0` to Network Access (for dev)
5. Click "Connect" → "Drivers" → copy the connection string
6. Replace `<password>` in the URI with your DB user password

### Cloudinary (Free Tier)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Paste into `.env`

### OpenAI API
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add billing (pay-as-you-go, ~$0.001 per resume analysis)
4. Paste key into `.env`

---

## API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Login (Admin + Student) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET  | `/api/auth/me` | Get current user |

### Companies
| Method | Endpoint | Access |
|--------|----------|--------|
| GET    | `/api/companies` | All |
| POST   | `/api/companies` | Admin |
| GET    | `/api/companies/:id` | All |
| PUT    | `/api/companies/:id` | Admin |
| DELETE | `/api/companies/:id` | Admin |
| POST   | `/api/companies/:id/roles` | Admin |
| GET    | `/api/companies/:id/eligibility` | Student |

### Applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST   | `/api/applications` | Student |
| GET    | `/api/applications/my` | Student |
| GET    | `/api/applications` | Admin |
| PUT    | `/api/applications/:id/status` | Admin |

### AI
| Method | Endpoint | Access |
|--------|----------|--------|
| POST   | `/api/ai/analyze-resume` | Student |
| POST   | `/api/ai/generate-interview-prep` | Student |
| POST   | `/api/ai/mock-interview` | Student |

### Analytics
| Method | Endpoint | Access |
|--------|----------|--------|
| GET    | `/api/analytics/admin/overview` | Admin |
| GET    | `/api/analytics/admin/department-participation` | Admin |
| GET    | `/api/analytics/admin/applications-per-company` | Admin |
| GET    | `/api/analytics/student/me` | Student |

---

##  Deployment Guide

### Backend → Render.com

1. Push your `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add all environment variables from `.env`
6. Deploy!

### Frontend → Vercel

1. Push your `frontend/` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g. `https://uniplacement-api.onrender.com/api`)
5. Deploy!

---

## 🏗️ Extending the App

### Add a new page (Frontend)
```
frontend/app/student/new-feature/page.jsx
```
It will auto-register as `/student/new-feature` route.

### Add a new API endpoint (Backend)
1. Add controller function in `controllers/`
2. Add route in `routes/`
3. Register route in `server.js`

### Add new AI feature
Extend `services/aiService.js` with a new function and expose it through `controllers/aiController.js`

---

## Quick Test Commands

```bash
# Test API health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uniplacement.ai","password":"Admin@123456"}'
```

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh tokens) |
| File Storage | Cloudinary |
| AI | OpenAI GPT-4o-mini |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Deploy FE | Vercel |
| Deploy BE | Render / Railway |

---

<<<<<<< HEAD
Built with for UniPlacement 
=======
Built with for UniPlacement 
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
