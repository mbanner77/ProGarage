-- Repair script to fix existing tables with missing columns
-- Run this if you get "column does not exist" errors

-- Check and add missing columns to existing tables

-- Fix profiles table
DO $$ 
BEGIN
    -- Check if tenant_id exists (it shouldn't, but just in case)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'tenant_id') THEN
        -- tenant_id should not be in profiles, this is correct
        NULL;
    END IF;
END $$;

-- Fix properties table - add total_units if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'properties' 
                   AND column_name = 'total_units') THEN
        ALTER TABLE public.properties ADD COLUMN total_units INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added total_units column to properties table';
    END IF;
END $$;

-- Fix invoices table - ensure tenant_id exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'invoices' 
                   AND column_name = 'tenant_id') THEN
        -- Add tenant_id column
        ALTER TABLE public.invoices ADD COLUMN tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added tenant_id column to invoices table';
    END IF;
END $$;

-- Fix contracts table - ensure tenant_id exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'contracts' 
                   AND column_name = 'tenant_id') THEN
        ALTER TABLE public.contracts ADD COLUMN tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added tenant_id column to contracts table';
    END IF;
END $$;

-- Fix maintenance_requests table - ensure tenant_id exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'maintenance_requests' 
                   AND column_name = 'tenant_id') THEN
        ALTER TABLE public.maintenance_requests ADD COLUMN tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added tenant_id column to maintenance_requests table';
    END IF;
END $$;

-- Recreate triggers (drop first to avoid "already exists" errors)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
DROP TRIGGER IF EXISTS update_units_updated_at ON public.units;
DROP TRIGGER IF EXISTS update_contracts_updated_at ON public.contracts;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
DROP TRIGGER IF EXISTS update_maintenance_requests_updated_at ON public.maintenance_requests;
DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON public.quote_requests;

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Verify all critical columns exist
DO $$
DECLARE
    missing_columns TEXT := '';
BEGIN
    -- Check invoices.tenant_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'tenant_id') THEN
        missing_columns := missing_columns || 'invoices.tenant_id, ';
    END IF;
    
    -- Check contracts.tenant_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'contracts' AND column_name = 'tenant_id') THEN
        missing_columns := missing_columns || 'contracts.tenant_id, ';
    END IF;
    
    -- Check properties.total_units
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'total_units') THEN
        missing_columns := missing_columns || 'properties.total_units, ';
    END IF;
    
    IF missing_columns != '' THEN
        RAISE EXCEPTION 'Missing columns: %', missing_columns;
    ELSE
        RAISE NOTICE 'All required columns exist!';
    END IF;
END $$;
