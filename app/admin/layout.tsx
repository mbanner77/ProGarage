import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

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
        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="flex items-center gap-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 md:hidden">
            <SidebarTrigger className="-ml-1">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü öffnen</span>
            </SidebarTrigger>
            <div className="flex-1">
              <p className="text-sm font-semibold">Verwaltung</p>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
