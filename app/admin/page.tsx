export const dynamic = 'force-dynamic'

import { getAdminStats } from "@/lib/actions/stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Warehouse, Users, FileText, Calendar, TrendingUp, AlertCircle, Wrench } from "lucide-react"

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Übersicht</h1>
          <p className="text-muted-foreground">Willkommen im Verwaltungsbereich</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garagen</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.properties}</div>
            <p className="text-xs text-muted-foreground">Verwaltete Objekte</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Verträge</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeContracts}</div>
            <p className="text-xs text-muted-foreground">Laufende Mietverträge</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Rechnungen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAmount.toFixed(0)} €</div>
            <p className="text-xs text-muted-foreground">{stats.overdueInvoices} überfällig</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heutige Termine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Anstehende Termine</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
            <CardDescription>Wichtige Verwaltungsfunktionen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/properties"
              className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <Warehouse className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Garagen verwalten</p>
                <p className="text-sm text-muted-foreground">Standorte und Stellplätze</p>
              </div>
            </a>
            <a
              href="/admin/tenants"
              className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Mieter verwalten</p>
                <p className="text-sm text-muted-foreground">Verträge und Kontakte</p>
              </div>
            </a>
            <a
              href="/admin/invoices"
              className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Rechnungen</p>
                <p className="text-sm text-muted-foreground">Erstellen und verwalten</p>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Systeminformationen</CardTitle>
            <CardDescription>Status und Hinweise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">System läuft einwandfrei</p>
                <p className="text-xs text-muted-foreground">Alle Dienste operational</p>
              </div>
            </div>
            {stats.openMaintenance > 0 && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-500/20 p-2">
                  <Wrench className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{stats.openMaintenance} offene Wartungsanfragen</p>
                  <p className="text-xs text-muted-foreground">Benötigen Bearbeitung</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/20 p-2">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Datenbank verbunden</p>
                <p className="text-xs text-muted-foreground">PostgreSQL aktiv</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
