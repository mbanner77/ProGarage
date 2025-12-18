export const dynamic = 'force-dynamic'

import { getPropertyById } from "@/lib/actions/properties"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Home, ArrowLeft, Plus, Euro } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params
  const { data: property, error } = await getPropertyById(id)

  if (error || !property) {
    notFound()
  }

  const occupiedUnits = property.units?.filter((u: any) => u.isOccupied).length || 0
  const vacantUnits = (property.units?.length || 0) - occupiedUnits
  const totalMonthlyRent = property.units?.reduce((sum: number, u: any) => sum + Number(u.monthlyRent), 0) || 0

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="bg-transparent">
          <Link href="/admin/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
          <p className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.address}, {property.postalCode} {property.city}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Einheiten</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.units?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vermietet</CardTitle>
            <Home className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{occupiedUnits}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frei</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacantUnits}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monatl. Einnahmen</CardTitle>
            <Euro className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalMonthlyRent.toLocaleString("de-DE")} €</div>
          </CardContent>
        </Card>
      </div>

      {property.description && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Beschreibung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{property.description}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Einheiten</CardTitle>
              <CardDescription>Alle Einheiten dieser Immobilie</CardDescription>
            </div>
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="h-4 w-4" />
              Einheit hinzufügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {property.units?.map((unit: any) => (
              <Card key={unit.id} className="border-border/40 bg-secondary/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Einheit {unit.unitNumber}</CardTitle>
                    <Badge variant={unit.isOccupied ? "default" : "secondary"}>
                      {unit.isOccupied ? "Vermietet" : "Frei"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {unit.sizeSqm && (
                      <div>
                        <span className="text-muted-foreground">Größe: </span>
                        <span className="font-medium">{Number(unit.sizeSqm)} m²</span>
                      </div>
                    )}
                    {unit.floor !== null && (
                      <div>
                        <span className="text-muted-foreground">Etage: </span>
                        <span className="font-medium">{unit.floor}</span>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Miete: </span>
                      <span className="font-medium text-primary">{Number(unit.monthlyRent).toLocaleString("de-DE")} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!property.units || property.units.length === 0) && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                <Home className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p>Noch keine Einheiten vorhanden</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
