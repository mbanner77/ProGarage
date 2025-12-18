import { getAppointments } from "@/lib/actions/appointments"
import { getProperties } from "@/lib/actions/properties"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AppointmentDialog } from "@/components/admin/appointment-dialog"

export default async function AppointmentsPage() {
  const { data: appointments } = await getAppointments()
  const { data: properties } = await getProperties()
  const users: any[] = [] // TODO: Add getUsers action

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Termine</h1>
          <p className="text-muted-foreground">Verwalten Sie Besichtigungen und Wartungstermine</p>
        </div>
        <AppointmentDialog properties={properties || []} users={users || []} />
      </div>

      <div className="grid gap-4">
        {appointments?.map((appointment) => (
          <Card key={appointment.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{appointment.title}</CardTitle>
                    <CardDescription>
                      {appointment.property?.name}
                      {appointment.unit && ` - Einheit ${appointment.unit.unit_number}`}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    appointment.status === "completed"
                      ? "default"
                      : appointment.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {appointment.status === "completed"
                    ? "Erledigt"
                    : appointment.status === "cancelled"
                      ? "Abgesagt"
                      : "Geplant"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Datum: </span>
                  <span className="font-medium">
                    {new Date(appointment.scheduled_date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {appointment.assigned && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Zugewiesen: </span>
                    <span className="font-medium">
                      {appointment.assigned.first_name} {appointment.assigned.last_name}
                    </span>
                  </div>
                )}
                {appointment.description && (
                  <div className="col-span-full text-sm text-muted-foreground">{appointment.description}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {appointments?.length === 0 && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Noch keine Termine</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">Erstellen Sie Ihren ersten Termin</p>
              <AppointmentDialog properties={properties || []} users={users || []} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
