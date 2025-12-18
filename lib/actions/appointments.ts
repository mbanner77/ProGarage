"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { AppointmentStatus } from "@prisma/client"

export async function getAppointments() {
  try {
    const data = await prisma.appointment.findMany({
      orderBy: { scheduledDate: "asc" },
      include: {
        property: true,
        unit: true,
        assignedTo: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getAppointments exception:", error)
    return { error: String(error) }
  }
}

export async function getMyAppointments() {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    const data = await prisma.appointment.findMany({
      where: { assignedToId: session.id },
      orderBy: { scheduledDate: "asc" },
      include: {
        property: true,
        unit: true,
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getMyAppointments exception:", error)
    return { error: String(error) }
  }
}

export async function createAppointment(appointment: {
  title: string
  description?: string | null
  propertyId?: string | null
  unitId?: string | null
  assignedToId?: string | null
  scheduledDate: Date
  priority?: string
  notes?: string | null
}) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    const data = await prisma.appointment.create({
      data: {
        title: appointment.title,
        description: appointment.description,
        propertyId: appointment.propertyId,
        unitId: appointment.unitId,
        assignedToId: appointment.assignedToId,
        scheduledDate: appointment.scheduledDate,
        priority: appointment.priority || "medium",
        notes: appointment.notes,
        createdById: session.id,
      },
    })

    revalidatePath("/admin/appointments")
    revalidatePath("/manager/appointments")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createAppointment exception:", error)
    return { error: String(error) }
  }
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  try {
    const updateData: { status: AppointmentStatus; completedDate?: Date } = { status }
    
    if (status === "completed") {
      updateData.completedDate = new Date()
    }

    const data = await prisma.appointment.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/admin/appointments")
    revalidatePath("/manager/appointments")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateAppointmentStatus exception:", error)
    return { error: String(error) }
  }
}
