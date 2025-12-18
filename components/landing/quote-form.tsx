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
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      companyName: formData.get("company") as string,
      propertyCount: formData.get("propertyCount") ? Number.parseInt(formData.get("propertyCount") as string) : null,
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
      <Card className="border-orange-200 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-orange-100 p-4">
            <CheckCircle2 className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Vielen Dank für Ihre Anfrage!</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Wir haben Ihre Garagenankrage erhalten und melden uns schnellstmöglich bei Ihnen.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname *</Label>
              <Input id="firstName" name="firstName" required placeholder="Max" className="border-orange-200 focus:border-orange-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname *</Label>
              <Input id="lastName" name="lastName" required placeholder="Mustermann" className="border-orange-200 focus:border-orange-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail *</Label>
            <Input id="email" name="email" type="email" required placeholder="max@beispiel.de" className="border-orange-200 focus:border-orange-400" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+49 123 456789" className="border-orange-200 focus:border-orange-400" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Gewünschter Standort / PLZ</Label>
            <Input id="company" name="company" placeholder="z.B. München, 80331" className="border-orange-200 focus:border-orange-400" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyCount">Anzahl benötigter Garagen</Label>
            <Input id="propertyCount" name="propertyCount" type="number" placeholder="1" className="border-orange-200 focus:border-orange-400" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Ihre Nachricht / Wünsche</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="z.B. Garagengröße, Fahrzeugtyp, gewünschter Mietbeginn..."
              rows={4}
              className="resize-none border-orange-200 focus:border-orange-400"
            />
          </div>

          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet..." : "Garage anfragen"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Mit dem Absenden stimmen Sie unseren <a href="https://www.maxi-garagen.de/datenschutz" className="text-orange-500 hover:underline">Datenschutzbestimmungen</a> zu.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
