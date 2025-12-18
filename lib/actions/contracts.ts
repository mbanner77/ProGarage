"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Contract } from "@/lib/types/database"

export async function getContracts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("contracts")
    .select(
      `
      *,
      tenant:profiles!contracts_tenant_id_fkey(*),
      unit:units(*, property:properties(*))
    `,
    )
    .order("start_date", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getTenantContract() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("contracts")
    .select(
      `
      *,
      unit:units(*, property:properties(*))
    `,
    )
    .eq("tenant_id", user.id)
    .eq("status", "active")
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function createContract(contract: Omit<Contract, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").insert(contract).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/contracts")
  revalidatePath("/admin/tenants")
  return { data, success: true }
}

export async function updateContractStatus(id: string, status: Contract["status"]) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contracts").update({ status }).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/contracts")
  return { data, success: true }
}

export async function deleteContract(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("contracts").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/contracts")
  return { success: true }
}
