import Stripe from "stripe"
import { prisma } from "@/lib/db"

let stripeInstance: Stripe | null = null

export async function getStripeInstance(): Promise<Stripe | null> {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: "settings" },
  })

  if (!settings?.stripeEnabled || !settings?.stripeSecretKey) {
    return null
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(settings.stripeSecretKey, {
      apiVersion: "2023-10-16",
    })
  }

  return stripeInstance
}

export async function createCheckoutSession(invoice: {
  id: string
  invoiceNumber: string
  amount: number
  description?: string | null
  tenant: {
    email: string
    firstName?: string | null
    lastName?: string | null
  }
}, successUrl: string, cancelUrl: string) {
  const stripe = await getStripeInstance()
  
  if (!stripe) {
    return { error: "Stripe ist nicht konfiguriert" }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "sepa_debit"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Rechnung #${invoice.invoiceNumber}`,
              description: invoice.description || "Mietrechnung",
            },
            unit_amount: Math.round(invoice.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: invoice.tenant.email,
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
    })

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { stripeSessionId: session.id },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error("[Stripe] Failed to create checkout session:", error)
    return { error: String(error) }
  }
}

export async function handleWebhook(payload: string, signature: string) {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: "settings" },
  })

  if (!settings?.stripeEnabled || !settings?.stripeSecretKey || !settings?.stripeWebhookSecret) {
    return { error: "Stripe webhook not configured" }
  }

  const stripe = new Stripe(settings.stripeSecretKey, {
    apiVersion: "2023-10-16",
  })

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      settings.stripeWebhookSecret
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      
      if (session.metadata?.invoiceId) {
        await prisma.invoice.update({
          where: { id: session.metadata.invoiceId },
          data: {
            status: "paid",
            paidDate: new Date(),
            stripePaymentIntentId: session.payment_intent as string,
          },
        })

        await prisma.payment.create({
          data: {
            invoiceId: session.metadata.invoiceId,
            amount: (session.amount_total || 0) / 100,
            paymentDate: new Date(),
            paymentMethod: "stripe",
            referenceNumber: session.payment_intent as string,
          },
        })

        console.log("[Stripe] Invoice paid:", session.metadata.invoiceId)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[Stripe] Webhook error:", error)
    return { error: String(error) }
  }
}

export async function getStripePublicKey() {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: "settings" },
  })

  if (!settings?.stripeEnabled || !settings?.stripePublicKey) {
    return null
  }

  return settings.stripePublicKey
}
