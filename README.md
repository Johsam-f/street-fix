# Street Fix

Community Resource Sharing App for Informal Settlements in Blantyre, Malawi.

## Overview

Street Fix empowers residents of informal settlements (Mbayani, Ntopwa, Ndirande) to report issues, find community resources, and connect with neighbors.

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
cp docs-w/.env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Install Dependencies

```bash
npm install
# Or use the install script
./docs-w/INSTALL_PACKAGES.sh
```

### 4. Run Database Migrations

Copy the SQL from `docs-w/DATABASE_SCHEMA.sql` and run it in Supabase SQL Editor.

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
