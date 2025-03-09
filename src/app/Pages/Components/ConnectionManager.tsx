"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { auth } from "@/app/Firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"

type Connection = {
  id: string
  name: string
  type: string
  host: string
  port: string
  username: string
  password: string
}

const testConnection = async (connectionDetails: Partial<Connection>) => {
  try {
    const response = await fetch("/api/connections/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(connectionDetails),
    })
    const data = await response.json()

    if (data.success) {
      toast.success("Connection test successful!")
      return true
    } else {
      toast.error("Connection test failed", {
        description: data.error,
      })
      return false
    }
  } catch (error) {
    console.error("Error during connection test:", error)
    toast.error("Failed to test connection", {
      description: "An unexpected error occurred.",
    })
    return false
  }
}

const establishConnection = async (connectionDetails: Connection) => {
  try {
    const response = await fetch("/api/connections/establish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(connectionDetails),
    })
    const data = await response.json()

    if (data.success) {
      toast.success("Connection established successfully!")
      return true
    } else {
      toast.error("Failed to establish connection", {
        description: data.error,
      })
      return false
    }
  } catch (error) {
    console.error("Error establishing connection:", error)
    toast.error("Failed to establish connection", {
      description: "An unexpected error occurred.",
    })
    return false
  }
}

export function ConnectionManager() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [newConnection, setNewConnection] = useState<Partial<Connection>>({
    name: "",
    type: "",
    host: "",
    port: "",
    username: "",
    password: "",
  })
  const router = useRouter()

  const [user, loading, error] = useAuthState(auth)

  const fetchConnections = useCallback(async () => {
    try {
      const response = await fetch("/api/connections")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setConnections(data)
    } catch (error) {
      console.error("Failed to fetch connections:", error)
      toast.error("Failed to load connections", {
        description: "Please try again later.",
      })
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchConnections()
    }
  }, [user, fetchConnections])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewConnection((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setNewConnection((prev) => ({ ...prev, type: value }))
  }

  const handleTestConnection = async () => {
    await testConnection(newConnection)
  }

  const handleAddConnection = async () => {
    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConnection),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const addedConnection = await response.json()
      setConnections((prev) => [...prev, addedConnection])

      // Establish the connection
      const established = await establishConnection(addedConnection)
      if (established) {
        // Update the current connection in the studio navigation
        router.push(`/studio?connectionId=${addedConnection.id}`)
      }

      setNewConnection({
        name: "",
        type: "",
        host: "",
        port: "",
        username: "",
        password: "",
      })
      toast.success("Connection added successfully!")
      fetchConnections() // Refresh the connections list
    } catch (error) {
      console.error("Failed to add connection:", error)
      toast.error("Failed to add connection", {
        description: "Please try again.",
      })
    }
  }

  const handleConnectExisting = async (connection: Connection) => {
    const established = await establishConnection(connection)
    if (established) {
      // Update the current connection in the studio navigation
      router.push(`/studio?connectionId=${connection.id}`)
    }
  }

  const handleDeleteConnection = async (connectionId: string) => {
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success("Connection deleted successfully!")
      fetchConnections() // Refresh the connections list
    } catch (error) {
      console.error("Failed to delete connection:", error)
      toast.error("Failed to delete connection", {
        description: "Please try again.",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!user) {
    return <div>Please sign in to manage your connections.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Connection</CardTitle>
          <CardDescription>Enter the details for a new database connection.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Connection Name</Label>
                <Input id="name" name="name" value={newConnection.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Database Type</Label>
                <Select value={newConnection.type} onValueChange={handleTypeChange}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input id="host" name="host" value={newConnection.host} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" name="port" value={newConnection.port} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={newConnection.username} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newConnection.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleTestConnection}>
            Test Connection
          </Button>
          <Button onClick={handleAddConnection}>Add Connection</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Connections</CardTitle>
          <CardDescription>Manage your saved database connections.</CardDescription>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <p>No connections found. Add a new connection above.</p>
          ) : (
            <ul className="space-y-4">
              {connections.map((connection) => (
                <li key={connection.id} className="flex items-center justify-between bg-secondary p-4 rounded-md">
                  <div>
                    <h3 className="font-semibold">{connection.name}</h3>
                    <p className="text-sm text-gray-500">
                      {connection.type} - {connection.host}:{connection.port}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => handleConnectExisting(connection)}>
                      Connect
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteConnection(connection.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}