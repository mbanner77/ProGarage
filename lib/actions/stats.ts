"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAdminStats() {
  const supabase = await createClient()

  // Get total properties
  const { count: propertiesCount } = await supabase.from("properties").select("*", { count: "exact", head: true })

  // Get total tenants
  const { count: tenantsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "tenant")

  // Get active contracts
  const { count: activeContracts } = await supabase
    .from("contracts")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Get pending invoices
  const { data: pendingInvoices } = await supabase.from("invoices").select("amount").eq("status", "pending")

  const pendingAmount = pendingInvoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0

  // Get overdue invoices
  const { count: overdueCount } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("status", "overdue")

  // Get open maintenance requests
  const { count: maintenanceCount } = await supabase
    .from("maintenance_requests")
    .select("*", { count: "exact", head: true })
    .neq("status", "completed")

  // Get today's appointments
  const today = new Date().toISOString().split("T")[0]
  const { count: todayAppointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .gte("appointment_date", today)
    .lt("appointment_date", `${today}T23:59:59`)

  return {
    properties: propertiesCount || 0,
    tenants: tenantsCount || 0,
    activeContracts: activeContracts || 0,
    pendingAmount,
    overdueInvoices: overdueCount || 0,
    openMaintenance: maintenanceCount || 0,
    todayAppointments: todayAppointments || 0,
  }
}
