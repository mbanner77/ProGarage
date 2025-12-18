"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Receipt, User, Hash, Euro, Calendar, FileText, Loader2 } from "lucide-react"
import { createInvoice } from "@/lib/actions/invoices"
import { toast } from "sonner"

interface InvoiceDialogProps {
  tenants: Array<{ id: string; firstName: string | null; lastName: string | null; email: string }>
}

export function InvoiceDialog({ tenants }: InvoiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      tenant_id: formData.get("tenant_id") as string,
      invoice_number: formData.get("invoice_number") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      due_date: formData.get("due_date") as string,
      description: formData.get("description") as string,
    }

    const result = await createInvoice(data)

    if (result.success) {
      toast.success("Rechnung erfolgreich erstellt")
      setOpen(false)
      window.location.reload()
    } else {
      toast.error(result.error || "Fehler beim Erstellen der Rechnung")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
          <Plus className="h-4 w-4" />
          Neue Rechnung
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden">
        <form onSubmit={onSubmit}>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 pb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Neue Rechnung</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Erstellen Sie eine Rechnung für einen Mieter
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Tenant Selection */}
            <div className="space-y-2">
              <Label htmlFor="tenant_id" className="text-sm font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-amber-500" />
                Mieter auswählen
              </Label>
              <Select name="tenant_id" required>
                <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors">
                  <SelectValue placeholder="Mieter auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.firstName} {tenant.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Invoice Number */}
            <div className="space-y-2">
              <Label htmlFor="invoice_number" className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-amber-500" />
                Rechnungsnummer
              </Label>
              <Input
                id="invoice_number"
                name="invoice_number"
                placeholder="RE-2025-001"
                defaultValue={`RE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`}
                required
                className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
              />
            </div>

            {/* Amount and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-3.5 w-3.5 text-amber-500" />
                  Betrag
                </Label>
                <Input 
                  id="amount" 
                  name="amount" 
                  type="number" 
                  step="0.01" 
                  placeholder="85.00" 
                  required 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  Fällig am
                </Label>
                <Input 
                  id="due_date" 
                  name="due_date" 
                  type="date" 
                  required 
                  className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                Beschreibung
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input 
                id="description" 
                name="description" 
                placeholder="z.B. Miete Januar 2025" 
                className="h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 pt-4 bg-muted/30 border-t">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)} 
              disabled={loading}
              className="hover:bg-muted"
            >
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 min-w-[140px]"
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
