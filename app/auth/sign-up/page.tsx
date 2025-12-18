"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const fullName = formData.get("fullName") as string

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein")
      setLoading(false)
      return
    }

    const result = await signUp({
      email,
      password,
      fullName,
      role: "tenant",
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Registrierung erfolgreich!</CardTitle>
            <CardDescription>
              Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte überprüfen Sie Ihr Postfach und klicken Sie auf
              den Bestätigungslink.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/login">Zur Anmeldung</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Konto erstellen</CardTitle>
          <CardDescription>Registrieren Sie sich für Ihr Mieterportal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Vollständiger Name</Label>
              <Input id="fullName" name="fullName" required placeholder="Max Mustermann" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" required placeholder="max@beispiel.de" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Mindestens 8 Zeichen"
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Passwort wiederholen"
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Wird erstellt..." : "Konto erstellen"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Sie haben bereits ein Konto?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Hier anmelden
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
