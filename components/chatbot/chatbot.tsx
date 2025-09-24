'use client'

import { useState } from 'react'
import { FloatingButton } from './floating-button'
import { ChatPanel } from './chat-panel'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <FloatingButton isOpen={isOpen} onClick={toggleChat} />
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
