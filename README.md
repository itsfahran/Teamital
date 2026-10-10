# Teamital website

Marketing site + admin panel for Teamital. Next.js (App Router) · React · TypeScript · Node · Supabase.

The public UI is a port of the original Flutter web site (kept for reference in `legacy-flutter/`).

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev                  # http://localhost:3000
```

### Supabase

1. In the Supabase SQL editor run `supabase/migrations/0001_init.sql`.
2. (Optional) run `supabase/seed.sql` for placeholder pricing plans.
3. Create a user under Authentication → Users, then make them an admin:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
4. Sign in at `/login` → `/admin`.

### What's in the admin panel (`/admin`)

- **Pages** – CMS pages (slug `home` drives the homepage), block editor + SEO fields, publish/unpublish.
- **Pricing plans** – shown on `/pricing`.
- **Messages** – contact-form submissions (stored in `contact_messages`).
- **Navigation** – stored link lists.

### Contact form

`POST /api/contact` stores the message in Supabase and, if `RESEND_API_KEY` is set, also emails `NEXT_PUBLIC_CONTACT_EMAIL`.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run typecheck`

Deploy anywhere that runs Next.js (e.g. Vercel); set the env vars from `.env.example`.
