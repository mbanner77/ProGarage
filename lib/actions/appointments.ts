"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Appointment } from "@/lib/types/database"

export async function getAppointments() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      property:properties(*),
      unit:units(*),
      assigned:profiles!appointments_assigned_to_fkey(*)
    `,
    )
    .order("appointment_date", { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getMyAppointments() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      property:properties(*),
      unit:units(*)
    `,
    )
    .eq("assigned_to", user.id)
    .order("appointment_date", { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function createAppointment(
  appointment: Omit<Appointment, "id" | "created_at" | "updated_at" | "created_by">,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      ...appointment,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/appointments")
  revalidatePath("/manager/appointments")
  return { data, success: true }
}

export async function updateAppointmentStatus(id: string, status: Appointment["status"]) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("appointments").update({ status }).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/appointments")
  revalidatePath("/manager/appointments")
  return { data, success: true }
}
