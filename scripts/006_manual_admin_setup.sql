-- Vereinfachtes Admin-Setup für manuelle Ausführung
-- Schritt 1: Erstellen Sie zuerst den User über Supabase Dashboard Auth UI
-- Email: admin@propmanage.de
-- Passwort: RealCore2025

-- Schritt 2: Führen Sie dieses SQL aus, um die Rolle zu setzen
UPDATE public.profiles 
SET 
  role = 'admin'::user_role,
  first_name = 'Admin',
  last_name = 'User',
  phone = '+49 123 456789',
  updated_at = NOW()
WHERE email = 'admin@propmanage.de';

-- Überprüfen Sie das Ergebnis
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.role,
  u.email_confirmed_at
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE p.email = 'admin@propmanage.de';
