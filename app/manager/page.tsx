export const dynamic = 'force-dynamic'

import { getAppointments } from "@/lib/actions/appointments"
import { getMaintenanceRequests } from "@/lib/actions/maintenance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function ManagerDashboard() {
  const { data: todayAppointments } = await getAppointments()
  const { data: maintenanceRequests } = await getMaintenanceRequests()

  const completedToday = todayAppointments?.filter((apt: any) => apt.status === "completed").length || 0
  const pendingToday = todayAppointments?.filter((apt: any) => apt.status === "scheduled").length || 0

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Hallo!</h1>
        <p className="text-muted-foreground">Hier sind Ihre heutigen Aufgaben</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heute</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Termine insgesamt</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingToday}</div>
            <p className="text-xs text-muted-foreground">Noch zu erledigen</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erledigt</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground">Heute abgeschlossen</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Heutige Termine</CardTitle>
          <CardDescription>Ihre geplanten Aufgaben für heute</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments?.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4"
              >
                <div className="rounded-lg bg-primary/20 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{appointment.title}</p>
                    <Badge
                      variant={appointment.status === "completed" ? "default" : "secondary"}
                      className="ml-2 shrink-0"
                    >
                      {appointment.status === "completed" ? "Erledigt" : "Geplant"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {appointment.property?.name}
                      {appointment.unit && ` - Einheit ${appointment.unit.unit_number}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointment.scheduled_date).toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {(!todayAppointments || todayAppointments.length === 0) && (
              <div className="py-8 text-center text-muted-foreground">Keine Termine für heute</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Wartungsanfragen</CardTitle>
          <CardDescription>Offene Anfragen von Mietern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintenanceRequests?.map((request) => (
              <div
                key={request.id}
                className="flex items-start gap-3 rounded-lg border border-border/40 bg-secondary/30 p-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{request.title}</p>
                    <Badge
                      variant={
                        request.priority === "high"
                          ? "destructive"
                          : request.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="ml-2 shrink-0"
                    >
                      {request.priority === "high" ? "Hoch" : request.priority === "medium" ? "Mittel" : "Niedrig"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {request.property?.name}
                      {request.unit && ` - Einheit ${request.unit.unit_number}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                </div>
              </div>
            ))}

            {(!maintenanceRequests || maintenanceRequests.length === 0) && (
              <div className="py-8 text-center text-muted-foreground">Keine offenen Wartungsanfragen</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
