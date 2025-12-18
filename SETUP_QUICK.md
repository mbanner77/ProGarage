# Quick Setup Guide

## One-Click Setup (Recommended)

1. **Navigate to the setup page:**
   ```
   /setup
   ```

2. **Click "Start Setup"** - This will automatically:
   - Reset the database (clean slate)
   - Create all tables and relationships
   - Enable Row Level Security
   - Create triggers for auto-updating timestamps
   - Create an admin user
   - Seed demo data

3. **Login credentials after setup:**
   - Email: `admin@propmanage.de`
   - Password: `RealCore2025`

4. **Access the app:**
   - Admin Dashboard: `/auth/login` → `/admin`
   - Landing Page: `/`
   - Tenant Portal: `/portal` (after logging in as tenant)
   - Property Manager: `/manager` (after logging in as employee)

## Troubleshooting

### If setup fails:

1. **Check Supabase Connection:**
   - Verify environment variables are set in the Vars section
   - Make sure Supabase integration is connected

2. **Create exec_sql function manually:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the script from `scripts/000_create_exec_function.sql`

3. **Try Debug Page:**
   - Navigate to `/debug/sql`
   - Run scripts individually to see specific errors

### Common Issues:

- **"exec_sql function does not exist"** → Run `scripts/000_create_exec_function.sql` in Supabase SQL Editor
- **"Multiple GoTrueClient instances"** → Refresh the page (harmless warning)
- **"Cannot read properties of null"** → Database tables not created yet, run setup

## Manual Setup (Alternative)

If automatic setup doesn't work, run these scripts in order in Supabase SQL Editor:

1. `scripts/000_create_exec_function.sql` - Create helper function
2. `scripts/000_reset_database.sql` - Clean slate
3. `scripts/001_create_schema.sql` - Create tables
4. `scripts/002_enable_rls.sql` - Enable security
5. `scripts/003_create_triggers.sql` - Create triggers
6. Then use `/debug/admin` to create the admin user
```

```tsx file="" isHidden
