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
import { Plus, CalendarIcon } from "lucide-react"
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Termin
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Neuen Termin erstellen
            </DialogTitle>
            <DialogDescription>Planen Sie eine Besichtigung oder einen Wartungstermin</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titel *</Label>
              <Input id="title" name="title" placeholder="z.B. Besichtigung Wohnung 12" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="property_id">Immobilie *</Label>
              <Select name="property_id" value={selectedProperty} onValueChange={setSelectedProperty} required>
                <SelectTrigger>
                  <SelectValue placeholder="Immobilie auswählen" />
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

            <div className="grid gap-2">
              <Label htmlFor="scheduled_date">Datum und Uhrzeit *</Label>
              <Input id="scheduled_date" name="scheduled_date" type="datetime-local" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assigned_to">Zugewiesen an</Label>
              <Select name="assigned_to">
                <SelectTrigger>
                  <SelectValue placeholder="Person auswählen (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Zusätzliche Informationen zum Termin..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Erstelle..." : "Termin erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
