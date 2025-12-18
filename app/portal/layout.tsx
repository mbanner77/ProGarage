import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TenantSidebar } from "@/components/portal/tenant-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function TenantPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <TenantSidebar user={user} profile={profile} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}
