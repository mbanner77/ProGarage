"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { updateMaintenanceStatus, assignMaintenanceToJanitor } from "@/lib/actions/maintenance"
import { getJanitors } from "@/lib/actions/users"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Wrench, AlertTriangle, User, FileText, Loader2, CheckCircle2, HardHat } from "lucide-react"

interface MaintenanceDialogProps {
  request: any
}

export function MaintenanceDialog({ request }: MaintenanceDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [janitors, setJanitors] = useState<{ id: string; firstName: string | null; lastName: string | null; email: string }[]>([])
  const [selectedJanitor, setSelectedJanitor] = useState<string>(request.assignedToId || "none")

  useEffect(() => {
    if (open) {
      getJanitors().then((result) => {
        if (result.data) {
          setJanitors(result.data)
        }
      })
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const status = formData.get("status") as string
    
    // First update status
    const result = await updateMaintenanceStatus(request.id, status)

    if (result.error) {
      toast({
        title: "Fehler",
        description: result.error,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Then assign janitor if selected (and not "none")
    if (selectedJanitor && selectedJanitor !== "none" && selectedJanitor !== request.assignedToId) {
      const assignResult = await assignMaintenanceToJanitor(request.id, selectedJanitor)
      if (assignResult.error) {
        toast({
          title: "Warnung",
          description: "Status aktualisiert, aber Zuweisung fehlgeschlagen",
          variant: "destructive",
        })
      }
    }

    toast({
      title: "Erfolg",
      description: "Wartungsanfrage wurde aktualisiert",
    })
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors">
          <Wrench className="h-3.5 w-3.5" />
          Status ändern
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent p-6 pb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Status aktualisieren</DialogTitle>
                  <DialogDescription className="text-muted-foreground line-clamp-1">
                    {request.title}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Priority Badge */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                Aktuelle Priorität
              </Label>
              <Badge
                className={
                  request.priority === "high" 
                    ? "bg-red-100 text-red-700 hover:bg-red-100" 
                    : request.priority === "medium" 
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-100" 
                    : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                }
              >
                {request.priority === "high" ? "Hoch" : request.priority === "medium" ? "Mittel" : "Niedrig"}
              </Badge>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-500" />
                Neuer Status
              </Label>
              <Select name="status" defaultValue={request.status} required>
                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="in_progress">In Arbeit</SelectItem>
                  <SelectItem value="completed">Erledigt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Janitor Assignment */}
            <div className="space-y-2">
              <Label htmlFor="janitor" className="text-sm font-medium flex items-center gap-2">
                <HardHat className="h-3.5 w-3.5 text-orange-500" />
                Hausmeister zuweisen
              </Label>
              <Select value={selectedJanitor} onValueChange={setSelectedJanitor}>
                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors">
                  <SelectValue placeholder="Hausmeister auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nicht zugewiesen</SelectItem>
                  {janitors.map((janitor) => (
                    <SelectItem key={janitor.id} value={janitor.id}>
                      {janitor.firstName && janitor.lastName 
                        ? `${janitor.firstName} ${janitor.lastName}` 
                        : janitor.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {request.assignedTo && (
                <p className="text-xs text-muted-foreground">
                  Aktuell: {request.assignedTo.firstName} {request.assignedTo.lastName}
                </p>
              )}
            </div>

            {/* Details Card */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Beschreibung</p>
                  <p className="text-sm">{request.description || "Keine Beschreibung"}</p>
                </div>
              </div>
              {request.tenant && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Mieter</p>
                    <p className="text-sm">{request.tenant.firstName} {request.tenant.lastName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 pt-4 bg-muted/30 border-t">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="hover:bg-muted"
            >
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Speichere...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Speichern
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
