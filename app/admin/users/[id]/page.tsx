export const dynamic = 'force-dynamic'

import { getUserById } from "@/lib/actions/users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCog } from "lucide-react"
import { UserForm } from "@/components/admin/user-form"
import { notFound } from "next/navigation"

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const { data: user, error } = await getUserById(id)

  if (error || !user) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <UserCog className="h-8 w-8 text-primary" />
          Benutzer bearbeiten
        </h1>
        <p className="text-muted-foreground">
          {user.firstName} {user.lastName} ({user.email})
        </p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm max-w-2xl">
        <CardHeader>
          <CardTitle>Benutzerdaten</CardTitle>
          <CardDescription>
            Bearbeiten Sie die Daten des Benutzers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
