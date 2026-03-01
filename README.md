# Street Fix

Community Resource Sharing App for Informal Settlements in Blantyre, Malawi.

## Overview

Street Fix empowers residents of informal settlements (Mbayani, Chirimba, Ndirande, etc) to report issues, find community resources, and connect with neighbors.

### Features

- **Issue Reporting**: Document broken water points, sanitation problems, and waste issues with photos and GPS
- **Community Map**: Interactive map showing nearby resources (taps, clinics, waste collection points)
- **Forum**: Share tips on home improvements, emergency contacts, and community discussions
- **Neighbor Shoutouts**: Thank helpful neighbors and celebrate community spirit
- **Admin Dashboard**: Manage issues, resources, and moderate content

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Maps**: Leaflet.js with OpenStreetMap
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## Quick Start

### 1. Set up Supabase

```bash
# Create account at https://supabase.com
# Create new project
# Copy your credentials
```

### 2. Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Database Migrations

Copy the SQL from `docs/schema/DATABASE_SCHEMA.sql` and run it in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Contributing

This is a community-focused project. Contributions welcome!

## License

MIT

---

**Building better communities in Blantyre**
