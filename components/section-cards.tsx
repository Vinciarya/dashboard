"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFinance } from "@/lib/finance-context"
import {
  getTotalBalance,
  getTotalIncome,
  getTotalExpenses,
  getSavingsRate,
  formatCurrency,
  getMonthlyData,
} from "@/lib/finance-data"

export function SectionCards() {
  const { transactions } = useFinance()

  const balance = getTotalBalance(transactions)
  const income = getTotalIncome(transactions)
  const expenses = getTotalExpenses(transactions)
  const savingsRate = getSavingsRate(transactions)

  // MoM change using last two months
  const monthly = getMonthlyData(transactions)
  const prevMonth = monthly.length >= 2 ? monthly[monthly.length - 2] : null
  const currMonth = monthly.length >= 1 ? monthly[monthly.length - 1] : null

  const incomeDiff = prevMonth && currMonth
    ? currMonth.income - prevMonth.income
    : 0
  const expenseDiff = prevMonth && currMonth
    ? currMonth.expenses - prevMonth.expenses
    : 0

  const incomeUp = incomeDiff >= 0
  const expenseUp = expenseDiff >= 0

  function pct(diff: number, prev: number) {
    if (!prev) return "0"
    return Math.abs((diff / prev) * 100).toFixed(1)
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Total Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(balance)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {balance >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {balance >= 0 ? "Positive" : "Negative"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overall net position{" "}
            {balance >= 0 ? (
              <IconTrendingUp className="size-4 text-emerald-500" />
            ) : (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            Across all {transactions.length} transactions
          </div>
        </CardFooter>
      </Card>

      {/* Total Income */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(income)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {incomeUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {incomeUp ? "+" : "-"}{pct(incomeDiff, prevMonth?.income ?? 0)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {incomeUp ? "Up" : "Down"} vs last month{" "}
            {incomeUp ? (
              <IconTrendingUp className="size-4 text-emerald-500" />
            ) : (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            Salary, freelance &amp; investments
          </div>
        </CardFooter>
      </Card>

      {/* Total Expenses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(expenses)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {!expenseUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {expenseUp ? "+" : "-"}{pct(expenseDiff, prevMonth?.expenses ?? 0)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {expenseUp ? "Higher" : "Lower"} than last month{" "}
            {!expenseUp ? (
              <IconTrendingUp className="size-4 text-emerald-500" />
            ) : (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            All spending categories combined
          </div>
        </CardFooter>
      </Card>

      {/* Savings Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Savings Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {savingsRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {savingsRate >= 20 ? <IconTrendingUp /> : <IconTrendingDown />}
              {savingsRate >= 20 ? "On track" : "Below target"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {savingsRate >= 20 ? "Meeting savings goal" : "Target: 20% savings"}{" "}
            {savingsRate >= 20 ? (
              <IconTrendingUp className="size-4 text-emerald-500" />
            ) : (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            {formatCurrency(income - expenses)} saved of {formatCurrency(income)} earned
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
