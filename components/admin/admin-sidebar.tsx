"use client"

import {
  Warehouse,
  Users,
  FileText,
  Calendar,
  LogOut,
  Home,
  LayoutDashboard,
  Wrench,
  MessageSquare,
} from "lucide-react"
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

interface AdminSidebarProps {
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

export function AdminSidebar({ user, profile }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  const navigation = [
    { name: "Übersicht", href: "/admin", icon: LayoutDashboard },
    { name: "Garagen", href: "/admin/properties", icon: Warehouse },
    { name: "Mieter", href: "/admin/tenants", icon: Users },
    { name: "Verträge", href: "/admin/contracts", icon: FileText },
    { name: "Rechnungen", href: "/admin/invoices", icon: FileText },
    { name: "Termine", href: "/admin/appointments", icon: Calendar },
    { name: "Wartung", href: "/admin/maintenance", icon: Wrench },
    { name: "Anfragen", href: "/admin/quotes", icon: MessageSquare },
  ]

  const initials =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`
      : profile?.email[0].toUpperCase() || "A"

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">PropManage</p>
            <p className="text-xs text-muted-foreground">Verwaltung</p>
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
            <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
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
