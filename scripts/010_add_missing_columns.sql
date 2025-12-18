-- Add missing columns to existing tables
-- This script is idempotent and can be run multiple times safely

-- Add missing columns to profiles table
DO $$ 
BEGIN
  -- Add first_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'first_name') THEN
    ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
  END IF;

  -- Add last_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'last_name') THEN
    ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
  END IF;

  -- Add phone if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;

  -- Add avatar_url if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Add missing columns to properties table
DO $$ 
BEGIN
  -- Add total_units if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'properties' 
                 AND column_name = 'total_units') THEN
    ALTER TABLE public.properties ADD COLUMN total_units INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- Add description if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'properties' 
                 AND column_name = 'description') THEN
    ALTER TABLE public.properties ADD COLUMN description TEXT;
  END IF;
END $$;

-- Add missing columns to invoices table
DO $$ 
BEGIN
  -- Add tenant_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'invoices' 
                 AND column_name = 'tenant_id') THEN
    -- First add the column as nullable
    ALTER TABLE public.invoices ADD COLUMN tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    
    -- Try to populate it from contracts if possible
    UPDATE public.invoices i
    SET tenant_id = c.tenant_id
    FROM public.contracts c
    WHERE i.contract_id = c.id AND i.tenant_id IS NULL;
  END IF;
END $$;
