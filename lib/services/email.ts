import nodemailer from "nodemailer"
import { prisma } from "@/lib/db"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: "settings" },
  })

  if (!settings?.emailEnabled || !settings?.smtpHost) {
    console.log("[Email] Email not configured, skipping send")
    return { success: false, error: "Email not configured" }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort || 587,
      secure: settings.smtpSecure,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    })

    const result = await transporter.sendMail({
      from: settings.smtpFromName 
        ? `"${settings.smtpFromName}" <${settings.smtpFromEmail}>`
        : settings.smtpFromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    console.log("[Email] Email sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("[Email] Failed to send email:", error)
    return { success: false, error: String(error) }
  }
}

export async function sendInvoiceNotification(invoice: {
  id: string
  invoiceNumber: string
  amount: number
  dueDate: Date
  description?: string | null
  tenant: {
    email: string
    firstName?: string | null
    lastName?: string | null
  }
}) {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: "settings" },
  })

  if (!settings?.notifyOnNewInvoice) {
    console.log("[Email] Invoice notifications disabled")
    return { success: false, error: "Notifications disabled" }
  }

  const tenantName = invoice.tenant.firstName && invoice.tenant.lastName
    ? `${invoice.tenant.firstName} ${invoice.tenant.lastName}`
    : invoice.tenant.email

  const formattedAmount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(invoice.amount)

  const formattedDueDate = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(invoice.dueDate))

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .invoice-box { background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .invoice-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
        .invoice-row:last-child { border-bottom: none; }
        .label { color: #666; }
        .value { font-weight: bold; }
        .amount { font-size: 24px; color: #f97316; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Neue Rechnung</h1>
        </div>
        <div class="content">
          <p>Guten Tag ${tenantName},</p>
          <p>es wurde eine neue Rechnung für Sie erstellt:</p>
          
          <div class="invoice-box">
            <div class="invoice-row">
              <span class="label">Rechnungsnummer:</span>
              <span class="value">${invoice.invoiceNumber}</span>
            </div>
            <div class="invoice-row">
              <span class="label">Fällig am:</span>
              <span class="value">${formattedDueDate}</span>
            </div>
            ${invoice.description ? `
            <div class="invoice-row">
              <span class="label">Beschreibung:</span>
              <span class="value">${invoice.description}</span>
            </div>
            ` : ""}
            <div class="invoice-row">
              <span class="label">Betrag:</span>
              <span class="value amount">${formattedAmount}</span>
            </div>
          </div>
          
          <p>Sie können diese Rechnung in Ihrem Mieterportal einsehen und bezahlen.</p>
          
          <div class="footer">
            <p>Diese E-Mail wurde automatisch generiert.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Neue Rechnung

Guten Tag ${tenantName},

es wurde eine neue Rechnung für Sie erstellt:

Rechnungsnummer: ${invoice.invoiceNumber}
Fällig am: ${formattedDueDate}
${invoice.description ? `Beschreibung: ${invoice.description}\n` : ""}
Betrag: ${formattedAmount}

Sie können diese Rechnung in Ihrem Mieterportal einsehen und bezahlen.
  `.trim()

  return sendEmail({
    to: invoice.tenant.email,
    subject: `Neue Rechnung #${invoice.invoiceNumber}`,
    html,
    text,
  })
}
