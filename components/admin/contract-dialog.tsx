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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FileText, User, Home, Euro, Calendar, Loader2 } from "lucide-react"
import { createContract } from "@/lib/actions/contracts"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface ContractDialogProps {
  trigger?: React.ReactNode
  units?: any[]
  tenants?: any[]
}

export function ContractDialog({ trigger, units = [], tenants = [] }: ContractDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createContract(formData)

    if (result.error) {
      toast({
        title: "Fehler",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Erfolg",
        description: "Vertrag wurde erstellt",
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
            Neuer Vertrag
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 pb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Neuer Mietvertrag</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Erstellen Sie einen neuen Vertrag
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Unit Selection */}
            <div className="space-y-2">
              <Label htmlFor="unit_id" className="text-sm font-medium flex items-center gap-2">
                <Home className="h-3.5 w-3.5 text-emerald-500" />
                Einheit auswählen
              </Label>
              <Select name="unit_id" required>
                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors">
                  <SelectValue placeholder="Einheit auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.property?.name} - Einheit {unit.unitNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tenant Selection */}
            <div className="space-y-2">
              <Label htmlFor="tenant_id" className="text-sm font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-emerald-500" />
                Mieter auswählen
              </Label>
              <Select name="tenant_id" required>
                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors">
                  <SelectValue placeholder="Mieter auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.firstName} {tenant.lastName} ({tenant.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rent and Deposit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_rent" className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-3.5 w-3.5 text-emerald-500" />
                  Monatliche Miete
                </Label>
                <Input 
                  id="monthly_rent" 
                  name="monthly_rent" 
                  type="number" 
                  step="0.01" 
                  placeholder="85.00" 
                  required 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit" className="text-sm font-medium">
                  Kaution <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input 
                  id="deposit" 
                  name="deposit" 
                  type="number" 
                  step="0.01" 
                  placeholder="255.00" 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  Vertragsbeginn
                </Label>
                <Input 
                  id="start_date" 
                  name="start_date" 
                  type="date" 
                  required 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-sm font-medium">
                  Vertragsende <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input 
                  id="end_date" 
                  name="end_date" 
                  type="date" 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
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
              className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 min-w-[140px]"
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
