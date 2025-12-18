"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Play, CheckCircle, Calendar, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateMaintenanceStatus, updateMaintenanceSchedule } from "@/lib/actions/maintenance"

interface TaskActionsProps {
  task: {
    id: string
    status: string
    scheduledDate?: Date | null
    scheduledTime?: string | null
    notes?: string | null
  }
}

export function TaskActions({ task }: TaskActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduledDate, setScheduledDate] = useState(
    task.scheduledDate ? new Date(task.scheduledDate).toISOString().split("T")[0] : ""
  )
  const [scheduledTime, setScheduledTime] = useState(task.scheduledTime || "")
  const [notes, setNotes] = useState(task.notes || "")

  const handleStatusChange = async (status: "in_progress" | "completed") => {
    setLoading(true)
    try {
      const result = await updateMaintenanceStatus(task.id, status)
      if (result.success) {
        toast.success(status === "completed" ? "Aufgabe erledigt!" : "Aufgabe gestartet")
        router.refresh()
      } else {
        toast.error(result.error || "Fehler beim Aktualisieren")
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleSave = async () => {
    setLoading(true)
    try {
      const result = await updateMaintenanceSchedule(task.id, {
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        scheduledTime: scheduledTime || null,
        notes: notes || null,
      })
      if (result.success) {
        toast.success("Termin gespeichert")
        setScheduleOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Fehler beim Speichern")
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  if (task.status === "completed") {
    return (
      <div className="flex items-center gap-2 text-emerald-500">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Erledigt</span>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {task.status === "pending" && (
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => handleStatusChange("in_progress")}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Starten
        </Button>
      )}

      {task.status === "in_progress" && (
        <Button
          size="sm"
          className="gap-2"
          onClick={() => handleStatusChange("completed")}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          Erledigt
        </Button>
      )}

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Termin
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Termin planen</DialogTitle>
            <DialogDescription>
              Planen Sie einen Termin für diese Aufgabe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Uhrzeit</Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Interne Notizen zur Aufgabe..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleScheduleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
