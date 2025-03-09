"use client"

import { useState } from "react"
import { StudioLayout } from "@/app/Pages/Components/StudioLayout"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { ScrollArea } from "@/shadcn/ui/scroll-area"
import { Textarea } from "@/shadcn/ui/textarea"
import { Send } from "lucide-react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

export default function QueryChatPage() {
  const [input, setInput] = useState("")
  const [generatedQuery, setGeneratedQuery] = useState("")

  const handleSendMessage = () => {
    // Implement query generation logic here
    console.log("Generating query for:", input)
  }

  return (
    <StudioLayout>
      <div className="h-full flex flex-col">
        <PanelGroup direction="horizontal" className="flex-grow">
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col bg-background">
              <ScrollArea className="flex-grow">{/* Chat messages would go here */}</ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your query here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="w-1 bg-gray-300 cursor-col-resize" />
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col bg-background">
              <div className="p-4 border-b">
                <h2 className="text-sm font-medium text-muted-foreground">Generated Query</h2>
              </div>
              <ScrollArea className="flex-grow p-4">
                <Textarea
                  value={generatedQuery}
                  onChange={(e) => setGeneratedQuery(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Generated SQL query will appear here..."
                />
              </ScrollArea>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </StudioLayout>
  )
}

