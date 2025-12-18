export const dynamic = 'force-dynamic'

import { getAppointments } from "@/lib/actions/appointments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function ManagerAppointmentsPage() {
  const { data: appointments } = await getAppointments()

  const upcoming = appointments?.filter(
    (apt: any) => apt.status === "scheduled" && new Date(apt.scheduledDate) >= new Date(),
  )
  const completed = appointments?.filter((apt: any) => apt.status === "completed")

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Termine</h1>
        <p className="text-muted-foreground">Alle Ihre zugewiesenen Termine</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anstehend</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcoming?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Geplante Termine</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erledigt</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Abgeschlossene Termine</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Alle Termine</CardTitle>
          <CardDescription>Chronologisch sortiert</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments?.map((appointment) => (
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
                      variant={
                        appointment.status === "completed"
                          ? "default"
                          : appointment.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                      className="ml-2 shrink-0"
                    >
                      {appointment.status === "completed"
                        ? "Erledigt"
                        : appointment.status === "cancelled"
                          ? "Abgesagt"
                          : "Geplant"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {appointment.property?.name}
                      {appointment.unit && ` - Einheit ${appointment.unit.unitNumber}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointment.scheduledDate).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {appointment.description && (
                    <p className="text-sm text-muted-foreground">{appointment.description}</p>
                  )}
                </div>
              </div>
            ))}

            {(!appointments || appointments.length === 0) && (
              <div className="py-16 text-center text-muted-foreground">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p>Noch keine Termine zugewiesen</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
