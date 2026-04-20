# DocBook – Doctor Appointment Booking App

A full-stack Next.js doctor appointment booking platform with patient, doctor, and admin panels.
Data is stored in local JSON files — no database needed.

---

## Demo Credentials

| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Admin   | admin@docapp.com   | Admin@1234  |
| Patient | Register at /register | (your choice) |

---

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo on vercel.com
3. Add env vars: JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
4. Deploy

> Note: JSON file writes won't persist on Vercel (read-only filesystem). Works great for local dev and demos. For production, connect MongoDB Atlas or Supabase.

---

## Adding Doctor Login

1. Register at /register
2. Edit data/users.json — set "role":"doctor" and "doctorId":"doc1" on that user
3. Restart server
