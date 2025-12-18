import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ManagerSidebar } from "@/components/manager/manager-sidebar"

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "property_manager") {
    redirect("/portal")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ManagerSidebar user={user} profile={profile} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}
