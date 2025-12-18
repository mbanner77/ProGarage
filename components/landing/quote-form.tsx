"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitQuoteRequest } from "@/lib/actions/quotes"
import { CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company_name: formData.get("company") as string,
      property_count: formData.get("propertyCount") ? Number.parseInt(formData.get("propertyCount") as string) : null,
      message: formData.get("message") as string,
    }

    try {
      const result = await submitQuoteRequest(data)

      if (result.error) {
        throw new Error(result.error)
      }

      setIsSuccess(true)
      toast.success("Ihre Anfrage wurde erfolgreich gesendet!")
    } catch (error) {
      console.error("[v0] Quote submission error:", error)
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-primary/20 p-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Vielen Dank für Ihre Anfrage!</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Wir haben Ihre Anfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname *</Label>
              <Input id="firstName" name="firstName" required placeholder="Max" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname *</Label>
              <Input id="lastName" name="lastName" required placeholder="Mustermann" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail *</Label>
            <Input id="email" name="email" type="email" required placeholder="max@beispiel.de" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+49 123 456789" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Firma/Unternehmen</Label>
            <Input id="company" name="company" placeholder="Mustermann Immobilien GmbH" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyCount">Anzahl der Einheiten</Label>
            <Input id="propertyCount" name="propertyCount" type="number" placeholder="20" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Beschreiben Sie Ihre Anforderungen..."
              rows={4}
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet..." : "Angebot anfragen"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Mit dem Absenden stimmen Sie unseren Datenschutzbestimmungen zu.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
