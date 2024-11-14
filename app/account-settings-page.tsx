"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const accounts = [
  {id: 10001, name: "[PG_Name] Commission Account - GL", description: "Commission charged by the PG at the Gross amount level", type: "Payable", currency: "INR", environment: "Prod", status: "Active", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, internalName: "{pg_name}_commission_GL", InternalAccountType: "GL Account", BalCalculation: "Account Level", level1code: "134907", level1desc: "PG Commission", level2code: "131509", level2desc: "FKN Nodal - Commission clearing A/c", level3code: "131500", level3desc: "Other Receivable", level4code: "131000", level4desc: "Trade and other receivables", level5code: "130000", level5desc: "Current Assets", level6code: "100000", level6desc: "Asset", entity: "FKMP", balance:4000},
  {id: 10002, name: "[PG_Name] Commission Provisions - GL", description: "Commission not charged as per daily MIS but have to be booked as a provision in the books", type: "Payable", currency: "INR", environment: "Prod", status: "Active", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, internalName: "{pg_name}_commission_provision_GL", InternalAccountType: "GL Account", BalCalculation: "Account Level", level1code: "509089", level1desc: "PG Commission Provision", level2code: "131510", level2desc: "FKN Nodal - PG Charges Clearing A/c", level3code: "131500", level3desc: "Other Receivable", level4code: "131000", level4desc: "Trade and other receivables", level5code: "130000", level5desc: "Current Assets", level6code: "100000", level6desc: "Asset", entity: "FKMP", balance:4000},
  {id: 10003, name: "[PG_Name] Chargeback", description: "Chargeback posted by PG", type: "Payable", currency: "INR", environment: "Prod", status: "Active", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, internalName: "{pg_name}_chargeback_GL", InternalAccountType: "Transaction Account", BalCalculation: "Account Level", level1code: "000", level1desc: "NA", level2code: "000", level2desc: "NA", level3code: "000", level3desc: "NA", level4code: "000", level4desc: "Chargeback", level5code: "000", level5desc: "Charges", level6code: "000", level6desc: "Payment Gateway", entity: "FKMP", balance:4000},
  {id: 10004, name: "[PG_Name] Commission", description: "Commission charged by [PG_Name]", type: "Payable", currency: "INR", environment: "Sandbox", status: "Active", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, internalName: "{pg_name}_commission", InternalAccountType: "Transaction Account", BalCalculation: "Account Level", level1code: "000", level1desc: "NA", level2code: "000", level2desc: "NA", level3code: "000", level3desc: "NA", level4code: "000", level4desc: "Commission", level5code: "000", level5desc: "Charges", level6code: "000", level6desc: "Payment Gateway", entity: "FKMP", balance:4000},
  {id: 10005, name: "[PG_Name] Commission Provisions", description: "Provisions (if any) to be stored at a PG level", type: "Payable", currency: "INR", environment: "Sandbox", status: "Active", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, internalName: "{pg_name}_commission", InternalAccountType: "Transaction Account", BalCalculation: "Account Level", level1code: "000", level1desc: "NA", level2code: "000", level2desc: "NA", level3code: "000", level3desc: "NA", level4code: "000", level4desc: "Commission", level5code: "000", level5desc: "Charges", level6code: "000", level6desc: "Payment Gateway", entity: "FKMP", balance:4000},
  {id: 10006, name: "[PG_Name] Chargeback Reversal", description: "Charges reversal", type: "Receivable", currency: "INR", environment: "Sandbox", status: "Active", associatedUsecases: {"AR03-04_U6": true, "AR22": true}, internalName: "{pg_name}_commission_reversal", InternalAccountType: "Transaction Account", BalCalculation: "Account Level", level1code: "000", level1desc: "NA", level2code: "000", level2desc: "NA", level3code: "000", level3desc: "NA", level4code: "000", level4desc: "Chargeback", level5code: "000", level5desc: "Charges", level6code: "000", level6desc: "Payment Gateway", entity: "FKMP", balance:4000}
]

export default function AccountSettingsPage() {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0])

  const handleAccountChange = (accountId: string) => {
    const account = accounts.find(acc => acc.id.toString() === accountId)
    if (account) {
      setSelectedAccount(account)
    }
  }

  const handleSaveChanges = () => {
    console.log("Changes saved for account:", selectedAccount.id)
  }

  const FormField = ({ label, id, value, readOnly = false }) => (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input id={id} value={value} readOnly={readOnly} className="col-span-2" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Account</CardTitle>
          <CardDescription>Choose an account to view and edit its settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedAccount.id.toString()}
            onValueChange={handleAccountChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="details">Account Details</TabsTrigger>
          <TabsTrigger value="levels">Account Levels</TabsTrigger>
          <TabsTrigger value="usecases">Associated Usecases</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>View and update general account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="ID" id="id" value={selectedAccount.id.toString()} readOnly />
              <FormField label="Name" id="name" value={selectedAccount.name} />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" defaultValue={selectedAccount.description} className="col-span-2" />
              </div>
              <FormField label="Internal Name" id="internalName" value={selectedAccount.internalName} />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select defaultValue={selectedAccount.status} className="col-span-2">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>View and update detailed account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Type" id="type" value={selectedAccount.type} />
              <FormField label="Currency" id="currency" value={selectedAccount.currency} />
              <FormField label="Environment" id="environment" value={selectedAccount.environment} />
              <FormField label="Internal Account Type" id="internalAccountType" value={selectedAccount.InternalAccountType} />
              <FormField label="Balance Calculation" id="balCalculation" value={selectedAccount.BalCalculation} />
              <FormField label="Entity" id="entity" value={selectedAccount.entity} />
              <FormField label="Balance" id="balance" value={selectedAccount.balance.toString()} />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="levels">
          <Card>
            <CardHeader>
              <CardTitle>Account Levels</CardTitle>
              <CardDescription>View and update account level information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <div key={level} className="grid grid-cols-2 gap-4">
                  <FormField label={`Level ${level} Code`} id={`level${level}code`} value={selectedAccount[`level${level}code`]} />
                  <FormField label={`Level ${level} Description`} id={`level${level}desc`} value={selectedAccount[`level${level}desc`]} />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="usecases">
          <Card>
            <CardHeader>
              <CardTitle>Associated Usecases</CardTitle>
              <CardDescription>Manage associated usecases for this account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(selectedAccount.associatedUsecases).map(([usecase, isAssociated]) => (
                <div key={usecase} className="flex items-center justify-between">
                  <Label htmlFor={usecase}>{usecase}</Label>
                  <Switch
                    id={usecase}
                    checked={isAssociated}
                    onCheckedChange={(checked) => {
                      console.log(`Usecase ${usecase} is now ${checked ? 'associated' : 'disassociated'}`)
                    }}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}