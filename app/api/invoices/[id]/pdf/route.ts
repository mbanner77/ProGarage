import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { generateInvoicePDF } from "@/lib/services/pdf"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
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
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Check access - tenant can only access their own invoices
    const tenant = invoice.contract?.tenant
    if (session.role !== "admin" && session.role !== "property_manager") {
      if (!tenant || tenant.id !== session.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    // Get tenant info - either from contract or direct lookup
    let tenantInfo = tenant
    if (!tenantInfo && invoice.tenantId) {
      tenantInfo = await prisma.user.findUnique({
        where: { id: invoice.tenantId },
        select: { id: true, email: true, firstName: true, lastName: true },
      })
    }

    if (!tenantInfo) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const pdfData = generateInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      amount: Number(invoice.amount),
      dueDate: invoice.dueDate,
      paidDate: invoice.paidDate,
      status: invoice.status,
      description: invoice.description,
      createdAt: invoice.createdAt,
      tenant: tenantInfo,
      contract: invoice.contract,
    })

    return new NextResponse(pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Rechnung-${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[API] PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
