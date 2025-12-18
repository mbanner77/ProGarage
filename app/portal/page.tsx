export const dynamic = 'force-dynamic'

import { getCurrentUser } from "@/lib/actions/auth"
import { getTenantContract } from "@/lib/actions/contracts"
import { getTenantInvoices } from "@/lib/actions/invoices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, FileText, AlertCircle, Euro } from "lucide-react"
import { redirect } from "next/navigation"

export default async function TenantPortal() {
  const userResult = await getCurrentUser()
  if (!userResult?.user) {
    redirect("/auth/login")
  }
  const { user: profile } = userResult

  const { data: contract } = await getTenantContract()
  const { data: invoices } = await getTenantInvoices()

  const pendingInvoices = invoices?.filter((inv: any) => inv.status !== "paid").length || 0
  const totalDue =
    invoices
      ?.filter((inv: any) => inv.status !== "paid")
      .reduce((sum: number, inv: any) => sum + Number(inv.amount), 0)
      .toFixed(2) || "0.00"

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Willkommen, {profile?.firstName || "Mieter"}
          </h1>
          <p className="text-muted-foreground">Ihr persönlicher Mieterbereich</p>
        </div>
      </div>

      {contract && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Meine Wohnung</CardTitle>
                <CardDescription>Aktiver Mietvertrag</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">{contract.unit.property.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {contract.unit.property.address}, {contract.unit.property.city}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Einheit: </span>
                  <span className="font-medium">{contract.unit.unitNumber}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Monatliche Miete: </span>
                  <span className="font-medium">{Number(contract.monthlyRent).toFixed(2)} €</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Größe: </span>
                  <span className="font-medium">
                    {contract.unit.sizeSqm ? `${Number(contract.unit.sizeSqm)} m²` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Rechnungen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">Zu begleichen</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehender Betrag</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDue} €</div>
            <p className="text-xs text-muted-foreground">Gesamt offen</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Schnellzugriff</CardTitle>
          <CardDescription>Ihre wichtigsten Funktionen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="/portal/invoices"
            className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
          >
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Rechnungen</p>
              <p className="text-sm text-muted-foreground">Alle Rechnungen einsehen</p>
            </div>
          </a>
          <a
            href="/portal/maintenance"
            className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
          >
            <AlertCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Schadensmeldungen</p>
              <p className="text-sm text-muted-foreground">Problem melden</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
