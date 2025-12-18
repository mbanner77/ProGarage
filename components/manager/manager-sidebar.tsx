"use client"

import { Calendar, LogOut, Home, LayoutDashboard, Wrench, Warehouse } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ManagerSidebarProps {
  user: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role: string
  }
  profile: {
    firstName?: string | null
    lastName?: string | null
    email: string
    role: string
  } | null
}

export function ManagerSidebar({ user, profile }: ManagerSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  const navigation = [
    { name: "Übersicht", href: "/manager", icon: LayoutDashboard },
    { name: "Termine", href: "/manager/appointments", icon: Calendar },
    { name: "Wartung", href: "/manager/maintenance", icon: Wrench },
  ]

  const initials =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`
      : profile?.email[0].toUpperCase() || "H"

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">PropManage</p>
            <p className="text-xs text-muted-foreground">Hausmeister</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3 pb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {profile?.firstName && profile?.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : profile?.email}
            </p>
            <p className="text-xs text-muted-foreground">Hausmeister</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </Button>
      </SidebarFooter>

      <SidebarTrigger className="absolute -right-4 top-4" />
    </Sidebar>
  )
}
