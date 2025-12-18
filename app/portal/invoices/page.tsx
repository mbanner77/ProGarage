export const dynamic = 'force-dynamic'

import { getTenantInvoices } from "@/lib/actions/invoices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function TenantInvoicesPage() {
  const { data: invoices } = await getTenantInvoices()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Bezahlt</Badge>
      case "overdue":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Überfällig</Badge>
      case "sent":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Offen</Badge>
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">Entwurf</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Rechnungen</h1>
          <p className="text-muted-foreground">Ihre Mietrechnungen und Zahlungen</p>
        </div>
      </div>

      <div className="grid gap-4">
        {invoices?.map((invoice: any) => (
          <Card key={invoice.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Rechnung #{invoice.invoiceNumber}</CardTitle>
                    <CardDescription>{invoice.description || "Monatliche Miete"}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(invoice.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Betrag: </span>
                    <span className="font-semibold text-lg">{Number(invoice.amount).toFixed(2)} €</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Fällig: </span>
                    <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString("de-DE")}</span>
                  </div>
                  {invoice.paidDate && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Bezahlt: </span>
                      <span className="font-medium">{new Date(invoice.paidDate).toLocaleDateString("de-DE")}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {invoice.status !== "paid" && (
                    <Button size="sm" className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Jetzt bezahlen
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {invoices?.length === 0 && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Keine Rechnungen</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">Es liegen derzeit keine Rechnungen vor</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
