'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Download, MapPin, Calendar } from 'lucide-react'
import { ChatResponse } from '@/types'
import WeatherChart from './WeatherChart'

interface ResultsCardProps {
  response: ChatResponse
  onDownload: () => void
}

export default function ResultsCard({ response, onDownload }: ResultsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const averages = response.chartData.length > 0 ? {
    temperature: Math.round((response.chartData.reduce((sum, day) => sum + day.temperature, 0) / response.chartData.length) * 10) / 10,
    precipitation: Math.round((response.chartData.reduce((sum, day) => sum + day.precipitation, 0) / response.chartData.length) * 100) / 100,
    windSpeed: Math.round((response.chartData.reduce((sum, day) => sum + day.windSpeed, 0) / response.chartData.length) * 10) / 10
  } : { temperature: 0, precipitation: 0, windSpeed: 0 }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 mt-12"
    >
      {/* Main Result Card */}
      <div className="glassmorphism rounded-3xl p-8 border border-gray-700/30">
        {/* NASA Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-gray-600/20">
            {/* Placeholder for NASA APOD/EPIC image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300 text-sm">NASA Earth Observatory</p>
              </div>
            </div>
            {/* Cosmic overlay effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 leading-relaxed">
            {response.summary}
          </h2>
          {response.explanation && (
            <p className="text-gray-300 text-lg leading-relaxed">
              {response.explanation}
            </p>
          )}
        </motion.div>

        {/* Location & Date Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-5 h-5 text-violet-400" />
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="font-medium">{response.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-sm text-gray-400">Date Range</p>
              <p className="font-medium">{response.dateRange}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">{averages.temperature}°C</div>
            <div className="text-sm text-gray-400">Avg Temperature</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20">
            <div className="text-2xl font-bold text-cyan-400">{averages.precipitation}mm</div>
            <div className="text-sm text-gray-400">Avg Rainfall</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">{averages.windSpeed} m/s</div>
            <div className="text-sm text-gray-400">Avg Wind</div>
          </div>
        </motion.div>

        {/* Expandable Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-600/30 hover:bg-gray-700/30 transition-all duration-300 mb-4"
          >
            <span className="text-white font-medium">Detailed Weather Analysis</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {response.chartData.length > 0 && (
                  <WeatherChart
                    data={response.chartData}
                    title="NASA POWER Weather Data Analysis"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap gap-3 pt-6 border-t border-gray-700/30"
        >
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download Data
          </button>
          
          <button
            onClick={() => window.location.href = '/share'}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-600/30 text-gray-300 font-medium hover:bg-gray-700/50 hover:border-violet-400/50 transition-all duration-300"
          >
            Share Results
          </button>
        </motion.div>

        {/* NASA Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-6 pt-6 border-t border-gray-700/30"
        >
          <p className="text-sm text-gray-400">
            Data courtesy of NASA POWER meteorological database • Powered by Google Gemini AI
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}