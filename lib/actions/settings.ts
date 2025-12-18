"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "settings" },
    })

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: "settings" },
      })
    }

    return { data: settings }
  } catch (error) {
    console.error("[v0] getSettings exception:", error)
    return { error: String(error) }
  }
}

export async function updateStripeSettings(data: {
  stripeEnabled: boolean
  stripePublicKey?: string
  stripeSecretKey?: string
  stripeWebhookSecret?: string
}) {
  try {
    const settings = await prisma.systemSettings.upsert({
      where: { id: "settings" },
      update: {
        stripeEnabled: data.stripeEnabled,
        stripePublicKey: data.stripePublicKey || null,
        stripeSecretKey: data.stripeSecretKey || null,
        stripeWebhookSecret: data.stripeWebhookSecret || null,
      },
      create: {
        id: "settings",
        stripeEnabled: data.stripeEnabled,
        stripePublicKey: data.stripePublicKey || null,
        stripeSecretKey: data.stripeSecretKey || null,
        stripeWebhookSecret: data.stripeWebhookSecret || null,
      },
    })

    revalidatePath("/admin/settings")
    return { data: settings, success: true }
  } catch (error) {
    console.error("[v0] updateStripeSettings exception:", error)
    return { error: String(error) }
  }
}

export async function updateEmailSettings(data: {
  emailEnabled: boolean
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  smtpFromEmail?: string
  smtpFromName?: string
  smtpSecure?: boolean
  notifyOnNewInvoice?: boolean
}) {
  try {
    const settings = await prisma.systemSettings.upsert({
      where: { id: "settings" },
      update: {
        emailEnabled: data.emailEnabled,
        smtpHost: data.smtpHost || null,
        smtpPort: data.smtpPort || null,
        smtpUser: data.smtpUser || null,
        smtpPassword: data.smtpPassword || null,
        smtpFromEmail: data.smtpFromEmail || null,
        smtpFromName: data.smtpFromName || null,
        smtpSecure: data.smtpSecure ?? true,
        notifyOnNewInvoice: data.notifyOnNewInvoice ?? true,
      },
      create: {
        id: "settings",
        emailEnabled: data.emailEnabled,
        smtpHost: data.smtpHost || null,
        smtpPort: data.smtpPort || null,
        smtpUser: data.smtpUser || null,
        smtpPassword: data.smtpPassword || null,
        smtpFromEmail: data.smtpFromEmail || null,
        smtpFromName: data.smtpFromName || null,
        smtpSecure: data.smtpSecure ?? true,
        notifyOnNewInvoice: data.notifyOnNewInvoice ?? true,
      },
    })

    revalidatePath("/admin/settings")
    return { data: settings, success: true }
  } catch (error) {
    console.error("[v0] updateEmailSettings exception:", error)
    return { error: String(error) }
  }
}

export async function testEmailConnection() {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "settings" },
    })

    if (!settings?.emailEnabled || !settings?.smtpHost) {
      return { error: "E-Mail ist nicht konfiguriert" }
    }

    const nodemailer = require("nodemailer")
    
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort || 587,
      secure: settings.smtpSecure,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    })

    await transporter.verify()
    return { success: true, message: "Verbindung erfolgreich!" }
  } catch (error) {
    console.error("[v0] testEmailConnection exception:", error)
    return { error: String(error) }
  }
}
