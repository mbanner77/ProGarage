"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { InvoiceStatus } from "@prisma/client"

export async function getInvoices() {
  try {
    const data = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contract: {
          include: {
            tenant: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
        payments: true,
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getInvoices exception:", error)
    return { error: String(error) }
  }
}

export async function getTenantInvoices() {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    const data = await prisma.invoice.findMany({
      where: {
        contract: {
          tenantId: session.id,
        },
      },
      orderBy: { dueDate: "desc" },
      include: {
        contract: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
        payments: true,
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getTenantInvoices exception:", error)
    return { error: String(error) }
  }
}

export async function createInvoice(invoice: {
  invoiceNumber: string
  contractId?: string | null
  tenantId: string
  amount: number
  dueDate: Date
  status?: InvoiceStatus
  description?: string | null
  createdById?: string | null
}) {
  try {
    const data = await prisma.invoice.create({
      data: {
        invoiceNumber: invoice.invoiceNumber,
        contractId: invoice.contractId,
        tenantId: invoice.tenantId,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        status: invoice.status || "draft",
        description: invoice.description,
        createdById: invoice.createdById,
      },
    })

    revalidatePath("/admin/invoices")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] createInvoice exception:", error)
    return { error: String(error) }
  }
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  try {
    const updateData: { status: InvoiceStatus; paidDate?: Date } = { status }
    
    if (status === "paid") {
      updateData.paidDate = new Date()
    }

    const data = await prisma.invoice.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/admin/invoices")
    revalidatePath("/portal/invoices")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateInvoiceStatus exception:", error)
    return { error: String(error) }
  }
}
