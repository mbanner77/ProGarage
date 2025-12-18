"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SQLStep {
  id: string
  name: string
  sql: string
  status: "pending" | "running" | "success" | "error"
  error?: string
  duration?: number
}

export default function SQLDebugPage() {
  const [steps, setSteps] = useState<SQLStep[]>([
    {
      id: "1",
      name: "Enable Extensions",
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
      status: "pending",
    },
    {
      id: "2",
      name: "Create user_role enum",
      sql: "DO $$ BEGIN CREATE TYPE user_role AS ENUM ('admin', 'property_manager', 'tenant', 'employee'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      status: "pending",
    },
    {
      id: "3",
      name: "Create invoice_status enum",
      sql: "DO $$ BEGIN CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      status: "pending",
    },
    {
      id: "4",
      name: "Create appointment_status enum",
      sql: "DO $$ BEGIN CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      status: "pending",
    },
    {
      id: "5",
      name: "Create contract_status enum",
      sql: "DO $$ BEGIN CREATE TYPE contract_status AS ENUM ('active', 'expired', 'terminated'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      status: "pending",
    },
    {
      id: "6",
      name: "Create maintenance_status enum",
      sql: "DO $$ BEGIN CREATE TYPE maintenance_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      status: "pending",
    },
    {
      id: "7",
      name: "Create profiles table",
      sql: `CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        role user_role NOT NULL DEFAULT 'tenant',
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`,
      status: "pending",
    },
    {
      id: "8",
      name: "Create properties table",
      sql: `CREATE TABLE IF NOT EXISTS public.properties (
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
      );`,
      status: "pending",
    },
    {
      id: "9",
      name: "Create units table",
      sql: `CREATE TABLE IF NOT EXISTS public.units (
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
      );`,
      status: "pending",
    },
    {
      id: "10",
      name: "Create contracts table",
      sql: `CREATE TABLE IF NOT EXISTS public.contracts (
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
      );`,
      status: "pending",
    },
    {
      id: "11",
      name: "Create invoices table",
      sql: `CREATE TABLE IF NOT EXISTS public.invoices (
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
      );`,
      status: "pending",
    },
    {
      id: "12",
      name: "Create appointments table",
      sql: `CREATE TABLE IF NOT EXISTS public.appointments (
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
      );`,
      status: "pending",
    },
    {
      id: "13",
      name: "Create maintenance_requests table",
      sql: `CREATE TABLE IF NOT EXISTS public.maintenance_requests (
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
      );`,
      status: "pending",
    },
    {
      id: "14",
      name: "Create messages table",
      sql: `CREATE TABLE IF NOT EXISTS public.messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        parent_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`,
      status: "pending",
    },
    {
      id: "15",
      name: "Create payments table",
      sql: `CREATE TABLE IF NOT EXISTS public.payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
        amount NUMERIC(10,2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method TEXT,
        reference_number TEXT,
        notes TEXT,
        created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`,
      status: "pending",
    },
    {
      id: "16",
      name: "Create quote_requests table",
      sql: `CREATE TABLE IF NOT EXISTS public.quote_requests (
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
      );`,
      status: "pending",
    },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [showRepair, setShowRepair] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const resetSteps: SQLStep[] = [
    {
      id: "reset-1",
      name: "Drop all tables",
      sql: `
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.maintenance_requests CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.units CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.quote_requests CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;`,
      status: "pending",
    },
    {
      id: "reset-2",
      name: "Drop all triggers",
      sql: `
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties CASCADE;
DROP TRIGGER IF EXISTS update_units_updated_at ON public.units CASCADE;
DROP TRIGGER IF EXISTS update_contracts_updated_at ON public.contracts CASCADE;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices CASCADE;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments CASCADE;
DROP TRIGGER IF EXISTS update_maintenance_requests_updated_at ON public.maintenance_requests CASCADE;
DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON public.quote_requests CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS update_unit_occupancy_trigger ON public.contracts CASCADE;`,
      status: "pending",
    },
    {
      id: "reset-3",
      name: "Drop all functions",
      sql: `
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_unit_occupancy() CASCADE;`,
      status: "pending",
    },
    {
      id: "reset-4",
      name: "Drop all enum types",
      sql: `
DROP TYPE IF EXISTS maintenance_status CASCADE;
DROP TYPE IF EXISTS contract_status CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;`,
      status: "pending",
    },
  ]

  const repairSteps: SQLStep[] = [
    {
      id: "repair-1",
      name: "Create/Recreate trigger function first",
      sql: `
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
      status: "pending",
    },
    {
      id: "repair-2",
      name: "Add missing columns to profiles",
      sql: `
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'first_name') THEN
    ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
    RAISE NOTICE 'Added first_name to profiles';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_name') THEN
    ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
    RAISE NOTICE 'Added last_name to profiles';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    RAISE NOTICE 'Added phone to profiles';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    RAISE NOTICE 'Added avatar_url to profiles';
  END IF;
END $$;`,
      status: "pending",
    },
    {
      id: "repair-3",
      name: "Add missing columns to properties",
      sql: `
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'total_units') THEN
    ALTER TABLE public.properties ADD COLUMN total_units INTEGER NOT NULL DEFAULT 0;
    RAISE NOTICE 'Added total_units to properties';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'description') THEN
    ALTER TABLE public.properties ADD COLUMN description TEXT;
    RAISE NOTICE 'Added description to properties';
  END IF;
END $$;`,
      status: "pending",
    },
    {
      id: "repair-4",
      name: "Add missing tenant_id to invoices",
      sql: `
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.invoices ADD COLUMN tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added tenant_id to invoices';
    
    -- Try to populate from contracts
    UPDATE public.invoices i
    SET tenant_id = c.tenant_id
    FROM public.contracts c
    WHERE i.contract_id = c.id AND i.tenant_id IS NULL;
  END IF;
END $$;`,
      status: "pending",
    },
    {
      id: "repair-5",
      name: "Drop and recreate all triggers",
      sql: `
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
DROP TRIGGER IF EXISTS update_units_updated_at ON public.units;
DROP TRIGGER IF EXISTS update_contracts_updated_at ON public.contracts;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
DROP TRIGGER IF EXISTS update_maintenance_requests_updated_at ON public.maintenance_requests;
DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON public.quote_requests;

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON public.maintenance_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();`,
      status: "pending",
    },
  ]

  const executeStep = async (step: SQLStep) => {
    console.log("[v0] Executing SQL step:", step.name)
    console.log("[v0] SQL Query:", step.sql)

    const supabase = createClient()
    const startTime = Date.now()

    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql_query: step.sql,
      })

      const duration = Date.now() - startTime

      console.log("[v0] RPC Response:", { data, error })

      if (error) {
        console.error("[v0] SQL step failed:", step.name, error)
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
      }

      if (data && typeof data === "object" && "success" in data && !data.success) {
        console.error("[v0] SQL execution failed:", data)
        throw new Error(`SQL Error: ${data.error || "Unknown error"}\nDetail: ${data.detail || "N/A"}`)
      }

      console.log("[v0] SQL step succeeded:", step.name, `(${duration}ms)`)
      return { success: true, duration }
    } catch (error: any) {
      const duration = Date.now() - startTime
      console.error("[v0] SQL step error:", step.name, error)

      let errorMessage = error.message || String(error)
      if (error.code) {
        errorMessage += ` [Code: ${error.code}]`
      }
      if (error.hint) {
        errorMessage += ` Hint: ${error.hint}`
      }

      return { success: false, error: errorMessage, duration }
    }
  }

  const runRepairSteps = async () => {
    setIsRunning(true)
    setShowRepair(true)

    const repairStepsState = [...repairSteps]

    for (let i = 0; i < repairStepsState.length; i++) {
      repairStepsState[i].status = "running"
      setSteps([...repairStepsState])

      const result = await executeStep(repairStepsState[i])

      repairStepsState[i].status = result.success ? "success" : "error"
      repairStepsState[i].error = result.error
      repairStepsState[i].duration = result.duration

      setSteps([...repairStepsState])

      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsRunning(false)
  }

  const runAllSteps = async () => {
    setIsRunning(true)

    for (let i = 0; i < steps.length; i++) {
      setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: "running" } : s)))

      const result = await executeStep(steps[i])

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i
            ? {
                ...s,
                status: result.success ? "success" : "error",
                error: result.error,
                duration: result.duration,
              }
            : s,
        ),
      )

      if (!result.success) {
        console.error("[v0] Stopping execution at step:", steps[i].name)
        break
      }

      // Small delay between steps
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsRunning(false)
  }

  const runResetSteps = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will DELETE ALL DATA in the database!\n\nAre you absolutely sure you want to continue?",
    )

    if (!confirmed) return

    setIsRunning(true)
    setShowReset(true)

    const resetStepsState = [...resetSteps]

    for (let i = 0; i < resetStepsState.length; i++) {
      resetStepsState[i].status = "running"
      setSteps([...resetStepsState])

      const result = await executeStep(resetStepsState[i])

      resetStepsState[i].status = result.success ? "success" : "error"
      resetStepsState[i].error = result.error
      resetStepsState[i].duration = result.duration

      setSteps([...resetStepsState])

      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsRunning(false)

    alert("Database reset complete! Now run the migration steps to recreate everything.")
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">SQL Migration Debug</h1>
        <p className="text-muted-foreground">Execute SQL migrations step-by-step to identify where errors occur</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <strong>Important:</strong> This page requires a database function called `exec_sql`. First, run this in your
          Supabase SQL Editor:
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
            {`CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;`}
          </pre>
        </AlertDescription>
      </Alert>

      <Alert className="mb-6 border-orange-500 bg-orange-50">
        <AlertDescription>
          <strong>Database Issues Detected?</strong> If you see errors about missing columns or existing triggers, run
          the repair script first to fix existing database structure.
        </AlertDescription>
      </Alert>

      <Alert className="mb-6 border-red-500 bg-red-50">
        <AlertDescription>
          <strong>⚠️ Nuclear Option:</strong> If repairs don't work, you can completely reset the database and start
          fresh. This will DELETE ALL DATA!
        </AlertDescription>
      </Alert>

      <div className="mb-6 flex gap-4">
        <Button onClick={runResetSteps} disabled={isRunning} variant="destructive" className="flex-1">
          {isRunning && showReset ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Database...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Reset Database (Delete All)
            </>
          )}
        </Button>
        <Button onClick={runRepairSteps} disabled={isRunning} variant="outline" className="flex-1 bg-transparent">
          {isRunning && showRepair ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Repairing Database...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Repair Script
            </>
          )}
        </Button>
        <Button onClick={runAllSteps} disabled={isRunning} size="lg" className="flex-1">
          {isRunning && !showRepair && !showReset ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Migrations...
            </>
          ) : (
            "Run All Steps"
          )}
        </Button>
      </div>

      {showReset && (
        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-semibold mb-3 text-red-600">Reset Steps (DESTRUCTIVE)</h2>
          {resetSteps.map((step, index) => (
            <Card
              key={step.id}
              className={
                step.status === "success"
                  ? "border-green-500"
                  : step.status === "error"
                    ? "border-red-500"
                    : step.status === "running"
                      ? "border-blue-500"
                      : "border-red-300"
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {step.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                    {step.status === "running" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                    <CardTitle className="text-base">
                      Reset {index + 1}: {step.name}
                    </CardTitle>
                  </div>
                  {step.duration !== undefined && (
                    <span className="text-xs text-muted-foreground">{step.duration}ms</span>
                  )}
                </div>
                {step.error && <CardDescription className="text-red-500 mt-2">Error: {step.error}</CardDescription>}
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">{step.sql}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showRepair && (
        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-semibold mb-3">Repair Steps</h2>
          {repairSteps.map((step, index) => (
            <Card
              key={step.id}
              className={
                step.status === "success"
                  ? "border-green-500"
                  : step.status === "error"
                    ? "border-red-500"
                    : step.status === "running"
                      ? "border-blue-500"
                      : ""
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {step.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                    {step.status === "running" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                    <CardTitle className="text-base">
                      Repair {index + 1}: {step.name}
                    </CardTitle>
                  </div>
                  {step.duration !== undefined && (
                    <span className="text-xs text-muted-foreground">{step.duration}ms</span>
                  )}
                </div>
                {step.error && <CardDescription className="text-red-500 mt-2">Error: {step.error}</CardDescription>}
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">{step.sql}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-3">Migration Steps</h2>
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className={
              step.status === "success"
                ? "border-green-500"
                : step.status === "error"
                  ? "border-red-500"
                  : step.status === "running"
                    ? "border-blue-500"
                    : ""
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step.status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {step.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                  {step.status === "running" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                  <CardTitle className="text-base">
                    Step {index + 1}: {step.name}
                  </CardTitle>
                </div>
                {step.duration !== undefined && (
                  <span className="text-xs text-muted-foreground">{step.duration}ms</span>
                )}
              </div>
              {step.error && <CardDescription className="text-red-500 mt-2">Error: {step.error}</CardDescription>}
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">{step.sql}</pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
