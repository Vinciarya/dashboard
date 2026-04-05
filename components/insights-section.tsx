"use client"

import { IconTrendingDown, IconTrendingUp, IconAlertTriangle, IconPigMoney, IconChartBar } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFinance } from "@/lib/finance-context"
import {
  getHighestSpendingCategory,
  getMonthlyComparison,
  getSavingsRate,
  getTotalIncome,
  getTotalExpenses,
  formatCurrency,
  getSpendingByCategory,
} from "@/lib/finance-data"

export function InsightsSection() {
  const { transactions } = useFinance()

  const topCategory = getHighestSpendingCategory(transactions)
  const comparison = getMonthlyComparison(transactions)
  const savingsRate = getSavingsRate(transactions)
  const income = getTotalIncome(transactions)
  const expenses = getTotalExpenses(transactions)
  const breakdown = getSpendingByCategory(transactions)

  // Categories "at risk" — taking > 30% of their likely budget share
  const highSpend = breakdown.filter((c) => c.percentage > 30)

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <h2 className="text-base font-semibold">Insights</h2>
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {/* Highest Spending Category */}
        {topCategory && (
          <Card>
            <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-chart-4/20 text-chart-4">
                <IconChartBar className="size-4" />
              </span>
              <div>
                <CardTitle className="text-sm font-medium">Top Spending Category</CardTitle>
                <CardDescription>Where most money goes</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{topCategory.category}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatCurrency(topCategory.amount)}{" "}
                <Badge variant="secondary" className="ml-1">
                  {topCategory.percentage.toFixed(1)}% of expenses
                </Badge>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Consider setting a budget limit for this category.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Month-over-Month Comparison */}
        {comparison ? (
          <Card>
            <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-chart-2/20 text-chart-2">
                <IconTrendingUp className="size-4" />
              </span>
              <div>
                <CardTitle className="text-sm font-medium">Monthly Comparison</CardTitle>
                <CardDescription>{comparison.previousMonth} → {comparison.currentMonth}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Income</span>
                <span className={`flex items-center gap-1 font-medium ${comparison.incomeChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                  {comparison.incomeChange >= 0 ? <IconTrendingUp className="size-3.5" /> : <IconTrendingDown className="size-3.5" />}
                  {comparison.incomeChange >= 0 ? "+" : ""}{formatCurrency(comparison.incomeChange)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expenses</span>
                <span className={`flex items-center gap-1 font-medium ${comparison.expensesChange <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                  {comparison.expensesChange <= 0 ? <IconTrendingDown className="size-3.5" /> : <IconTrendingUp className="size-3.5" />}
                  {comparison.expensesChange >= 0 ? "+" : ""}{formatCurrency(comparison.expensesChange)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Net change</span>
                <span className={`flex items-center gap-1 font-medium ${comparison.balanceChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                  {comparison.balanceChange >= 0 ? "+" : ""}{formatCurrency(comparison.balanceChange)}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Savings Rate */}
        <Card>
          <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
            <span className={`flex size-8 items-center justify-center rounded-lg ${savingsRate >= 20 ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-orange-500/20 text-orange-600 dark:text-orange-400"}`}>
              <IconPigMoney className="size-4" />
            </span>
            <div>
              <CardTitle className="text-sm font-medium">Savings Insight</CardTitle>
              <CardDescription>Financial health indicator</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{savingsRate.toFixed(1)}%{" "}
              <span className="text-sm font-normal text-muted-foreground">savings rate</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrency(income - expenses)} saved of {formatCurrency(income)} earned
            </p>
            <p className={`mt-2 text-xs font-medium ${savingsRate >= 20 ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}`}>
              {savingsRate >= 20
                ? "✓ You're meeting the 20% savings target."
                : `⚠ Aim to save ${formatCurrency(income * 0.2 - (income - expenses))} more to hit 20%.`}
            </p>
          </CardContent>
        </Card>

        {/* High-spend alert */}
        {highSpend.length > 0 && (
          <Card className="border-orange-200 dark:border-orange-900/50">
            <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400">
                <IconAlertTriangle className="size-4" />
              </span>
              <div>
                <CardTitle className="text-sm font-medium">Spending Alert</CardTitle>
                <CardDescription>Categories over 30% of expenses</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {highSpend.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{cat.category}</span>
                  <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700">
                    {cat.percentage.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
