-- Seed data for development/testing
-- Note: This creates test data. In production, you'd create real users through the auth system.

-- Insert sample admin user profile (assumes auth user already exists)
-- You'll need to sign up an admin user first, then update their role
-- This is just an example structure

-- Insert sample properties
INSERT INTO public.properties (id, name, address, city, postal_code, description, total_units)
VALUES
  (uuid_generate_v4(), 'Residenz Am Park', 'Parkstraße 123', 'Berlin', '10178', 'Moderne Wohnanlage im Herzen Berlins', 24),
  (uuid_generate_v4(), 'Altbau Charlottenburg', 'Kantstraße 45', 'Berlin', '10623', 'Charmante Altbauwohnungen', 12)
ON CONFLICT DO NOTHING;

-- Note: Units, contracts, and other data will be created through the admin interface
-- after the first admin user signs up
