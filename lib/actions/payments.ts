"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Payment } from "@/lib/types/database"

export async function getPayments(invoiceId?: string) {
  const supabase = await createClient()

  let query = supabase.from("payments").select("*, invoice:invoices(*)")

  if (invoiceId) {
    query = query.eq("invoice_id", invoiceId)
  }

  const { data, error } = await query.order("payment_date", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function createPayment(payment: Omit<Payment, "id" | "created_at">) {
  const supabase = await createClient()

  // Create payment record
  const { data: paymentData, error: paymentError } = await supabase.from("payments").insert(payment).select().single()

  if (paymentError) {
    return { error: paymentError.message }
  }

  // Check if invoice is fully paid
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("amount")
    .eq("id", payment.invoice_id)
    .single()

  if (!invoiceError && invoice) {
    const { data: allPayments } = await supabase.from("payments").select("amount").eq("invoice_id", payment.invoice_id)

    const totalPaid = allPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

    if (totalPaid >= invoice.amount) {
      // Mark invoice as paid
      await supabase
        .from("invoices")
        .update({ status: "paid", paid_date: new Date().toISOString() })
        .eq("id", payment.invoice_id)
    }
  }

  revalidatePath("/admin/invoices")
  revalidatePath("/portal/invoices")
  return { data: paymentData, success: true }
}

// Simulate Stripe payment integration
export async function processStripePayment(invoiceId: string, amount: number, paymentMethodId: string) {
  // In production, this would integrate with Stripe API
  // For now, we'll simulate a successful payment

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create payment record
    const result = await createPayment({
      invoice_id: invoiceId,
      amount,
      payment_date: new Date().toISOString(),
      payment_method: "stripe",
      reference_number: `stripe_${Math.random().toString(36).substring(7)}`,
    })

    return result
  } catch (error) {
    return { error: "Payment processing failed" }
  }
}

// Simulate FIN API bank transfer integration
export async function initiateBankTransfer(invoiceId: string, amount: number, accountDetails: any) {
  // In production, this would integrate with FIN API
  // For now, we'll create a pending payment record

  try {
    const result = await createPayment({
      invoice_id: invoiceId,
      amount,
      payment_date: new Date().toISOString(),
      payment_method: "bank_transfer",
      reference_number: `bank_${Math.random().toString(36).substring(7)}`,
    })

    return result
  } catch (error) {
    return { error: "Bank transfer initiation failed" }
  }
}
