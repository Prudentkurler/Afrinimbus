'use client'

import { motion } from 'framer-motion'
import { ChatResponse } from '@/types'
import WeatherChart from './WeatherChart'
import { MapPin, Calendar, Thermometer, Cloud, Wind } from 'lucide-react'

interface ResultCardsProps {
  response: ChatResponse
}

export default function ResultCards({ response }: ResultCardsProps) {
  const averages = response.chartData.length > 0 ? {
    temperature: Math.round((response.chartData.reduce((sum, day) => sum + day.temperature, 0) / response.chartData.length) * 10) / 10,
    precipitation: Math.round((response.chartData.reduce((sum, day) => sum + day.precipitation, 0) / response.chartData.length) * 100) / 100,
    windSpeed: Math.round((response.chartData.reduce((sum, day) => sum + day.windSpeed, 0) / response.chartData.length) * 10) / 10
  } : { temperature: 0, precipitation: 0, windSpeed: 0 }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <Cloud className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Weather Summary</h3>
            <p className="text-gray-300 leading-relaxed">{response.summary}</p>
            {response.explanation && (
              <p className="text-gray-400 text-sm mt-3">{response.explanation}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Location & Date Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white font-medium">{response.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Date Range</p>
              <p className="text-white font-medium">{response.dateRange}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weather Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Average Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-red-500/20 p-4 rounded-lg mb-3 inline-block">
              <Thermometer className="w-6 h-6 text-red-400 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-white">{averages.temperature}°C</p>
            <p className="text-sm text-gray-400">Temperature</p>
          </div>
          <div className="text-center">
            <div className="bg-cyan-500/20 p-4 rounded-lg mb-3 inline-block">
              <Cloud className="w-6 h-6 text-cyan-400 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-white">{averages.precipitation}mm</p>
            <p className="text-sm text-gray-400">Precipitation</p>
          </div>
          <div className="text-center">
            <div className="bg-green-500/20 p-4 rounded-lg mb-3 inline-block">
              <Wind className="w-6 h-6 text-green-400 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-white">{averages.windSpeed} m/s</p>
            <p className="text-sm text-gray-400">Wind Speed</p>
          </div>
        </div>
      </motion.div>

      {/* Weather Chart */}
      {response.chartData.length > 0 && (
        <WeatherChart
          data={response.chartData}
          title="Detailed Weather Data from NASA POWER"
        />
      )}

      {/* NASA Credit */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glassmorphism rounded-xl p-4"
      >
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>Data provided by NASA POWER meteorological database</p>
          <p>Powered by Google Gemini AI</p>
        </div>
      </motion.div>
    </motion.div>
  )
}