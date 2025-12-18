import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"
import { TenantSidebar } from "@/components/portal/tenant-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function TenantPortalLayout({ children }: { children: React.ReactNode }) {
  const result = await getCurrentUser()

  if (!result?.user) {
    redirect("/auth/login")
  }

  const { user, profile } = result

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <TenantSidebar user={user} profile={profile} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}
