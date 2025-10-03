'use client'

import { useState } from 'react'
import AiThinkingLoader, { AiThinkingOrbs, AiThinkingWaveform } from '@/components/AiThinkingLoader'

export default function LoaderDemo() {
  const [currentLoader, setCurrentLoader] = useState(0)
  const loaders = ['Gradient Ring', 'Bouncing Orbs', 'Waveform']

  const renderLoader = () => {
    switch (currentLoader) {
      case 0:
        return <AiThinkingLoader />
      case 1:
        return <AiThinkingOrbs />
      case 2:
        return <AiThinkingWaveform />
      default:
        return <AiThinkingLoader />
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-8">
      <div className="glassmorphism rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          AI Thinking Loader Demo
        </h1>
        
        <div className="mb-8">
          {renderLoader()}
        </div>
        
        <div className="flex flex-col gap-4">
          <p className="text-gray-300 text-center text-sm">
            Current: {loaders[currentLoader]}
          </p>
          
          <div className="flex gap-2">
            {loaders.map((loader, index) => (
              <button
                key={index}
                onClick={() => setCurrentLoader(index)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentLoader === index
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {loader}
              </button>
            ))}
          </div>
          
          <a
            href="/"
            className="mt-4 text-center text-blue-400 hover:text-blue-300 text-sm underline"
          >
            ← Back to NASA Weather Companion
          </a>
        </div>
      </div>
    </div>
  )
}