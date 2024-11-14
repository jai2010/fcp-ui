"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Search as SearchIcon } from "lucide-react"

// Mock data for search results
const searchResults = [
  { id: "ORD001", itemId: "ITEM001", debitAccount: "Account A", creditAccount: "Account B", amount: "$500", date: "2024-01-15" },
  { id: "ORD001", itemId: "ITEM002", debitAccount: "Account C", creditAccount: "Account D", amount: "$750", date: "2024-01-16" },
  { id: "ORD001", itemId: "ITEM003", debitAccount: "Account E", creditAccount: "Account F", amount: "$1,000", date: "2024-01-17" },
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("orderId")

  const filteredResults = searchResults.filter(result => {
    const searchField = searchType === "orderId" ? result.id : result.itemId
    return searchField.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Search Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder={`Search by ${searchType === "orderId" ? "Order ID" : "Order Item ID"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="min-w-[100px]"
              onClick={() => setSearchType(searchType === "orderId" ? "itemId" : "orderId")}
            >
              {searchType === "orderId" ? "Order ID" : "Item ID"}
            </Button>
            <Button>
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Item ID</TableHead>
                <TableHead>Debit Account</TableHead>
                <TableHead>Credit Account</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.date}</TableCell>
                  <TableCell>{result.id}</TableCell>
                  <TableCell>{result.itemId}</TableCell>
                  <TableCell>{result.debitAccount}</TableCell>
                  <TableCell>{result.creditAccount}</TableCell>
                  <TableCell>{result.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}