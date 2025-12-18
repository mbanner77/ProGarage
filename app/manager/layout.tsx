import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ManagerSidebar } from "@/components/manager/manager-sidebar"

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const result = await getCurrentUser()

  if (!result?.user) {
    redirect("/auth/login")
  }

  const { user, profile } = result

  if (user.role !== "property_manager") {
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
