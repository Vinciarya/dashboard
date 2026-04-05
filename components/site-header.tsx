"use client"

import * as React from "react"
import { IconMoon, IconSun, IconShieldCheck, IconEye } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useFinance } from "@/lib/finance-context"

export function SiteHeader() {
  const { role } = useFinance()
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    // Sync with system preference on mount
    const stored = localStorage.getItem("theme")
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Finance Dashboard</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* Role badge */}
          <Badge
            variant={role === "admin" ? "default" : "secondary"}
            className={`hidden sm:flex items-center gap-1 px-2 py-0.5 text-xs ${role === "admin" ? "bg-primary/15 text-primary border-primary/30" : "text-muted-foreground"}`}
          >
            {role === "admin" ? (
              <><IconShieldCheck className="size-3" /> Admin</>
            ) : (
              <><IconEye className="size-3" /> Viewer</>
            )}
          </Badge>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <IconSun className="size-4" />
            ) : (
              <IconMoon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
