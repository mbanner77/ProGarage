import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Warehouse, Users, FileText, Shield, CheckCircle2, ArrowRight, Calendar, TrendingUp, Clock, Car, Key, MapPin } from "lucide-react"
import Link from "next/link"
import { QuoteForm } from "@/components/landing/quote-form"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Warehouse className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-orange-500">MAXI-GARAGEN</span>
              <span className="text-[10px] text-muted-foreground -mt-1">Ihr Garagenpartner</span>
            </div>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Leistungen
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Vorteile
            </a>
            <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Kontakt
            </a>
            <Button asChild variant="outline" size="sm" className="bg-transparent border-orange-500 text-orange-500 hover:bg-orange-50">
              <Link href="/auth/login">Kundenportal</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
                  </span>
                  <span className="text-orange-700">Ihr zuverlässiger Garagenpartner</span>
                </div>
                <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Ihre Garage bei <span className="text-orange-500">Maxi-Garagen</span>
                </h1>
                <p className="text-pretty text-lg text-muted-foreground md:text-xl">
                  Sicherer Stellplatz für Ihr Fahrzeug – flexibel mieten, einfach verwalten. 
                  Registrieren Sie sich jetzt im Kundenportal und behalten Sie alles im Blick.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                  <a href="#contact">
                    Garage anfragen
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-orange-500 text-orange-600 hover:bg-orange-50">
                  <Link href="/auth/login">Zum Kundenportal</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-orange-500">1.000+</p>
                  <p className="text-sm text-muted-foreground">Garagen & Stellplätze</p>
                </div>
                <div className="h-10 w-px bg-border/40" />
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-orange-500">25+</p>
                  <p className="text-sm text-muted-foreground">Standorte</p>
                </div>
                <div className="h-10 w-px bg-border/40" />
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-orange-500">98%</p>
                  <p className="text-sm text-muted-foreground">Zufriedene Mieter</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-orange-300/20 blur-3xl" />
              <Card className="relative border-orange-200 bg-card/50 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-orange-500" />
                    Ihre Vorteile bei Maxi-Garagen
                  </CardTitle>
                  <CardDescription>Warum Sie bei uns richtig sind</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Key, text: "24/7 Zugang zu Ihrer Garage" },
                    { icon: Shield, text: "Sichere & videoüberwachte Anlagen" },
                    { icon: FileText, text: "Übersichtliche Online-Verwaltung" },
                    { icon: MapPin, text: "Standorte in Ihrer Nähe" },
                  ].map((benefit, i) => (
                    <div key={benefit.text} className="flex items-center gap-3 transition-all hover:translate-x-2">
                      <div className="rounded-full bg-orange-100 p-2">
                        <benefit.icon className="h-4 w-4 text-orange-500" />
                      </div>
                      <span className="text-sm">{benefit.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-y border-orange-100 bg-orange-50/30 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1.5 text-sm">
                <span className="text-orange-500">✦</span>
                <span className="text-muted-foreground">Unsere Leistungen</span>
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Alles rund um Ihre Garage</h2>
              <p className="mt-4 text-pretty text-muted-foreground">
                Komfortable Garagenvermietung mit modernem Kundenportal
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Warehouse,
                  title: "Garagen & Stellplätze",
                  description: "Verschiedene Garagengrößen für PKW, Motorräder, Wohnmobile und mehr",
                },
                {
                  icon: Key,
                  title: "Flexibler Zugang",
                  description: "24/7 Zugang zu Ihrer Garage – mit modernen Schließsystemen",
                },
                {
                  icon: FileText,
                  title: "Online-Verwaltung",
                  description: "Verträge, Rechnungen und Dokumente digital im Kundenportal",
                },
                {
                  icon: Shield,
                  title: "Sicherheit",
                  description: "Videoüberwachte Anlagen und sichere Zugangskontrollen",
                },
                {
                  icon: MapPin,
                  title: "Viele Standorte",
                  description: "Garagen an zahlreichen Standorten – bestimmt auch in Ihrer Nähe",
                },
                {
                  icon: Clock,
                  title: "Flexible Mietdauer",
                  description: "Kurz- oder langfristige Mietverträge nach Ihrem Bedarf",
                },
              ].map((feature, i) => (
                <Card
                  key={feature.title}
                  className="group border-orange-100 bg-white backdrop-blur-sm transition-all hover:border-orange-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-3 transition-all group-hover:scale-110 group-hover:bg-orange-200">
                      <feature.icon className="h-6 w-6 text-orange-500" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm">
                    <span className="text-orange-500">★</span>
                    <span className="text-muted-foreground">Ihre Vorteile</span>
                  </div>
                  <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                    Warum Maxi-Garagen?
                  </h2>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      icon: Shield,
                      title: "Sicherheit für Ihr Fahrzeug",
                      description:
                        "Videoüberwachte Anlagen, sichere Schließsysteme und gut beleuchtete Zufahrten",
                    },
                    {
                      icon: Clock,
                      title: "Rund um die Uhr Zugang",
                      description: "Jederzeit Zugang zu Ihrer Garage – 24 Stunden, 7 Tage die Woche",
                    },
                    {
                      icon: TrendingUp,
                      title: "Transparente Verwaltung",
                      description: "Alle Verträge, Rechnungen und Dokumente übersichtlich im Kundenportal",
                    },
                  ].map((benefit) => (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                        <benefit.icon className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-300/10 blur-3xl" />
                <Card className="relative border-orange-200 bg-card/50 shadow-xl backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Jetzt Garage sichern</h3>
                        <p className="text-sm text-muted-foreground">
                          Fragen Sie unverbindlich nach freien Garagen in Ihrer Nähe
                        </p>
                      </div>
                      <div className="space-y-4">
                        <ul className="space-y-3">
                          {[
                            "Verschiedene Garagengrößen verfügbar",
                            "Flexible Vertragslaufzeiten",
                            "Faire und transparente Preise",
                            "Persönlicher Kundenservice",
                            "Schnelle Verfügbarkeit",
                            "Einfache Online-Verwaltung",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-500" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20" size="lg" asChild>
                          <a href="#contact">Jetzt anfragen</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/Quote Section */}
        <section id="contact" className="border-t border-orange-100 bg-orange-50/30 py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1.5 text-sm">
                  <span className="text-orange-500">✉</span>
                  <span className="text-muted-foreground">Kontakt</span>
                </div>
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Garage anfragen</h2>
                <p className="mt-4 text-pretty text-muted-foreground">
                  Fragen Sie unverbindlich nach freien Garagen. Wir melden uns schnellstmöglich bei Ihnen.
                </p>
              </div>
              <QuoteForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-100 bg-orange-50/20 py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold">Bereits Kunde?</p>
                  <p className="text-sm text-muted-foreground">
                    Melden Sie sich im Kundenportal an
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="bg-white border-orange-300 hover:bg-orange-50">
                <Link href="/auth/login">Zum Kundenportal</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-orange-500">MAXI-GARAGEN</span>
                  <span className="text-[10px] text-muted-foreground -mt-1">Ihr Garagenpartner</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Ihr zuverlässiger Partner für Garagen und Stellplätze. Sicher, flexibel, unkompliziert.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Leistungen</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="transition-colors hover:text-orange-500">
                    Garagen & Stellplätze
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="transition-colors hover:text-orange-500">
                    Ihre Vorteile
                  </a>
                </li>
                <li>
                  <a href="https://www.maxi-garagen.de" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-500">
                    Hauptwebsite
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Rechtliches</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://www.maxi-garagen.de/datenschutz" className="transition-colors hover:text-orange-500">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="https://www.maxi-garagen.de/impressum" className="transition-colors hover:text-orange-500">
                    Impressum
                  </a>
                </li>
                <li>
                  <a href="https://www.maxi-garagen.de/agb" className="transition-colors hover:text-orange-500">
                    AGB
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Kontakt</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:info@maxi-garagen.de" className="transition-colors hover:text-orange-500">
                    info@maxi-garagen.de
                  </a>
                </li>
                <li>
                  <a href="tel:+4989123456" className="transition-colors hover:text-orange-500">
                    +49 (0) 89 123 456
                  </a>
                </li>
                <li>
                  <a href="https://www.maxi-garagen.de" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-500">
                    www.maxi-garagen.de
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-orange-100 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Maxi-Garagen. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
