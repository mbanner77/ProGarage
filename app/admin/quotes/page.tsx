import { getQuoteRequests } from "@/lib/actions/quotes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Mail, Phone, Warehouse } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function AdminQuotesPage() {
  const { data: quoteRequests } = await getQuoteRequests()

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Angebotsanfragen</h1>
        <p className="text-muted-foreground">Neue Kundenanfragen von der Webseite</p>
      </div>

      <div className="grid gap-4">
        {quoteRequests?.map((request) => (
          <Card key={request.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>
                      {request.first_name} {request.last_name}
                    </CardTitle>
                    <CardDescription>Neuer Interessent</CardDescription>
                  </div>
                </div>
                <Badge variant={request.status === "contacted" ? "default" : "secondary"}>
                  {request.status === "contacted" ? "Kontaktiert" : "Neu"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${request.email}`} className="text-primary hover:underline">
                    {request.email}
                  </a>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${request.phone}`} className="text-primary hover:underline">
                      {request.phone}
                    </a>
                  </div>
                )}
                {request.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{request.company}</span>
                  </div>
                )}
                {request.message && (
                  <div className="col-span-full text-sm">
                    <span className="text-muted-foreground">Nachricht: </span>
                    <span>{request.message}</span>
                  </div>
                )}
                <div className="col-span-full text-xs text-muted-foreground">
                  Eingegangen:{" "}
                  {new Date(request.created_at).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {quoteRequests?.length === 0 && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Keine Anfragen</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">Noch keine Angebotsanfragen eingegangen</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
