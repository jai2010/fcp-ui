"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Download, Filter, Plus } from 'lucide-react'

// Mock data for rules
const mockRules = [
  {id: "R1000", ruleName: "PG Chargeback", ruleDesc: "PG Chargeback booking", Condition: "{chargeback: true, chargebackreversal:true}", creditAccount: "{pgName}_Chargeback", creditAction: "[Chargeback]", debitAccount: "FKMP_Chargeback", debitAction: "[chargeback] + [chargebackreversal]", status: "Active", ruleCreatedDate: "21-May-2024", ruleVersionId: "2", ruleCreatedBy: "Aman Jain", ruleApprovedBy: "Mridula Swaika"}, 
  {id: "R1001", ruleName: "PG Tax", ruleDesc: "PG Tax booking", Condition: "{gst: true}", creditAccount: "{pgName}_gst", creditAction: "[gst]", debitAccount: "FKMP_PG_GST", debitAction: "[gst]", status: "Active", ruleCreatedDate: "21-May-2024", ruleVersionId: "2", ruleCreatedBy: "Aman Jain", ruleApprovedBy: "Mridula Swaika"},   
  //{id: "R1001", ruleName: "PG Tax", ruleDesc: "Tax booking", Condition: "{fkmp_tax_cgst : true, fkmp_tax_igst : true, fkmp_tax_sgst_utgst : true, fkmp_tax_kkcess : true, fkmp_tax_sbcess : true, fkmp_tax_service_tax : true, fkmp_tax_cess : true}", creditAccount: "{fkmp_tax_cgst , fkmp_tax_igst , fkmp_tax_sgst_utgst , fkmp_tax_kkcess , fkmp_tax_sbcess , fkmp_tax_service_tax , fkmp_tax_cess}", creditAction: "{fkmp_tax_cgst , fkmp_tax_igst , fkmp_tax_sgst_utgst , fkmp_tax_kkcess , fkmp_tax_sbcess , fkmp_tax_service_tax , fkmp_tax_cess}", debitAccount: "fkmp_tax", "Debit Action": "fkmp_tax_cgst + fkmp_tax_igst + fkmp_tax_sgst_utgst + fkmp_tax_kkcess + fkmp_tax_sbcess + fkmp_tax_service_tax + fkmp_tax_cess", status: "Active", ruleCreatedDate: "22-May-2024", ruleVersionId: "2", ruleCreatedBy: "Aman Jain", ruleCreatedBy: "Mridula Swaika"}
]

/*
  {
    id: "RULE789",
    name: "Categorize Transactions",
    description: "Automatically categorize transactions based on merchant",
    status: "Inactive",
    createdAt: "2023-03-05",
    lastRun: "2023-10-31",
    nextRun: "N/A",
  },
*/

export default function RulesPage() {
  const [rules, setRules] = useState(mockRules)
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "id", "ruleName", "Condition", "creditAccount", "creditAction", "debitAccount", "debitAction","status"
  ])
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }

    const sortedRules = [...rules].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setRules(sortedRules)
  }

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const handleDownload = () => {
    const csv = [
      visibleColumns.join(','),
      ...rules.map(rule => 
        visibleColumns.map(column => rule[column]).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'rules.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const filteredRules = rules.filter(rule =>
    rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.ruleDesc.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rules</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Rule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>

                  {["id", "ruleName", "Condition", "creditAccount", "creditAction", "debitAccount", "debitAction","status"].map((column) => (
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
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                {visibleColumns.map((column) => (
                  <TableHead 
                    key={column}
                    className="cursor-pointer"
                    onClick={() => handleSort(column)}
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
              {filteredRules.map((rule) => (
                <>
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(rule.id)}
                      >
                        {expandedRows.includes(rule.id) ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </TableCell>
                    {visibleColumns.map((column) => (
                      <TableCell key={column}>{rule[column]}</TableCell>
                    ))}
                  </TableRow>
                  {expandedRows.includes(rule.id) && (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length + 1}>
                        <div className="p-4 bg-muted">
                            <p><b>Rule Description: </b> {rule.ruleDesc}</p> <br/>
                            <p><b>Version</b>: {rule.ruleVersionId} <br/>
                             <b>Created Date</b>: {rule.ruleCreatedDate} <br/>
                             <b>Created By</b>: {rule.ruleCreatedBy} <br/> 
                             <b>Approved By</b>: {rule.ruleApprovedBy}</p>
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
    </div>
  )
}