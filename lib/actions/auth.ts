"use server"

import { prisma } from "@/lib/db"
import { hashPassword, verifyPassword, createSession, deleteSession, getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { UserRole } from "@prisma/client"

export async function signUp(formData: {
  email: string
  password: string
  fullName: string
  role?: UserRole
}) {
  console.log("[v0] signUp action called with email:", formData.email)

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    })

    if (existingUser) {
      return { error: "Ein Benutzer mit dieser E-Mail existiert bereits" }
    }

    const hashedPassword = await hashPassword(formData.password)
    const [firstName, ...lastNameParts] = formData.fullName.split(" ")
    const lastName = lastNameParts.join(" ") || null

    const user = await prisma.user.create({
      data: {
        email: formData.email,
        password: hashedPassword,
        firstName,
        lastName,
        role: formData.role || "tenant",
      },
    })

    await createSession({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    })

    console.log("[v0] signUp successful, user ID:", user.id)
    return { data: { user }, success: true }
  } catch (error) {
    console.error("[v0] signUp exception:", error)
    return { error: String(error) }
  }
}

export async function signIn(email: string, password: string) {
  console.log("[v0] signIn action called with email:", email)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "Ungültige Anmeldedaten" }
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return { error: "Ungültige Anmeldedaten" }
    }

    await createSession({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    })

    console.log("[v0] signIn successful, user ID:", user.id)
    return { data: { user }, success: true }
  } catch (error) {
    console.error("[v0] signIn exception:", error)
    return { error: String(error) }
  }
}

export async function signOut() {
  console.log("[v0] signOut action called")

  try {
    await deleteSession()
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
    const session = await getSession()

    if (!session) {
      console.log("[v0] No session found")
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      console.log("[v0] No user found")
      return null
    }

    console.log("[v0] User found, ID:", user.id, "role:", user.role)
    return { user, profile: user }
  } catch (error) {
    console.error("[v0] getCurrentUser exception:", error)
    return null
  }
}
