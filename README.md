# NextGen Academy

NextGen Academy is a training-platform project for **Agence Digital Services**. It combines a public Angular sales website with a Next.js backend prepared for protected course delivery, Supabase authentication/data, Bunny.net video embeds, single-device access control, dynamic video watermarking, and Resend email alerts.

## Project Structure

```text
.
+-- Frontend/        # Angular landing page and purchase flow
`-- backend/         # Next.js API/backend, Supabase helpers, migrations
```

## Features

- Public landing page for a bundle of 30 training courses and 10 language programs.
- Angular routes for:
  - `/` - landing page
  - `/purchase` - account creation and payment/contact page
- Course catalog sections, testimonials, social proof, pricing, Instagram CTA, and WhatsApp links.
- Backend foundation for Supabase SSR auth and protected API routes.
- Supabase database migrations for users, courses, lessons, progress tracking, and RLS policies.
- Device fingerprint validation to limit student access to one device.
- Bunny.net signed video embed URL helper.
- Canvas watermark helper for overlaying student identifiers on video containers.
- Resend email helper for suspicious device login alerts.

## Tech Stack

### Frontend

- Angular 21
- TypeScript
- SCSS
- Angular Router

### Backend

- Next.js 16
- TypeScript
- Supabase SSR and Supabase JS
- Bunny.net video delivery helper
- Resend email API
- Jose

### Database

- Supabase PostgreSQL
- Row Level Security policies
- Tables: `users`, `courses`, `lessons`, `progress`

## Requirements

- Node.js 20 or newer is recommended.
- npm
- A Supabase project
- Bunny.net video library and token key
- Resend API key

## Environment Variables

Create `backend/.env.local` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-never-share-this

BUNNY_LIBRARY_ID=your-bunny-library-id
BUNNY_TOKEN_KEY=your-bunny-token-key-for-video-signatures

RESEND_API_KEY=re_your-resend-api-key
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `BUNNY_TOKEN_KEY`, or `RESEND_API_KEY` in frontend code.

## Installation

Install dependencies in both applications:

```bash
cd Frontend
npm install

cd ../backend
npm install
```

## Running Locally

Start the Angular frontend:

```bash
cd Frontend
npm start
```

By default, Angular serves the app at:

```text
http://localhost:4200
```

Start the Next.js backend:

```bash
cd backend
npm run dev
```

By default, Next.js serves the backend at:

```text
http://localhost:3000
```

## Available Scripts

### Frontend

```bash
npm start      # Run Angular development server
npm run build  # Build Angular app
npm run watch  # Build in watch mode
npm test       # Run Angular tests
```

### Backend

```bash
npm run dev    # Run Next.js development server
npm run build  # Build backend
npm start      # Start production server
```

## Supabase Setup

Apply the migrations in `backend/supabase/migrations` to your Supabase database in order:

1. `001_users.sql` - creates public user profiles linked to `auth.users`
2. `002_courses.sql` - creates the course catalog table
3. `003_lessons.sql` - creates lessons with Bunny.net video IDs
4. `004_progress.sql` - tracks watch progress and completion
5. `005_rls.sql` - enables Row Level Security and access policies

The schema supports:

- automatic profile creation when a Supabase auth user signs up
- admin users via `users.is_admin`
- published course visibility for normal users
- admin-only course and lesson management
- per-user progress records
- user profile/device restrictions

## Backend Notes

The backend currently includes shared infrastructure and placeholder route handlers:

- `GET /` returns `{ "message": "Hello world!" }`
- `GET /[slug]` returns `{ "message": "Hello <slug>!" }`

Middleware is already prepared to protect future API routes under:

- `/api/admin`
- `/api/video`
- `/api/progress`
- `/api/user`

For protected routes, the middleware:

- refreshes the Supabase session
- requires authentication
- checks admin privileges for `/api/admin`
- validates device fingerprint for non-admin users
- blocks access when the same account is used from a different device

## Frontend Notes

The frontend is a standalone Angular app. Main UI areas include:

- navbar and mobile menu
- hero section for the 30-course/10-language package
- course curriculum carousel
- included benefits
- testimonials and review/social proof sections
- pricing CTA
- purchase form with Click to Pay placeholder and WhatsApp contact link

Static assets are stored in:

```text
Frontend/public/
```

## Deployment

Suggested deployment split:

- Deploy `Frontend` to a static hosting provider that supports Angular builds.
- Deploy `backend` to a Next.js-compatible host.
- Configure environment variables in the backend hosting dashboard.
- Run Supabase migrations before enabling protected course features.

## Current Implementation Status

Implemented:

- Angular public website and purchase page
- Supabase schema migrations and RLS policies
- Supabase client/server helpers
- backend middleware for auth, admin checks, and device locking
- Bunny.net signed embed helper
- Resend email helper
- dynamic canvas watermark helper

Still to connect:

- real checkout provider integration
- Supabase signup/login UI flow
- course dashboard and lesson player UI
- protected API route handlers for videos, progress, user, and admin actions
- production WhatsApp number and legal pages
