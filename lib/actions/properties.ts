"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getProperties() {
  console.log("[v0] getProperties action called")

  try {
    const data = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        propertyManager: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    })

    console.log("[v0] getProperties successful, count:", data.length)
    return { data }
  } catch (error) {
    console.error("[v0] getProperties exception:", error)
    return { error: String(error) }
  }
}

export async function getPropertyById(id: string) {
  console.log("[v0] getPropertyById action called with id:", id)

  try {
    const data = await prisma.property.findUnique({
      where: { id },
      include: {
        units: true,
        propertyManager: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    })

    if (!data) {
      return { error: "Property not found" }
    }

    console.log("[v0] getPropertyById successful")
    return { data }
  } catch (error) {
    console.error("[v0] getPropertyById exception:", error)
    return { error: String(error) }
  }
}

export async function createProperty(input: FormData | {
  name: string
  address: string
  city: string
  postalCode: string
  description?: string | null
  propertyManagerId?: string | null
}) {
  // Handle both FormData and object input
  const property = input instanceof FormData ? {
    name: input.get("name") as string,
    address: input.get("address") as string,
    city: input.get("city") as string,
    postalCode: input.get("postal_code") as string || input.get("postalCode") as string,
    description: input.get("description") as string || null,
    propertyManagerId: input.get("property_manager_id") as string || null,
  } : input

  console.log("[v0] createProperty action called with name:", property.name)

  try {
    const data = await prisma.property.create({
      data: {
        name: property.name,
        address: property.address,
        city: property.city,
        postalCode: property.postalCode,
        description: property.description,
        propertyManagerId: property.propertyManagerId,
      },
    })

    console.log("[v0] createProperty successful, ID:", data.id)
    revalidatePath("/admin/properties")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createProperty exception:", error)
    return { error: String(error) }
  }
}

export async function updateProperty(id: string, property: {
  name?: string
  address?: string
  city?: string
  postalCode?: string
  description?: string | null
  propertyManagerId?: string | null
}) {
  console.log("[v0] updateProperty action called with id:", id)

  try {
    const data = await prisma.property.update({
      where: { id },
      data: property,
    })

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
    await prisma.property.delete({
      where: { id },
    })

    console.log("[v0] deleteProperty successful")
    revalidatePath("/admin/properties")
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteProperty exception:", error)
    return { error: String(error) }
  }
}
