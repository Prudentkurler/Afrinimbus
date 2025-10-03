'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useChatStore } from '@/store/chat'
import { User, Bot, Download, MapPin, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import MessageInput from './MessageInput'

export default function ChatInterface() {
  const { messages } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleDownload = async (messageData: any) => {
    // TODO: Implement PDF generation with charts and data
    console.log('Download functionality to be implemented', messageData)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header with back to search */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-neutral-800/40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => useChatStore.getState().clearMessages()}
            className="text-neutral-400 hover:text-white transition-colors text-sm"
          >
            ← New Search
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
              </div>
            )}

            <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : ''}`}>
              {message.type === 'user' ? (
                <div className="bg-white/10 backdrop-blur-sm border border-neutral-700/40 rounded-2xl px-4 py-3">
                  <p className="text-white">{message.content}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* AI Response Structure */}
                  <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-700/40 rounded-2xl overflow-hidden">
                    {/* Header with summary and metadata */}
                    <div className="px-6 py-4 border-b border-neutral-700/40">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-lg mb-2">
                            {message.content.split('\n')[0] || 'Weather Analysis'}
                          </h3>
                          {message.data && (
                            <div className="flex items-center gap-4 text-sm text-neutral-400">
                              {message.data.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>{message.data.location}</span>
                                </div>
                              )}
                              {message.data.dateRange && (
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>{message.data.dateRange}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {message.data?.chartData && (
                          <button
                            onClick={() => handleDownload(message.data)}
                            className="flex items-center gap-2 px-3 py-2 bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-600/40 rounded-lg text-neutral-300 text-sm transition-colors"
                          >
                            <Download size={14} />
                            Download Report
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Detailed explanation */}
                    <div className="px-6 py-4">
                      <div className="text-neutral-200 leading-relaxed">
                        {message.content.split('\n').slice(1).join('\n\n') || 'Analysis complete.'}
                      </div>
                    </div>

                    {/* Chart visualization */}
                    {message.data?.chartData && message.data.chartData.length > 0 && (
                      <div className="px-6 pb-6">
                        <div className="bg-black/40 border border-neutral-700/30 rounded-xl p-4">
                          <h4 className="text-white font-medium mb-4">Temperature Trend</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={message.data.chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#9CA3AF"
                                  fontSize={12}
                                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis 
                                  stroke="#9CA3AF"
                                  fontSize={12}
                                  label={{ value: '°C', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="temperature" 
                                  stroke="#3B82F6" 
                                  strokeWidth={2}
                                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                  activeDot={{ r: 6, stroke: '#1D4ED8', strokeWidth: 2 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Precipitation chart if available */}
                        {message.data.chartData.some((d: any) => d.precipitation > 0) && (
                          <div className="bg-black/40 border border-neutral-700/30 rounded-xl p-4 mt-4">
                            <h4 className="text-white font-medium mb-4">Precipitation</h4>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={message.data.chartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                  <XAxis 
                                    dataKey="date" 
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                  />
                                  <YAxis 
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    label={{ value: 'mm', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="precipitation" 
                                    stroke="#06B6D4" 
                                    strokeWidth={2}
                                    dot={{ fill: '#06B6D4', strokeWidth: 2, r: 3 }}
                                    activeDot={{ r: 5, stroke: '#0891B2', strokeWidth: 2 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {message.type === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-neutral-700/40 flex items-center justify-center">
                  <User size={16} className="text-neutral-300" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  )
}