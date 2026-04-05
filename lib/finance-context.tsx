"use client"

import * as React from "react"
import {
  type Transaction,
  type TransactionType,
  type TransactionCategory,
  INITIAL_TRANSACTIONS,
} from "@/lib/finance-data"

export type Role = "admin" | "viewer"

export interface Filters {
  search: string
  category: string // "" = all
  type: string     // "" = all
  month: string    // "" = all, or "YYYY-MM"
}

interface FinanceContextValue {
  transactions: Transaction[]
  role: Role
  filters: Filters
  setRole: (role: Role) => void
  setFilters: (filters: Partial<Filters>) => void
  addTransaction: (tx: Omit<Transaction, "id">) => void
  editTransaction: (tx: Transaction) => void
  deleteTransaction: (id: number) => void
}

const FinanceContext = React.createContext<FinanceContextValue | null>(null)

function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = React.useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [role, setRoleState] = React.useState<Role>("admin")
  const [filters, setFiltersState] = React.useState<Filters>({
    search: "",
    category: "",
    type: "",
    month: "",
  })
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    const storedTx = loadFromStorage<Transaction[]>("finance_transactions")
    if (storedTx) setTransactions(storedTx)
    
    const storedRole = loadFromStorage<Role>("finance_role")
    if (storedRole) setRoleState(storedRole)
    
    setIsMounted(true)
  }, [])

  // persist to localStorage
  React.useEffect(() => {
    if (isMounted) localStorage.setItem("finance_transactions", JSON.stringify(transactions))
  }, [transactions, isMounted])

  React.useEffect(() => {
    if (isMounted) localStorage.setItem("finance_role", JSON.stringify(role))
  }, [role, isMounted])

  const setRole = React.useCallback((r: Role) => setRoleState(r), [])

  const setFilters = React.useCallback((partial: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }))
  }, [])

  const addTransaction = React.useCallback((tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => {
      const id = prev.length > 0 ? Math.max(...prev.map((t) => t.id)) + 1 : 1
      return [...prev, { ...tx, id }]
    })
  }, [])

  const editTransaction = React.useCallback((tx: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === tx.id ? tx : t)))
  }, [])

  const deleteTransaction = React.useCallback((id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        filters,
        setRole,
        setFilters,
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance(): FinanceContextValue {
  const ctx = React.useContext(FinanceContext)
  if (!ctx) throw new Error("useFinance must be used within <FinanceProvider>")
  return ctx
}

// Re-export types for convenience
export type { Transaction, TransactionType, TransactionCategory }
