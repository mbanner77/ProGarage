"use server"

import { createClient } from "@/lib/supabase/server"
import type { AuthResponse } from "@supabase/supabase-js"

type StepCallback = (index: number, status: "running" | "success" | "error", message?: string) => void

export async function setupDatabase(onStep: StepCallback) {
  const supabase = await createClient()

  let authData: AuthResponse | null = null

  try {
    console.log("[v0] Setup database started")

    // Step 0: Reset Database
    onStep(0, "running")
    try {
      const resetSQL = `
        -- Drop all tables in correct order (respecting foreign keys)
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
        
        -- Drop functions
        DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
        DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
        
        -- Drop types (in reverse dependency order)
        DROP TYPE IF EXISTS maintenance_status CASCADE;
        DROP TYPE IF EXISTS contract_status CASCADE;
        DROP TYPE IF EXISTS appointment_status CASCADE;
        DROP TYPE IF EXISTS invoice_status CASCADE;
        DROP TYPE IF EXISTS user_role CASCADE;
      `

      const { error: resetError } = await supabase.rpc("exec_sql", { query: resetSQL })
      if (resetError) throw new Error(`Reset failed: ${resetError.message}`)

      onStep(0, "success", "Database reset complete")
      console.log("[v0] Step 0 complete: Reset")
    } catch (error: any) {
      console.error("[v0] Step 0 error:", error)
      onStep(0, "error", error.message)
      throw error
    }

    // Step 1: Create Schema
    onStep(1, "running")
    try {
      const schemaSQL = `
        -- Extensions
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";

        -- Enums
        CREATE TYPE user_role AS ENUM ('admin', 'property_manager', 'tenant', 'employee');
        CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
        CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
        CREATE TYPE contract_status AS ENUM ('active', 'expired', 'terminated');
        CREATE TYPE maintenance_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

        -- Profiles
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          role user_role NOT NULL DEFAULT 'tenant',
          avatar_url TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Properties
        CREATE TABLE public.properties (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          postal_code TEXT NOT NULL,
          description TEXT,
          total_units INTEGER NOT NULL DEFAULT 0,
          property_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Units
        CREATE TABLE public.units (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
          unit_number TEXT NOT NULL,
          floor INTEGER,
          size_sqm NUMERIC(10,2),
          rooms NUMERIC(3,1),
          monthly_rent NUMERIC(10,2) NOT NULL,
          is_occupied BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(property_id, unit_number)
        );

        -- Contracts
        CREATE TABLE public.contracts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
          tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          start_date DATE NOT NULL,
          end_date DATE,
          monthly_rent NUMERIC(10,2) NOT NULL,
          deposit NUMERIC(10,2),
          status contract_status NOT NULL DEFAULT 'active',
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Invoices
        CREATE TABLE public.invoices (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          invoice_number TEXT NOT NULL UNIQUE,
          contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
          tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          amount NUMERIC(10,2) NOT NULL,
          due_date DATE NOT NULL,
          paid_date DATE,
          status invoice_status NOT NULL DEFAULT 'draft',
          description TEXT,
          external_invoice_id TEXT,
          created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Appointments
        CREATE TABLE public.appointments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT,
          property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
          unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
          assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          scheduled_date TIMESTAMPTZ NOT NULL,
          completed_date TIMESTAMPTZ,
          status appointment_status NOT NULL DEFAULT 'scheduled',
          priority TEXT DEFAULT 'medium',
          notes TEXT,
          created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Maintenance Requests
        CREATE TABLE public.maintenance_requests (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          priority TEXT DEFAULT 'medium',
          status maintenance_status NOT NULL DEFAULT 'pending',
          assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          resolved_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Messages
        CREATE TABLE public.messages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          subject TEXT NOT NULL,
          body TEXT NOT NULL,
          is_read BOOLEAN NOT NULL DEFAULT FALSE,
          parent_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Payments
        CREATE TABLE public.payments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
          amount NUMERIC(10,2) NOT NULL,
          payment_date DATE NOT NULL,
          payment_method TEXT,
          reference_number TEXT,
          notes TEXT,
          created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Quote Requests
        CREATE TABLE public.quote_requests (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          company_name TEXT,
          property_count INTEGER,
          message TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Indexes
        CREATE INDEX idx_profiles_role ON public.profiles(role);
        CREATE INDEX idx_profiles_email ON public.profiles(email);
        CREATE INDEX idx_properties_manager ON public.properties(property_manager_id);
        CREATE INDEX idx_units_property ON public.units(property_id);
        CREATE INDEX idx_contracts_tenant ON public.contracts(tenant_id);
        CREATE INDEX idx_invoices_tenant ON public.invoices(tenant_id);
        CREATE INDEX idx_appointments_property ON public.appointments(property_id);
        CREATE INDEX idx_maintenance_tenant ON public.maintenance_requests(tenant_id);
      `

      const { error: schemaError } = await supabase.rpc("exec_sql", { query: schemaSQL })
      if (schemaError) throw new Error(`Schema creation failed: ${schemaError.message}`)

      onStep(1, "success", "Schema created successfully")
      console.log("[v0] Step 1 complete: Schema")
    } catch (error: any) {
      console.error("[v0] Step 1 error:", error)
      onStep(1, "error", error.message)
      throw error
    }

    // Step 2: Enable RLS
    onStep(2, "running")
    try {
      const rlsSQL = `
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

        -- Profile policies
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
        CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );

        -- Property policies
        CREATE POLICY "Admins can manage properties" ON public.properties FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'property_manager'))
        );

        -- Unit policies
        CREATE POLICY "Admins can manage units" ON public.units FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'property_manager'))
        );

        -- Contract policies
        CREATE POLICY "Admins can manage contracts" ON public.contracts FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'property_manager'))
        );
        CREATE POLICY "Tenants can view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = tenant_id);

        -- Invoice policies
        CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'property_manager'))
        );
        CREATE POLICY "Tenants can view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = tenant_id);

        -- Appointment policies
        CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'property_manager', 'employee'))
        );

        -- Maintenance policies
        CREATE POLICY "Tenants can create maintenance requests" ON public.maintenance_requests FOR INSERT WITH CHECK (auth.uid() = tenant_id);
        CREATE POLICY "Tenants can view own maintenance requests" ON public.maintenance_requests FOR SELECT USING (auth.uid() = tenant_id);
        CREATE POLICY "Admins can manage maintenance requests" ON public.maintenance_requests FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'property_manager', 'employee'))
        );

        -- Quote policies
        CREATE POLICY "Anyone can create quote requests" ON public.quote_requests FOR INSERT WITH CHECK (true);
        CREATE POLICY "Admins can manage quote requests" ON public.quote_requests FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'property_manager'))
        );
      `

      const { error: rlsError } = await supabase.rpc("exec_sql", { query: rlsSQL })
      if (rlsError) throw new Error(`RLS policies enable failed: ${rlsError.message}`)

      onStep(2, "success", "RLS policies enabled")
      console.log("[v0] Step 2 complete: RLS policies")
    } catch (error: any) {
      console.error("[v0] Step 2 error:", error)
      onStep(2, "error", error.message)
      throw error
    }

    // Step 3: Create Triggers
    onStep(3, "running")
    try {
      const triggerSQL = `
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON public.maintenance_requests
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
      `

      const { error: triggerError } = await supabase.rpc("exec_sql", { query: triggerSQL })
      if (triggerError) throw new Error(`Triggers creation failed: ${triggerError.message}`)

      onStep(3, "success", "Triggers created")
      console.log("[v0] Step 3 complete: Triggers")
    } catch (error: any) {
      console.error("[v0] Step 3 error:", error)
      onStep(3, "error", error.message)
      throw error
    }

    // Step 4: Create Admin User
    onStep(4, "running")
    try {
      console.log("[v0] Creating admin user...")

      const { data, error: authError } = await supabase.auth.admin.createUser({
        email: "admin@propmanage.de",
        password: "RealCore2025",
        email_confirm: true,
        user_metadata: {
          first_name: "Admin",
          last_name: "User",
          role: "admin",
        },
      })

      if (authError) {
        console.error("[v0] Auth error:", authError)
        throw new Error(`Failed to create admin user: ${authError.message}`)
      }

      authData = data
      console.log("[v0] Admin user created in auth, ID:", authData.user.id)

      // Create profile
      const profileSQL = `
        INSERT INTO public.profiles (id, email, first_name, last_name, role)
        VALUES ('${authData.user.id}', 'admin@propmanage.de', 'Admin', 'User', 'admin')
        ON CONFLICT (id) DO UPDATE SET role = 'admin', first_name = 'Admin', last_name = 'User';
      `

      const { error: profileError } = await supabase.rpc("exec_sql", { query: profileSQL })
      if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`)

      onStep(4, "success", "Admin user created (admin@propmanage.de / RealCore2025)")
      console.log("[v0] Step 4 complete: Admin user")
    } catch (error: any) {
      console.error("[v0] Step 4 error:", error)
      onStep(4, "error", error.message)
      throw error
    }

    // Step 5: Seed Demo Data
    onStep(5, "running")
    try {
      const demoDataSQL = `
        -- Insert demo property
        INSERT INTO public.properties (id, name, address, city, postal_code, total_units, property_manager_id)
        VALUES (
          '11111111-1111-1111-1111-111111111111',
          'Residenz am Park',
          'Parkstraße 123',
          'Berlin',
          '10115',
          12,
          '${authData.user.id}'
        );

        -- Insert demo units
        INSERT INTO public.units (property_id, unit_number, floor, size_sqm, rooms, monthly_rent, is_occupied)
        VALUES 
          ('11111111-1111-1111-1111-111111111111', '1A', 1, 75.5, 3, 1200.00, false),
          ('11111111-1111-1111-1111-111111111111', '1B', 1, 85.0, 3.5, 1400.00, false),
          ('11111111-1111-1111-1111-111111111111', '2A', 2, 65.0, 2.5, 1000.00, false);
      `

      const { error: demoDataError } = await supabase.rpc("exec_sql", { query: demoDataSQL })
      if (demoDataError) throw new Error(`Demo data seeding failed: ${demoDataError.message}`)

      onStep(5, "success", "Demo data seeded")
      console.log("[v0] Step 5 complete: Demo data")
    } catch (error: any) {
      console.error("[v0] Step 5 error:", error)
      onStep(5, "error", error.message)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Setup database error:", error)
    return { success: false, error: error.message }
  }
}
