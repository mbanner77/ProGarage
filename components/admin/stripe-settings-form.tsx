"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { CreditCard, Eye, EyeOff, Loader2, ExternalLink } from "lucide-react"
import { updateStripeSettings } from "@/lib/actions/settings"

interface StripeSettingsFormProps {
  settings: {
    stripeEnabled: boolean
    stripePublicKey?: string | null
    stripeSecretKey?: string | null
    stripeWebhookSecret?: string | null
  } | null
}

export function StripeSettingsForm({ settings }: StripeSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  
  const [enabled, setEnabled] = useState(settings?.stripeEnabled ?? false)
  const [publicKey, setPublicKey] = useState(settings?.stripePublicKey ?? "")
  const [secretKey, setSecretKey] = useState(settings?.stripeSecretKey ?? "")
  const [webhookSecret, setWebhookSecret] = useState(settings?.stripeWebhookSecret ?? "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateStripeSettings({
        stripeEnabled: enabled,
        stripePublicKey: publicKey || undefined,
        stripeSecretKey: secretKey || undefined,
        stripeWebhookSecret: webhookSecret || undefined,
      })

      if (result.success) {
        toast.success("Stripe-Einstellungen gespeichert")
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

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Stripe Zahlungen</CardTitle>
            <CardDescription>
              Konfigurieren Sie Stripe für Online-Zahlungen von Mietern
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Stripe aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Mieter können Rechnungen online per Karte oder SEPA bezahlen
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {enabled && (
            <div className="space-y-4 rounded-lg border border-border/40 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">API-Schlüssel</h4>
                <a 
                  href="https://dashboard.stripe.com/apikeys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Stripe Dashboard öffnen
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicKey">Öffentlicher Schlüssel (Publishable Key)</Label>
                <Input
                  id="publicKey"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  placeholder="pk_live_... oder pk_test_..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Geheimer Schlüssel (Secret Key)</Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="sk_live_... oder sk_test_..."
                    className="pr-10 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook-Geheimnis (optional)</Label>
                <div className="relative">
                  <Input
                    id="webhookSecret"
                    type={showWebhookSecret ? "text" : "password"}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder="whsec_..."
                    className="pr-10 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  >
                    {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Für automatische Zahlungsbestätigungen. Webhook-URL: {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/stripe
                </p>
              </div>
            </div>
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
