export const dynamic = 'force-dynamic'

import { getProperties } from "@/lib/actions/properties"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Building2, MapPin } from "lucide-react"
import Link from "next/link"
import { PropertyDialog } from "@/components/admin/property-dialog"

export default async function PropertiesPage() {
  const { data: properties } = await getProperties()

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Immobilien</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Objekte und Einheiten</p>
        </div>
        <PropertyDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties?.map((property) => (
          <Card
            key={property.id}
            className="border-border/40 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                  </div>
                </div>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.address}, {property.city}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Einheiten</span>
                <span className="font-medium">{property.units?.length || 0}</span>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full bg-transparent">
                <Link href={`/admin/properties/${property.id}`}>Details anzeigen</Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {properties?.length === 0 && (
          <Card className="col-span-full border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Noch keine Immobilien</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Beginnen Sie mit dem Hinzufügen Ihrer ersten Immobilie
              </p>
              <Button asChild className="mt-6">
                <Link href="/admin/properties/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Immobilie hinzufügen
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
