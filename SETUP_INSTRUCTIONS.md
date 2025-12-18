# Datenbank Setup Anleitung

Die Datenbank-Scripte schlagen fehl, weil die `exec_sql` Funktion nicht existiert. 

## Lösung: Manuelles Setup über Supabase Dashboard

1. **Öffnen Sie das Supabase Dashboard:**
   - Gehen Sie zu https://supabase.com/dashboard
   - Wählen Sie Ihr Projekt aus
   - Navigieren Sie zu "SQL Editor"

2. **Führen Sie diese Scripte in folgender Reihenfolge aus:**

### Schritt 1: exec_sql Funktion erstellen
```sql
-- Kopieren Sie den Inhalt von scripts/000_create_exec_function.sql
```

### Schritt 2: Datenbank zurücksetzen
```sql
-- Kopieren Sie den Inhalt von scripts/000_reset_database.sql
```

### Schritt 3: Schema erstellen
```sql
-- Kopieren Sie den Inhalt von scripts/001_create_schema.sql
```

### Schritt 4: RLS aktivieren
```sql
-- Kopieren Sie den Inhalt von scripts/002_enable_rls.sql
```

### Schritt 5: Trigger erstellen
```sql
-- Kopieren Sie den Inhalt von scripts/003_create_triggers.sql
```

### Schritt 6: Admin-User anlegen

**Option A: Über die App (empfohlen)**
- Gehen Sie zu `/setup`
- Klicken Sie auf "Start Setup"
- Der Admin-User wird automatisch angelegt

**Option B: Manuell im Supabase Dashboard**
1. Gehen Sie zu "Authentication" → "Users"
2. Klicken Sie auf "Add User" → "Create new user"
3. Email: `admin@propmanage.de`
4. Password: `RealCore2025`
5. Bestätigen Sie die Email (toggle "Auto Confirm Email")
6. Nach dem Erstellen, kopieren Sie die User-ID
7. Fügen Sie das Profil ein:

```sql
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES ('IHRE-USER-ID-HIER', 'admin@propmanage.de', 'Admin', 'User', 'admin');
```

## Häufige Probleme

**Problem: "exec_sql function does not exist"**
- Lösung: Führen Sie zuerst `scripts/000_create_exec_function.sql` aus

**Problem: "relation public.profiles does not exist"**
- Lösung: Script 001 wurde nicht erfolgreich ausgeführt. Führen Sie es erneut aus.

**Problem: "column tenant_id does not exist"**
- Lösung: Die Tabellen sind unvollständig. Führen Sie das Reset-Script (000) aus, dann Schema (001).

**Problem: "trigger already exists"**
- Lösung: Das ist OK. Die Scripte sind idempotent. Der Trigger existiert bereits und muss nicht neu erstellt werden.

## Nach dem Setup

1. Öffnen Sie `/auth/login`
2. Melden Sie sich an mit:
   - Email: `admin@propmanage.de`
   - Passwort: `RealCore2025`
3. Sie werden zum Admin-Dashboard weitergeleitet

## Alternative: Debug-Seite verwenden

Die `/debug/sql` Seite zeigt alle Scripte an und kann sie einzeln ausführen. Dies ist hilfreich um zu sehen, wo genau ein Fehler auftritt.
