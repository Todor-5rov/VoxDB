"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/shadcn/ui/button"
import { ScrollArea } from "@/shadcn/ui/scroll-area"
import { Database, FileCode, Settings, PlusCircle, ChevronLeft, ChevronRight, Server, FolderTree } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import { toast } from "sonner"

const navItems = [
  { name: "Connections", href: "/studio", icon: Server },
  { name: "Query Chat", href: "/studio/query", icon: FileCode },
  { name: "Data Explorer", href: "/studio/data-explorer", icon: FolderTree },
  { name: "Settings", href: "/studio/settings", icon: Settings },
]

type Connection = {
  id: string
  name: string
  type: string
}

type Database = {
  id: string
  name: string
}

interface StudioNavigationProps {
  isCollapsed: boolean
  onToggle: (collapsed: boolean) => void
  setIsNavCollapsed: (collapsed: boolean) => void
}

export function StudioNavigation({ isCollapsed, onToggle, setIsNavCollapsed }: StudioNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [connections, setConnections] = useState<Connection[]>([])
  const [databases, setDatabases] = useState<Database[]>([])
  const [selectedConnection, setSelectedConnection] = useState<string>("")
  const [selectedDatabase, setSelectedDatabase] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConnections()
    const connectionId = searchParams.get("connectionId")
    if (connectionId) {
      setSelectedConnection(connectionId)
      fetchDatabases(connectionId)
    }
  }, [searchParams])

  const fetchConnections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/connections")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setConnections(data)
    } catch (error) {
      console.error("Failed to load connections:", error)
      toast.error("Failed to load connections", {
        description: "Please check your network connection and try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDatabases = async (connectionId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/connections/${connectionId}/databases`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setDatabases(data)
      if (data.length > 0) {
        setSelectedDatabase(data[0].id)
      } else {
        setSelectedDatabase("")
      }
    } catch (error) {
      console.error("Failed to load databases:", error)
      toast.error("Failed to load databases", {
        description: "Please check your network connection and try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectionChange = async (connectionId: string) => {
    if (connectionId === "add_new") {
      router.push("/studio")
    } else {
      setSelectedConnection(connectionId)
      setSelectedDatabase("")
      await fetchDatabases(connectionId)

      // Establish the connection
      try {
        const response = await fetch("/api/connections/establish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connectionId }),
        })
        if (!response.ok) {
          throw new Error("Failed to establish connection")
        }
        toast.success("Connection established successfully!")
        router.push(`/studio?connectionId=${connectionId}`)
      } catch (error) {
        console.error("Error establishing connection:", error)
        toast.error("Failed to establish connection", {
          description: "Please try again."
        })
      }
    }
  }

  const handleDatabaseChange = (databaseId: string) => {
    setSelectedDatabase(databaseId)
    // Here you would typically update the global state or context with the selected database
    console.log("Selected database:", databaseId)
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    if (window.innerWidth < 640) {
      // 640px is the 'sm' breakpoint in Tailwind
      setIsNavCollapsed(true)
    }
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-0 sm:w-16" : "w-64",
        "sm:translate-x-0", // Always show on larger screens
        isCollapsed ? "-translate-x-full sm:translate-x-0" : "translate-x-0", // Hide when collapsed on mobile, always show on larger screens
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-2 z-50 rounded-full bg-background shadow-md transition-all duration-300",
          isCollapsed ? "left-4 sm:left-auto sm:right-0 sm:translate-x-1/2" : "right-0 translate-x-1/2",
        )}
        onClick={() => onToggle(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>
      <ScrollArea className={cn("h-full py-6 pt-12", isCollapsed ? "px-0 sm:px-3" : "px-3")}>
        <div className="mb-4 space-y-4">
          <div
            className={cn(
              "flex items-center h-10 transition-all duration-300 ease-in-out overflow-hidden",
              isCollapsed ? "w-10" : "w-full",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 px-0 flex-shrink-0"
              onClick={() => setIsNavCollapsed(false)}
            >
              <Server className="h-4 w-4" />
            </Button>
            <div
              className={cn(
                "flex-grow transition-all duration-300 ease-in-out",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2",
              )}
            >
              <Select value={selectedConnection} onValueChange={handleConnectionChange}>
                <SelectTrigger className="w-full h-10 border-none bg-transparent focus:ring-0 focus:ring-offset-0 p-0 transition-colors duration-300 ease-in-out">
                  <SelectValue placeholder="Select a connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Connections</SelectLabel>
                    {connections.map((connection) => (
                      <SelectItem key={connection.id} value={connection.id}>
                        {connection.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectItem value="add_new">
                      <span className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Connection
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedConnection && !isCollapsed && (
            <div className="flex items-center h-10">
              <Button variant="ghost" size="icon" className="w-10 h-10 px-0 flex-shrink-0">
                <Database className="h-4 w-4" />
              </Button>
              <div className="flex-grow ml-2">
                <Select value={selectedDatabase} onValueChange={handleDatabaseChange} disabled={!selectedConnection}>
                  <SelectTrigger className="w-full h-10 border-none bg-transparent focus:ring-0 focus:ring-offset-0 p-0 transition-colors duration-300 ease-in-out">
                    <SelectValue placeholder="Select a database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Databases</SelectLabel>
                      {databases.map((database) => (
                        <SelectItem key={database.id} value={database.id}>
                          {database.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start px-3 mb-1 hover:bg-accent/10 transition-colors",
                pathname === item.href && "bg-accent/20 hover:bg-accent/20",
                isCollapsed ? "justify-center px-0" : "justify-start",
                "h-10", // Set a fixed height for all buttons
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "justify-start")}>
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="ml-2">{item.name}</span>}
              </div>
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}