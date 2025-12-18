"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { MaintenanceRequest } from "@/lib/types/database"

export async function getMaintenanceRequests() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(
      `
      *,
      unit:units(*, property:properties(*)),
      tenant:profiles!maintenance_requests_tenant_id_fkey(*),
      assigned:profiles!maintenance_requests_assigned_to_fkey(*)
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getMyMaintenanceRequests() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(
      `
      *,
      unit:units(*, property:properties(*))
    `,
    )
    .eq("tenant_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function createMaintenanceRequest(
  request: Omit<MaintenanceRequest, "id" | "created_at" | "updated_at" | "tenant_id" | "assigned_to">,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("maintenance_requests")
    .insert({
      ...request,
      tenant_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/maintenance")
  return { data, success: true }
}

export async function updateMaintenanceStatus(id: string, status: MaintenanceRequest["status"], assigned_to?: string) {
  const supabase = await createClient()

  const updateData: Partial<MaintenanceRequest> = { status }
  if (assigned_to) {
    updateData.assigned_to = assigned_to
  }

  const { data, error } = await supabase.from("maintenance_requests").update(updateData).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/maintenance")
  revalidatePath("/manager/maintenance")
  revalidatePath("/portal/maintenance")
  return { data, success: true }
}
