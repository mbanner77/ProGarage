"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react"
import { setupDatabase } from "@/lib/actions/setup-database"

export default function SetupPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<
    Array<{
      name: string
      status: "pending" | "running" | "success" | "error"
      message?: string
    }>
  >([
    { name: "1. Reset Database (Clean Slate)", status: "pending" },
    { name: "2. Create Schema (Tables & Types)", status: "pending" },
    { name: "3. Enable Row Level Security", status: "pending" },
    { name: "4. Create Triggers", status: "pending" },
    { name: "5. Create Admin User", status: "pending" },
    { name: "6. Seed Demo Data", status: "pending" },
  ])

  const runSetup = async () => {
    setIsRunning(true)

    try {
      const result = await setupDatabase((stepIndex, status, message) => {
        setSteps((prev) => prev.map((step, idx) => (idx === stepIndex ? { ...step, status, message } : step)))
      })

      if (result.success) {
        // All done!
      }
    } catch (error) {
      console.error("[v0] Setup error:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const allSuccess = steps.every((s) => s.status === "success")
  const hasError = steps.some((s) => s.status === "error")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Property Management Setup</h1>
          <p className="text-slate-400 text-lg">One-click database setup and configuration</p>
        </div>

        {/* Main Setup Card */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Database Setup</CardTitle>
            <CardDescription>
              This will reset and configure your database with all necessary tables, security policies, and demo data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warning */}
            {!isRunning && !allSuccess && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-200">
                  <strong>Warning:</strong> This will delete all existing data and recreate the database from scratch.
                </AlertDescription>
              </Alert>
            )}

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-slate-900/50"
                >
                  {step.status === "pending" && (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex-shrink-0 mt-0.5" />
                  )}
                  {step.status === "running" && (
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
                  )}
                  {step.status === "success" && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  {step.status === "error" && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />}

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        step.status === "success"
                          ? "text-green-400"
                          : step.status === "error"
                            ? "text-red-400"
                            : step.status === "running"
                              ? "text-blue-400"
                              : "text-slate-300"
                      }`}
                    >
                      {step.name}
                    </p>
                    {step.message && (
                      <p className={`text-sm mt-1 ${step.status === "error" ? "text-red-300" : "text-slate-400"}`}>
                        {step.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex gap-4">
              <Button onClick={runSetup} disabled={isRunning || allSuccess} size="lg" className="flex-1">
                {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {allSuccess ? "Setup Complete!" : isRunning ? "Running Setup..." : "Start Setup"}
              </Button>
            </div>

            {/* Success Message */}
            {allSuccess && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-200">
                  <strong>Setup Complete!</strong> You can now login with:
                  <br />
                  Email: <code className="bg-slate-900 px-2 py-1 rounded">admin@propmanage.de</code>
                  <br />
                  Password: <code className="bg-slate-900 px-2 py-1 rounded">RealCore2025</code>
                </AlertDescription>
              </Alert>
            )}

            {/* Error Retry */}
            {hasError && !isRunning && (
              <Button onClick={runSetup} variant="outline" size="lg" className="w-full bg-transparent">
                Retry Setup
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        {allSuccess && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-white">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/auth/login">Go to Login</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-white">Landing Page</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a href="/">View Site</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-white">Debug Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a href="/debug/sql">SQL Debug</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
