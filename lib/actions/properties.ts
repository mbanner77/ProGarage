"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Property } from "@/lib/types/database"

export async function getProperties() {
  console.log("[v0] getProperties action called")

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] getProperties error:", error)
      return { error: error.message }
    }

    console.log("[v0] getProperties successful, count:", data?.length || 0)
    return { data }
  } catch (error) {
    console.error("[v0] getProperties exception:", error)
    return { error: String(error) }
  }
}

export async function getPropertyById(id: string) {
  console.log("[v0] getPropertyById action called with id:", id)

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("properties").select("*, units(*)").eq("id", id).single()

    if (error) {
      console.error("[v0] getPropertyById error:", error)
      return { error: error.message }
    }

    console.log("[v0] getPropertyById successful")
    return { data }
  } catch (error) {
    console.error("[v0] getPropertyById exception:", error)
    return { error: String(error) }
  }
}

export async function createProperty(property: Omit<Property, "id" | "created_at" | "updated_at">) {
  console.log("[v0] createProperty action called with name:", property.name)

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("properties").insert(property).select().single()

    if (error) {
      console.error("[v0] createProperty error:", error)
      return { error: error.message }
    }

    console.log("[v0] createProperty successful, ID:", data?.id)
    revalidatePath("/admin/properties")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createProperty exception:", error)
    return { error: String(error) }
  }
}

export async function updateProperty(id: string, property: Partial<Property>) {
  console.log("[v0] updateProperty action called with id:", id)

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("properties").update(property).eq("id", id).select().single()

    if (error) {
      console.error("[v0] updateProperty error:", error)
      return { error: error.message }
    }

    console.log("[v0] updateProperty successful")
    revalidatePath("/admin/properties")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateProperty exception:", error)
    return { error: String(error) }
  }
}

export async function deleteProperty(id: string) {
  console.log("[v0] deleteProperty action called with id:", id)

  try {
    const supabase = await createClient()

    const { error } = await supabase.from("properties").delete().eq("id", id)

    if (error) {
      console.error("[v0] deleteProperty error:", error)
      return { error: error.message }
    }

    console.log("[v0] deleteProperty successful")
    revalidatePath("/admin/properties")
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteProperty exception:", error)
    return { error: String(error) }
  }
}
