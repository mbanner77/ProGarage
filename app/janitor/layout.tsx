import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { JanitorSidebar } from "@/components/janitor/janitor-sidebar"
import { Menu } from "lucide-react"

export default async function JanitorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "janitor" && session.role !== "admin") {
    redirect("/")
  }

  return (
    <SidebarProvider>
      <JanitorSidebar user={session} />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <SidebarTrigger className="md:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <span className="font-semibold">Hausmeister Portal</span>
        </header>
        {children}
      </main>
    </SidebarProvider>
  )
}
