import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  console.log("[v0] Creating Supabase server client")
  console.log("[v0] NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const cookieStore = await cookies()
  console.log("[v0] Cookie store retrieved")

  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        const allCookies = cookieStore.getAll()
        console.log("[v0] Getting all cookies, count:", allCookies.length)
        return allCookies
      },
      setAll(cookiesToSet) {
        try {
          console.log("[v0] Setting cookies, count:", cookiesToSet.length)
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch (error) {
          console.log("[v0] Error setting cookies (expected in Server Components):", error)
        }
      },
    },
  })

  console.log("[v0] Supabase server client created successfully")
  return client
}

export { createClient as createServerClient }
