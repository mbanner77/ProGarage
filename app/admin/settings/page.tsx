export const dynamic = 'force-dynamic'

import { getSettings } from "@/lib/actions/settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Mail, Settings, FileText } from "lucide-react"
import { StripeSettingsForm } from "@/components/admin/stripe-settings-form"
import { EmailSettingsForm } from "@/components/admin/email-settings-form"
import { InvoiceNinjaSettingsForm } from "@/components/admin/invoice-ninja-settings-form"

export default async function SettingsPage() {
  const { data: settings } = await getSettings()

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Einstellungen
        </h1>
        <p className="text-muted-foreground">System- und Integrationseinstellungen verwalten</p>
      </div>

      <Tabs defaultValue="stripe" className="space-y-6">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="stripe" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="invoiceninja" className="gap-2">
            <FileText className="h-4 w-4" />
            Invoice Ninja
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            E-Mail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe">
          <StripeSettingsForm settings={settings} />
        </TabsContent>

        <TabsContent value="invoiceninja">
          <InvoiceNinjaSettingsForm settings={settings} />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettingsForm settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
