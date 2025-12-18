"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getPayments(invoiceId?: string) {
  try {
    const data = await prisma.payment.findMany({
      where: invoiceId ? { invoiceId } : undefined,
      orderBy: { paymentDate: "desc" },
      include: {
        invoice: true,
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getPayments exception:", error)
    return { error: String(error) }
  }
}

export async function createPayment(payment: {
  invoiceId: string
  amount: number
  paymentDate: Date
  paymentMethod?: string | null
  referenceNumber?: string | null
  notes?: string | null
}) {
  try {
    const session = await getSession()

    // Create payment record
    const paymentData = await prisma.payment.create({
      data: {
        invoiceId: payment.invoiceId,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        referenceNumber: payment.referenceNumber,
        notes: payment.notes,
        createdById: session?.id,
      },
    })

    // Check if invoice is fully paid
    const invoice = await prisma.invoice.findUnique({
      where: { id: payment.invoiceId },
      select: { amount: true },
    })

    if (invoice) {
      const allPayments = await prisma.payment.findMany({
        where: { invoiceId: payment.invoiceId },
        select: { amount: true },
      })

      const totalPaid = allPayments.reduce((sum: number, p: { amount: unknown }) => sum + Number(p.amount), 0)

      if (totalPaid >= Number(invoice.amount)) {
        // Mark invoice as paid
        await prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: "paid", paidDate: new Date() },
        })
      }
    }

    revalidatePath("/admin/invoices")
    revalidatePath("/portal/invoices")
    return { data: paymentData, success: true }
  } catch (error) {
    console.error("[v0] createPayment exception:", error)
    return { error: String(error) }
  }
}

// Simulate Stripe payment integration
export async function processStripePayment(invoiceId: string, amount: number, paymentMethodId: string) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create payment record
    const result = await createPayment({
      invoiceId,
      amount,
      paymentDate: new Date(),
      paymentMethod: "stripe",
      referenceNumber: `stripe_${Math.random().toString(36).substring(7)}`,
    })

    return result
  } catch (error) {
    return { error: "Payment processing failed" }
  }
}

// Simulate FIN API bank transfer integration
export async function initiateBankTransfer(invoiceId: string, amount: number, accountDetails: any) {
  try {
    const result = await createPayment({
      invoiceId,
      amount,
      paymentDate: new Date(),
      paymentMethod: "bank_transfer",
      referenceNumber: `bank_${Math.random().toString(36).substring(7)}`,
    })

    return result
  } catch (error) {
    return { error: "Bank transfer initiation failed" }
  }
}
