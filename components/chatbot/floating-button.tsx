'use client'

import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FloatingButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function FloatingButton({ isOpen, onClick, className }: FloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200",
        isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
        className
      )}
      size="icon"
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <MessageCircle className="w-6 h-6" />
      )}
      <span className="sr-only">
        {isOpen ? 'Close chat' : 'Open chat'}
      </span>
    </Button>
  )
}
