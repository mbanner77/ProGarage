import { getContracts } from "@/lib/actions/contracts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function TenantsPage() {
  const { data: contracts } = await getContracts()

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Mieter</h1>
          <p className="text-muted-foreground">Verwalten Sie Mietverträge und Kontakte</p>
        </div>
      </div>

      <div className="grid gap-4">
        {contracts?.map((contract) => (
          <Card key={contract.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>
                      {contract.tenant.first_name} {contract.tenant.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {contract.unit.property.name} - Einheit {contract.unit.unit_number}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    contract.status === "active"
                      ? "default"
                      : contract.status === "expired"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {contract.status === "active" ? "Aktiv" : contract.status === "expired" ? "Abgelaufen" : "Beendet"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{contract.tenant.email}</span>
                </div>
                {contract.tenant.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{contract.tenant.phone}</span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-muted-foreground">Miete: </span>
                  <span className="font-medium">{contract.monthly_rent.toFixed(2)} €</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Von: </span>
                  <span className="font-medium">{new Date(contract.start_date).toLocaleDateString("de-DE")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {contracts?.length === 0 && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Noch keine Mieter</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Erstellen Sie Immobilien und Einheiten, um Mietverträge anzulegen
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
