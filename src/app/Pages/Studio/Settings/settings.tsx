"use client"

import { useState } from "react"
import { StudioLayout } from "@/app/Pages/Components/StudioLayout"
import { Switch } from "@/shadcn/ui/switch"
import { Label } from "@/shadcn/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"

export default function StudioSettingsPage() {
  const [darkMode, setDarkMode] = useState(false)

  const handleSaveSettings = () => {
    // Implement settings save logic here
    console.log("Saving settings:", { darkMode })
  }

  return (
    <StudioLayout>
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
            <CardDescription>Manage your app settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode" className="flex-grow">
                  Dark Mode
                </Label>
                <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <Button onClick={handleSaveSettings} className="w-full">
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudioLayout>
  )
}

