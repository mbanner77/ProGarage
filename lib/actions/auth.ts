"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { UserRole } from "@/lib/types/database"

export async function signUp(formData: {
  email: string
  password: string
  fullName: string
  role?: UserRole
}) {
  console.log("[v0] signUp action called with email:", formData.email)

  try {
    const supabase = await createClient()
    console.log("[v0] Supabase client created for signUp")

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role || "tenant",
        },
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error("[v0] signUp error:", error)
      return { error: error.message }
    }

    console.log("[v0] signUp successful, user ID:", data.user?.id)
    return { data, success: true }
  } catch (error) {
    console.error("[v0] signUp exception:", error)
    return { error: String(error) }
  }
}

export async function signIn(email: string, password: string) {
  console.log("[v0] signIn action called with email:", email)

  try {
    const supabase = await createClient()
    console.log("[v0] Supabase client created for signIn")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[v0] signIn error:", error)
      return { error: error.message }
    }

    console.log("[v0] signIn successful, user ID:", data.user?.id)
    return { data, success: true }
  } catch (error) {
    console.error("[v0] signIn exception:", error)
    return { error: String(error) }
  }
}

export async function signOut() {
  console.log("[v0] signOut action called")

  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    console.log("[v0] signOut successful")
    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
    console.error("[v0] signOut exception:", error)
    throw error
  }
}

export async function getCurrentUser() {
  console.log("[v0] getCurrentUser action called")

  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No user found")
      return null
    }

    console.log("[v0] User found, ID:", user.id)

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("[v0] Error fetching profile:", error)
    } else {
      console.log("[v0] Profile fetched, role:", profile?.role)
    }

    return { user, profile }
  } catch (error) {
    console.error("[v0] getCurrentUser exception:", error)
    return null
  }
}
