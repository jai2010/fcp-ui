"use client"

import { useState } from "react"
import { BarChart3, Bell, ChevronDown, LayoutDashboard, LineChart, Mail, Menu, Search, Settings, Users, PlusCircle, FileText, DollarSign, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import AccountsPage from "@/app/accounts-page"
import SearchPage from "@/app/search-page"
import AccountSettingsPage from "@/app/account-settings-page"
import RulesPage from "@/app/rules-page"

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [environment, setEnvironment] = useState("Sandbox")
  const [businessUnit, setBusinessUnit] = useState("FKMP")

  const menuItems = [
    { section: "MENU", items: [
      { name: "Dashboard", icon: LayoutDashboard, link: "dashboard" },
      { name: "Search", icon: Search, link: "search" },
      { name: "Accounts", icon: Users, link: "accounts" },
    ]},
    { section: "CONFIGURATIONS", items: [
      { name: "Rules", icon: Settings, link: "rules" },
      { name: "Account Settings", icon: FileText, link: "account-settings-page" },
    ]},
    { section: "ONBOARDING", items: [
      { name: "New Usecase", icon: PlusCircle, link: "new-usecase" },
      { name: "New Account", icon: PlusCircle, link: "new-account" },
    ]},
    { section: "PLATFORM SETTINGS", items: [
      { name: "System Status", icon: BarChart3, link: "system-status" },
    ]},
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    Active Accounts
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">+2350</div>
                  <div className="text-sm text-green-600 mt-1">
                    +180.1% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    Total Transactions
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">+12,234</div>
                  <div className="text-sm text-green-600 mt-1">
                    +19% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    Active Rules
                    <Settings className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">573</div>
                  <div className="text-sm text-green-600 mt-1">
                    +201 since last week
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    GMV
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">$1,234,567</div>
                  <div className="text-sm text-green-600 mt-1">
                    +15.3% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    Revenue
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">$987,654</div>
                  <div className="text-sm text-green-600 mt-1">
                    +12.7% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    Usecases Onboarded
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">127</div>
                  <div className="text-sm text-green-600 mt-1">
                    +5 this month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    Users on Platform
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">3,542</div>
                  <div className="text-sm text-green-600 mt-1">
                    +201 since last week
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 flex gap-4">
              <Button onClick={() => setCurrentPage("accounts")} className="flex-1">
                <Users className="mr-2 h-4 w-4" /> View All Accounts
              </Button>
              <Button onClick={() => setCurrentPage("search")} className="flex-1">
                <Search className="mr-2 h-4 w-4" /> Go to Search
              </Button>
            </div>
          </>
        )
      case "accounts":
        return <AccountsPage />
      case "search":
        return <SearchPage />
      case "account-settings-page":
        return <AccountSettingsPage />
      case "rules":
          return <RulesPage />
      default:
        return <h1 className="text-2xl font-semibold mb-6">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-background border-r h-screen transition-all duration-300",
            isSidebarCollapsed ? "w-[60px]" : "w-[250px]"
          )}
        >
          <div className="p-4 border-b">
            <div className="font-semibold text-xl">FCP</div>
          </div>
          <div className="py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((section, index) => (
                <div key={index}>
                  {!isSidebarCollapsed && (
                    <div className="text-xs font-semibold text-muted-foreground mt-4 mb-2 px-2">
                      {section.section}
                    </div>
                  )}
                  {section.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      className={cn("w-full justify-start gap-2", currentPage === item.link && "bg-muted")}
                      onClick={() => setCurrentPage(item.link)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </Button>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{environment}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setEnvironment("Sandbox")}>Sandbox</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEnvironment("Prod")}>Prod</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{businessUnit}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setBusinessUnit("FKMP")}>FKMP</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBusinessUnit("EKL")}>EKL</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  )
}