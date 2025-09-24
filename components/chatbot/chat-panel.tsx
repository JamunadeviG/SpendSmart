'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from './message'
import { TypingIndicator } from './typing-indicator'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ChatPanel({ isOpen, onClose, className }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:4000/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let assistantMessage: Message | null = null
      let content = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'session') {
                setSessionId(data.sessionId)
              } else if (data.type === 'chunk') {
                if (!assistantMessage) {
                  assistantMessage = {
                    id: (Date.now() + 1).toString(),
                    content: '',
                    role: 'assistant',
                    timestamp: new Date()
                  }
                  setMessages(prev => [...prev, assistantMessage!])
                }
                content += data.content
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage!.id 
                      ? { ...msg, content }
                      : msg
                  )
                )
              } else if (data.type === 'error') {
                throw new Error(data.message)
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: error instanceof Error ? error.message : 'Sorry, something went wrong. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearHistory = async () => {
    if (sessionId) {
      try {
        await fetch('http://localhost:4000/chat/clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })
      } catch (error) {
        console.error('Failed to clear history:', error)
      }
    }
    setMessages([])
    setSessionId(null)
  }

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-background border rounded-lg shadow-xl flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">AI Assistant</h3>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">Ask me anything about your finances!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <Message
                key={message.id}
                content={message.content}
                role={message.role}
              />
            ))}
            {isLoading && <TypingIndicator className="px-4 py-2" />}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
