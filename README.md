# TrustLocal — Local Skilled Services Trust & Discovery Platform

> **"Find. Verify. Compare. Connect."**
> A trust-first digital identity and discovery platform for local skilled services (electricians, plumbers, AC technicians, appliance repair, computer technicians, mechanics, and house contractors). Starting with a pilot in **Dehradun, Uttarakhand**.

---

## 🌟 Core Architecture & Principles

1. **Unified Results**: Technicians, local workshops, registered service companies, and construction contractors all appear in a single searchable interface.
2. **Evidence-Based Trust Score (0–100)**: A multi-factor algorithmic score evaluated across 10 evidence components. Badges and trust points **cannot be purchased**; advertising affects visibility only, never credibility.
3. **Direct Contact**: Customers connect directly with providers via phone call (`tel:`) and WhatsApp (`wa.me`). No forced intermediary dispatch or booking commission.
4. **Structured Comparison**: Side-by-side comparison matrix for 2 to 4 providers evaluating ratings, experience, trust points, price indications, and verified badges.
5. **Two-Sided Portals**: Full self-serve **Provider Dashboard** for business operations and an **Admin Operations Center** for auditing verification evidence and resolving dispute complaints.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Route Handlers)
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider with bcrypt password hashing)
- **Role-Based Access Control (RBAC)**: `CUSTOMER`, `PROVIDER`, `ADMIN`
- **UI & Styling**: Tailwind CSS, Shadcn/ui design patterns, Lucide Icons
- **Language**: TypeScript throughout

---

## 📊 Trust Score Engine (`src/lib/trust-score.ts`)

The Trust Score evaluates service providers on a scale of 0 to 100 based on verified real-world evidence:

| Component | Max Points | Description |
|---|---|---|
| **Profile Completeness** | 10 pts | Description, avatar, contact details, pricing notes, and service area |
| **Identity Verification** | 10 pts | Government identity (Aadhaar/Voter ID) physically or digitally audited |
| **Phone Verification** | 5 pts | Working direct phone number verified |
| **Location Verification** | 5 pts | Workshop physical address or utility bill proof in Dehradun |
| **Experience Evidence** | 10 pts | Trade diploma, ITI certificate, apprenticeship, or verified years in trade |
| **Completed Work Count** | 10 pts | Scale based on logged customer engagements |
| **Portfolio Evidence** | 15 pts | Real job site photographs, before/after documentation, project specs |
| **Verified Reviews** | 15 pts | Authentic multi-factor customer feedback |
| **Rating Consistency** | 10 pts | High multi-factor average (Quality, Pricing, Timeliness, Behavior) |
| **Complaint Deductions** | Variable | Validated customer complaints deduct 5 to 25 points |

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/trustlocal?schema=public"
NEXTAUTH_SECRET="super-secret-development-key-trustlocal-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Push & Migrations
Initialize the schema in your PostgreSQL database:
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Comprehensive Dehradun Data
Populate the database with realistic Dehradun trade professionals, services, portfolio projects, and reviews:
```bash
npm run prisma:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts (Seeded)

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@trustlocal.in` | `admin123` | Full access to `/admin` operations center |
| **Provider (AC & HVAC)** | `ramesh.ac@example.com` | `password123` | Ramesh Sharma AC (Trust Score: 93) |
| **Provider (Contractor)** | `rawat.build@example.com` | `password123` | Rawat Civil Contractors (Trust Score: 95) |
| **Provider (Electrician)** | `shiva.elec@example.com` | `password123` | Shiva Electricals & Lighting (Trust Score: 84) |
| **Customer** | `rahul.verma@example.com` | `password123` | Active customer with saved providers & reviews |

---

## 📱 Platform Pages & Routes

### Public Discovery & Customers
- `/` — Homepage with pilot city search, popular categories, and Trust Score explainer
- `/search` — Unified discovery engine with search filters (category, provider type, locality, min trust score, min rating, availability)
- `/provider/[slug]` — Detailed provider profile with portfolio, pricing, badges, review breakdown, and direct contact CTAs
- `/compare` — Structured side-by-side comparison dock for 2–4 selected providers
- `/saved` — Customer bookmark shortlist
- `/reviews` — Customer submitted feedback history
- `/complaints` — Customer dispute reports and resolution status

### Provider Portal (`/dashboard/provider`)
- `/dashboard/provider` — Overview dashboard with Trust Score audit and contact click analytics
- `/dashboard/provider/profile` — Business details, service area, and specializations
- `/dashboard/provider/services` — Rate card, visit charges, and custom pricing
- `/dashboard/provider/portfolio` — Project showcase with job photos, budget, and locality
- `/dashboard/provider/verification` — Submit trade licenses, ID, and workshop evidence
- `/dashboard/provider/availability` — Real-time availability status and working hours
- `/dashboard/provider/reviews` — Customer feedback with provider reply capability

### Admin Operations Center (`/admin`)
- `/admin` — System overview with pending verifications and unresolved complaint metrics
- `/admin/providers` — Provider approval, suspension, and Trust Score monitoring
- `/admin/verifications` — Audit queue for trade diplomas, licenses, and business documents
- `/admin/complaints` — Investigation queue for fake claims, misconduct, and Trust Score penalties
- `/admin/categories` — Service taxonomy and subcategory management

---

## 📄 License
MIT License. Built for trust and transparency in skilled trade services.
