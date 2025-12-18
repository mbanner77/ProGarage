"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { MaintenanceStatus } from "@prisma/client"

export async function getMaintenanceRequests() {
  try {
    const data = await prisma.maintenanceRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        assignedTo: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getMaintenanceRequests exception:", error)
    return { error: String(error) }
  }
}

export async function getMyMaintenanceRequests() {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    const data = await prisma.maintenanceRequest.findMany({
      where: { tenantId: session.id },
      orderBy: { createdAt: "desc" },
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
    console.error("[v0] getMyMaintenanceRequests exception:", error)
    return { error: String(error) }
  }
}

export async function createMaintenanceRequest(request: {
  unitId?: string | null
  title: string
  description: string
  priority?: string
}) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    const data = await prisma.maintenanceRequest.create({
      data: {
        tenantId: session.id,
        unitId: request.unitId,
        title: request.title,
        description: request.description,
        priority: request.priority || "medium",
      },
    })

    revalidatePath("/portal/maintenance")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createMaintenanceRequest exception:", error)
    return { error: String(error) }
  }
}

export async function updateMaintenanceStatus(id: string, status: MaintenanceStatus, assignedToId?: string) {
  try {
    const updateData: { status: MaintenanceStatus; assignedToId?: string; resolvedAt?: Date } = { status }
    
    if (assignedToId) {
      updateData.assignedToId = assignedToId
    }
    
    if (status === "completed") {
      updateData.resolvedAt = new Date()
    }

    const data = await prisma.maintenanceRequest.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/admin/maintenance")
    revalidatePath("/manager/maintenance")
    revalidatePath("/portal/maintenance")
    revalidatePath("/janitor/tasks")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateMaintenanceStatus exception:", error)
    return { error: String(error) }
  }
}

export async function updateMaintenanceSchedule(id: string, data: {
  scheduledDate?: Date | null
  scheduledTime?: string | null
  notes?: string | null
}) {
  try {
    const result = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        notes: data.notes,
      },
    })

    revalidatePath("/admin/maintenance")
    revalidatePath("/janitor/tasks")
    return { data: result, success: true }
  } catch (error) {
    console.error("[v0] updateMaintenanceSchedule exception:", error)
    return { error: String(error) }
  }
}

export async function assignMaintenanceToJanitor(id: string, janitorId: string) {
  try {
    const data = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        assignedToId: janitorId,
        status: "pending",
      },
    })

    revalidatePath("/admin/maintenance")
    revalidatePath("/janitor/tasks")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] assignMaintenanceToJanitor exception:", error)
    return { error: String(error) }
  }
}
