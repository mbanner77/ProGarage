-- Enable Row Level Security on all tables
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

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage properties" ON public.properties;
DROP POLICY IF EXISTS "Tenants can view properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage units" ON public.units;
DROP POLICY IF EXISTS "Tenants can view own unit" ON public.units;
DROP POLICY IF EXISTS "Admins can manage contracts" ON public.contracts;
DROP POLICY IF EXISTS "Tenants can view own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;
DROP POLICY IF EXISTS "Tenants can view own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "Assigned users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Tenants can create maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Tenants can view own maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Admins can manage maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Users can view sent messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view received messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update received messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Tenants can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can create quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can manage quote requests" ON public.quote_requests;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Properties policies
CREATE POLICY "Admins can manage properties" ON public.properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
    )
  );

CREATE POLICY "Tenants can view properties" ON public.properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      JOIN public.units u ON c.unit_id = u.id
      WHERE c.tenant_id = auth.uid() AND u.property_id = properties.id
    )
  );

-- Units policies
CREATE POLICY "Admins can manage units" ON public.units
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
    )
  );

CREATE POLICY "Tenants can view own unit" ON public.units
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE tenant_id = auth.uid() AND unit_id = units.id
    )
  );

-- Contracts policies
CREATE POLICY "Admins can manage contracts" ON public.contracts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
    )
  );

CREATE POLICY "Tenants can view own contracts" ON public.contracts
  FOR SELECT USING (auth.uid() = tenant_id);

-- Invoices policies
CREATE POLICY "Admins can manage invoices" ON public.invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
    )
  );

CREATE POLICY "Tenants can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = tenant_id);

-- Appointments policies
CREATE POLICY "Admins can manage appointments" ON public.appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager', 'employee')
    )
  );

CREATE POLICY "Assigned users can view appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = assigned_to);

-- Added maintenance_requests RLS policies
CREATE POLICY "Tenants can create maintenance requests" ON public.maintenance_requests
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Tenants can view own maintenance requests" ON public.maintenance_requests
  FOR SELECT USING (auth.uid() = tenant_id);

CREATE POLICY "Admins can manage maintenance requests" ON public.maintenance_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager', 'employee')
    )
  );

-- Messages policies
CREATE POLICY "Users can view sent messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "Users can view received messages" ON public.messages
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received messages" ON public.messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Payments policies
CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
    )
  );

CREATE POLICY "Tenants can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE id = payments.invoice_id AND tenant_id = auth.uid()
    )
  );

-- Quote requests policies (public can insert, admins can manage)
CREATE POLICY "Anyone can create quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage quote requests" ON public.quote_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'property_manager')
    )
  );
