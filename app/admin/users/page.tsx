export const dynamic = 'force-dynamic'

import { getStaffUsers } from "@/lib/actions/users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function UsersPage() {
  const { data: users } = await getStaffUsers()

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Admin</Badge>
      case "property_manager":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Verwalter</Badge>
      case "janitor":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Hausmeister</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Benutzerverwaltung
          </h1>
          <p className="text-muted-foreground">Admins und Hausmeister verwalten</p>
        </div>
        <Link href="/admin/users/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neuer Benutzer
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {users?.length === 0 ? (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Keine Benutzer</p>
              <p className="text-muted-foreground">Erstellen Sie den ersten Admin oder Hausmeister</p>
            </CardContent>
          </Card>
        ) : (
          users?.map((user) => (
            <Card key={user.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                      {user.firstName && user.lastName
                        ? `${user.firstName[0]}${user.lastName[0]}`
                        : user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.email}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {user.phone && <span>Tel: {user.phone}</span>}
                    {!user.phone && <span>Kein Telefon hinterlegt</span>}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="outline" size="sm">Bearbeiten</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
