import { getMaintenanceRequests } from "@/lib/actions/maintenance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MaintenanceDialog } from "@/components/admin/maintenance-dialog"

export default async function AdminMaintenancePage() {
  const { data: maintenanceRequests } = await getMaintenanceRequests()

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Wartungsanfragen</h1>
        <p className="text-muted-foreground">Übersicht aller Reparatur- und Wartungsanfragen</p>
      </div>

      <div className="grid gap-4">
        {maintenanceRequests?.map((request) => (
          <Card key={request.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
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
                      className={`h-5 w-5 ${
                        request.priority === "high"
                          ? "text-destructive"
                          : request.priority === "medium"
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <CardTitle>{request.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {request.property?.name}
                      {request.unit && ` - Einheit ${request.unit.unit_number}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
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
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {request.tenant && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Mieter: </span>
                    <span className="font-medium">
                      {request.tenant.first_name} {request.tenant.last_name}
                    </span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-muted-foreground">Erstellt: </span>
                  <span className="font-medium">{new Date(request.created_at).toLocaleDateString("de-DE")}</span>
                </div>
                <div className="col-span-full text-sm">
                  <span className="text-muted-foreground">Beschreibung: </span>
                  <span>{request.description}</span>
                </div>
              </div>
              <div className="mt-4">
                <MaintenanceDialog request={request} />
              </div>
            </CardContent>
          </Card>
        ))}

        {maintenanceRequests?.length === 0 && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Wrench className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Keine Wartungsanfragen</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Derzeit sind keine Wartungsanfragen vorhanden
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
