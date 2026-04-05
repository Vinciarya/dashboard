"use client"

import * as React from "react"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useFinance } from "@/lib/finance-context"
import {
  getSpendingByCategory,
  CATEGORY_COLORS,
  formatCurrency,
} from "@/lib/finance-data"

export function SpendingDonutChart() {
  const { transactions } = useFinance()
  const breakdown = getSpendingByCategory(transactions)

  const chartConfig = React.useMemo(() => {
    const cfg: ChartConfig = {}
    breakdown.forEach(({ category }) => {
      cfg[category] = {
        label: category,
        color: CATEGORY_COLORS[category] ?? "hsl(0 0% 60%)",
      }
    })
    return cfg
  }, [breakdown])

  if (breakdown.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>By category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const total = breakdown.reduce((s, d) => s + d.amount, 0)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>By category — {formatCurrency(total)} total</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    String(name),
                  ]}
                  hideLabel
                />
              }
            />
            <Pie
              data={breakdown}
              dataKey="amount"
              nameKey="category"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {breakdown.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? "hsl(0 0% 60%)"}
                  stroke="transparent"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
          {breakdown.slice(0, 8).map((item) => (
            <div key={item.category} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block size-2.5 shrink-0 rounded-full"
                style={{ background: CATEGORY_COLORS[item.category] ?? "hsl(0 0% 60%)" }}
              />
              <span className="flex-1 truncate text-muted-foreground">{item.category}</span>
              <span className="font-medium tabular-nums">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
