export type UserRole = "admin" | "employee" | "tenant" | "property_manager"

export type UnitStatus = "vacant" | "occupied" | "maintenance"

export type ContractStatus = "active" | "terminated" | "expired"

export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled"

export type AppointmentStatus = "pending" | "in_progress" | "completed" | "cancelled"

export type AppointmentType = "maintenance" | "inspection" | "showing" | "other"

export type Priority = "low" | "medium" | "high" | "urgent"

export type MaintenanceStatus = "submitted" | "in_progress" | "completed" | "rejected"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  description: string | null
  property_manager_id: string | null
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  property_id: string
  unit_number: string
  floor: number | null
  size_sqm: number | null
  rooms: number | null
  monthly_rent: number | null
  status: UnitStatus
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  unit_id: string
  tenant_id: string
  start_date: string
  end_date: string | null
  monthly_rent: number
  deposit: number | null
  status: ContractStatus
  contract_file_url: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  contract_id: string
  invoice_number: string
  amount: number
  due_date: string
  paid_date: string | null
  status: InvoiceStatus
  description: string | null
  external_invoice_url: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  invoice_id: string
  amount: number
  payment_date: string
  payment_method: string | null
  reference_number: string | null
  created_at: string
}

export interface Appointment {
  id: string
  property_id: string | null
  unit_id: string | null
  assigned_to: string | null
  title: string
  description: string | null
  appointment_date: string | null
  status: AppointmentStatus
  priority: Priority
  type: AppointmentType
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceRequest {
  id: string
  unit_id: string
  tenant_id: string
  title: string
  description: string
  priority: Priority
  status: MaintenanceStatus
  assigned_to: string | null
  images: string[] | null
  created_at: string
  updated_at: string
}

export interface QuoteRequest {
  id: string
  full_name: string
  email: string
  phone: string | null
  property_count: number | null
  message: string | null
  status: "new" | "contacted" | "converted" | "rejected"
  created_at: string
}
