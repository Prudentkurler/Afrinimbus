'use client'

import { useState, useEffect } from 'react'
import { useChatStore } from '@/store/chat'
import ModernSearch from './ModernSearch'
import ChatInterface from './ChatInterface'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { messages, isLoading } = useChatStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  const showChat = messages.length > 0

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Pure black background with subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900/20 to-black pointer-events-none" />
      
      {/* Modern ring-wave animation  */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative">
            {/* Multiple animated rings with glow */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-20 h-20 border-2 border-blue-500/30 rounded-full"></div>
            </div>
            <div className="absolute inset-0 animate-pulse">
              <div className="w-16 h-16 border-2 border-cyan-400/40 rounded-full m-2"></div>
            </div>
            <div className="absolute inset-0 animate-bounce">
              <div className="w-12 h-12 border-2 border-purple-500/50 rounded-full m-4"></div>
            </div>
            
            {/* Center glowing dot */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {!showChat ? (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            {/* AstroCast Logo */}
            <div className="mb-12 text-center">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-4 tracking-tight">
                Diva
              </h1>
              <p className="text-neutral-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                AI-powered weather intelligence from NASA satellite data
              </p>
            </div>

            {/* Modern Search Component */}
            <div className="w-full max-w-2xl">
              <ModernSearch />
            </div>

            {/* Floating suggestion chips */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center max-w-2xl">
              {[
                "Weather in Tokyo next week",
                "Camping conditions in Yosemite",
                "Istanbul weather patterns",
                "Monsoon forecast Mumbai"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => useChatStore.getState().setCurrentQuery(suggestion)}
                  className="px-4 py-2 bg-neutral-900/60 border border-neutral-700/40 rounded-full text-neutral-300 text-sm hover:bg-neutral-800/60 hover:border-neutral-600/60 transition-all duration-300 backdrop-blur-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ChatInterface />
        )}
      </div>
    </div>
  )
}