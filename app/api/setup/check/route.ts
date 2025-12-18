import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase.from("profiles").select("id").limit(1)

    const tablesExist = !tablesError

    // Check if admin exists
    let adminExists = false
    if (tablesExist) {
      const { data: admin } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("email", "admin@propmanage.de")
        .eq("role", "admin")
        .single()

      adminExists = !!admin
    }

    return NextResponse.json({
      tablesExist,
      adminExists,
      message: tablesExist ? "Datenbank ist konfiguriert" : "Datenbank muss noch eingerichtet werden",
    })
  } catch (error) {
    return NextResponse.json({ error: "Setup-Check fehlgeschlagen", details: error }, { status: 500 })
  }
}
