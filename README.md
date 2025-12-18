# PropManage - Hausverwaltungssoftware

*Property Management System built with Next.js, Supabase, and TypeScript*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/marcus-banners-projects/v0-build-app-from-concept)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/hNW03nf7K7X)

## 🚀 Quick Start

### 1. First-Time Setup

**Navigate to the setup page and click "Start Setup":**
```
https://your-domain.com/setup
```

This will automatically:
- ✅ Create all database tables
- ✅ Enable Row Level Security
- ✅ Set up triggers and indexes
- ✅ Create admin user
- ✅ Seed demo data

### 2. Login

After setup completes, login with:
- **Email:** `admin@propmanage.de`
- **Password:** `RealCore2025`

### 3. Access the App

- **Admin Dashboard:** `/admin` - Manage properties, tenants, invoices
- **Tenant Portal:** `/portal` - View apartments, invoices, submit maintenance requests
- **Property Manager:** `/manager` - View assignments, complete tasks
- **Landing Page:** `/` - Public website with quote request form

## 🏗️ Architecture

### Frontend Applications

1. **Admin Dashboard** (`/admin`)
   - Property & unit management
   - Tenant management
   - Invoice & payment tracking
   - Appointment scheduling
   - Maintenance request handling
   - Quote request management

2. **Tenant Portal** (`/portal`)
   - View apartment details
   - View & pay invoices
   - Submit maintenance requests
   - View contract information

3. **Property Manager App** (`/manager`)
   - Mobile-optimized interface
   - View assigned appointments
   - Complete maintenance tasks
   - Track work progress

4. **Landing Page** (`/`)
   - Modern, responsive design
   - Feature showcase
   - Quote request form
   - Contact information

### Backend Services

- **Supabase** - PostgreSQL database with Row Level Security
- **Next.js API Routes** - Server actions for all operations
- **Supabase Auth** - User authentication and authorization

### Database Schema

- **profiles** - User information and roles
- **properties** - Building information
- **units** - Individual apartments/units
- **contracts** - Rental agreements
- **invoices** - Billing records
- **payments** - Payment tracking
- **appointments** - Scheduled tasks
- **maintenance_requests** - Tenant issue reporting
- **messages** - Internal communication
- **quote_requests** - New customer inquiries

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Environment Variables

The following variables are automatically configured when using Vercel + Supabase integration:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Navigate to setup page
open http://localhost:3000/setup
```

## 🐛 Troubleshooting

### Setup Issues

If automatic setup fails:

1. **Create exec_sql function manually:**
   - Go to Supabase Dashboard → SQL Editor
   - Run `scripts/000_create_exec_function.sql`

2. **Use Debug Tools:**
   - Navigate to `/debug/sql` to run scripts individually
   - Navigate to `/debug/admin` to manually create admin user

3. **Check Environment Variables:**
   - Verify Supabase integration is connected
   - Check that all env vars are set in Vercel dashboard

### Common Errors

- **"exec_sql function does not exist"** → Run `scripts/000_create_exec_function.sql`
- **"Multiple GoTrueClient instances"** → Refresh page (harmless warning)
- **Login fails** → Ensure setup completed successfully and admin user was created

## 📚 Documentation

- **SETUP_QUICK.md** - Detailed setup instructions
- **DEBUG_SQL.md** - SQL debugging guide
- **SETUP.md** - Manual setup procedures

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control (Admin, Property Manager, Tenant, Employee)
- Secure password hashing via Supabase Auth
- API routes protected with authentication middleware

## 📝 License

Built with [v0.app](https://v0.app)

## 🔗 Links

- **Live App:** [https://vercel.com/marcus-banners-projects/v0-build-app-from-concept](https://vercel.com/marcus-banners-projects/v0-build-app-from-concept)
- **v0 Chat:** [https://v0.app/chat/hNW03nf7K7X](https://v0.app/chat/hNW03nf7K7X)
```

```tsx file="" isHidden
