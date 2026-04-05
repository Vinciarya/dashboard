export type TransactionType = "income" | "expense"

export type TransactionCategory =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Food & Dining"
  | "Housing"
  | "Transport"
  | "Entertainment"
  | "Healthcare"
  | "Shopping"
  | "Utilities"
  | "Education"
  | "Travel"
  | "Other"

export interface Transaction {
  id: number
  date: string // ISO string YYYY-MM-DD
  description: string
  category: TransactionCategory
  type: TransactionType
  amount: number // always positive; sign derived from type
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // January
  { id: 1,  date: "2024-01-01", description: "Monthly Salary",          category: "Salary",         type: "income",  amount: 5500 },
  { id: 2,  date: "2024-01-03", description: "Rent Payment",             category: "Housing",        type: "expense", amount: 1400 },
  { id: 3,  date: "2024-01-05", description: "Grocery Store",            category: "Food & Dining",  type: "expense", amount: 210 },
  { id: 4,  date: "2024-01-08", description: "Netflix Subscription",     category: "Entertainment",  type: "expense", amount: 15 },
  { id: 5,  date: "2024-01-10", description: "Freelance Project",        category: "Freelance",      type: "income",  amount: 800 },
  { id: 6,  date: "2024-01-12", description: "Electric & Gas Bill",      category: "Utilities",      type: "expense", amount: 95 },
  { id: 7,  date: "2024-01-15", description: "Restaurant Dinner",        category: "Food & Dining",  type: "expense", amount: 68 },
  { id: 8,  date: "2024-01-18", description: "Gym Membership",           category: "Healthcare",     type: "expense", amount: 45 },
  { id: 9,  date: "2024-01-20", description: "Amazon Purchase",          category: "Shopping",       type: "expense", amount: 129 },
  { id: 10, date: "2024-01-22", description: "Uber Rides",               category: "Transport",      type: "expense", amount: 42 },
  // February
  { id: 11, date: "2024-02-01", description: "Monthly Salary",           category: "Salary",         type: "income",  amount: 5500 },
  { id: 12, date: "2024-02-03", description: "Rent Payment",             category: "Housing",        type: "expense", amount: 1400 },
  { id: 13, date: "2024-02-06", description: "Grocery Store",            category: "Food & Dining",  type: "expense", amount: 195 },
  { id: 14, date: "2024-02-10", description: "Dividend Income",          category: "Investment",     type: "income",  amount: 320 },
  { id: 15, date: "2024-02-12", description: "Doctor Visit",             category: "Healthcare",     type: "expense", amount: 150 },
  { id: 16, date: "2024-02-14", description: "Valentine's Dinner",       category: "Food & Dining",  type: "expense", amount: 88 },
  { id: 17, date: "2024-02-18", description: "Online Course",            category: "Education",      type: "expense", amount: 59 },
  { id: 18, date: "2024-02-20", description: "Fuel",                     category: "Transport",      type: "expense", amount: 55 },
  { id: 19, date: "2024-02-22", description: "Spotify Premium",          category: "Entertainment",  type: "expense", amount: 10 },
  { id: 20, date: "2024-02-25", description: "Water & Internet Bill",    category: "Utilities",      type: "expense", amount: 110 },
  // March
  { id: 21, date: "2024-03-01", description: "Monthly Salary",           category: "Salary",         type: "income",  amount: 5500 },
  { id: 22, date: "2024-03-02", description: "Freelance Project",        category: "Freelance",      type: "income",  amount: 1200 },
  { id: 23, date: "2024-03-04", description: "Rent Payment",             category: "Housing",        type: "expense", amount: 1400 },
  { id: 24, date: "2024-03-07", description: "Grocery Store",            category: "Food & Dining",  type: "expense", amount: 225 },
  { id: 25, date: "2024-03-10", description: "Flight Tickets",           category: "Travel",         type: "expense", amount: 380 },
  { id: 26, date: "2024-03-14", description: "Movie Night",              category: "Entertainment",  type: "expense", amount: 30 },
  { id: 27, date: "2024-03-16", description: "Phone Bill",               category: "Utilities",      type: "expense", amount: 70 },
  { id: 28, date: "2024-03-20", description: "Clothing Shopping",        category: "Shopping",       type: "expense", amount: 210 },
  { id: 29, date: "2024-03-22", description: "Public Transport",         category: "Transport",      type: "expense", amount: 36 },
  { id: 30, date: "2024-03-25", description: "Pharmacy",                 category: "Healthcare",     type: "expense", amount: 48 },
  // April
  { id: 31, date: "2024-04-01", description: "Monthly Salary",           category: "Salary",         type: "income",  amount: 5500 },
  { id: 32, date: "2024-04-03", description: "Rent Payment",             category: "Housing",        type: "expense", amount: 1400 },
  { id: 33, date: "2024-04-05", description: "Grocery Store",            category: "Food & Dining",  type: "expense", amount: 180 },
  { id: 34, date: "2024-04-08", description: "Dividend Income",          category: "Investment",     type: "income",  amount: 320 },
  { id: 35, date: "2024-04-10", description: "Freelance Project",        category: "Freelance",      type: "income",  amount: 950 },
  { id: 36, date: "2024-04-12", description: "Restaurant Lunch",         category: "Food & Dining",  type: "expense", amount: 42 },
  { id: 37, date: "2024-04-15", description: "Electric Bill",            category: "Utilities",      type: "expense", amount: 88 },
  { id: 38, date: "2024-04-18", description: "Tech Gadget",              category: "Shopping",       type: "expense", amount: 299 },
  { id: 39, date: "2024-04-22", description: "Gym Membership",           category: "Healthcare",     type: "expense", amount: 45 },
  { id: 40, date: "2024-04-25", description: "Concert Tickets",          category: "Entertainment",  type: "expense", amount: 120 },
]

// ─── Utility Functions ────────────────────────────────────────────────────────

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions)
}

export function getSavingsRate(transactions: Transaction[]): number {
  const income = getTotalIncome(transactions)
  if (income === 0) return 0
  const savings = income - getTotalExpenses(transactions)
  return Math.max(0, (savings / income) * 100)
}

export function getSpendingByCategory(
  transactions: Transaction[]
): { category: string; amount: number; percentage: number }[] {
  const expenses = transactions.filter((t) => t.type === "expense")
  const total = expenses.reduce((sum, t) => sum + t.amount, 0)

  const map: Record<string, number> = {}
  expenses.forEach((t) => {
    map[t.category] = (map[t.category] ?? 0) + t.amount
  })

  return Object.entries(map)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function getMonthlyData(
  transactions: Transaction[]
): { month: string; income: number; expenses: number; balance: number }[] {
  const map: Record<string, { income: number; expenses: number }> = {}

  transactions.forEach((t) => {
    const key = t.date.slice(0, 7) // "YYYY-MM"
    if (!map[key]) map[key] = { income: 0, expenses: 0 }
    if (t.type === "income") map[key].income += t.amount
    else map[key].expenses += t.amount
  })

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, { income, expenses }]) => {
      const [year, month] = key.split("-")
      const label = new Date(Number(year), Number(month) - 1, 1).toLocaleString(
        "en-US",
        { month: "short", year: "2-digit" }
      )
      return { month: label, income, expenses, balance: income - expenses }
    })
}

export function getMonthlyComparison(transactions: Transaction[]) {
  const monthly = getMonthlyData(transactions)
  if (monthly.length < 2) return null
  const current = monthly[monthly.length - 1]
  const previous = monthly[monthly.length - 2]
  return {
    currentMonth: current.month,
    previousMonth: previous.month,
    incomeChange: current.income - previous.income,
    expensesChange: current.expenses - previous.expenses,
    balanceChange: current.balance - previous.balance,
    currentIncome: current.income,
    currentExpenses: current.expenses,
    previousIncome: previous.income,
    previousExpenses: previous.expenses,
  }
}

export function getHighestSpendingCategory(transactions: Transaction[]) {
  const breakdown = getSpendingByCategory(transactions)
  return breakdown[0] ?? null
}

export const CATEGORY_COLORS: Record<string, string> = {
  "Salary":         "var(--chart-1)",
  "Freelance":      "var(--chart-2)",
  "Investment":     "var(--chart-3)",
  "Food & Dining":  "var(--chart-4)",
  "Housing":        "var(--chart-5)",
  "Transport":      "hsl(220 70% 50%)",
  "Entertainment":  "hsl(280 65% 55%)",
  "Healthcare":     "hsl(160 60% 45%)",
  "Shopping":       "hsl(30 80% 55%)",
  "Utilities":      "hsl(200 60% 50%)",
  "Education":      "hsl(340 65% 55%)",
  "Travel":         "hsl(50 80% 50%)",
  "Other":          "hsl(0 0% 60%)",
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
