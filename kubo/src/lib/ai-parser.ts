// Enhanced AI Query Parser with Location Resolution
export function parseNaturalQuery(query: string): {
  location?: string
  intent: 'weather' | 'nasa' | 'space' | 'general'
  dateContext?: 'today' | 'tomorrow' | 'week' | 'custom'
  clarificationNeeded: boolean
  suggestedQuestions?: string[]
} {
  const lowerQuery = query.toLowerCase()
  
  // Location extraction patterns - more comprehensive
  const locationPatterns = [
    /(?:in|at|near|around|for)\s+([a-zA-Z\s,.-]+?)(?:\s|$|\.|\?|!|weather|temperature|climate|forecast)/i,
    /([a-zA-Z\s,.-]+?)\s+(?:weather|temperature|climate|forecast|conditions)/i,
    /(?:weather|temperature|climate|forecast|conditions)\s+(?:in|at|near|around|for)\s+([a-zA-Z\s,.-]+?)(?:\s|$|\.|\?|!)/i,
    /^([a-zA-Z\s,.-]+?)\s*(?:weather|forecast|climate)/i,
  ]
  
  let extractedLocation = ''
  for (const pattern of locationPatterns) {
    const match = query.match(pattern)
    if (match && match[1]) {
      extractedLocation = match[1].trim()
      // Clean up common false positives
      if (extractedLocation.length > 2 && !extractedLocation.match(/^(the|and|or|but|with|for|weather|climate)$/i)) {
        break
      }
    }
  }
  
  // Enhanced location mappings with regions
  const locationMappings: Record<string, string> = {
    'yosemite': 'Yosemite National Park, California, USA',
    'yellowstone': 'Yellowstone National Park, Wyoming, USA',
    'grand canyon': 'Grand Canyon National Park, Arizona, USA',
    'nyc': 'New York City, New York, USA',
    'la': 'Los Angeles, California, USA',
    'sf': 'San Francisco, California, USA',
    'london': 'London, England, UK',
    'paris': 'Paris, France',
    'tokyo': 'Tokyo, Japan',
    'accra': 'Accra, Ghana',
    'lagos': 'Lagos, Nigeria',
    'cairo': 'Cairo, Egypt',
    'sydney': 'Sydney, Australia',
    'mumbai': 'Mumbai, India',
    'delhi': 'New Delhi, India',
  }
  
  // Apply location mappings
  const mappedLocation = locationMappings[extractedLocation.toLowerCase()] || extractedLocation
  
  // Intent detection
  let intent: 'weather' | 'nasa' | 'space' | 'general' = 'general'
  
  const weatherKeywords = ['weather', 'temperature', 'rain', 'wind', 'climate', 'forecast', 'camping', 'hiking', 'outdoor', 'conditions']
  const spaceKeywords = ['solar', 'space', 'satellite', 'aurora', 'flare', 'nasa', 'earth', 'atmosphere']
  
  if (weatherKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'weather'
  } else if (spaceKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'nasa'
  }
  
  // Date context detection with future date support
  let dateContext: 'today' | 'tomorrow' | 'week' | 'custom' = 'week'
  if (lowerQuery.includes('today') || lowerQuery.includes('current')) {
    dateContext = 'today'
  } else if (lowerQuery.includes('tomorrow') || lowerQuery.includes('next day')) {
    dateContext = 'tomorrow'
  } else if (lowerQuery.includes('next week') || lowerQuery.includes('next tuesday') || lowerQuery.includes('next wednesday') || lowerQuery.includes('next thursday') || lowerQuery.includes('next friday') || lowerQuery.includes('next saturday') || lowerQuery.includes('next sunday') || lowerQuery.includes('next monday')) {
    dateContext = 'custom'
  }
  
  // Determine if clarification is needed
  const clarificationNeeded = !mappedLocation || mappedLocation.length < 3
  
  const suggestedQuestions = clarificationNeeded ? [
    "Could you specify a city and country?",
    "Are you looking for weather or space weather data?",
    "What time period are you interested in?"
  ] : []
  
  return {
    location: mappedLocation || undefined,
    intent,
    dateContext,
    clarificationNeeded,
    suggestedQuestions
  }
}

// Generate Gemini prompt for location resolution
export function generateLocationResolutionPrompt(userQuery: string): string {
  return `
You are a location resolution assistant. Parse this user query and extract the intended location:

User Query: "${userQuery}"

Your task:
1. Identify the location mentioned in the query
2. Resolve it to the format: "City, Region/State, Country"
3. If the location is ambiguous, suggest the most likely interpretation
4. If no clear location is found, respond with "LOCATION_NOT_FOUND"

Examples:
- "weather in Agbogba" → "Agbogba, Greater Accra, Ghana"
- "Tokyo forecast" → "Tokyo, Tokyo Prefecture, Japan"
- "NYC weather" → "New York City, New York, USA"
- "weather tomorrow" → "LOCATION_NOT_FOUND"

Respond with ONLY the resolved location in the specified format, or "LOCATION_NOT_FOUND".
`.trim()
}

// Generate structured API request from parsed query
export function generateApiRequest(parsed: ReturnType<typeof parseNaturalQuery>, originalQuery: string, resolvedLocation?: string) {
  const today = new Date()
  let endDate = new Date()
  let startDate = new Date()
  
  // Handle different date contexts
  if (parsed.dateContext === 'today') {
    // For today, get current day data
    endDate = new Date(today)
    startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 1)
  } else if (parsed.dateContext === 'tomorrow') {
    // For tomorrow
    endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 1)
    startDate = new Date(today)
  } else if (parsed.dateContext === 'custom') {
    // For future dates like "next Tuesday", extend the range to include future days
    endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 14) // Look ahead 2 weeks for more data
    startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 1) // Start from yesterday for baseline
  } else {
    // Default: past week for historical data
    endDate = new Date(today)
    endDate.setDate(endDate.getDate() - 1) // Yesterday for data availability
    startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 7) // 7 days of historical data
  }
  
  return {
    location: resolvedLocation || parsed.location || 'New York, NY',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    originalQuery,
    intent: parsed.intent,
    dateContext: parsed.dateContext
  }
}

// Generate clarification prompt for AI
export function generateClarificationPrompt(query: string, parsed: ReturnType<typeof parseNaturalQuery>): string {
  return `
The user asked: "${query}"

I need to help clarify their request for weather data. The location provided is unclear or missing.

Please respond in a helpful, professional tone asking for:
1. A specific location (city and country)
2. Confirmation of what type of weather information they need

Keep the response concise (1-2 sentences) and suggest they provide a clearer location.
Example: "I'd be happy to help with weather information. Could you please specify a city and country? For example, 'weather in London, UK' or 'Tokyo, Japan forecast'."
`.trim()
}