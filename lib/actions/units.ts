"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getUnits() {
  console.log("[v0] getUnits action called")

  try {
    const data = await prisma.unit.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: { id: true, name: true, address: true, city: true },
        },
      },
    })

    console.log("[v0] getUnits successful, count:", data.length)
    return { data }
  } catch (error) {
    console.error("[v0] getUnits exception:", error)
    return { error: String(error) }
  }
}

export async function getVacantUnits() {
  console.log("[v0] getVacantUnits action called")

  try {
    const data = await prisma.unit.findMany({
      where: { isOccupied: false },
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: { id: true, name: true, address: true, city: true },
        },
      },
    })

    console.log("[v0] getVacantUnits successful, count:", data.length)
    return { data }
  } catch (error) {
    console.error("[v0] getVacantUnits exception:", error)
    return { error: String(error) }
  }
}

export async function getUnitById(id: string) {
  console.log("[v0] getUnitById action called with id:", id)

  try {
    const data = await prisma.unit.findUnique({
      where: { id },
      include: {
        property: true,
        contracts: {
          include: { tenant: true },
          where: { status: "active" },
        },
      },
    })

    if (!data) {
      return { error: "Unit not found" }
    }

    console.log("[v0] getUnitById successful")
    return { data }
  } catch (error) {
    console.error("[v0] getUnitById exception:", error)
    return { error: String(error) }
  }
}

export async function createUnit(unit: {
  propertyId: string
  unitNumber: string
  floor?: number | null
  sizeSqm?: number | null
  rooms?: number | null
  monthlyRent: number
}) {
  console.log("[v0] createUnit action called with unitNumber:", unit.unitNumber)

  try {
    const data = await prisma.unit.create({
      data: {
        propertyId: unit.propertyId,
        unitNumber: unit.unitNumber,
        floor: unit.floor,
        sizeSqm: unit.sizeSqm,
        rooms: unit.rooms,
        monthlyRent: unit.monthlyRent,
      },
    })

    // Update total units count on property
    await prisma.property.update({
      where: { id: unit.propertyId },
      data: { totalUnits: { increment: 1 } },
    })

    console.log("[v0] createUnit successful, ID:", data.id)
    revalidatePath("/admin/properties")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createUnit exception:", error)
    return { error: String(error) }
  }
}

export async function updateUnit(id: string, unit: {
  unitNumber?: string
  floor?: number | null
  sizeSqm?: number | null
  rooms?: number | null
  monthlyRent?: number
  isOccupied?: boolean
}) {
  console.log("[v0] updateUnit action called with id:", id)

  try {
    const data = await prisma.unit.update({
      where: { id },
      data: unit,
    })

    console.log("[v0] updateUnit successful")
    revalidatePath("/admin/properties")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateUnit exception:", error)
    return { error: String(error) }
  }
}

export async function deleteUnit(id: string) {
  console.log("[v0] deleteUnit action called with id:", id)

  try {
    const unit = await prisma.unit.findUnique({
      where: { id },
      select: { propertyId: true },
    })

    await prisma.unit.delete({
      where: { id },
    })

    // Update total units count on property
    if (unit?.propertyId) {
      await prisma.property.update({
        where: { id: unit.propertyId },
        data: { totalUnits: { decrement: 1 } },
      })
    }

    console.log("[v0] deleteUnit successful")
    revalidatePath("/admin/properties")
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteUnit exception:", error)
    return { error: String(error) }
  }
}
