"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function SetupPage() {
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState<any>(null)

  async function checkSetup() {
    setChecking(true)
    try {
      const response = await fetch("/api/setup/check")
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({ error: "Setup-Check fehlgeschlagen" })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Setup-Assistent</h1>
          <p className="text-muted-foreground mt-2">Überprüfen Sie die Datenbank-Konfiguration</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datenbank-Status</CardTitle>
            <CardDescription>Klicken Sie auf &quot;Setup prüfen&quot; um die Datenbank zu überprüfen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkSetup} disabled={checking}>
              {checking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Setup prüfen
            </Button>

            {results && (
              <div className="space-y-3">
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {results.tablesExist ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>Tabellen: {results.tablesExist ? "Vorhanden" : "Fehlend"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {results.adminExists ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>Admin-User: {results.adminExists ? "Angelegt" : "Fehlt"}</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {!results.tablesExist && (
                  <Alert>
                    <AlertDescription>
                      <p className="font-semibold mb-2">Tabellen fehlen!</p>
                      <p>Bitte führen Sie die SQL-Scripte aus:</p>
                      <ol className="list-decimal ml-4 mt-2 space-y-1">
                        <li>scripts/001_create_schema.sql</li>
                        <li>scripts/002_enable_rls.sql</li>
                        <li>scripts/003_create_triggers.sql</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                {!results.adminExists && results.tablesExist && (
                  <Alert>
                    <AlertDescription>
                      <p className="font-semibold mb-2">Admin-User fehlt!</p>
                      <p>Erstellen Sie den User über Supabase Dashboard:</p>
                      <ol className="list-decimal ml-4 mt-2 space-y-1">
                        <li>Gehen Sie zu Authentication {">"} Users</li>
                        <li>Klicken Sie auf &quot;Add user&quot;</li>
                        <li>Email: admin@propmanage.de</li>
                        <li>Passwort: RealCore2025</li>
                        <li>Führen Sie scripts/006_manual_admin_setup.sql aus</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                {results.tablesExist && results.adminExists && (
                  <Alert>
                    <AlertDescription className="text-green-600">
                      ✅ Setup ist vollständig! Sie können sich jetzt anmelden.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manuelle Setup-Schritte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Extensions aktivieren</h3>
              <code className="block bg-muted p-3 rounded text-sm">
                CREATE EXTENSION IF NOT EXISTS &quot;uuid-ossp&quot;;
                <br />
                CREATE EXTENSION IF NOT EXISTS &quot;pgcrypto&quot;;
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Enum Typen erstellen</h3>
              <code className="block bg-muted p-3 rounded text-sm">
                CREATE TYPE user_role AS ENUM (&apos;admin&apos;, &apos;property_manager&apos;, &apos;tenant&apos;,
                &apos;employee&apos;);
                <br />
                {"//"} ... weitere Enums siehe scripts/001_create_schema.sql
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Admin-User erstellen</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Erstellen Sie den User über: Authentication {">"} Users {">"} Add user
              </p>
              <ul className="list-disc ml-4 text-sm">
                <li>Email: admin@propmanage.de</li>
                <li>Passwort: RealCore2025</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
