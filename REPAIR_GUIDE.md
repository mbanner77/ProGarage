# Database Repair Guide

## Quick Fix for Column Errors

If you see errors like:
- `column "tenant_id" does not exist`
- `column "total_units" does not exist`
- `column "first_name" does not exist`
- `trigger already exists`

**Solution:**

1. Go to `/debug/sql` in your browser
2. Click the **"Run Repair Steps"** button (blue button)
3. Wait for all steps to complete (should show green checkmarks)
4. Then click **"Run All Steps"** to complete the setup

## What the Repair Does

The repair process:
1. Creates the trigger function first (avoids trigger errors)
2. Adds missing columns to `profiles` table (first_name, last_name, phone, avatar_url)
3. Adds missing columns to `properties` table (total_units, description)
4. Adds missing `tenant_id` column to `invoices` table
5. Drops and recreates all triggers (fixes "already exists" errors)

## Manual SQL Repair

If the automated repair doesn't work, you can run this SQL directly in Supabase SQL Editor:

```sql
-- Run scripts/010_add_missing_columns.sql
-- This script is idempotent and safe to run multiple times
```

## After Repair

Once repair is complete:
1. All column errors should be resolved
2. All trigger errors should be resolved
3. You can proceed with normal database operations
4. Create admin user at `/debug/admin`

## Still Having Issues?

1. Check the browser console for detailed error messages
2. Verify Supabase connection in environment variables
3. Try the **Reset Database** option (⚠️ deletes all data!)
4. Contact support with error logs
