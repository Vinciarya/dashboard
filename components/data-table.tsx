"use client"

import * as React from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconArrowsUpDown,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconDownload,
  IconLayoutColumns,
  IconPlus,
  IconSearch,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useFinance, type Transaction, type TransactionCategory, type TransactionType } from "@/lib/finance-context"
import { formatCurrency, CATEGORY_COLORS } from "@/lib/finance-data"

// ─── Zod Schema ──────────────────────────────────────────────────────────────
export const schema = z.object({
  id: z.number(),
  date: z.string(),
  description: z.string(),
  category: z.string(),
  type: z.enum(["income", "expense"]),
  amount: z.number(),
})

const CATEGORIES: TransactionCategory[] = [
  "Salary", "Freelance", "Investment",
  "Food & Dining", "Housing", "Transport", "Entertainment",
  "Healthcare", "Shopping", "Utilities", "Education", "Travel", "Other",
]

// ─── Transaction Form Dialog ──────────────────────────────────────────────────
interface TxFormProps {
  open: boolean
  onClose: () => void
  initial?: Transaction | null
}

function TransactionFormDialog({ open, onClose, initial }: TxFormProps) {
  const { addTransaction, editTransaction } = useFinance()
  const isEdit = !!initial

  const [form, setForm] = React.useState({
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    description: initial?.description ?? "",
    category: (initial?.category ?? "Food & Dining") as TransactionCategory,
    type: (initial?.type ?? "expense") as TransactionType,
    amount: initial?.amount?.toString() ?? "",
  })

  React.useEffect(() => {
    if (open) {
      setForm({
        date: initial?.date ?? new Date().toISOString().slice(0, 10),
        description: initial?.description ?? "",
        category: (initial?.category ?? "Food & Dining") as TransactionCategory,
        type: (initial?.type ?? "expense") as TransactionType,
        amount: initial?.amount?.toString() ?? "",
      })
    }
  }, [open, initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.description.trim() || isNaN(amount) || amount <= 0) {
      toast.error("Please fill all fields with valid values.")
      return
    }
    const payload = {
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      amount,
    }
    if (isEdit && initial) {
      editTransaction({ ...payload, id: initial.id })
      toast.success("Transaction updated.")
    } else {
      addTransaction(payload)
      toast.success("Transaction added.")
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the transaction details below." : "Fill in the new transaction details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-date">Date</Label>
              <Input
                id="tx-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-type">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TransactionType })}>
                <SelectTrigger id="tx-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tx-desc">Description</Label>
            <Input
              id="tx-desc"
              placeholder="e.g. Grocery Store"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-cat">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as TransactionCategory })}>
                <SelectTrigger id="tx-cat" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tx-amount">Amount ($)</Label>
              <Input
                id="tx-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={(e) => { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent) }}>
            {isEdit ? "Save Changes" : "Add Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main DataTable Component ─────────────────────────────────────────────────
export function DataTable() {
  const { transactions, role, filters, setFilters, deleteTransaction } = useFinance()
  const isAdmin = role === "admin"

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [formOpen, setFormOpen] = React.useState(false)
  const [editTarget, setEditTarget] = React.useState<Transaction | null>(null)
  const [deleteId, setDeleteId] = React.useState<number | null>(null)

  // Apply context filters
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = !filters.search ||
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase())
      const matchCategory = !filters.category || t.category === filters.category
      const matchType = !filters.type || t.type === filters.type
      const matchMonth = !filters.month || t.date.startsWith(filters.month)
      return matchSearch && matchCategory && matchType && matchMonth
    })
  }, [transactions, filters])

  const columns: ColumnDef<Transaction>[] = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-1 size-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-1 size-3.5" />
          ) : (
            <IconArrowsUpDown className="ml-1 size-3.5 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const d = new Date(row.original.date)
        return (
          <span className="text-muted-foreground tabular-nums text-sm">
            {d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="font-medium max-w-[200px] truncate block">
          {row.original.description}
        </span>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="px-2 text-xs font-medium"
          style={{
            borderColor: CATEGORY_COLORS[row.original.category] ?? "transparent",
            color: CATEGORY_COLORS[row.original.category],
          }}
        >
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant={row.original.type === "income" ? "default" : "secondary"}
          className={`capitalize px-2 text-xs ${row.original.type === "income" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300/50 dark:border-emerald-700/50" : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-300/50 dark:border-red-700/50"}`}
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="-mr-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            {column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-1 size-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-1 size-3.5" />
            ) : (
              <IconArrowsUpDown className="ml-1 size-3.5 opacity-50" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className={`text-right font-semibold tabular-nums ${row.original.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
          {row.original.type === "income" ? "+" : "-"}
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    ...(isAdmin ? [{
      id: "actions",
      cell: ({ row }: { row: { original: Transaction } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => { setEditTarget(row.original); setFormOpen(true) }}
            >
              <IconEdit className="mr-2 size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteId(row.original.id)}
            >
              <IconTrash className="mr-2 size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    } as ColumnDef<Transaction>] : []),
  ], [isAdmin])

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    state: { sorting, columnVisibility, rowSelection, pagination },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Export helpers
  function exportCSV() {
    const rows = filteredTransactions.map((t) => [
      t.date, t.description, t.category, t.type, t.amount,
    ])
    const header = ["Date", "Description", "Category", "Type", "Amount"]
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "transactions.csv"; a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported as CSV")
  }

  function exportJSON() {
    const json = JSON.stringify(filteredTransactions, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "transactions.json"; a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported as JSON")
  }

  // Get unique months from all transactions
  const availableMonths = React.useMemo(() => {
    const months = new Set(transactions.map((t) => t.date.slice(0, 7)))
    return Array.from(months).sort().reverse()
  }, [transactions])

  return (
    <>
      <Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 lg:px-6">
          <TabsList className="hidden @4xl/main:flex">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
          </TabsList>
          <Select
            defaultValue="all"
            onValueChange={(v) => {
              const tab = v === "all" ? "" : v
              setFilters({ type: tab })
            }}
          >
            <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-1 items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                id="tx-search"
                placeholder="Search transactions..."
                className="pl-8 h-8"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>

            {/* Month filter */}
            <Select
              value={filters.month || "all"}
              onValueChange={(v) => setFilters({ month: v === "all" ? "" : v })}
            >
              <SelectTrigger size="sm" className="w-36">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All months</SelectItem>
                {availableMonths.map((m) => {
                  const [y, mo] = m.split("-")
                  const label = new Date(Number(y), Number(mo) - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" })
                  return <SelectItem key={m} value={m}>{label}</SelectItem>
                })}
              </SelectContent>
            </Select>

            {/* Category filter */}
            <Select
              value={filters.category || "all"}
              onValueChange={(v) => setFilters({ category: v === "all" ? "" : v })}
            >
              <SelectTrigger size="sm" className="w-36 hidden lg:flex">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {/* Column visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {table.getAllColumns().filter((c) => typeof c.accessorFn !== "undefined" && c.getCanHide()).map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconDownload />
                  <span className="hidden lg:inline">Export</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportCSV}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportJSON}>Export as JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add (admin only) */}
            {isAdmin && (
              <Button size="sm" onClick={() => { setEditTarget(null); setFormOpen(true) }}>
                <IconPlus />
                <span className="hidden lg:inline">Add Transaction</span>
              </Button>
            )}
          </div>
        </div>

        {/* All Tab */}
        <TabsContent value="all" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <TableContent table={table} columns={columns} />
          <Pagination table={table} />
        </TabsContent>
        <TabsContent value="income" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <TableContent table={table} columns={columns} />
          <Pagination table={table} />
        </TabsContent>
        <TabsContent value="expense" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <TableContent table={table} columns={columns} />
          <Pagination table={table} />
        </TabsContent>
      </Tabs>

      {/* Add / Edit form */}
      <TransactionFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        initial={editTarget}
      />

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Transaction?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId !== null) {
                  deleteTransaction(deleteId)
                  toast.success("Transaction deleted.")
                  setDeleteId(null)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TableContent({ table, columns }: { table: ReturnType<typeof useReactTable<Transaction>>, columns: ColumnDef<Transaction>[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id} colSpan={h.colSpan}>
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function Pagination({ table }: { table: ReturnType<typeof useReactTable<Transaction>> }) {
  return (
    <div className="flex items-center justify-between px-4">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">Rows per page</Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50].map((s) => (
                <SelectItem key={s} value={`${s}`}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">First page</span><IconChevronsLeft />
          </Button>
          <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Previous page</span><IconChevronLeft />
          </Button>
          <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <span className="sr-only">Next page</span><IconChevronRight />
          </Button>
          <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <span className="sr-only">Last page</span><IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
