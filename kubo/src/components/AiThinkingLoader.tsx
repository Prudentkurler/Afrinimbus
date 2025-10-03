'use client'

import { motion } from 'framer-motion'

interface AiThinkingLoaderProps {
  className?: string
}

export default function AiThinkingLoader({ className = '' }: AiThinkingLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Main gradient ring loader */}
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-transparent"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #8B5CF6, #06B6D4, #10B981, transparent)',
            borderRadius: '50%'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-1 rounded-full bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20 blur-sm"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Center pulsing dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
      
      {/* Thinking text with typing animation */}
      <motion.div
        className="mt-4 text-gray-300 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.span
          animate={{
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Analyzing NASA weather data
        </motion.span>
        <motion.span
          className="ml-1"
          animate={{
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          ...
        </motion.span>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full"
          style={{
            left: `${50 + Math.cos((i * 120) * Math.PI / 180) * 40}%`,
            top: `${50 + Math.sin((i * 120) * Math.PI / 180) * 40}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  )
}

// Alternative loader variations (can be used by changing the export)

// Option 2: Bouncing orbs
export function AiThinkingOrbs({ className = '' }: AiThinkingLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </div>
      <motion.p
        className="mt-4 text-gray-300 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        AI is thinking...
      </motion.p>
    </div>
  )
}

// Option 3: Waveform equalizer
export function AiThinkingWaveform({ className = '' }: AiThinkingLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="flex space-x-1 items-end h-8">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-violet-500 via-cyan-400 to-emerald-400 rounded-full"
            animate={{
              height: [8, 32, 8]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </div>
      <motion.p
        className="mt-4 text-gray-300 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Processing data...
      </motion.p>
    </div>
  )
}