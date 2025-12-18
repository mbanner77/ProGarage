export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus } from "lucide-react"
import { UserForm } from "@/components/admin/user-form"

export default function NewUserPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          Neuer Benutzer
        </h1>
        <p className="text-muted-foreground">Admin oder Hausmeister anlegen</p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm max-w-2xl">
        <CardHeader>
          <CardTitle>Benutzer erstellen</CardTitle>
          <CardDescription>
            Erstellen Sie einen neuen Admin oder Hausmeister
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  )
}
