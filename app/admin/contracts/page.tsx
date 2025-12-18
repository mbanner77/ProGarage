import { Button } from "@/components/ui/button"
import { getContracts } from "@/lib/actions/contracts"
import { getVacantUnits } from "@/lib/actions/units"
import { getTenants } from "@/lib/actions/users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContractDialog } from "@/components/admin/contract-dialog"
import { FileText } from "lucide-react"

export default async function ContractsPage() {
  const { data: contracts } = await getContracts()
  const { data: units } = await getVacantUnits()
  const { data: tenants } = await getTenants()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "terminated":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "expired":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktiv"
      case "terminated":
        return "Gekündigt"
      case "expired":
        return "Abgelaufen"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Verträge</h1>
          <p className="text-muted-foreground">Verwalten Sie alle Mietverträge</p>
        </div>
        <ContractDialog units={units || []} tenants={tenants || []} />
      </div>

      <div className="gap-6 grid">
        {contracts?.map((contract: any) => (
          <Card key={contract.id} className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    {contract.unit?.property?.name} - {contract.unit?.unit_number}
                  </CardTitle>
                  <CardDescription>{contract.tenant?.full_name || contract.tenant?.email}</CardDescription>
                </div>
                <Badge className={getStatusColor(contract.status)}>{getStatusText(contract.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-medium text-muted-foreground text-sm">Miete</p>
                  <p className="font-semibold text-lg">{contract.monthly_rent.toLocaleString("de-DE")} €</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">Kaution</p>
                  <p className="font-semibold text-lg">{contract.deposit?.toLocaleString("de-DE") || "0"} €</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">Beginn</p>
                  <p className="font-semibold text-lg">{new Date(contract.start_date).toLocaleDateString("de-DE")}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-sm">Ende</p>
                  <p className="font-semibold text-lg">
                    {contract.end_date ? new Date(contract.end_date).toLocaleDateString("de-DE") : "Unbefristet"}
                  </p>
                </div>
              </div>
              {contract.contract_file_url && (
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    Vertrag anzeigen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {(!contracts || contracts.length === 0) && (
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="text-muted-foreground">Keine Verträge gefunden</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
