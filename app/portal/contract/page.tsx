import { getTenantContract } from "@/lib/actions/contracts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

export default async function ContractPage() {
  const { data: contract, error } = await getTenantContract()

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
          <p className="text-muted-foreground">Kein aktiver Mietvertrag gefunden</p>
        </CardContent>
      </Card>
    )
  }

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
      <div>
        <h1 className="font-bold text-3xl">Mein Mietvertrag</h1>
        <p className="text-muted-foreground">Details zu Ihrem aktuellen Mietvertrag</p>
      </div>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                {contract.unit?.property?.name}
              </CardTitle>
              <CardDescription>
                Wohnung {contract.unit?.unit_number} - {contract.unit?.property?.address}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(contract.status)}>{getStatusText(contract.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="gap-6 grid sm:grid-cols-2">
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Monatliche Miete</p>
              <p className="font-bold text-2xl text-primary">{contract.monthly_rent.toLocaleString("de-DE")} €</p>
            </div>
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Kaution</p>
              <p className="font-bold text-2xl">{contract.deposit?.toLocaleString("de-DE") || "0"} €</p>
            </div>
          </div>

          <div className="gap-6 grid sm:grid-cols-2">
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Vertragsbeginn</p>
              <p className="font-semibold text-lg">{new Date(contract.start_date).toLocaleDateString("de-DE")}</p>
            </div>
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Vertragsende</p>
              <p className="font-semibold text-lg">
                {contract.end_date ? new Date(contract.end_date).toLocaleDateString("de-DE") : "Unbefristet"}
              </p>
            </div>
          </div>

          <div className="gap-6 grid sm:grid-cols-3">
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Wohnfläche</p>
              <p className="font-semibold text-lg">{contract.unit?.size_sqm || "-"} m²</p>
            </div>
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Zimmer</p>
              <p className="font-semibold text-lg">{contract.unit?.rooms || "-"}</p>
            </div>
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-sm">Etage</p>
              <p className="font-semibold text-lg">{contract.unit?.floor || "-"}</p>
            </div>
          </div>

          {contract.contract_file_url && (
            <div className="pt-4 border-t">
              <Button className="w-full sm:w-auto">
                <Download className="mr-2 size-4" />
                Vertrag herunterladen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
