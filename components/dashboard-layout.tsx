"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/lib/useTranslation"
import { hasPermission } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Package, Users, CreditCard, Settings, LogOut, Menu, Truck, FileText, UserPlus, LayoutDashboard, Search, Bell, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import SiteFooter from "@/components/site-footer"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  adminOnly?: boolean
}

const getNavigationItems = (t: (key: string) => string): NavigationItem[] => [
  { id: "dashboard", label: t('navigation.dashboard'), icon: LayoutDashboard, href: "/" },
  { id: "orders", label: t('navigation.orders'), icon: Package, href: "/orders" },
  { id: "drivers", label: t('navigation.drivers'), icon: Truck, href: "/drivers" },
  { id: "subscriptions", label: t('navigation.subscriptions'), icon: Users, href: "/subscriptions" },
  // { id: "billing", label: t('navigation.billing'), icon: CreditCard, href: "/billing" },
  // { id: "settings", label: t('navigation.settings'), icon: Settings, href: "/settings", adminOnly: true },
]

export function DashboardLayout({ children, currentPage = "orders" }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigationItems = getNavigationItems(t)
  const filteredNavItems = navigationItems.filter((item) => !item.adminOnly || hasPermission(user, "admin_access"))

  const handleNavigation = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
  }

  const SidebarContent = () => (
    <div className="fixed flex flex-col h-full w-72 bg-gradient-to-b from-[#272626] to-[#272626]">
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Image src='/images/fawri_logo_yellow.jpg' alt='Fawri Plus' width={40} height={40} className="rounded-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#ffcc04]">Fawri Plus</h2>
            <p className="text-xs text-white">نظام إدارة التوصيل</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <li key={item.id} className="relative">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11 !text-white hover:bg-[#ffcc04]/10 transition-all duration-200 rounded-xl",
                    isActive && "bg-gradient-to-r from-[#ffcc04] to-[#ffcc04] !text-[#272626]"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                  )} />
                  {item.label}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ffcc04]/10 border border-[#ffcc04]/60">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ffcc04] to-[#ffcc04] flex items-center justify-center">
            <span className="text-[#272626] font-semibold">
              {user?.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{user?.username}</p>
            <p className="text-sm text-white">{user?.role === "admin" ? t('users.admin') : t('users.manager')}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-red-500 hover:text-red-400 h-8 w-8 p-0" 
            onClick={logout}
          >
            <LogOut className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#ffcc04]/5 to-[ffcc04]/8">
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="fixed z-20 w-full lg:w-[calc(100%-285px)] bg-[#272626]/10 backdrop-blur-xl p-4 lg:py-4 lg:px-6 shadow-sm border-b border-gray-200/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden bg-transparent border-gray-200 hover:bg-gray-100">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <nav className="hidden sm:flex text-sm text-gray-600">
              <span>لوحة التحكم</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900">
                {filteredNavItems.find((item) => item.id === currentPage)?.label || "لوحة التحكم"}
              </span>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="ابحث هنا..."
                className="h-9 w-64 text-sm rounded-lg pe-10 ps-4 bg-[#272626]/10 border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc04] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#ffcc04] flex items-center justify-center">
                  <span className="text-[#272626] font-semibold text-sm">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-[#272626]">{user?.role === "admin" ? t('users.admin') : t('users.manager')}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6 mt-20">{children}</main>
      </div>
    </div>
  )
}