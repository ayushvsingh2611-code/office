# Hospital Management System (HMS)  
**Patient Portal, Doctor Desk, ICU Vacancy, Lab Reports & Appointment Booking**

> **Author:** Robin – Documentation Specialist, Straw Hat Dev Crew  
> **Version:** 1.0.0 (Prototype)  
> **Last Updated:** 2026‑11‑04  

---

## 1. Project Vision & Purpose  

| **Audience** | **Pain‑Points** | **Solution** |
|--------------|-----------------|--------------|
| **Patients** | • Hard to schedule appointments<br>• No single place for lab results<br>• Lack of real‑time ICU status | • One‑stop portal for booking, viewing reports, and checking bed availability |
| **Doctors & Staff** | • Fragmented patient data<br>• Manual ICU bed tracking<br>• Time‑consuming appointment confirmations | • Unified dashboard for patient records, lab orders, and ICU status<br>• Automated notifications |
| **Hospital Administration** | • Inefficient bed utilisation<br>• No audit trail of appointments | • Real‑time ICU vacancy view<br>• Detailed logs and analytics |
| **Lab Technicians** | • No integrated ordering system | • Seamless lab order placement & result upload |

> **Goal** – Build a **scalable, secure, and user‑friendly** system that brings **all stakeholders** into a single digital ecosystem, reducing administrative overhead and improving patient outcomes.

---

## 2. Visual Identity & Architecture  

### 2.1 Layout  

| **Component** | **Placement** | **Responsiveness** |
|---------------|---------------|--------------------|
| **Header** | Top‑bar (fixed) – logo, nav, user avatar | Collapses to hamburger on <768 px |
| **Sidebar** | Left panel (collapsible) – main navigation | Hidden on <576 px, toggled via icon |
| **Main Content** | Central area – dynamic pages | Full width on mobile |
| **Footer** | Bottom – contact, links, version | Sticky on mobile |

> **Design System**: Based on **Tailwind CSS** + **Heroicons** for consistent styling.

### 2.2 Color System  

| **Purpose** | **Color** | **Hex** | **Tailwind Class** |
|-------------|-----------|---------|--------------------|
| Primary | Soft Blue | #1E90FF | `bg-blue-600` |
| Secondary | Light Gray | #F5F5F5 | `bg-gray-100` |
| Success | Green | #28A745 | `bg-green-500` |
| Warning | Orange | #FFC107 | `bg-yellow-400` |
| Error | Red | #DC3545 | `bg-red-500` |
| Accent | Teal | #20C997 | `bg-teal-500` |

### 2.3 Architecture Diagram  

```
┌───────────────────────┐
│      Frontend (React) │
│   - Patient Portal    │
│   - Doctor Desk       │
│   - Admin Dashboard   │
└───────────┬───────────┘
            │ REST API
┌───────────▼───────────┐
│  Backend (Node.js)    │
│  - Express Router      │
│  - JWT Auth Middleware │
│  - MongoDB (Local)     │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│  External Services    │
│  - Email/SMS (Mock)   │
│  - Cloud Storage      │
└───────────────────────┘
```

> **Note:** All services are containerised; the database is **MongoDB** (local for demo, cloud for production).  
> **Security** – HTTPS enforced, JWT for auth, rate limiting, input validation.

---

## 3. Key Features & Workflows  

| **Feature** | **Workflow** | **Key UI Elements** |
|-------------|--------------|---------------------|
| **Patient Registration & Login** | 1. Sign‑up → 2. Verify email → 3. Login | Sign‑up form, 2FA toggle |
| **Appointment Booking** | 1. Select doctor → 2. Pick date/time → 3. Confirm | Calendar picker, doctor list, confirmation modal |
| **Lab Order & Report** | 1. Doctor orders test → 2. Lab tech uploads result → 3. Patient views | Order form, file upload, PDF viewer |
| **ICU Vacancy Dashboard** | 1. Admin selects ICU → 2. View real‑time bed status → 3. Book bed | Grid view, color‑coded beds, live updates |
| **Doctor Desk** | 1. View patient list → 2. Access records → 3. Update notes | Patient table, record tabs |
| **Patient Portal** | 1. View appointments → 2. Download reports → 3. Request lab | Appointment list, report card |
| **Notifications** | 1. Trigger event (e.g., appointment booked) → 2. Send email/SMS | Email template, SMS preview |
| **Audit Trail** | 1. Log every CRUD action → 2. Admin reviews logs | Log table, filters |

---

## 4. Honest Completion Report (MANDATORY TRANSPARENCY MATRIX)

| **Status** | **Feature** | **Implementation Notes** |
|------------|-------------|--------------------------|
| 🟢 **Fully Implemented** | Patient Registration & Login | ✔️ JWT, email verification mock |
| 🟢 | Appointment Booking | ✔️ Calendar integration, local DB persistence |
| 🟢 | Lab Order & Report | ✔️ File upload, PDF viewer |
| 🟢 | ICU Vacancy Dashboard | ✔️ Real‑time grid, mock data updates |
| 🟢 | Doctor Desk | ✔️ Patient list, record tabs |
| 🟢 | Patient Portal | ✔️ Appointment list, report download |
| 🟡 **Simulated** | Email/SMS Notifications | ✉️ Mock console logs; no real gateway |
| 🟡 | Payment for Lab Tests | ✉️ Simulated payment flow, no gateway |
| 🟡 | Cloud Storage (Lab Reports) | ✉️ Local filesystem only |
| 🟠 **Partially Implemented** | Analytics Dashboard | • Basic charts; missing export functionality |
| 🟠 | Role‑Based Access Control | • Basic roles; fine‑grained permissions pending |
| 🔵 **External Production Services Required** | Live Email/SMS | Requires SendGrid / Twilio |
| 🔵 | Cloud Database (e.g., Atlas) | Production DB needed |
| 🔵 | CI/CD Pipeline | GitHub Actions set up for tests, but not fully automated |

> **Transparency** – All incomplete or simulated parts are clearly flagged; no hidden functionality.

---

## 5. Quick Start Guide  

### 5.1 Prerequisites  

| Tool | Minimum Version | Installation |
|------|-----------------|--------------|
| Node.js | 20.x | `nvm install 20` |
| npm | 10.x | Comes with Node |
| Docker | 24.x | https://docs.docker.com/get-docker/ |
| MongoDB (local) | 7.x | `brew install mongodb-community@7` (macOS) or `apt install mongodb` |

> **Tip:** Use `nvm` to manage Node versions easily.

### 5.2 Clone & Setup  

```bash
# Clone the repo
git clone https://github.com/strawhat-dev/hms.git
cd hms

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
# Edit .env to set DB_URI, JWT_SECRET, etc.
```

### 5.3 Run Locally  

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

> **Access**  
> • Frontend: `http://localhost:5173`  
> • API: `http://localhost:4000/api`

### 5.4 Run Tests  

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test
```

---

## 6. Docker Deployment Guide  

### 6.1 Docker Compose

Create `docker-compose.yml` at repo root:

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7
    container_name: hms-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    container_name: hms-backend
    restart: unless-stopped
    env_file: .env
    depends_on:
      - mongo
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production

  frontend:
    build: ./frontend
    container_name: hms-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend:4000/api

volumes:
  mongo-data:
```

### 6.2 Build & Run

```bash
# Build images
docker compose build

# Start containers
docker compose up -d
```

> **Result** –  
> • MongoDB on `localhost:27017`  
> • Backend API on `localhost:4000`  
> • Frontend on `localhost:5173`

### 6.3 Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

> Use `docker-compose -f docker-compose.prod.yml up -d` for a production‑ready stack (includes Nginx reverse proxy, TLS, etc.).

### 6.4 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/hms` |
| `JWT_SECRET` | Secret for JWT signing | `supersecretkey` |
| `EMAIL_SERVICE` | `mock` or `sendgrid` | `mock` |
| `SMS_SERVICE` | `mock` or `twilio` | `mock` |

> **Tip:** For production, store secrets in Docker secrets or a secrets manager.

---

## 7. FAQ  

| **Question** | **Answer** |
|--------------|------------|
| **Can I add more lab tests?** | Yes – extend the `tests` collection in MongoDB and update the lab order form. |
| **How to enable real email/SMS?** | Swap `mock` services in `.env` to `sendgrid`/`twilio` and provide API keys. |
| **Is the UI responsive?** | Yes – built with Tailwind’s mobile‑first utilities. |
| **How to run unit tests?** | See *Run Tests* section. |
| **Can I host on a cloud provider?** | Absolutely – just point your domain to the Docker host and set up TLS. |

---

## 8. Contribution Guidelines  

1. Fork the repo.  
2. Create a feature branch (`feature/<short-desc>`).  
3. Write tests for new code.  
4. Submit a PR with a clear description.  
5. All PRs undergo a **code‑review** and **CI** checks.

---

### 9. License  

MIT License – see `LICENSE` file.

---

**Happy coding!** 🚀