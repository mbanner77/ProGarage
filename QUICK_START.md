# Quick Start Guide - Property Management App

## 1. Database Setup (First Time Only)

### Step 1: Create exec_sql Function
Go to your Supabase SQL Editor and run:

```sql
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;
```

### Step 2: Run Database Setup

1. Navigate to `/debug/sql` in your app
2. Click **"Run Repair Script"** first (if this is not your first setup)
3. Then click **"Run All Steps"** to create all tables
4. All steps should show green checkmarks ✅

### Step 3: Create Admin User

1. Navigate to `/debug/admin` in your app
2. The page will show if admin user exists
3. If not, use the form to create:
   - Email: `admin@propmanage.de`
   - Password: `RealCore2025`
   - Click "Create Admin User"

## 2. Login

1. Go to `/auth/login`
2. Enter your admin credentials
3. You'll be redirected to `/admin` dashboard

## 3. Common Issues

### "column does not exist" errors
- Run the **Repair Script** on `/debug/sql` page
- This fixes missing columns in existing tables

### "trigger already exists" errors
- The repair script handles this automatically
- Drops and recreates all triggers

### Can't login
- Make sure admin user was created via `/debug/admin`
- Check browser console for detailed error messages
- Verify user exists in Supabase Auth dashboard

### Multiple GoTrueClient warning
- This is harmless but fixed in the code
- Uses singleton pattern to prevent multiple instances

## 4. Next Steps

After successful setup:
- Create properties in Admin → Properties
- Add units to properties
- Create tenant users via `/auth/sign-up`
- Assign contracts to tenants
- Test the tenant portal at `/portal`
- Test the manager interface at `/manager`

## 5. Features Overview

- **Admin Dashboard** (`/admin`): Full management interface
- **Tenant Portal** (`/portal`): For tenants to view invoices, submit maintenance requests
- **Manager Interface** (`/manager`): Mobile-optimized for property managers
- **Landing Page** (`/`): Public-facing quote request form
- **Debug Tools** (`/debug/sql`, `/debug/admin`): Setup and troubleshooting

## Need Help?

Check the browser console (F12) for detailed error messages with `[v0]` prefix.
