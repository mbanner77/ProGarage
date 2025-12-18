"use server"

import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { UserRole } from "@prisma/client"

export async function getUsers() {
  console.log("[v0] getUsers action called")

  try {
    const data = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    console.log("[v0] getUsers successful, count:", data.length)
    return { data }
  } catch (error) {
    console.error("[v0] getUsers exception:", error)
    return { error: String(error) }
  }
}

export async function getUsersByRole(roles: UserRole[]) {
  console.log("[v0] getUsersByRole action called with roles:", roles)

  try {
    const data = await prisma.user.findMany({
      where: { role: { in: roles } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    console.log("[v0] getUsersByRole successful, count:", data.length)
    return { data }
  } catch (error) {
    console.error("[v0] getUsersByRole exception:", error)
    return { error: String(error) }
  }
}

export async function getTenants() {
  console.log("[v0] getTenants action called")

  try {
    const data = await prisma.user.findMany({
      where: { role: "tenant" },
      orderBy: { lastName: "asc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    console.log("[v0] getTenants successful, count:", data.length)
    return { data }
  } catch (error) {
    console.error("[v0] getTenants exception:", error)
    return { error: String(error) }
  }
}

export async function getManagers() {
  console.log("[v0] getManagers action called")

  try {
    const data = await prisma.user.findMany({
      where: { role: { in: ["admin", "property_manager"] } },
      orderBy: { lastName: "asc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    console.log("[v0] getManagers successful, count:", data.length)
    return { data }
  } catch (error) {
    console.error("[v0] getManagers exception:", error)
    return { error: String(error) }
  }
}

export async function getJanitors() {
  try {
    const data = await prisma.user.findMany({
      where: { role: "janitor" },
      orderBy: { lastName: "asc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getJanitors exception:", error)
    return { error: String(error) }
  }
}

export async function getStaffUsers() {
  try {
    const data = await prisma.user.findMany({
      where: { role: { in: ["admin", "property_manager", "janitor"] } },
      orderBy: [{ role: "asc" }, { lastName: "asc" }],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getStaffUsers exception:", error)
    return { error: String(error) }
  }
}

export async function getUserById(id: string) {
  console.log("[v0] getUserById action called with id:", id)

  try {
    const data = await prisma.user.findUnique({
      where: { id },
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

    if (!data) {
      return { error: "User not found" }
    }

    console.log("[v0] getUserById successful")
    return { data }
  } catch (error) {
    console.error("[v0] getUserById exception:", error)
    return { error: String(error) }
  }
}

export async function createUser(user: {
  email: string
  password: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  role?: UserRole
}) {
  console.log("[v0] createUser action called with email:", user.email)

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (existingUser) {
      return { error: "Ein Benutzer mit dieser E-Mail existiert bereits" }
    }

    const hashedPassword = await hashPassword(user.password)

    const data = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role || "tenant",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    console.log("[v0] createUser successful, ID:", data.id)
    revalidatePath("/admin/tenants")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createUser exception:", error)
    return { error: String(error) }
  }
}

export async function updateUser(id: string, user: {
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  role?: UserRole
  avatarUrl?: string | null
}) {
  console.log("[v0] updateUser action called with id:", id)

  try {
    const data = await prisma.user.update({
      where: { id },
      data: user,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        updatedAt: true,
      },
    })

    console.log("[v0] updateUser successful")
    revalidatePath("/admin/tenants")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateUser exception:", error)
    return { error: String(error) }
  }
}

export async function deleteUser(id: string) {
  console.log("[v0] deleteUser action called with id:", id)

  try {
    await prisma.user.delete({
      where: { id },
    })

    console.log("[v0] deleteUser successful")
    revalidatePath("/admin/tenants")
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteUser exception:", error)
    return { error: String(error) }
  }
}
