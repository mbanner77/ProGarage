"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { updateMaintenanceStatus } from "@/lib/actions/maintenance"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface MaintenanceDialogProps {
  request: any
}

export function MaintenanceDialog({ request }: MaintenanceDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateMaintenanceStatus(request.id, formData.get("status") as string)

    if (result.error) {
      toast({
        title: "Fehler",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Erfolg",
        description: "Status wurde aktualisiert",
      })
      setOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Status ändern
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Status aktualisieren</DialogTitle>
            <DialogDescription>{request.title}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Aktuelle Priorität</Label>
              <Badge
                variant={
                  request.priority === "high" ? "destructive" : request.priority === "medium" ? "default" : "secondary"
                }
              >
                {request.priority === "high" ? "Hoch" : request.priority === "medium" ? "Mittel" : "Niedrig"}
              </Badge>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Neuer Status *</Label>
              <Select name="status" defaultValue={request.status} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="in_progress">In Arbeit</SelectItem>
                  <SelectItem value="completed">Erledigt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Beschreibung:</strong> {request.description}
              </p>
              {request.tenant && (
                <p className="mt-2">
                  <strong>Mieter:</strong> {request.tenant.firstName} {request.tenant.lastName}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Aktualisiere..." : "Status aktualisieren"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
