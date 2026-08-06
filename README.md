# Dream Homes PG — Website

A full-featured PG accommodation website built with Next.js + Tailwind CSS.

## Pages Included

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, features, featured PGs, testimonials |
| All PGs | `/pgs` | Listing with filter by type/locality/budget |
| PG Detail | `/pgs/[slug]` | Gallery, rooms, amenities, enquiry form |
| Raise Complaint | `/complaints` | 2-step complaint form with categories |
| Track Complaint | `/track` | Track by complaint ID |
| Room Alert | `/availability` | Register for room availability notification |
| Admin Login | `/admin/login` | Owner login (demo: owner@dreamhomespg.com / admin123) |
| Admin Dashboard | `/admin/dashboard` | Manage complaints, enquiries, PGs, alerts |

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

### 3. Build for Production
```bash
npm run build
npm start
```

## Connecting to Supabase (Next Steps)

1. Create a free project at https://supabase.com
2. Run the SQL schema (see below) in Supabase SQL Editor
3. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
4. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Create `lib/supabaseClient.js`:
   ```js
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   )
   ```
6. Replace dummy data in `data/dummyPgs.js` with Supabase queries

## SQL Schema (Supabase)

```sql
-- Run this in Supabase SQL Editor

create table owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique,
  email text unique,
  business_name text,
  created_at timestamptz default now()
);

create table pgs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references owners(id),
  name text not null,
  slug text unique not null,
  pg_type text check (pg_type in ('boys','girls','co-living')),
  description text,
  address text,
  city text,
  locality text,
  total_rooms int,
  available_rooms int,
  food_included boolean default false,
  food_type text,
  electricity_included boolean default false,
  curfew_time text,
  notice_period_days int,
  cover_image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table room_types (
  id uuid primary key default gen_random_uuid(),
  pg_id uuid references pgs(id) on delete cascade,
  type text,
  rent_per_month int,
  security_deposit int,
  total_units int,
  available_units int,
  ac boolean default false,
  attached_bathroom boolean default false,
  furniture_included boolean default true
);

create table amenities (
  id serial primary key,
  name text unique
);

create table pg_amenities (
  pg_id uuid references pgs(id) on delete cascade,
  amenity_id int references amenities(id),
  primary key (pg_id, amenity_id)
);

create table pg_images (
  id uuid primary key default gen_random_uuid(),
  pg_id uuid references pgs(id) on delete cascade,
  image_url text,
  caption text,
  display_order int,
  created_at timestamptz default now()
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  pg_id uuid references pgs(id),
  visitor_name text,
  visitor_phone text,
  visitor_email text,
  room_type text,
  move_in_date date,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);

create table complaints (
  id text primary key,
  pg_id uuid references pgs(id),
  room_number text,
  student_name text,
  student_phone text,
  category text,
  description text,
  priority text default 'medium',
  status text default 'pending',
  assigned_to text,
  assigned_to_phone text,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create table availability_alerts (
  id uuid primary key default gen_random_uuid(),
  pg_id uuid references pgs(id),
  name text,
  phone text,
  room_type text,
  message text,
  created_at timestamptz default now()
);
```

## Deploying to Vercel

1. Push code to GitHub
2. Go to https://vercel.com → New Project → Import your repo
3. Add environment variables (Supabase URL + Key)
4. Deploy — done!

## Owner Info to Update

Edit `data/dummyPgs.js` → `ownerInfo` object:
- Change name, phone, whatsapp, email

## Admin Login (Demo)
- Email: owner@dreamhomespg.com
- Password: admin123
(Connect Supabase Auth to make this real)
