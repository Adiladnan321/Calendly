# Calendly Clone

This project is a full-stack scheduling application inspired by Calendly. It allows users to set their availability, create event types, and allows others to book meetings with them.

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI library:** React 19
- **Styling:** Tailwind CSS (v4)
- **State Management / Data Fetching:** React Query (`@tanstack/react-query`)
- **Date Manipulation:** `date-fns`
- **Notifications:** `react-hot-toast`
- **Language:** TypeScript

### Backend
- **Framework:** Express.js
- **Runtime:** Node.js
- **Database ORM:** Prisma
- **Validation:** Zod
- **Date Manipulation:** `date-fns`, `date-fns-tz`
- **Language:** TypeScript

---

## Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- Optional: PostgreSQL or a SQLite database file setup depending on your Prisma provider

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
Create a `.env` file in the `backend/` directory using your database URL. For example (if using SQLite):
```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

Run database migrations to generate the schema and the Prisma client:
```bash
npm run prisma:migrate
npm run prisma:generate
```

Start the backend development server:
```bash
npm run dev
```
The backend should now be running on `http://localhost:3001`.

### 2. Frontend Setup

In a new terminal, navigate to the frontend directory:
```bash
cd Frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The frontend should now be running on `http://localhost:3000`.

---

## Assumptions Made

1. **Authentication:** Given that authentication can be complex to setup perfectly for a quick local test, the system either uses simplified / mock authentication flows (like a basic global user context middleware or simulated user login) or requires an external provider not fully configured here.
2. **Database:** Built using Prisma, meaning it's highly portable across different relational databases (PostgreSQL, MySQL, SQLite) by altering `schema.prisma` and providing a compatible `DATABASE_URL`.
3. **Timezones:** Users are assumed to book meetings across multiple timezones. The backend standardizes timezone handling and storage (likely in UTC), converting on the frontend utilizing `date-fns` and `date-fns-tz`.
