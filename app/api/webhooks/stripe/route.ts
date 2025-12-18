import { NextRequest, NextResponse } from "next/server"
import { handleWebhook } from "@/lib/services/stripe"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const result = await handleWebhook(payload, signature)

    if (result.error) {
      console.error("[Webhook] Error:", result.error)
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Webhook] Unhandled error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
