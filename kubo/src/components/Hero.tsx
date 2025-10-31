'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'

interface HeroProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export default function Hero({ onSearch, isLoading }: HeroProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return
    onSearch(query)
  }

  const suggestionChips = [
    " Will it be very hot or cold at Madina for shopping next week?",
    " Will it rain in Miami next month?",
 
  ]

  const handleChipClick = (suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^[🌌☀️🌍]\s/, '') // Remove emoji
    setQuery(cleanSuggestion)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Cosmic Background Glow */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto z-10"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-violet-400" />
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Diva
            </h1>
          </div>
          <p className="text-gray-300 text-xl md:text-2xl font-light">
            Ask about your plans and I&apos;ll check the skies with NASA data.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 mb-8"
        >
          {/* Cosmic Glow Behind Search Bar */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))',
                'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))',
                'linear-gradient(45deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))',
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
            <div className={`relative glassmorphism rounded-2xl p-1 transition-all duration-300 ${
              isFocused || query ? 'ring-2 ring-violet-400/50 shadow-[0_0_40px_rgba(139,92,246,0.3)]' : ''
            }`}>
              <div className="flex items-center bg-gray-900/20 rounded-2xl">
                <div className="flex-1 px-6 py-4">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask me about your event… e.g. 'Will it rain in Paris next month?'"
                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                    disabled={isLoading}
                  />
                </div>
                
                {/* Floating Search Button */}
                <motion.button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="mr-2 relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Suggestion Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto"
        >
          {suggestionChips.map((chip, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              onClick={() => handleChipClick(chip)}
              className="px-4 py-2 rounded-full bg-gray-800/40 border border-gray-600/30 text-gray-300 text-sm hover:bg-gray-700/50 hover:border-violet-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {chip}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}