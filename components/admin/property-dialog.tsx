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
import { Plus, Building2 } from "lucide-react"
import { createProperty } from "@/lib/actions/properties"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface PropertyDialogProps {
  trigger?: React.ReactNode
}

export function PropertyDialog({ trigger }: PropertyDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createProperty(formData)

    if (result.error) {
      toast({
        title: "Fehler",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Erfolg",
        description: "Immobilie wurde erstellt",
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
            Neue Immobilie
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Neue Immobilie erstellen
            </DialogTitle>
            <DialogDescription>Fügen Sie eine neue Immobilie zu Ihrem Portfolio hinzu</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name der Immobilie *</Label>
              <Input id="name" name="name" placeholder="z.B. Wohnanlage Musterstraße" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input id="address" name="address" placeholder="Musterstraße 123" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Stadt *</Label>
                <Input id="city" name="city" placeholder="Berlin" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postal_code">PLZ *</Label>
                <Input id="postal_code" name="postal_code" placeholder="10115" required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Zusätzliche Informationen zur Immobilie..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Erstelle..." : "Immobilie erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
