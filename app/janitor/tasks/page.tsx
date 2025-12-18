export const dynamic = 'force-dynamic'

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench } from "lucide-react"
import { TaskActions } from "@/components/janitor/task-actions"

export default async function JanitorTasksPage() {
  const session = await getSession()
  
  const tasks = await prisma.maintenanceRequest.findMany({
    where: { assignedToId: session?.id },
    include: {
      unit: { include: { property: true } },
      tenant: { select: { firstName: true, lastName: true, email: true, phone: true } },
    },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Erledigt</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Bearbeitung</Badge>
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Offen</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Hoch</Badge>
      case "medium":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Mittel</Badge>
      case "low":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Niedrig</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          Meine Aufgaben
        </h1>
        <p className="text-muted-foreground">Ihre zugewiesenen Wartungsaufträge</p>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Wrench className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Keine Aufgaben</p>
              <p className="text-muted-foreground">Ihnen sind derzeit keine Aufgaben zugewiesen</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription>
                      {task.unit?.property?.name} - Einheit {task.unit?.unitNumber}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{task.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mieter: </span>
                    <span className="font-medium">
                      {task.tenant.firstName} {task.tenant.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kontakt: </span>
                    <span className="font-medium">{task.tenant.phone || task.tenant.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Erstellt: </span>
                    <span className="font-medium">
                      {new Date(task.createdAt).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                  {task.scheduledDate && (
                    <div>
                      <span className="text-muted-foreground">Termin: </span>
                      <span className="font-medium text-primary">
                        {new Date(task.scheduledDate).toLocaleDateString("de-DE")}
                        {task.scheduledTime && ` um ${task.scheduledTime}`}
                      </span>
                    </div>
                  )}
                </div>

                {task.notes && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Notizen: </span>
                    <span className="text-sm">{task.notes}</span>
                  </div>
                )}

                <TaskActions task={task} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
