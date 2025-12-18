"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { QuoteRequest } from "@/lib/types/database"

export async function submitQuoteRequest(request: Omit<QuoteRequest, "id" | "created_at" | "status">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("quote_requests").insert(request).select().single()

  if (error) {
    return { error: error.message }
  }

  return { data, success: true }
}

export async function getQuoteRequests() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateQuoteStatus(id: string, status: QuoteRequest["status"]) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("quote_requests").update({ status }).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/quotes")
  return { data, success: true }
}
