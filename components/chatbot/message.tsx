'use client'

import { cn } from '@/lib/utils'
import { User, Bot } from 'lucide-react'

interface MessageProps {
  content: string
  role: 'user' | 'assistant'
  className?: string
}

export function Message({ content, role, className }: MessageProps) {
  const isUser = role === 'user'
  
  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-muted text-muted-foreground"
      )}>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
