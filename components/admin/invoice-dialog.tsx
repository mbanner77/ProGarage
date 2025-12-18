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
import { Plus } from "lucide-react"
import { createInvoice } from "@/lib/actions/invoices"
import { toast } from "sonner"

interface InvoiceDialogProps {
  tenants: Array<{ id: string; first_name: string; last_name: string }>
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neue Rechnung
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rechnung erstellen</DialogTitle>
            <DialogDescription>Erstellen Sie eine neue Rechnung für einen Mieter</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tenant_id">Mieter</Label>
              <Select name="tenant_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Mieter auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.first_name} {tenant.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invoice_number">Rechnungsnummer</Label>
              <Input
                id="invoice_number"
                name="invoice_number"
                placeholder="RE-2025-001"
                defaultValue={`RE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Betrag (€)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" placeholder="1200.00" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due_date">Fälligkeitsdatum</Label>
              <Input id="due_date" name="due_date" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Input id="description" name="description" placeholder="z.B. Miete Januar 2025" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Wird erstellt..." : "Rechnung erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
