import { prisma } from "@/lib/db"

interface InvoiceNinjaClient {
  id: string
  name: string
  email: string
}

interface InvoiceNinjaInvoice {
  id: string
  number: string
  amount: number
  balance: number
  status_id: string
  client_id: string
  due_date: string
  public_notes: string
}

async function getSettings() {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: "settings" },
  })
  
  if (!settings?.invoiceNinjaEnabled || !settings?.invoiceNinjaUrl || !settings?.invoiceNinjaApiKey) {
    return null
  }
  
  return settings
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const settings = await getSettings()
  
  if (!settings) {
    console.error("[InvoiceNinja] Not configured")
    return null
  }
  
  const headers: Record<string, string> = {
    "X-Api-Token": settings.invoiceNinjaApiKey!,
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  }
  
  if (settings.invoiceNinjaCompanyId) {
    headers["X-Api-Company-Id"] = settings.invoiceNinjaCompanyId
  }
  
  try {
    const response = await fetch(`${settings.invoiceNinjaUrl}/api/v1${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      console.error("[InvoiceNinja] API error:", response.status, await response.text())
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error("[InvoiceNinja] Request failed:", error)
    return null
  }
}

export async function findOrCreateClient(tenant: {
  email: string
  firstName?: string | null
  lastName?: string | null
}): Promise<string | null> {
  // Search for existing client by email
  const searchResult = await apiRequest<{ data: InvoiceNinjaClient[] }>(
    `/clients?email=${encodeURIComponent(tenant.email)}`
  )
  
  if (searchResult?.data && searchResult.data.length > 0) {
    return searchResult.data[0].id
  }
  
  // Create new client
  const name = tenant.firstName && tenant.lastName
    ? `${tenant.firstName} ${tenant.lastName}`
    : tenant.email
    
  const createResult = await apiRequest<{ data: InvoiceNinjaClient }>("/clients", {
    method: "POST",
    body: JSON.stringify({
      name,
      contacts: [
        {
          email: tenant.email,
          first_name: tenant.firstName || "",
          last_name: tenant.lastName || "",
        },
      ],
    }),
  })
  
  return createResult?.data?.id || null
}

export async function createInvoiceInNinja(data: {
  tenantEmail: string
  tenantFirstName?: string | null
  tenantLastName?: string | null
  amount: number
  dueDate: Date
  description?: string | null
  invoiceNumber?: string
}): Promise<{ id: string; number: string } | null> {
  const clientId = await findOrCreateClient({
    email: data.tenantEmail,
    firstName: data.tenantFirstName,
    lastName: data.tenantLastName,
  })
  
  if (!clientId) {
    console.error("[InvoiceNinja] Failed to find/create client")
    return null
  }
  
  const result = await apiRequest<{ data: InvoiceNinjaInvoice }>("/invoices", {
    method: "POST",
    body: JSON.stringify({
      client_id: clientId,
      number: data.invoiceNumber,
      due_date: data.dueDate.toISOString().split("T")[0],
      public_notes: data.description || "Monatliche Miete",
      line_items: [
        {
          quantity: 1,
          cost: data.amount,
          product_key: "MIETE",
          notes: data.description || "Monatliche Miete",
        },
      ],
      auto_bill_enabled: false,
    }),
  })
  
  if (!result?.data) {
    return null
  }
  
  return {
    id: result.data.id,
    number: result.data.number,
  }
}

export async function markInvoiceAsSent(invoiceId: string): Promise<boolean> {
  const result = await apiRequest<{ data: InvoiceNinjaInvoice }>(
    `/invoices/${invoiceId}?action=mark_sent`,
    { method: "PUT" }
  )
  
  return !!result?.data
}

export async function getInvoiceStatus(invoiceId: string): Promise<string | null> {
  const result = await apiRequest<{ data: InvoiceNinjaInvoice }>(`/invoices/${invoiceId}`)
  
  if (!result?.data) {
    return null
  }
  
  // Invoice Ninja status IDs:
  // 1: Draft, 2: Sent, 3: Viewed, 4: Approved, 5: Partial, 6: Paid
  const statusMap: Record<string, string> = {
    "1": "draft",
    "2": "sent",
    "3": "sent",
    "4": "sent",
    "5": "sent",
    "6": "paid",
  }
  
  return statusMap[result.data.status_id] || "draft"
}

export async function getInvoicePdfUrl(invoiceId: string): Promise<string | null> {
  const settings = await getSettings()
  
  if (!settings) {
    return null
  }
  
  return `${settings.invoiceNinjaUrl}/api/v1/invoices/${invoiceId}/download`
}

export async function isInvoiceNinjaEnabled(): Promise<boolean> {
  const settings = await getSettings()
  return !!settings?.useInvoiceNinjaForNew
}
