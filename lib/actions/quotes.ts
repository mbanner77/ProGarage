"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function submitQuoteRequest(request: {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  companyName?: string | null
  propertyCount?: number | null
  message?: string | null
}) {
  try {
    const data = await prisma.quoteRequest.create({
      data: {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        companyName: request.companyName,
        propertyCount: request.propertyCount,
        message: request.message,
      },
    })

    return { data, success: true }
  } catch (error) {
    console.error("[v0] submitQuoteRequest exception:", error)
    return { error: String(error) }
  }
}

export async function getQuoteRequests() {
  try {
    const data = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    })

    return { data }
  } catch (error) {
    console.error("[v0] getQuoteRequests exception:", error)
    return { error: String(error) }
  }
}

export async function updateQuoteStatus(id: string, status: string) {
  try {
    const data = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/admin/quotes")
    return { data, success: true }
  } catch (error) {
    console.error("[v0] updateQuoteStatus exception:", error)
    return { error: String(error) }
  }
}
