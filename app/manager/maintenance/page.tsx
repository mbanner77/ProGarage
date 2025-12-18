import { getMaintenanceRequests } from "@/lib/actions/maintenance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function ManagerMaintenancePage() {
  const { data: maintenanceRequests } = await getMaintenanceRequests()

  const pending = maintenanceRequests?.filter((req: any) => req.status === "pending")
  const inProgress = maintenanceRequests?.filter((req: any) => req.status === "in_progress")
  const completed = maintenanceRequests?.filter((req: any) => req.status === "completed")

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Wartungsanfragen</h1>
        <p className="text-muted-foreground">Alle Reparatur- und Wartungsanfragen</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Neue Anfragen</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Bearbeitung</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Laufende Arbeiten</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erledigt</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Abgeschlossen</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Alle Anfragen</CardTitle>
          <CardDescription>Nach Priorität sortiert</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintenanceRequests?.map((request) => (
              <div
                key={request.id}
                className="flex items-start gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4"
              >
                <div
                  className={`rounded-lg p-2 ${
                    request.priority === "high"
                      ? "bg-destructive/20"
                      : request.priority === "medium"
                        ? "bg-primary/20"
                        : "bg-secondary/20"
                  }`}
                >
                  <Wrench
                    className={`h-4 w-4 ${
                      request.priority === "high"
                        ? "text-destructive"
                        : request.priority === "medium"
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{request.title}</p>
                    <div className="ml-2 flex shrink-0 gap-2">
                      <Badge
                        variant={
                          request.priority === "high"
                            ? "destructive"
                            : request.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {request.priority === "high" ? "Hoch" : request.priority === "medium" ? "Mittel" : "Niedrig"}
                      </Badge>
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
                            ? "In Arbeit"
                            : "Ausstehend"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {request.property?.name}
                      {request.unit && ` - Einheit ${request.unit.unit_number}`}
                    </span>
                  </div>
                  {request.tenant && (
                    <p className="text-sm text-muted-foreground">
                      Mieter: {request.tenant.first_name} {request.tenant.last_name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Erstellt: {new Date(request.created_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
            ))}

            {(!maintenanceRequests || maintenanceRequests.length === 0) && (
              <div className="py-16 text-center text-muted-foreground">
                <Wrench className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p>Keine Wartungsanfragen vorhanden</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
