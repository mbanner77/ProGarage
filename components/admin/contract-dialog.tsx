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
import { Plus, FileText } from "lucide-react"
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Vertrag
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Neuen Mietvertrag erstellen
            </DialogTitle>
            <DialogDescription>Erstellen Sie einen Vertrag für eine Einheit</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="unit_id">Einheit *</Label>
              <Select name="unit_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Einheit auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.property?.name} - Einheit {unit.unit_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tenant_id">Mieter *</Label>
              <Select name="tenant_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Mieter auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.first_name} {tenant.last_name} ({tenant.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="monthly_rent">Monatliche Miete (€) *</Label>
                <Input id="monthly_rent" name="monthly_rent" type="number" step="0.01" placeholder="850.00" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deposit">Kaution (€)</Label>
                <Input id="deposit" name="deposit" type="number" step="0.01" placeholder="2550.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Beginn *</Label>
                <Input id="start_date" name="start_date" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">Ende (optional)</Label>
                <Input id="end_date" name="end_date" type="date" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Erstelle..." : "Vertrag erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
