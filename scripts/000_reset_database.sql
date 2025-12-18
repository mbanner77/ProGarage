-- COMPLETE DATABASE RESET
-- WARNING: This will DELETE ALL DATA!
-- This script is idempotent and can be run multiple times

-- Drop all tables (with CASCADE to handle dependencies)
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.maintenance_requests CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.units CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.quote_requests CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop all functions and triggers
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS exec_sql(text) CASCADE;

-- Drop all enum types
DROP TYPE IF EXISTS maintenance_status CASCADE;
DROP TYPE IF EXISTS contract_status CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Drop all policies (they'll be recreated)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "Users can view own profile" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can view all profiles" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage properties" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Tenants can view properties" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage units" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Tenants can view own unit" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage contracts" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Tenants can view own contracts" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage invoices" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Tenants can view own invoices" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage appointments" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Assigned users can view appointments" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Tenants can create maintenance requests" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Tenants can view own maintenance requests" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage maintenance requests" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Users can view sent messages" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Users can view received messages" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Users can send messages" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Users can update received messages" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage payments" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Tenants can view own payments" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Anyone can create quote requests" ON public.' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage quote requests" ON public.' || r.tablename;
    END LOOP;
END $$;

-- Success message
SELECT 'Database reset complete! Run scripts in order: 001 → 002 → 003 → 004' as status;
