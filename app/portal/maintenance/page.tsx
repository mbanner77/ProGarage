import { getMaintenanceRequests } from "@/lib/actions/maintenance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { MaintenanceDialog } from "@/components/portal/maintenance-dialog"
import { Badge } from "@/components/ui/badge"

export default async function TenantMaintenancePage() {
  const { data: maintenanceRequests } = await getMaintenanceRequests()

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Schadensmeldungen</h1>
          <p className="text-muted-foreground">Melden Sie Probleme in Ihrer Wohnung</p>
        </div>
        <MaintenanceDialog />
      </div>

      <div className="grid gap-4">
        {maintenanceRequests?.map((request) => (
          <Card key={request.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{request.title}</CardTitle>
                  <CardDescription>{request.category}</CardDescription>
                </div>
                <Badge
                  variant={
                    request.status === "completed"
                      ? "default"
                      : request.status === "in_progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {request.status === "completed"
                    ? "Erledigt"
                    : request.status === "in_progress"
                      ? "In Bearbeitung"
                      : "Offen"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{request.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Gemeldet am: {new Date(request.created_at).toLocaleDateString("de-DE")}
              </p>
            </CardContent>
          </Card>
        ))}

        {(!maintenanceRequests || maintenanceRequests.length === 0) && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
              <CardTitle className="mt-4 text-lg">Keine Schadensmeldungen</CardTitle>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Sie haben noch keine Schadensmeldungen erstellt
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
