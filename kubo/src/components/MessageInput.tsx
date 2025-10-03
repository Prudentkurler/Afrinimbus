'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useChatStore } from '@/store/chat'

export default function MessageInput() {
  const [message, setMessage] = useState('')
  const { isLoading, submitQuery } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    await submitQuery(message.trim())
    setMessage('')
  }

  return (
    <div className="sticky bottom-0 z-20 bg-black/80 backdrop-blur-sm border-t border-neutral-800/40 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-neutral-900/60 backdrop-blur-sm border border-neutral-700/40 rounded-2xl transition-all duration-300 hover:border-neutral-600/60 focus-within:border-blue-500/60 focus-within:bg-neutral-900/80">
            <div className="flex items-center gap-3 p-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your location or follow-up question..."
                className="flex-1 bg-transparent text-white placeholder-neutral-400 outline-none text-base"
                disabled={isLoading}
              />
              
              {!isLoading && message && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-colors"
                >
                  <Send size={18} />
                </motion.button>
              )}
              
              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}