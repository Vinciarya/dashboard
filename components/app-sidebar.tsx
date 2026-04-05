"use client";

import * as React from "react";
import {
  IconChartPie,
  IconCreditCard,
  IconDashboard,
  IconHelp,
  IconSettings,
  IconShieldCheck,
  IconEye,
  IconWallet,
  IconTrendingUp,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFinance, type Role } from "@/lib/finance-context";
import { Badge } from "@/components/ui/badge";

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Transactions", url: "/transactions", icon: IconCreditCard },
  { title: "Analytics", url: "/analytics", icon: IconTrendingUp },
  { title: "Insights", url: "/insights", icon: IconChartPie },
];

const navSecondary = [
  { title: "Settings", url: "#", icon: IconSettings },
  { title: "Help", url: "#", icon: IconHelp },
];

const user = {
  name: "Aryan",
  email: "kosliaaryan@gmail.com",
  avatar: "/placeholder-user.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role, setRole } = useFinance();
  const pathname = usePathname();

  const navMainWithActive = navMain.map(item => ({
    ...item,
    isActive: pathname.startsWith(item.url)
  }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Logo / Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconWallet className="size-5!" />
                <span className="text-base font-semibold">FinanceIQ</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavSecondary items={navSecondary} className="mt-auto" />

        {/* Role Switcher */}
        <div className="px-3 py-3">
          <SidebarSeparator className="mb-3" />
          <Label className="text-xs font-medium text-muted-foreground px-1 mb-1 block">
            Current Role
          </Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-full h-8 text-sm" id="role-switcher">
              <div className="flex items-center gap-2">
                {role === "admin" ? (
                  <IconShieldCheck className="size-3.5 text-primary" />
                ) : (
                  <IconEye className="size-3.5 text-muted-foreground" />
                )}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <IconShieldCheck className="size-3.5" />
                  Admin
                  <Badge
                    variant="secondary"
                    className="ml-1 text-xs py-0 px-1.5"
                  >
                    full access
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="viewer">
                <div className="flex items-center gap-2">
                  <IconEye className="size-3.5" />
                  Viewer
                  <Badge variant="outline" className="ml-1 text-xs py-0 px-1.5">
                    read only
                  </Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
            {role === "admin"
              ? "Can add, edit and delete transactions."
              : "View-only access — no edits allowed."}
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
