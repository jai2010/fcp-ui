"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from 'lucide-react'

// Mock metadata structure
const defaultAccountMetadata = {
  "Base Attributes": [
    { name: "Account ID", description: "FCP Internal ID for the Account", value: "" },
    { name: "Account Name", description: "External Facing name for the Account", value: "" },
    { name: "Account Description", description: "Short description about the Account", value: "" },
    { name: "Account Type", description: "FCP is capable of adding any number accounts & is not context aware. This field will help define the usage/type of account & associated privileges are available to the account.", value: "" },
    { name: "Account Hierarchy", description: "Attribute to track if this account will have Parent / Child accounts", value: "" },
    { name: "Account Parent", description: "Attribute to map the parent for a child account", value: "" },
    { name: "Account Currency", description: "Currency of the Account", value: "" },
    { name: "Account Environment", description: "Identifies the environment in which the Account is setup.", value: "" },
  ],
  "Lifecycle Attributes": [
    { name: "Account Status", description: "Defines the status of the account", value: "" },
    { name: "Account Start Date", description: "Defines the Start date when this account should go live", value: "" },
    { name: "Account End Date", description: "Defines the sunset date when this account should go inactive", value: "" },
  ],
  "Privileges": [
    { name: "Calc Type", description: "Attribute to configure the balance calc type", value: "" },
    { name: "State Type", description: "Attribute to configure the balance state type", value: "" },
    { name: "Post to GL", description: "Attribute to identify if the account is allowed to post to GL", value: "" },
  ],
  "Finance Attributes": [
    { name: "Level 1 Code", description: "Attribute to identify the legal entity of the Account", value: "" },
    { name: "Level 1 Description", description: "Description of the Level 1 attribute", value: "" },
    { name: "Level 2 Code", description: "Attribute to identify the Account Type in Financial Reporting", value: "" },
    { name: "Level 2 Description", description: "Description of the Level 2 attribute", value: "" },
    { name: "Level 3 Code", description: "Attribute to identify the Level 3 in Financial Reporting", value: "" },
    { name: "Level 3 Description", description: "Description of the Level 3 attribute", value: "" },
    { name: "Level 4 Code", description: "Attribute to identify the Level 4 in Financial Reporting", value: "" },
    { name: "Level 4 Description", description: "Description of the Level 4 attribute", value: "" },
    { name: "Level 5 Code", description: "Attribute to identify the Level 5 in Financial Reporting", value: "" },
    { name: "Level 5 Description", description: "Description of the Level 5 attribute", value: "" },
    { name: "GL-Account / FK-Minor Code", description: "Attribute to identify the Account Type in Financial Reporting", value: "" },
    { name: "GL-Account / FK-Minor Description", description: "Description of the GL-Account attribute", value: "" },
  ],
  "Txn Account Attributes": [
    { name: "Account Grouping", description: "Accounts to be grouped for better tracking & this attribute will define the group the account belongs to.", value: "" },
    { name: "Account Type", description: "Attribute to identify the usecase that will be tracked under this account.", value: "" },
  ],
}

export default function AccountSettings({ account }) {
  const [metadata, setMetadata] = useState(defaultAccountMetadata)
  const [isEditing, setIsEditing] = useState({})

  const handleEdit = (group, name) => {
    setIsEditing(prev => ({ ...prev, [`${group}-${name}`]: true }))
  }

  const handleSave = (group, name, value) => {
    setMetadata(prev => ({
      ...prev,
      [group]: prev[group].map(item =>
        item.name === name ? { ...item, value } : item
      )
    }))
    setIsEditing(prev => ({ ...prev, [`${group}-${name}`]: false }))
  }

  const handleSaveAll = () => {
    console.log("Saving all changes:", metadata)
    // Here you would typically send the updated metadata to your backend
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage account details and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="base" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="base">Base</TabsTrigger>
            <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
            <TabsTrigger value="privileges">Privileges</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="txn">Transaction</TabsTrigger>
          </TabsList>
          {Object.entries(metadata).map(([group, attributes]) => {
            const tabValue = group.toLowerCase().split(' ')[0]
            return (
              <TabsContent key={group} value={tabValue} className="mt-4 space-y-4">
                <div className="grid gap-4">
                  {attributes.map(({ name, description, value }) => (
                    <div key={name} className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={name} className="text-sm font-medium">
                          {name}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          id={name}
                          value={value}
                          onChange={(e) => handleSave(group, name, e.target.value)}
                          disabled={!isEditing[`${group}-${name}`]}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => isEditing[`${group}-${name}`] ? handleSave(group, name, value) : handleEdit(group, name)}
                        >
                          {isEditing[`${group}-${name}`] ? "Save" : "Edit"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
        <Button onClick={handleSaveAll} className="w-full mt-6">Save All Changes</Button>
      </CardContent>
    </Card>
  )
}