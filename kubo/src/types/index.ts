export interface WeatherData {
  date: string
  temperature: number
  precipitation: number
  windSpeed: number
}

export interface WeatherApiResponse {
  success?: boolean
  location: {
    lat: number
    lon: number
    address: string
  }
  data: WeatherData[]
  averages: {
    temperature: number
    precipitation: number
    windSpeed: number
  }
  summary: string
  error?: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatResponse {
  success?: boolean
  summary: string
  explanation: string
  chartData: WeatherData[]
  location: string
  dateRange: string
  error?: string
}

export interface GeocodeResult {
  lat: number
  lon: number
  display_name: string
}

export interface NASAPowerResponse {
  parameters: {
    T2M: Record<string, number>
    PRECTOT: Record<string, number>
    WS2M: Record<string, number>
  }
}