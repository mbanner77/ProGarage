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
import { Plus, Building2, MapPin, FileText, Loader2, Sparkles } from "lucide-react"
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
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
            <Plus className="h-4 w-4" />
            Neue Immobilie
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Neue Immobilie</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Fügen Sie eine neue Immobilie hinzu
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Name der Immobilie
              </Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="z.B. Garagenhof Musterstraße" 
                required 
                className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
              />
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Adresse
              </Label>
              <Input 
                id="address" 
                name="address" 
                placeholder="Musterstraße 123" 
                required 
                className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
              />
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">Stadt</Label>
                <Input 
                  id="city" 
                  name="city" 
                  placeholder="Berlin" 
                  required 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-sm font-medium">PLZ</Label>
                <Input 
                  id="postal_code" 
                  name="postal_code" 
                  placeholder="10115" 
                  required 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Beschreibung
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Zusätzliche Informationen zur Immobilie..."
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
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 min-w-[140px]"
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
