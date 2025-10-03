'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import { useChatStore } from '@/store/chat'

export default function ModernSearch() {
  const [query, setQuery] = useState('')
  const { isLoading, setCurrentQuery, submitQuery } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    await submitQuery(query.trim())
    setQuery('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setCurrentQuery(suggestion)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Main search bar */}
        <div className="relative group">
          {/* Google-style animated rings during loading */}
          {isLoading && (
            <>
              <div className="absolute inset-0 animate-ping">
                <div className="w-full h-full border-2 border-blue-500/30 rounded-full"></div>
              </div>
              <div className="absolute inset-0 animate-pulse">
                <div className="w-full h-full border-2 border-cyan-400/40 rounded-full"></div>
              </div>
            </>
          )}

          <div className="relative bg-neutral-900/60 backdrop-blur-sm border border-neutral-700/40 rounded-full p-4 transition-all duration-300 hover:border-neutral-600/60 focus-within:border-blue-500/60 focus-within:bg-neutral-900/80">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-neutral-400 flex-shrink-0" />
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about weather anywhere on Earth..."
                className="flex-1 bg-transparent text-white placeholder-neutral-400 outline-none text-lg"
                disabled={isLoading}
              />
              
              {!isLoading && query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-colors"
                >
                  <Sparkles size={16} />
                </motion.button>
              )}
              
              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating suggestions */}
        {!isLoading && query.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-wrap gap-2 justify-center"
          >
            {[
              "Weather in Tokyo today",
              "Camping forecast Yosemite",
              "Istanbul next week",
              "Monsoon Mumbai forecast"
            ].map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-neutral-900/40 border border-neutral-700/30 rounded-full text-neutral-300 text-sm hover:bg-neutral-800/60 hover:border-neutral-600/50 transition-all duration-300 backdrop-blur-sm"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </form>
    </div>
  )
}