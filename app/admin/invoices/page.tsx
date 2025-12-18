import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InvoiceDialog } from "@/components/admin/invoice-dialog"

export default async function InvoicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select(
      `
      *,
      tenant:profiles!invoices_tenant_id_fkey(*)
    `,
    )
    .order("due_date", { ascending: false })

  const { data: tenants } = await supabase.from("profiles").select("id, first_name, last_name").eq("role", "tenant")

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Rechnungen</h1>
          <p className="text-muted-foreground">Erstellen und verwalten Sie Rechnungen</p>
        </div>
        <InvoiceDialog tenants={tenants || []} />
      </div>

      <div className="grid gap-4">
        {invoices?.map((invoice) => (
          <Card key={invoice.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Rechnung #{invoice.invoice_number}</CardTitle>
                    <CardDescription>
                      {invoice.tenant.first_name} {invoice.tenant.last_name}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "secondary"
                  }
                >
                  {invoice.status === "paid"
                    ? "Bezahlt"
                    : invoice.status === "overdue"
                      ? "Überfällig"
                      : invoice.status === "sent"
                        ? "Versendet"
                        : "Entwurf"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Betrag: </span>
                  <span className="font-medium">{invoice.amount.toFixed(2)} €</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Fällig: </span>
                  <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString("de-DE")}</span>
                </div>
                {invoice.paid_date && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Bezahlt: </span>
                    <span className="font-medium">{new Date(invoice.paid_date).toLocaleDateString("de-DE")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {invoices?.length === 0 && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Noch keine Rechnungen</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">Erstellen Sie Ihre erste Rechnung</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
