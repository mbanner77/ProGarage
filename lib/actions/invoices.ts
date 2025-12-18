"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Invoice } from "@/lib/types/database"

export async function getInvoices() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      contract:contracts(
        *,
        tenant:profiles!contracts_tenant_id_fkey(*),
        unit:units(*, property:properties(*))
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getTenantInvoices() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      contract:contracts!inner(
        *,
        unit:units(*, property:properties(*))
      )
    `,
    )
    .eq("contract.tenant_id", user.id)
    .order("due_date", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function createInvoice(invoice: Omit<Invoice, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("invoices").insert(invoice).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/invoices")
  return { data, success: true }
}

export async function updateInvoiceStatus(id: string, status: Invoice["status"]) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("invoices").update({ status }).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/invoices")
  revalidatePath("/portal/invoices")
  return { data, success: true }
}
