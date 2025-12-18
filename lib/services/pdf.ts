import { jsPDF } from "jspdf"
import "jspdf-autotable"

// Logo as base64 - maxi-garagen.de logo
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAABkCAYAAABwx8J9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZmFjLCAyMDIxLzExLzE3LTE3OjIzOjE5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDEtMTVUMTI6MDA6MDArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAxLTE1VDEyOjAwOjAwKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTE1VDEyOjAwOjAwKzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMjM0NTY3OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMjM0NTY3OCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjEyMzQ1Njc4Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMjM0NTY3OCIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0xNVQxMjowMDowMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA"

interface InvoiceData {
  invoiceNumber: string
  amount: number
  dueDate: Date
  paidDate?: Date | null
  status: string
  description?: string | null
  createdAt: Date
  tenant: {
    firstName?: string | null
    lastName?: string | null
    email: string
  }
  contract?: {
    unit?: {
      unitNumber: string
      property?: {
        name: string
        address: string
        city: string
        postalCode: string
      } | null
    } | null
  } | null
}

export function generateInvoicePDF(invoice: InvoiceData): ArrayBuffer {
  const doc = new jsPDF()
  
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header with logo text (since we can't embed actual image without proper base64)
  doc.setFillColor(200, 30, 30)
  doc.rect(0, 0, pageWidth, 40, "F")
  
  // Company name as logo replacement
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("maxi-garagen.de", 15, 25)
  
  // Reset text color
  doc.setTextColor(0, 0, 0)
  
  // Invoice title
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("RECHNUNG", pageWidth - 15, 60, { align: "right" })
  
  // Invoice details
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  
  const rightCol = pageWidth - 15
  let y = 70
  
  doc.setFont("helvetica", "bold")
  doc.text("Rechnungsnummer:", rightCol - 50, y)
  doc.setFont("helvetica", "normal")
  doc.text(invoice.invoiceNumber, rightCol, y, { align: "right" })
  
  y += 7
  doc.setFont("helvetica", "bold")
  doc.text("Rechnungsdatum:", rightCol - 50, y)
  doc.setFont("helvetica", "normal")
  doc.text(formatDate(invoice.createdAt), rightCol, y, { align: "right" })
  
  y += 7
  doc.setFont("helvetica", "bold")
  doc.text("Fällig am:", rightCol - 50, y)
  doc.setFont("helvetica", "normal")
  doc.text(formatDate(invoice.dueDate), rightCol, y, { align: "right" })
  
  if (invoice.paidDate) {
    y += 7
    doc.setFont("helvetica", "bold")
    doc.text("Bezahlt am:", rightCol - 50, y)
    doc.setFont("helvetica", "normal")
    doc.text(formatDate(invoice.paidDate), rightCol, y, { align: "right" })
  }
  
  // Tenant info (left side)
  y = 55
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Rechnung an:", 15, y)
  
  y += 7
  doc.setFont("helvetica", "normal")
  const tenantName = invoice.tenant.firstName && invoice.tenant.lastName
    ? `${invoice.tenant.firstName} ${invoice.tenant.lastName}`
    : invoice.tenant.email
  doc.text(tenantName, 15, y)
  
  y += 5
  doc.text(invoice.tenant.email, 15, y)
  
  // Property info
  if (invoice.contract?.unit?.property) {
    y += 12
    doc.setFont("helvetica", "bold")
    doc.text("Objekt:", 15, y)
    y += 7
    doc.setFont("helvetica", "normal")
    doc.text(invoice.contract.unit.property.name, 15, y)
    y += 5
    doc.text(`Einheit: ${invoice.contract.unit.unitNumber}`, 15, y)
    y += 5
    doc.text(invoice.contract.unit.property.address, 15, y)
    y += 5
    doc.text(`${invoice.contract.unit.property.postalCode} ${invoice.contract.unit.property.city}`, 15, y)
  }
  
  // Divider line
  y = 120
  doc.setDrawColor(200, 200, 200)
  doc.line(15, y, pageWidth - 15, y)
  
  // Invoice items table
  y += 10
  
  // Table header
  doc.setFillColor(245, 245, 245)
  doc.rect(15, y, pageWidth - 30, 10, "F")
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Beschreibung", 20, y + 7)
  doc.text("Betrag", pageWidth - 20, y + 7, { align: "right" })
  
  // Table content
  y += 15
  doc.setFont("helvetica", "normal")
  doc.text(invoice.description || "Monatliche Miete", 20, y)
  doc.text(formatCurrency(invoice.amount), pageWidth - 20, y, { align: "right" })
  
  // Divider
  y += 10
  doc.line(15, y, pageWidth - 15, y)
  
  // Total
  y += 10
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Gesamtbetrag:", pageWidth - 80, y)
  doc.text(formatCurrency(invoice.amount), pageWidth - 20, y, { align: "right" })
  
  // Status badge
  y += 15
  const statusText = getStatusText(invoice.status)
  const statusColor = getStatusColor(invoice.status)
  
  doc.setFillColor(statusColor.r, statusColor.g, statusColor.b)
  const textWidth = doc.getTextWidth(statusText) + 10
  doc.roundedRect(pageWidth - 20 - textWidth, y - 5, textWidth + 5, 10, 2, 2, "F")
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text(statusText, pageWidth - 20, y + 2, { align: "right" })
  
  // Reset text color
  doc.setTextColor(0, 0, 0)
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30
  doc.setDrawColor(200, 200, 200)
  doc.line(15, footerY, pageWidth - 15, footerY)
  
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text("maxi-garagen.de | Garagen & Stellplätze", pageWidth / 2, footerY + 10, { align: "center" })
  doc.text("Diese Rechnung wurde elektronisch erstellt und ist ohne Unterschrift gültig.", pageWidth / 2, footerY + 16, { align: "center" })
  
  return doc.output("arraybuffer")
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function getStatusText(status: string): string {
  switch (status) {
    case "paid": return "BEZAHLT"
    case "overdue": return "ÜBERFÄLLIG"
    case "sent": return "OFFEN"
    case "draft": return "ENTWURF"
    default: return status.toUpperCase()
  }
}

function getStatusColor(status: string): { r: number; g: number; b: number } {
  switch (status) {
    case "paid": return { r: 34, g: 197, b: 94 }
    case "overdue": return { r: 239, g: 68, b: 68 }
    case "sent": return { r: 245, g: 158, b: 11 }
    default: return { r: 107, g: 114, b: 128 }
  }
}
