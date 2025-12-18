export const dynamic = 'force-dynamic'

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

export default async function JanitorSchedulePage() {
  const session = await getSession()
  
  const tasks = await prisma.maintenanceRequest.findMany({
    where: { 
      assignedToId: session?.id,
      scheduledDate: { not: null },
      status: { not: "completed" },
    },
    include: {
      unit: { include: { property: true } },
      tenant: { select: { firstName: true, lastName: true, phone: true } },
    },
    orderBy: { scheduledDate: "asc" },
  })

  const groupedTasks = tasks.reduce((acc, task) => {
    const date = task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString("de-DE") : "Ohne Datum"
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(task)
    return acc
  }, {} as Record<string, typeof tasks>)

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Termine
        </h1>
        <p className="text-muted-foreground">Ihre geplanten Wartungstermine</p>
      </div>

      {Object.keys(groupedTasks).length === 0 ? (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">Keine Termine</p>
            <p className="text-muted-foreground">Sie haben derzeit keine geplanten Termine</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([date, dateTasks]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {date}
              </h2>
              <div className="space-y-3">
                {dateTasks.map((task) => (
                  <Card key={task.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          <CardDescription>
                            {task.unit?.property?.name} - Einheit {task.unit?.unitNumber}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {task.scheduledTime && (
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {task.scheduledTime}
                            </Badge>
                          )}
                          <Badge
                            className={
                              task.priority === "high"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : task.priority === "medium"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            }
                          >
                            {task.priority === "high" ? "Hoch" : task.priority === "medium" ? "Mittel" : "Niedrig"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      {task.tenant && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Mieter: </span>
                          <span className="font-medium">
                            {task.tenant.firstName} {task.tenant.lastName}
                            {task.tenant.phone && ` (${task.tenant.phone})`}
                          </span>
                        </div>
                      )}
                      {task.notes && (
                        <div className="mt-2 rounded-lg bg-muted/50 p-2 text-sm">
                          <span className="text-muted-foreground">Notizen: </span>
                          {task.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
