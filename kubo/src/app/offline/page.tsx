'use client'

import { motion } from 'framer-motion'
import { Wifi, Sparkles } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="glassmorphism rounded-2xl p-8">
          <div className="mb-6">
            <div className="bg-red-500/20 p-4 rounded-full inline-block mb-4">
              <Wifi className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-gradient">
                NASA Weather Companion
              </h1>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            You&apos;re offline
          </h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            This app requires an internet connection to fetch NASA weather data. 
            Please check your connection and try again.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  )
}