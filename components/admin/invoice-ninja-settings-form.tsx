"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { FileText, Eye, EyeOff, Loader2, CheckCircle, ExternalLink } from "lucide-react"
import { updateInvoiceNinjaSettings, testInvoiceNinjaConnection } from "@/lib/actions/settings"

interface InvoiceNinjaSettingsFormProps {
  settings: {
    invoiceNinjaEnabled: boolean
    invoiceNinjaUrl?: string | null
    invoiceNinjaApiKey?: string | null
    invoiceNinjaCompanyId?: string | null
    useInvoiceNinjaForNew?: boolean
  } | null
}

export function InvoiceNinjaSettingsForm({ settings }: InvoiceNinjaSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  
  const [enabled, setEnabled] = useState(settings?.invoiceNinjaEnabled ?? false)
  const [url, setUrl] = useState(settings?.invoiceNinjaUrl ?? "")
  const [apiKey, setApiKey] = useState(settings?.invoiceNinjaApiKey ?? "")
  const [companyId, setCompanyId] = useState(settings?.invoiceNinjaCompanyId ?? "")
  const [useForNew, setUseForNew] = useState(settings?.useInvoiceNinjaForNew ?? false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateInvoiceNinjaSettings({
        invoiceNinjaEnabled: enabled,
        invoiceNinjaUrl: url || undefined,
        invoiceNinjaApiKey: apiKey || undefined,
        invoiceNinjaCompanyId: companyId || undefined,
        useInvoiceNinjaForNew: useForNew,
      })

      if (result.success) {
        toast.success("Invoice Ninja-Einstellungen gespeichert")
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
      const result = await testInvoiceNinjaConnection()
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
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Invoice Ninja</CardTitle>
            <CardDescription>
              Rechnungen über Invoice Ninja erstellen und verwalten
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Invoice Ninja aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Integration mit Invoice Ninja für erweiterte Rechnungsfunktionen
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
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">API-Konfiguration</h4>
                  <a 
                    href="https://invoiceninja.github.io/docs/api-tokens/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    API-Dokumentation
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Invoice Ninja URL</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://invoicing.example.com oder https://app.invoiceninja.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Die URL Ihrer Invoice Ninja Installation (ohne /api)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API-Token</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Ihr Invoice Ninja API-Token"
                      className="pr-10 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyId">Firmen-ID (optional)</Label>
                  <Input
                    id="companyId"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    placeholder="Für Multi-Company Setup"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nur bei mehreren Firmen in Invoice Ninja erforderlich
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={testing || !url || !apiKey}
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
                <h4 className="font-medium">Rechnungserstellung</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Neue Rechnungen über Invoice Ninja</Label>
                    <p className="text-sm text-muted-foreground">
                      Wenn aktiviert, werden neue Rechnungen automatisch in Invoice Ninja erstellt
                    </p>
                  </div>
                  <Switch
                    checked={useForNew}
                    onCheckedChange={setUseForNew}
                  />
                </div>

                {!useForNew && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>In-App Modus:</strong> Rechnungen werden direkt in der App erstellt. 
                      Sie können einzelne Rechnungen bei Bedarf manuell nach Invoice Ninja exportieren.
                    </p>
                  </div>
                )}

                {useForNew && (
                  <div className="rounded-lg bg-primary/10 p-3">
                    <p className="text-sm text-primary">
                      <strong>Invoice Ninja Modus:</strong> Alle neuen Rechnungen werden automatisch 
                      in Invoice Ninja erstellt. Die App synchronisiert den Status automatisch.
                    </p>
                  </div>
                )}
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
