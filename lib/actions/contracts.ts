"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { ContractStatus } from "@prisma/client"

export async function getContracts() {
  try {
    const data = await prisma.contract.findMany({
      orderBy: { startDate: "desc" },
      include: {
        tenant: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        unit: {
          include: {
            property: true,
          },
        },
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getContracts exception:", error)
    return { error: String(error) }
  }
}

export async function getTenantContract() {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    const data = await prisma.contract.findFirst({
      where: {
        tenantId: session.id,
        status: "active",
      },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getTenantContract exception:", error)
    return { error: String(error) }
  }
}

export async function createContract(input: FormData | {
  unitId: string
  tenantId: string
  startDate: Date
  endDate?: Date | null
  monthlyRent: number
  deposit?: number | null
  status?: ContractStatus
  notes?: string | null
}) {
  try {
    // Handle both FormData and object input
    const contract = input instanceof FormData ? {
      unitId: input.get("unit_id") as string,
      tenantId: input.get("tenant_id") as string,
      startDate: new Date(input.get("start_date") as string),
      endDate: input.get("end_date") ? new Date(input.get("end_date") as string) : null,
      monthlyRent: parseFloat(input.get("monthly_rent") as string),
      deposit: input.get("deposit") ? parseFloat(input.get("deposit") as string) : null,
      notes: input.get("notes") as string || null,
    } : input

    const data = await prisma.contract.create({
      data: {
        unitId: contract.unitId,
        tenantId: contract.tenantId,
        startDate: contract.startDate,
        endDate: contract.endDate,
        monthlyRent: contract.monthlyRent,
        deposit: contract.deposit,
        status: "active",
        notes: contract.notes,
      },
    })

    // Update unit occupancy
    await prisma.unit.update({
      where: { id: contract.unitId },
      data: { isOccupied: true },
    })

    revalidatePath("/admin/contracts")
    revalidatePath("/admin/tenants")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createContract exception:", error)
    return { error: String(error) }
  }
}

export async function updateContractStatus(id: string, status: ContractStatus) {
  try {
    const data = await prisma.contract.update({
      where: { id },
      data: { status },
    })

    // If contract is terminated, update unit occupancy
    if (status === "terminated" || status === "expired") {
      await prisma.unit.update({
        where: { id: data.unitId },
        data: { isOccupied: false },
      })
    }

    revalidatePath("/admin/contracts")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateContractStatus exception:", error)
    return { error: String(error) }
  }
}

export async function deleteContract(id: string) {
  try {
    const contract = await prisma.contract.delete({
      where: { id },
    })

    // Update unit occupancy
    await prisma.unit.update({
      where: { id: contract.unitId },
      data: { isOccupied: false },
    })

    revalidatePath("/admin/contracts")
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteContract exception:", error)
    return { error: String(error) }
  }
}
