import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createCheckoutSession } from "@/lib/services/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { invoiceId } = await request.json()

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 })
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        contract: {
          include: {
            tenant: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Check if user has access to this invoice
    const tenant = invoice.contract?.tenant
    if (!tenant || (tenant.id !== session.id && session.role !== "admin")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 })
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const successUrl = `${origin}/portal/invoices?success=true&invoiceId=${invoice.id}`
    const cancelUrl = `${origin}/portal/invoices?cancelled=true&invoiceId=${invoice.id}`

    const result = await createCheckoutSession(
      {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: Number(invoice.amount),
        description: invoice.description,
        tenant: {
          email: tenant.email,
          firstName: tenant.firstName,
          lastName: tenant.lastName,
        },
      },
      successUrl,
      cancelUrl
    )

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ url: result.url, sessionId: result.sessionId })
  } catch (error) {
    console.error("[API] Payment checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
