-- This script creates an admin user through Supabase Auth
-- Run this in your Supabase SQL Editor after the schema is created

-- First, check if the user already exists and delete if needed
DELETE FROM auth.users WHERE email = 'admin@propmanage.de';

-- Create the admin user using Supabase's auth functions
-- Note: In production, use Supabase Dashboard or auth.signup() instead
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@propmanage.de',
    crypt('RealCore2025', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User","role":"admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO admin_user_id;

  -- Create profile with admin role
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    admin_user_id,
    'admin@propmanage.de',
    'Admin',
    'User',
    'admin'
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin';

  -- Create identity record
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    admin_user_id,
    format('{"sub":"%s","email":"%s"}', admin_user_id::text, 'admin@propmanage.de')::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  RAISE NOTICE 'Admin user created successfully with email: admin@propmanage.de';
END $$;
