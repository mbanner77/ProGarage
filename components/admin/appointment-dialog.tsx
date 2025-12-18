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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CalendarIcon, Building2, User, Clock, FileText, Loader2, Sparkles } from "lucide-react"
import { createAppointment } from "@/lib/actions/appointments"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface AppointmentDialogProps {
  trigger?: React.ReactNode
  properties?: any[]
  users?: any[]
}

export function AppointmentDialog({ trigger, properties = [], users = [] }: AppointmentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createAppointment(formData)

    if (result.error) {
      toast({
        title: "Fehler",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Erfolg",
        description: "Termin wurde erstellt",
      })
      setOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
            <Plus className="h-4 w-4" />
            Neuer Termin
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent p-6 pb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Neuer Termin</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Planen Sie eine Besichtigung
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                Titel
              </Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="z.B. Besichtigung Garage 12" 
                required 
                className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
              />
            </div>

            {/* Property Selection */}
            <div className="space-y-2">
              <Label htmlFor="property_id" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-violet-500" />
                Immobilie
              </Label>
              <Select name="property_id" value={selectedProperty} onValueChange={setSelectedProperty} required>
                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors">
                  <SelectValue placeholder="Immobilie auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date/Time */}
            <div className="space-y-2">
              <Label htmlFor="scheduled_date" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-violet-500" />
                Datum und Uhrzeit
              </Label>
              <Input 
                id="scheduled_date" 
                name="scheduled_date" 
                type="datetime-local" 
                required 
                className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
              />
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <Label htmlFor="assigned_to" className="text-sm font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-violet-500" />
                Zugewiesen an
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Select name="assigned_to">
                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors">
                  <SelectValue placeholder="Person auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-violet-500" />
                Beschreibung
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Zusätzliche Informationen zum Termin..."
                rows={3}
                className="bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors resize-none"
              />
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
              className="gap-2 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/25 min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Erstelle...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Erstellen
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
