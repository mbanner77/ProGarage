import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] SQL execution API called")

    const { sql } = await request.json()

    if (!sql) {
      console.error("[v0] No SQL provided")
      return NextResponse.json({ error: "No SQL query provided" }, { status: 400 })
    }

    console.log("[v0] Executing SQL:", sql.substring(0, 100) + "...")

    const supabase = await createClient()

    // Execute the SQL directly
    const { data, error } = await supabase.rpc("exec_sql", {
      sql_query: sql,
    })

    if (error) {
      console.error("[v0] SQL execution error:", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    console.log("[v0] SQL execution successful")
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
