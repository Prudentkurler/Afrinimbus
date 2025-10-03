import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { parseNaturalQuery, generateApiRequest, generateClarificationPrompt, generateLocationResolutionPrompt } from '@/lib/ai-parser'
import { ChatResponse } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBuROoixboUK2wuCEiMTU3-iK7X3khaoQc')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    const trimmedQuery = query.trim()

    // Step 1: Parse the natural language query
    const parsed = parseNaturalQuery(trimmedQuery)

    // Step 2: Use Gemini to resolve location if weather-related
    let resolvedLocation = parsed.location
    if (parsed.intent === 'weather' && parsed.location) {
      try {
        const locationPrompt = generateLocationResolutionPrompt(trimmedQuery)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const result = await model.generateContent(locationPrompt)
        const response = await result.response
        const geminiLocation = response.text().trim()
        
        if (geminiLocation !== 'LOCATION_NOT_FOUND') {
          resolvedLocation = geminiLocation
          console.log(`Location resolved: "${parsed.location}" → "${resolvedLocation}"`)
        }
      } catch (locationError) {
        console.error('Location resolution error:', locationError)
        // Continue with original location if Gemini fails
      }
    }

    // Step 3: If clarification is needed or location resolution failed
    if (parsed.clarificationNeeded || !resolvedLocation) {
      let clarificationResponse = ''
      try {
        const clarificationPrompt = generateClarificationPrompt(trimmedQuery, parsed)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const result = await model.generateContent(clarificationPrompt)
        const response = await result.response
        clarificationResponse = response.text()
      } catch (geminiError: any) {
        console.error('Gemini API error for clarification:', geminiError.message || geminiError)
        clarificationResponse = `I'd be happy to help with weather information. Could you please specify a city and country? For example, 'weather in London, UK' or 'Tokyo, Japan forecast'.`
      }

      const chatResponse: ChatResponse = {
        success: true,
        summary: "Location Clarification Needed",
        explanation: clarificationResponse,
        chartData: [],
        location: "Unknown",
        dateRange: "N/A"
      }

      return NextResponse.json(chatResponse)
    }

    // Step 4: Generate structured API request with resolved location
    const apiRequest = generateApiRequest(parsed, trimmedQuery, resolvedLocation)

    // Step 5: Fetch weather data
    const weatherResponse = await fetch(`${request.nextUrl.origin}/api/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest)
    })

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Weather API error:', weatherResponse.status, errorData)
      
      if (weatherResponse.status === 404) {
        // Graceful handling of missing NASA data
        let fallbackResponse = ''
        try {
          const fallbackPrompt = `
The user asked about weather for "${resolvedLocation}" but NASA POWER doesn't have exact data for this location.

Please provide a professional response that:
1. Acknowledges the request
2. Explains that NASA data isn't available for this exact location
3. Suggests they try a larger nearby city
4. Mentions that NASA data covers broader regions

Keep it concise and helpful, around 2-3 sentences.
          `.trim()
          
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
          const result = await model.generateContent(fallbackPrompt)
          const response = await result.response
          fallbackResponse = response.text()
        } catch (fallbackError) {
          fallbackResponse = `I don't have exact NASA satellite data for "${resolvedLocation}". NASA POWER covers broader regions, so I'd recommend trying a larger nearby city or checking a local weather app for hyper-local accuracy.`
        }

        return NextResponse.json({
          success: false,
          summary: "📍 Location Not Found in NASA Database",
          explanation: fallbackResponse,
          chartData: [],
          location: resolvedLocation || "Unknown",
          dateRange: "N/A"
        }, { status: 404 })
      }

      if (weatherResponse.status >= 500) {
        return NextResponse.json({
          success: false,
          summary: "🔧 Service Temporarily Unavailable", 
          explanation: "Our weather data service is experiencing technical difficulties. Please check your internet connection and try again in a few moments. If the problem persists, the NASA POWER API might be temporarily down.",
          chartData: [],
          location: resolvedLocation || "Unknown",
          dateRange: "N/A"
        }, { status: 503 })
      }
      
      throw new Error(`Weather API failed with status ${weatherResponse.status}`)
    }

    const weatherData = await weatherResponse.json()
    
    // Check if we got valid weather data
    if (!weatherData.success || !weatherData.data || weatherData.data.length === 0) {
      throw new Error('No weather data available for the specified location and dates')
    }

    // Step 6: Generate enhanced response with Gemini
    const currentDate = new Date().toISOString().split('T')[0]
    const enhancedPrompt = `
You are a professional weather analyst. Current date: ${currentDate}

A user asked: "${trimmedQuery}"

NASA POWER satellite data for ${resolvedLocation}:
- Date Range: ${apiRequest.startDate} to ${apiRequest.endDate}
- Average Temperature: ${weatherData.averages.temperature}°C
- Average Precipitation: ${weatherData.averages.precipitation}mm
- Average Wind Speed: ${weatherData.averages.windSpeed} m/s

Recent daily data:
${weatherData.data.slice(-5).map((day: any) => 
  `${day.date}: ${day.temperature}°C, ${day.precipitation}mm rain, ${day.windSpeed} m/s wind`
).join('\n')}

Important: If the user asked about a future date (like "next Tuesday"), be clear that this is historical NASA data being used to provide insights about typical weather patterns for that location and time of year, not a real forecast.

For future date requests:
- Calculate the correct date (e.g., if today is ${currentDate} and they ask about "next Tuesday", that would be the next occurring Tuesday)
- Explain you're showing historical patterns from NASA data for that location
- Mention they should check a live weather service for actual forecasts

Provide a response with these sections:
1. **Summary headline** (1 line, like "☁️ Conditions look favorable" or "🌡️ Warm and dry period")
2. **Detailed explanation** (2-3 sentences about the weather patterns, being accurate about dates)
3. **NASA dataset note** (1 sentence mentioning the data source and time period)

Use minimal weather icons (☁️🌡️💨) only where relevant. Be professional and concise.
`.trim()

    let aiResponse = ''
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      const result = await model.generateContent(enhancedPrompt)
      const response = await result.response
      aiResponse = response.text()
    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError.message || geminiError)
      
      // Enhanced fallback response
      const conditionSummary = weatherData.averages.temperature > 20 ? '🌡️ Warm conditions' : 
                              weatherData.averages.temperature < 10 ? '❄️ Cool conditions' : '🌤️ Moderate conditions'
      
      aiResponse = `${conditionSummary} observed for ${resolvedLocation}.\n\nNASA satellite data shows average temperatures of ${weatherData.averages.temperature}°C with ${weatherData.averages.precipitation}mm precipitation and ${weatherData.averages.windSpeed} m/s wind speeds over the past week.\n\nData sourced from NASA POWER meteorological database covering ${apiRequest.startDate} to ${apiRequest.endDate}.`
    }

    // Parse AI response into structured format
    const sections = aiResponse.split('\n').filter(line => line.trim())
    const summary = sections[0] || `Weather data for ${resolvedLocation}`
    const explanation = sections.slice(1).join('\n\n') || "NASA satellite data provides regional weather insights."

    const chatResponse: ChatResponse = {
      success: true,
      summary: summary.replace(/\*\*/g, ''), // Remove markdown formatting
      explanation: explanation.replace(/\*\*/g, ''),
      chartData: weatherData.data,
      location: weatherData.location.address,
      dateRange: `${apiRequest.startDate} to ${apiRequest.endDate}`
    }

    return NextResponse.json(chatResponse)

  } catch (error: any) {
    console.error('Chat API error:', error.message || error)
    
    // Check if it's a network-related error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.message?.includes('fetch')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Network error',
          summary: "🌐 Network Connection Issue",
          explanation: "Unable to connect to our weather services. Please check your internet connection and try again. If you're on a corporate network, it might be blocking external requests.",
          chartData: [],
          location: "Unknown",
          dateRange: "N/A"
        },
        { status: 503 }
      )
    }

    // Generic server error
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        summary: "⚠️ Service Temporarily Unavailable",
        explanation: "I'm experiencing technical difficulties processing your request. This could be due to high server load or a temporary service outage. Please try again in a few moments.",
        chartData: [],
        location: "Unknown",
        dateRange: "N/A"
      },
      { status: 500 }
    )
  }
}