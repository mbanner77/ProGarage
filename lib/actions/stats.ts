"use server"

import { prisma } from "@/lib/db"

export async function getAdminStats() {
  try {
    // Get total properties
    const propertiesCount = await prisma.property.count()

    // Get total tenants
    const tenantsCount = await prisma.user.count({
      where: { role: "tenant" },
    })

    // Get active contracts
    const activeContracts = await prisma.contract.count({
      where: { status: "active" },
    })

    // Get pending invoices
    const pendingInvoices = await prisma.invoice.findMany({
      where: { status: "sent" },
      select: { amount: true },
    })

    const pendingAmount = pendingInvoices.reduce((sum: number, inv: { amount: unknown }) => sum + Number(inv.amount), 0)

    // Get overdue invoices
    const overdueCount = await prisma.invoice.count({
      where: { status: "overdue" },
    })

    // Get open maintenance requests
    const maintenanceCount = await prisma.maintenanceRequest.count({
      where: {
        NOT: { status: "completed" },
      },
    })

    // Get today's appointments
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAppointments = await prisma.appointment.count({
      where: {
        scheduledDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    return {
      properties: propertiesCount,
      tenants: tenantsCount,
      activeContracts: activeContracts,
      pendingAmount,
      overdueInvoices: overdueCount,
      openMaintenance: maintenanceCount,
      todayAppointments: todayAppointments,
    }
  } catch (error) {
    console.error("[v0] getAdminStats exception:", error)
    return {
      properties: 0,
      tenants: 0,
      activeContracts: 0,
      pendingAmount: 0,
      overdueInvoices: 0,
      openMaintenance: 0,
      todayAppointments: 0,
    }
  }
}
