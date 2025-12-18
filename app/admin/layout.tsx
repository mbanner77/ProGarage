import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const result = await getCurrentUser()

  if (!result?.user) {
    redirect("/auth/login")
  }

  const { user, profile } = result

  if (user.role !== "admin" && user.role !== "property_manager") {
    redirect("/portal")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar user={user} profile={profile} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}
