import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, FileText, Shield, CheckCircle2, ArrowRight, Calendar, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { QuoteForm } from "@/components/landing/quote-form"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">PropManage</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Funktionen
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Vorteile
            </a>
            <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Kontakt
            </a>
            <Button asChild variant="outline" size="sm" className="bg-transparent">
              <Link href="/auth/login">Anmelden</Link>
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
                <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/50 px-3 py-1 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-muted-foreground">Professionelle Lösung für Ihre Immobilien</span>
                </div>
                <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Hausverwaltung neu gedacht
                </h1>
                <p className="text-pretty text-lg text-muted-foreground md:text-xl">
                  Verwalten Sie Ihre Immobilien effizient mit unserer modernen All-in-One-Plattform. Sparen Sie Zeit und
                  steigern Sie Ihre Produktivität.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
                  <a href="#contact">
                    Kostenlos testen
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <a href="#features">Mehr erfahren</a>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Verwaltete Einheiten</p>
                </div>
                <div className="h-10 w-px bg-border/40" />
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Zufriedene Verwalter</p>
                </div>
                <div className="h-10 w-px bg-border/40" />
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-primary">98%</p>
                  <p className="text-sm text-muted-foreground">Kundenzufriedenheit</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl" />
              <Card className="relative border-border/40 bg-card/50 shadow-xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Ihre Vorteile im Überblick
                  </CardTitle>
                  <CardDescription>Was Sie mit PropManage erreichen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Building2, text: "Zentrale Verwaltung aller Immobilien" },
                    { icon: FileText, text: "Automatisierte Rechnungserstellung" },
                    { icon: Users, text: "Digitales Mieterportal" },
                    { icon: Calendar, text: "Effizientes Terminmanagement" },
                  ].map((benefit, i) => (
                    <div key={benefit.text} className="flex items-center gap-3 transition-all hover:translate-x-2">
                      <div className="rounded-full bg-primary/20 p-2">
                        <benefit.icon className="h-4 w-4 text-primary" />
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
        <section id="features" className="border-y border-border/40 bg-secondary/20 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
                <span className="text-primary">✦</span>
                <span className="text-muted-foreground">Leistungsstarke Features</span>
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Alles, was Sie brauchen</h2>
              <p className="mt-4 text-pretty text-muted-foreground">
                Eine vollständige Lösung für professionelle Hausverwaltung
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: "Immobilienverwaltung",
                  description: "Verwalten Sie beliebig viele Objekte und Einheiten übersichtlich an einem Ort",
                },
                {
                  icon: Users,
                  title: "Mieterverwaltung",
                  description: "Digitale Verträge, Kontaktdaten und Kommunikation mit Ihren Mietern",
                },
                {
                  icon: FileText,
                  title: "Rechnungsverwaltung",
                  description: "Erstellen und verwalten Sie Rechnungen mit automatischer Verwaltung",
                },
                {
                  icon: Shield,
                  title: "Sicher & Datenschutzkonform",
                  description: "Ihre Daten sind bei uns sicher. DSGVO-konform und verschlüsselt",
                },
                {
                  icon: Calendar,
                  title: "Terminverwaltung",
                  description: "Planen Sie Besichtigungen, Wartungen und andere Termine zentral",
                },
                {
                  icon: Clock,
                  title: "Zeitersparnis",
                  description: "Automatisieren Sie wiederkehrende Aufgaben und Prozesse",
                },
              ].map((feature, i) => (
                <Card
                  key={feature.title}
                  className="group border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-4 inline-flex rounded-lg bg-primary/20 p-3 transition-all group-hover:scale-110 group-hover:bg-primary/30">
                      <feature.icon className="h-6 w-6 text-primary" />
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
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/50 px-4 py-1.5 text-sm">
                    <span className="text-primary">★</span>
                    <span className="text-muted-foreground">Vorteile</span>
                  </div>
                  <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                    Warum PropManage wählen?
                  </h2>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      icon: Clock,
                      title: "Zeitersparnis",
                      description:
                        "Automatisieren Sie wiederkehrende Aufgaben und sparen Sie bis zu 10 Stunden pro Woche",
                    },
                    {
                      icon: TrendingUp,
                      title: "Transparenz",
                      description: "Behalten Sie jederzeit den Überblick über alle Ihre Immobilien in Echtzeit",
                    },
                    {
                      icon: Shield,
                      title: "Professionell",
                      description: "Moderne Software für professionelles Immobilienmanagement nach höchsten Standards",
                    },
                  ].map((benefit) => (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                        <benefit.icon className="h-6 w-6 text-primary" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl" />
                <Card className="relative border-border/40 bg-card/50 shadow-xl backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Starten Sie jetzt</h3>
                        <p className="text-sm text-muted-foreground">
                          Entdecken Sie, wie PropManage Ihre Immobilienverwaltung revolutionieren kann
                        </p>
                      </div>
                      <div className="space-y-4">
                        <ul className="space-y-3">
                          {[
                            "Unbegrenzte Immobilien und Einheiten",
                            "Alle Premium-Funktionen inklusive",
                            "Persönlicher Support",
                            "Regelmäßige Updates",
                            "DSGVO-konforme Datenhaltung",
                            "30 Tage kostenlos testen",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full shadow-lg shadow-primary/20" size="lg" asChild>
                          <a href="#contact">Jetzt kostenlos testen</a>
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
        <section id="contact" className="border-t border-border/40 bg-secondary/20 py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
                  <span className="text-primary">✉</span>
                  <span className="text-muted-foreground">Kontakt</span>
                </div>
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Angebot anfragen</h2>
                <p className="mt-4 text-pretty text-muted-foreground">
                  Lassen Sie uns über Ihre Anforderungen sprechen. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                </p>
              </div>
              <QuoteForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="font-bold">PropManage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professionelle Hausverwaltungssoftware für modernes Immobilienmanagement
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Produkt</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="transition-colors hover:text-foreground">
                    Funktionen
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="transition-colors hover:text-foreground">
                    Vorteile
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Rechtliches</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Impressum
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Kontakt</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:info@propmanage.de" className="transition-colors hover:text-foreground">
                    info@propmanage.de
                  </a>
                </li>
                <li>
                  <a href="tel:+491234567890" className="transition-colors hover:text-foreground">
                    +49 (0) 123 456789
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PropManage. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
