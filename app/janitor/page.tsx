export const dynamic = 'force-dynamic'

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export default async function JanitorDashboard() {
  const session = await getSession()
  
  const myTasks = await prisma.maintenanceRequest.findMany({
    where: { assignedToId: session?.id },
    include: {
      unit: { include: { property: true } },
      tenant: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const pendingTasks = myTasks.filter(t => t.status === "pending")
  const inProgressTasks = myTasks.filter(t => t.status === "in_progress")
  const completedTasks = myTasks.filter(t => t.status === "completed")
  const scheduledTasks = myTasks.filter(t => t.scheduledDate)

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hallo, {session?.firstName || "Hausmeister"}!
        </h1>
        <p className="text-muted-foreground">Ihre Aufgabenübersicht</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Aufgaben</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Warten auf Bearbeitung</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Bearbeitung</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">Aktive Aufgaben</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geplant</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledTasks.length}</div>
            <p className="text-xs text-muted-foreground">Mit Termin</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erledigt</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Abgeschlossen</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Aktuelle Aufgaben</CardTitle>
          <CardDescription>Ihre nächsten zu bearbeitenden Aufgaben</CardDescription>
        </CardHeader>
        <CardContent>
          {[...pendingTasks, ...inProgressTasks].length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Keine offenen Aufgaben vorhanden
            </p>
          ) : (
            <div className="space-y-4">
              {[...pendingTasks, ...inProgressTasks].slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.unit?.property?.name} - {task.unit?.unitNumber}
                    </p>
                    {task.scheduledDate && (
                      <p className="text-xs text-primary">
                        Termin: {new Date(task.scheduledDate).toLocaleDateString("de-DE")}
                        {task.scheduledTime && ` um ${task.scheduledTime}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        task.status === "pending"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {task.status === "pending" ? "Offen" : "In Bearbeitung"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        task.priority === "high"
                          ? "bg-red-500/10 text-red-500"
                          : task.priority === "medium"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {task.priority === "high" ? "Hoch" : task.priority === "medium" ? "Mittel" : "Niedrig"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
