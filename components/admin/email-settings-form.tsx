"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Mail, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react"
import { updateEmailSettings, testEmailConnection } from "@/lib/actions/settings"

interface EmailSettingsFormProps {
  settings: {
    emailEnabled: boolean
    smtpHost?: string | null
    smtpPort?: number | null
    smtpUser?: string | null
    smtpPassword?: string | null
    smtpFromEmail?: string | null
    smtpFromName?: string | null
    smtpSecure?: boolean
    notifyOnNewInvoice?: boolean
  } | null
}

export function EmailSettingsForm({ settings }: EmailSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [enabled, setEnabled] = useState(settings?.emailEnabled ?? false)
  const [smtpHost, setSmtpHost] = useState(settings?.smtpHost ?? "")
  const [smtpPort, setSmtpPort] = useState(settings?.smtpPort?.toString() ?? "587")
  const [smtpUser, setSmtpUser] = useState(settings?.smtpUser ?? "")
  const [smtpPassword, setSmtpPassword] = useState(settings?.smtpPassword ?? "")
  const [smtpFromEmail, setSmtpFromEmail] = useState(settings?.smtpFromEmail ?? "")
  const [smtpFromName, setSmtpFromName] = useState(settings?.smtpFromName ?? "")
  const [smtpSecure, setSmtpSecure] = useState(settings?.smtpSecure ?? true)
  const [notifyOnNewInvoice, setNotifyOnNewInvoice] = useState(settings?.notifyOnNewInvoice ?? true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateEmailSettings({
        emailEnabled: enabled,
        smtpHost: smtpHost || undefined,
        smtpPort: smtpPort ? parseInt(smtpPort) : undefined,
        smtpUser: smtpUser || undefined,
        smtpPassword: smtpPassword || undefined,
        smtpFromEmail: smtpFromEmail || undefined,
        smtpFromName: smtpFromName || undefined,
        smtpSecure,
        notifyOnNewInvoice,
      })

      if (result.success) {
        toast.success("E-Mail-Einstellungen gespeichert")
        router.refresh()
      } else {
        toast.error(result.error || "Fehler beim Speichern")
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setTesting(true)
    try {
      const result = await testEmailConnection()
      if (result.success) {
        toast.success("Verbindung erfolgreich!")
      } else {
        toast.error(result.error || "Verbindung fehlgeschlagen")
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten")
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>E-Mail Einstellungen</CardTitle>
            <CardDescription>
              Konfigurieren Sie den E-Mail-Versand für Benachrichtigungen
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
            <div className="space-y-0.5">
              <Label className="text-base">E-Mail aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Aktiviert den E-Mail-Versand für das System
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {enabled && (
            <>
              <div className="space-y-4 rounded-lg border border-border/40 p-4">
                <h4 className="font-medium">SMTP-Server</h4>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input
                      id="smtpPort"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="587"
                      type="number"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">Benutzername</Label>
                    <Input
                      id="smtpUser"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Passwort</Label>
                    <div className="relative">
                      <Input
                        id="smtpPassword"
                        type={showPassword ? "text" : "password"}
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smtpSecure"
                      checked={smtpSecure}
                      onCheckedChange={setSmtpSecure}
                    />
                    <Label htmlFor="smtpSecure">SSL/TLS verwenden</Label>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={testing || !smtpHost}
                    className="gap-2"
                  >
                    {testing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Verbindung testen
                  </Button>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border/40 p-4">
                <h4 className="font-medium">Absender</h4>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpFromEmail">Absender E-Mail</Label>
                    <Input
                      id="smtpFromEmail"
                      value={smtpFromEmail}
                      onChange={(e) => setSmtpFromEmail(e.target.value)}
                      placeholder="noreply@example.com"
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpFromName">Absender Name</Label>
                    <Input
                      id="smtpFromName"
                      value={smtpFromName}
                      onChange={(e) => setSmtpFromName(e.target.value)}
                      placeholder="Maxi Garagen"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border/40 p-4">
                <h4 className="font-medium">Benachrichtigungen</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Neue Rechnungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Mieter per E-Mail über neue Rechnungen informieren
                    </p>
                  </div>
                  <Switch
                    checked={notifyOnNewInvoice}
                    onCheckedChange={setNotifyOnNewInvoice}
                  />
                </div>
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Einstellungen speichern
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
