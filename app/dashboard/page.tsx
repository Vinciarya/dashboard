"use client"

import dynamic from "next/dynamic"

import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { InsightsSection } from "@/components/insights-section"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { FinanceProvider } from "@/lib/finance-context"
import { Toaster } from "@/components/ui/sonner"

const ChartAreaInteractive = dynamic(() => import("@/components/chart-area-interactive").then((mod) => mod.ChartAreaInteractive), { ssr: false })
const SpendingDonutChart = dynamic(() => import("@/components/spending-donut-chart").then((mod) => mod.SpendingDonutChart), { ssr: false })
const DataTable = dynamic(() => import("@/components/data-table").then((mod) => mod.DataTable), { ssr: false })

export default function Page() {
  return (
    <FinanceProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Summary Cards */}
                <SectionCards />

                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @4xl/main:grid-cols-5">
                  <div className="@4xl/main:col-span-3">
                    <ChartAreaInteractive />
                  </div>
                  <div className="@4xl/main:col-span-2">
                    <SpendingDonutChart />
                  </div>
                </div>

                {/* Insights */}
                <InsightsSection />

                {/* Transactions Table */}
                <DataTable />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </FinanceProvider>
  )
}
