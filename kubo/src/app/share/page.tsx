'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SharePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = window.location.origin
        const qrUrl = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
          color: {
            dark: '#FFFFFF',
            light: '#0B0F19'
          }
        })
        setQrCodeUrl(qrUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQRCode()
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                Share NASA Weather Companion
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Scan the QR code below to try this app on your device
            </p>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glassmorphism rounded-2xl p-8 mb-8"
          >
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-64 h-64 mx-auto"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <div className="text-gray-400">Generating QR Code...</div>
              </div>
            )}
          </motion.div>

          {/* URL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm mb-2">Or visit directly:</p>
            <p className="text-blue-400 font-mono text-lg">
              {typeof window !== 'undefined' ? window.location.origin : ''}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                title: "NASA Data",
                description: "Real meteorological data from NASA's POWER database"
              },
              {
                title: "AI-Powered",
                description: "Intelligent analysis using Google Gemini AI"
              },
              {
                title: "PWA Ready",
                description: "Install on your device for offline access"
              }
            ].map((feature, index) => (
              <div key={index} className="glassmorphism rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}