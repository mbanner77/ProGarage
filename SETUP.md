# Hausverwaltungs-App - Setup Anleitung

## Datenbank Setup

### Schritt 1: Extensions aktivieren
Führen Sie im Supabase SQL Editor aus:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Schritt 2: Enum Typen erstellen
```sql
CREATE TYPE user_role AS ENUM ('admin', 'property_manager', 'tenant', 'employee');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE contract_status AS ENUM ('active', 'expired', 'terminated');
CREATE TYPE maintenance_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
```

### Schritt 3: Tabellen erstellen
Führen Sie die SQL-Befehle aus `scripts/001_create_schema.sql` aus.

### Schritt 4: RLS aktivieren
Führen Sie die SQL-Befehle aus `scripts/002_enable_rls.sql` aus.

### Schritt 5: Trigger erstellen
Führen Sie die SQL-Befehle aus `scripts/003_create_triggers.sql` aus.

### Schritt 6: Admin-User erstellen

**Option A: Über Supabase Auth UI (Empfohlen)**
1. Gehen Sie zu Authentication > Users im Supabase Dashboard
2. Klicken Sie auf "Add user"
3. Email: admin@propmanage.de
4. Passwort: RealCore2025
5. Nach der Erstellung, führen Sie folgendes SQL aus:

```sql
UPDATE public.profiles 
SET role = 'admin', 
    first_name = 'Admin', 
    last_name = 'User'
WHERE email = 'admin@propmanage.de';
```

**Option B: Über SQL (Komplex)**
```sql
-- Admin User manuell anlegen
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@propmanage.de',
  crypt('RealCore2025', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Profil anlegen (verwenden Sie die UUID aus dem obigen INSERT)
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT id, email, 'Admin', 'User', 'admin'::user_role
FROM auth.users
WHERE email = 'admin@propmanage.de';
```

### Schritt 7: Test-Daten (Optional)
Führen Sie `scripts/004_seed_data.sql` aus für Demo-Daten.

## Login-Informationen

- **Admin**: admin@propmanage.de / RealCore2025
- **Landing Page**: http://localhost:3000
- **Admin Dashboard**: Nach Login wird automatisch zu /admin weitergeleitet
- **Mieter Portal**: /portal (nur für Mieter)
- **Hausmeister App**: /manager (nur für Property Manager)

## Troubleshooting

### "Policies not allowing access"
Stellen Sie sicher, dass alle RLS Policies korrekt angelegt wurden (Schritt 4).

### "User can't login"
- Überprüfen Sie, ob der User in `auth.users` existiert
- Überprüfen Sie, ob ein Profil in `public.profiles` existiert
- Überprüfen Sie die `email_confirmed_at` in auth.users (sollte nicht NULL sein)

### "Role not set correctly"
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@propmanage.de';
