# Event Planning Application

A full-stack event planning platform where users can create, manage, and browse events with secure authentication, tagging/filtering, and RSVP support.

## Tech Stack

- Frontend: `React` + `TypeScript` + `Vite`
- Backend: `Node.js` + `Express` + `TypeScript`
- Database: `PostgreSQL`
- Query Builder: `Knex.js`
- Validation: `Zod` (frontend + backend)
- HTTP Client: Axios (with interceptors for attaching JWT, handling refresh tokens, and global error handling)
- Data Fetching/Caching: `@tanstack/react-query`
- UI: `Tailwind CSS` + shadcn-style reusable components
- Logger : Pinston (structured logging, levels like info/error/debug, request tracing, and environment-based formatting)
- Auth: `JWT` with cookie-based session flow

## Core Features Implemented

### Events
- Create events (title, description, date/time, location, type, tags)
- Edit existing events
- Delete events
- Browse event listings
- View single event details
- Event filtering by tags and event type
- Pagination for event listings

### Tags & Categories
- Create tags
- Delete tags
- Search tags
- Assign multiple tags to events

### Authentication & Authorization
- User registration and login
- Authenticated user session (`/auth/me`)
- Logout flow
- Route protection and ownership-based authorization for event modifications

### RSVP
- RSVP to events (`yes` / `maybe` / `no`)
- RSVP counts displayed in event details

## Engineering Decisions

### 1) Layered Full-Stack Architecture
- **Decision:** Kept frontend and backend as separate applications with a clear API contract.
- **Why:** Improves separation of concerns and maintainability in a real-world team setup.
- **Trade-off:** Requires explicit DTO/contract consistency between apps.

### 2) React + TypeScript + Vite on Frontend
- **Decision:** Used Vite with TypeScript for fast local development and safer refactoring.
- **Why:** Tight feedback loop and strong typing reduce UI regressions.
- **Trade-off:** Requires stricter type discipline and linting overhead.

### 3) TanStack Query for Server State
- **Decision:** Used React Query for events/tags/auth-dependent API state.
- **Why:** Simplifies cache invalidation, async loading/error states, and mutation workflows.
- **Trade-off:** Adds a state abstraction layer that team members must understand.

### 4) Validation on Both Frontend and Backend
- **Decision:** Applied Zod validation in form layer and server middleware.
- **Why:** Frontend gives fast feedback; backend remains the source of truth for integrity/security.
- **Trade-off:** Some validation rules are duplicated conceptually across layers.

### 5) JWT Cookie-Based Auth with Refresh Flow
- **Decision:** Used auth cookies (`withCredentials`) and refresh-token endpoint support.
- **Why:** Keeps tokens off local storage and improves session continuity.
- **Trade-off:** Requires careful CORS/cookie configuration across frontend/backend origins.

### 6) Authorization via Ownership Rules
- **Decision:** Enforced authenticated access and event-owner-only edit/delete behavior.
- **Why:** Protects user resources and aligns with multi-user security requirements.
- **Trade-off:** More backend checks and error handling paths in controllers.

### 7) Relational Modeling with Knex + PostgreSQL
- **Decision:** Used normalized relational schema and Knex migrations.
- **Why:** Clear data relationships and portable schema evolution.
- **Trade-off:** Requires writing explicit SQL-like query logic rather than ORM conveniences.

### 8) Database Design for Flexibility
- **Decision:** Used join tables and separate resources for many-to-many and participation data.
- **Why:** Supports growth without denormalized duplication.
- **Core entities:** `users`, `events`, `tags`, `event_tags`, `rsvps`.

### 9) Normalized Relational Schema (3NF-Oriented)
- **Decision:** Designed the schema in a normalized form where each table owns one domain concept and relationships are modeled via foreign keys/join tables.
- **Why:** Reduces redundancy, prevents update anomalies, and keeps data consistent as features scale.
- **How it is applied:**
  - `users` stores user identity/auth profile data once.
  - `events` stores event data and references creator via `created_by`.
  - `tags` stores tag definitions independently.
  - `event_tags` resolves many-to-many relation between events and tags (instead of storing arrays/CSV inside `events`).
  - `rsvps` stores participation state per user per event, decoupled from `events`.
- **Trade-off:** Reads require joins for composed views (event + tags + RSVP summary), but this is preferred over duplicated or inconsistent data.

### 10) RESTful API Organization
- **Decision:** Resource-oriented routing under `/api/v1` with dedicated route modules.
- **Why:** Predictable endpoint design and easier integration testing/debugging.
- **Trade-off:** Requires deliberate versioning strategy for future breaking changes.

### 11) Reusable UI Components & Consistent UX
- **Decision:** Built reusable components like shared form fields, modals, and confirm alerts.
- **Why:** Reduces duplication and keeps behavior/UI consistent (delete/logout confirmations).
- **Trade-off:** Initial setup time is higher than page-local UI wiring.

## High-Level Project Structure

```text
Event Management/
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      validators/
  backend/
    src/
      controllers/
      db/
        migrations/
      middlewares/
      routes/
      validators/
```

## API Surface (High-Level)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/events`
- `GET /api/v1/events/:eventId`
- `POST /api/v1/events`
- `PATCH /api/v1/events/:eventId`
- `DELETE /api/v1/events/:eventId`
- `GET /api/v1/tags`
- `POST /api/v1/tags`
- `PATCH /api/v1/tags/:tagId`
- `DELETE /api/v1/tags/:tagId`
- `GET /api/v1/rsvps/:eventId`
- `POST /api/v1/rsvps/:eventId`

## Setup Instructions

### Prerequisites

- `Node.js` 20+ (recommended)
- `npm`
- `Docker` + `Docker Compose` (for backend containerized setup)

---

### Backend Setup (Docker + Local Development)

Backend uses PostgreSQL and can be run in a Dockerized environment. Frontend remains local.

#### 1) Go to backend

```bash
cd backend
```

#### 2) Configure environment

Create/update `backend/.env` (example values):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/devdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=devdb
JWT_EXPIRES_IN=1h
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:5173
```

> If your DB runs outside Docker (local Postgres), update `DATABASE_URL` host accordingly (e.g., `localhost`).

#### 3) Install dependencies

```bash
npm install
```

#### 4) Run database migrations

```bash
npx knex --knexfile knexfile.ts --env development migrate:latest
```

#### 5) (Optional) Seed database

```bash
npx knex --knexfile knexfile.ts --env development seed:run
```

#### 6) Start backend server

```bash
npm run dev
```

Backend API runs at: `http://localhost:3000/api/v1`

---

### Frontend Setup (Local, No Docker)

Frontend runs locally with Vite.

#### 1) Go to frontend

```bash
cd frontend
```

#### 2) Install dependencies

```bash
npm install
```

#### 3) Configure environment

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

#### 4) Start frontend

```bash
npm run dev
```

Frontend app runs at: `http://localhost:5173`

---

### Run Order

1. Start backend (and ensure DB is reachable).
2. Start frontend.
3. Open `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

- `PORT`: Backend server port.
- `NODE_ENV`: Environment (`development` / `production`).
- `DATABASE_URL`: PostgreSQL connection string.
- `POSTGRES_USER`: DB user.
- `POSTGRES_PASSWORD`: DB password.
- `POSTGRES_DB`: DB name.
- `JWT_EXPIRES_IN`: Access token expiry.
- `JWT_SECRET`: Access token secret.
- `JWT_REFRESH_SECRET`: Refresh token secret.
- `FRONTEND_URL`: Allowed frontend origin for CORS.

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL`: API base URL used by Axios client.

## Assumptions

- **Private event visibility:** Private events are not visible in public browsing for non-authorized users. Access is intended through a private/join link workflow.
- **Private event participation:** A private event can be joined only through its join link (or equivalent direct private access flow), not via public listing discovery.
- **Tag fetch strategy:** Tags are globally available for selection (not restricted to only self-created tags in the default flow).
- **Initial tag fetch limit:** Tag queries are limited to an initial batch of 20 results to reduce payload size and improve UI responsiveness.
- **Search-driven tag loading:** Users can search for additional tags beyond the initial batch; search acts as the primary optimization path for discovery.
- **Per-user tag filtering as optional:** Fetching tags for a specific user is optional and can be left out of the default global tag picker behavior.
- **Creator vs organizer role:** The user who creates an event is not automatically treated as an organizer role in business semantics.
- **Creator RSVP independence:** Event creators can still decide RSVP status (`yes`/`maybe`/`no`) like any other user.

