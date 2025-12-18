"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { InvoiceStatus } from "@prisma/client"
import { sendInvoiceNotification } from "@/lib/services/email"

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
        OR: [
          { tenantId: session.id },
          { contract: { tenantId: session.id } },
        ],
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

export async function createInvoice(input: FormData | {
  invoiceNumber?: string
  invoice_number?: string
  contractId?: string | null
  tenantId?: string
  tenant_id?: string
  amount: number
  dueDate?: Date
  due_date?: string
  status?: InvoiceStatus
  description?: string | null
  createdById?: string | null
}) {
  try {
    // Handle both FormData and object input
    const invoice = input instanceof FormData ? {
      invoiceNumber: input.get("invoice_number") as string,
      tenantId: input.get("tenant_id") as string,
      amount: parseFloat(input.get("amount") as string),
      dueDate: new Date(input.get("due_date") as string),
      description: input.get("description") as string || null,
    } : {
      invoiceNumber: input.invoiceNumber || input.invoice_number || '',
      tenantId: input.tenantId || input.tenant_id || '',
      amount: input.amount,
      dueDate: input.dueDate || (input.due_date ? new Date(input.due_date) : new Date()),
      description: input.description,
      contractId: input.contractId,
      createdById: input.createdById,
    }

    const session = await getSession()

    const data = await prisma.invoice.create({
      data: {
        invoiceNumber: invoice.invoiceNumber,
        contractId: invoice.contractId,
        tenantId: invoice.tenantId,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        status: "sent",
        description: invoice.description,
        createdById: invoice.createdById || session?.id,
      },
    })

    // Send email notification to tenant
    const tenant = await prisma.user.findUnique({
      where: { id: invoice.tenantId },
      select: { email: true, firstName: true, lastName: true },
    })

    if (tenant) {
      sendInvoiceNotification({
        id: data.id,
        invoiceNumber: data.invoiceNumber,
        amount: Number(data.amount),
        dueDate: data.dueDate,
        description: data.description,
        tenant,
      }).catch((err) => console.error("[Invoice] Email notification failed:", err))
    }

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
