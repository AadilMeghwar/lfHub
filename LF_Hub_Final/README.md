# LF_Hub — Lost & Found Hub

Full-stack university Lost & Found application built from the supplied React frontend.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: SQLite (`node:sqlite`)
- Authentication: JWT + bcrypt
- API: REST

## Requirements
- Node.js 22.5 or newer
- npm

## Run the backend
```bash
cd backend
npm install
npm run dev
```
Backend: `http://localhost:5000`

## Run the frontend
Open a second terminal:
```bash
npm install
npm run dev
```
Frontend: `http://localhost:5173`

Vite proxies `/api` requests to the Express server.

## Main functionality
- Student registration and login
- JWT-protected API
- Lost and found report creation
- Read/search/filter reports
- My Reports from the database
- Update/resolve/delete reports
- Dashboard statistics and recent reports
- Notifications stored in the database
- Profile information and notification preferences
- Validation and error responses
- SQLite database created automatically at `backend/data/lfhub.sqlite`

## API endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/reports`
- `POST /api/reports`
- `PUT /api/reports/:id`
- `DELETE /api/reports/:id`
- `PATCH /api/reports/:id/resolve`
- `GET /api/dashboard`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/health`

## Assignment alignment
The project demonstrates Express backend development, database design/integration, CRUD operations, validation/error handling, React frontend integration, readable separation of frontend/backend code, and README documentation.

## Important
The supplied frontend UI was preserved. Changes are focused on replacing static/mock data and console-only submissions with real API/database operations.
