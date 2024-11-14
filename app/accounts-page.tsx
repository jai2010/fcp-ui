"use client"

import { useState, useMemo } from "react"
import { BarChart, ChevronDown, ChevronUp, CreditCard, DollarSign, Filter, MoreHorizontal, Search, ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AccountSettings from "./account-settings"

// Mock data for the accounts (unchanged)
const accounts = [
    {id: 1000001, name: "PayTM PG Chargeback", description: "Chargeback posted by PG", internalAccountType: "Transaction Account", type: "Payable", status: "Active", acGroup1: "Chargeback", acGroup2: "Charges", acGroup3: "Payment Gateway", entity: "FKMP", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, balance: 4000},
    {id: 1000002, name: "PayTM Commission", description: "Commission charged by [PG_Name]", internalAccountType: "Transaction Account", type: "Payable", status: "Active", acGroup1: "Commission", acGroup2: "Charges", acGroup3: "Payment Gateway", entity: "FKMP", associatedUsecases: {"AR03-04_U6": true}, balance: 4000},
    {id: 1000003, name: "PayTM Commission Provisions", description: "Provisions (if any) to be stored at a PG level", internalAccountType: "Transaction Account", type: "Payable", status: "Active", acGroup1: "Commission", acGroup2: "Charges", acGroup3: "Payment Gateway", entity: "FKMP", associatedUsecases: {"AR03-04_U6": true}, balance: 4000},
    {id: 1000004, name: "PayTM Commission Account - GL", description: "Commission charged by the PG at the Gross amount level", internalAccountType: "GL Account", type: "Payable", status: "Active", acGroup1: "Commission", acGroup2: "Charges", acGroup3: "Payment Gateway", entity: "FKMP", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, balance: 4000},
    {id: 1000005, name: "PayTM Commission Provisions - GL", description: "Commission not charged as per daily MIS but have to be booked as a provision in the books", internalAccountType: "GL Account", type: "Payable", status: "Active", acGroup1: "Commission", acGroup2: "Charges", acGroup3: "Payment Gateway", entity: "FKMP", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, balance: 4000},
    {id: 1000006, name: "PayTM Chargeback Reversal", description: "Charges reversal", internalAccountType: "Transaction Account", type: "Receivable", status: "Disabled", acGroup1: "Commission", acGroup2: "Charges", acGroup3: "Payment Gateway", entity: "FKMP", associatedUsecases: {"AR03-04_U6": true}, balance: 4000}
  ];

  
  
 

// Mock data for the balance history graph (unchanged)
const balanceHistory = [
  { date: "2023-06", balance: 4000 },
  { date: "2023-07", balance: 3000 },
  { date: "2023-08", balance: 5000 },
  { date: "2023-09", balance: 2780 },
  { date: "2023-10", balance: 1890 },
  { date: "2023-11", balance: 2390 },
]

// Mock data for transactions (unchanged)
const mockTransactions = [
  {
    date: "22-May-2024",
    referenceId: "REF123456789",
    debitAccount: "John Doe Checking",
    creditAccount: "Jane Smith Savings",
    amount: 100000, // Amount in paise
    runId: 123456789,
    ruleId: "RULE123456789",
    ruleVersion: "v1",
    bookId: 987654321,
    tenantId: 1029384756,
  },
  {
    date: "23-May-2024",
    referenceId: "REF987654321",
    debitAccount: "Alice Johnson Checking",
    creditAccount: "Bob Williams Savings",
    amount: 200000, // Amount in paise
    runId: 987654321,
    ruleId: "RULE987654321",
    ruleVersion: "v2",
    bookId: 876543210,
    tenantId: 2019283746,
  },
  {
    date: "24-May-2024",
    referenceId: "REF456789123",
    debitAccount: "Charlie Brown Business",
    creditAccount: "Lucy Van Pelt Personal",
    amount: 300000, // Amount in paise
    runId: 456789123,
    ruleId: "RULE456789123",
    ruleVersion: "v1",
    bookId: 765432109,
    tenantId: 3018273645,
  }
]

// Mock data for rules (unchanged)
const mockRules = [
  {
    id: "RULE123",
    name: "Monthly Transfer",
    description: "Transfer $500 from Checking to Savings on the 1st of each month",
    status: "Active",
    createdAt: "2023-01-15",
    lastRun: "2023-11-01",
    nextRun: "2023-12-01",
  },
  {
    id: "RULE456",
    name: "Low Balance Alert",
    description: "Send alert when balance drops below $1000",
    status: "Active",
    createdAt: "2023-02-20",
    lastRun: "2023-11-10",
    nextRun: "2023-11-11",
  },
  {
    id: "RULE789",
    name: "Categorize Transactions",
    description: "Automatically categorize transactions based on merchant",
    status: "Inactive",
    createdAt: "2023-03-05",
    lastRun: "2023-10-31",
    nextRun: "N/A",
  },
]

export default function AccountsPage() {
  const [grouping, setGrouping] = useState("none")
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    usecase: [],
  })
  const [transactions, setTransactions] = useState(mockTransactions)
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "date", "referenceId", "debitAccount", "creditAccount", "amount"
  ])
  const [rules, setRules] = useState(mockRules)
  const [visibleRuleColumns, setVisibleRuleColumns] = useState<string[]>([
    "id", "name", "Status", "lastRun", "nextRun"
  ])

  const handleAccountClick = (account) => {
    setSelectedAccount(account)
  }

  const handleBackToList = () => {
    setSelectedAccount(null)
  }

  const handleFilterChange = (category, item) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }))
  }

  const filteredAndGroupedAccounts = useMemo(() => {
    let result = accounts.filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.status.length === 0 || filters.status.includes(account.status)) &&
      (filters.type.length === 0 || filters.type.includes(account.type)) 
     // (filters.associatedUsecases.length === 0 || filters.associatedUsecases.includes(account.associatedUsecases))
    )

    if (grouping !== "none") {
      const grouped = result.reduce((acc, account) => {
        const key = account[grouping]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(account)
        return acc
      }, {})
      return Object.entries(grouped)
    }

    return [["All Accounts", result]]
  }, [searchTerm, filters, grouping])

  const handleSort = (column: string, dataType: 'transactions' | 'rules' = 'transactions') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }

    const sortedData = [...(dataType === 'transactions' ? transactions : rules)].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    if (dataType === 'transactions') {
      setTransactions(sortedData)
    } else {
      setRules(sortedData)
    }
  }

  const toggleRowExpansion = (index: number) => {
    setExpandedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleDownload = (dataType: 'transactions' | 'rules' = 'transactions') => {
    const data = dataType === 'transactions' ? transactions : rules
    const columns = dataType === 'transactions' 
      ? [...visibleColumns, "runId", "ruleId", "ruleVersion", "bookId", "tenantId"]
      : visibleRuleColumns

    const csv = [
      columns.join(','),
      ...data.map(row => 
        columns.map(column => row[column]).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${dataType}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Function to format amount in Indian Rupees
  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount / 100) // Convert paise to rupees
  }

  if (selectedAccount) {
    return (
      <div className="p-6">
        <Button onClick={handleBackToList} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Account List
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{selectedAccount.name}</CardTitle>
            <CardDescription>Account details and history</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${selectedAccount.balance.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">type</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedAccount.type}</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Balance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={balanceHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="balance" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Columns
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {["date", "referenceId", "debitAccount", "creditAccount", "amount", "runId", "ruleId", "ruleVersion"].map((column) => (
                            <DropdownMenuCheckboxItem
                              key={column}
                              checked={visibleColumns.includes(column)}
                              onCheckedChange={(checked) => {
                                setVisibleColumns(prev => 
                                  checked 
                                    ? [...prev, column]
                                    : prev.filter(col => col !== column)
                                )
                              }}
                            >
                              {column}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button onClick={() => handleDownload('transactions')}>
                        <Download className="mr-2 h-4 w-4" /> Download CSV
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          {visibleColumns.map((column) => (
                            <TableHead 
                              key={column}
                              className="cursor-pointer"
                              onClick={() => handleSort(column, 'transactions')}
                            >
                              {column}
                              {sortColumn === column && (
                                sortDirection === 'asc' ? <ChevronUp className="inline ml-2" /> :
                                <ChevronDown className="inline ml-2" />
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((row, index) => (
                          <>
                            <TableRow key={row.referenceId}>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRowExpansion(index)}
                                >
                                  {expandedRows.includes(index) ? <ChevronUp /> : <ChevronDown />}
                                </Button>
                              </TableCell>
                              {visibleColumns.map((column) => (
                                <TableCell key={column}>
                                  {column === 'amount' ? formatIndianRupees(row[column]) : row[column]}
                                </TableCell>
                              ))}
                            </TableRow>
                            {expandedRows.includes(index) && (
                              <TableRow>
                                <TableCell colSpan={visibleColumns.length + 1}>
                                  <div className="p-4 bg-muted">
                                    <h4 className="font-semibold mb-2">Additional Details</h4>
                                    <p>Run ID: {row.runId}</p>
                                    <p>Rule ID: {row.ruleId}</p>
                                    <p>Rule Version: {row.ruleVersion}</p>
                                    <p>Book ID: {row.bookId}</p>
                                    <p>Tenant ID: {row.tenantId}</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="rules">
                <Card>
                  <CardHeader>
                    <CardTitle>Associated Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Columns
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {["id", "name", "Description", "Status", "createdAt", "lastRun", "nextRun"].map((column) => (
                            <DropdownMenuCheckboxItem
                              key={column}
                              checked={visibleRuleColumns.includes(column)}
                              onCheckedChange={(checked) => {
                                setVisibleRuleColumns(prev => 
                                  checked 
                                    ? [...prev, column]
                                    : prev.filter(col => col !== column)
                                )
                              }}
                            >
                              {column}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button onClick={() => handleDownload('rules')}>
                        <Download className="mr-2 h-4 w-4" /> Download CSV
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          {visibleRuleColumns.map((column) => (
                            <TableHead 
                              key={column}
                              className="cursor-pointer"
                              onClick={() => handleSort(column, 'rules')}
                            >
                              {column}
                              {sortColumn === column && (
                                sortDirection === 'asc' ?
                                <ChevronUp className="inline ml-2" /> :
                                <ChevronDown className="inline ml-2" />
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rules.map((rule, index) => (
                          <>
                            <TableRow key={rule.id}>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRowExpansion(index)}
                                >
                                  {expandedRows.includes(index) ? <ChevronUp /> : <ChevronDown />}
                                </Button>
                              </TableCell>
                              {visibleRuleColumns.map((column) => (
                                <TableCell key={column}>{rule[column]}</TableCell>
                              ))}
                            </TableRow>
                            {expandedRows.includes(index) && (
                              <TableRow>
                                <TableCell colSpan={visibleRuleColumns.length + 1}>
                                  <div className="p-4 bg-muted">
                                    <h4 className="font-semibold mb-2">Rule Description</h4>
                                    <p>{rule.description}</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings">
                <AccountSettings account={selectedAccount} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Accounts</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Search accounts..." 
            className="w-[300px]" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["Active", "Inactive"].map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => handleFilterChange(Status, status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["Payable", "Receivable"].map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filters.type.includes(type)}
                  onCheckedChange={() => handleFilterChange("type", type)}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
                         </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Select value={grouping} onValueChange={setGrouping}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Grouping</SelectItem>
            <SelectItem value="associatedUsecases">By Associated Usecase</SelectItem>
            <SelectItem value="type">By Type</SelectItem>
            <SelectItem value="internalAccountType">By Internal Account Type</SelectItem>
            <SelectItem value="status">By Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndGroupedAccounts.map(([group, groupAccounts]) => (
        <Card key={group} className="mb-6">
          <CardHeader>
            <CardTitle>{group}</CardTitle>
            <CardDescription>Total accounts: {groupAccounts.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>ACGroup1</TableHead>
                  <TableHead>ACGroup2</TableHead>
                  <TableHead>ACGroup3</TableHead>
                  <TableHead> Internal Account Type</TableHead>
                  <TableHead>Associated Usecase</TableHead>

                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>

                {groupAccounts.map((account) => (
                  <TableRow key={account.id} onClick={() => handleAccountClick(account)} className="cursor-pointer">
                    <TableCell>{account.id}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.description}</TableCell>
                    <TableCell>{account.type}</TableCell>
                    <TableCell>{account.acGroup1}</TableCell>
                    <TableCell>{account.acGroup2}</TableCell>
                    <TableCell>{account.acGroup3}</TableCell>
                    <TableCell>{account.internalAccountType}</TableCell>
                    <TableCell>{Object.keys(account.associatedUsecases).filter(uc => account.associatedUsecases[uc]).join(", ")}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        account.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {account.status}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}