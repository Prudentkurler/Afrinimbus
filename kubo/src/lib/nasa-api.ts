import { GeocodeResult, NASAPowerResponse, WeatherData } from '@/types'

export async function geocodeLocation(location: string): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          'User-Agent': 'NASA Weather Companion/1.0'
        }
      }
    )
    
    if (!response.ok) throw new Error('Geocoding failed')
    
    const data = await response.json()
    if (data.length === 0) return null
    
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display_name: data[0].display_name
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export async function fetchNASAWeatherData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<WeatherData[]> {
  try {
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,WS2M&community=AG&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('NASA API request failed')
    
    const data: any = await response.json()
    
    // The real NASA API structure is different - use properties.parameter
    const parameters = data.properties?.parameter
    if (!parameters || !parameters.T2M || !parameters.PRECTOTCORR || !parameters.WS2M) {
      throw new Error('Invalid NASA API response: Missing required parameters')
    }
    
    // Transform NASA data to our format
    const weatherData: WeatherData[] = []
    const dates = Object.keys(parameters.T2M).sort()
    
    dates.forEach(date => {
      // Validate that all parameters have data for this date
      const temp = parameters.T2M[date]
      const precip = parameters.PRECTOTCORR[date] // Note: PRECTOTCORR not PRECTOT
      const wind = parameters.WS2M[date]
      
      if (temp !== undefined && precip !== undefined && wind !== undefined && 
          temp !== -999 && precip !== -999 && wind !== -999) { // -999 is NASA's fill value
        const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        weatherData.push({
          date: formattedDate,
          temperature: temp,
          precipitation: precip,
          windSpeed: wind
        })
      }
    })
    
    if (weatherData.length === 0) {
      throw new Error('No valid weather data found for the specified date range')
    }
    
    return weatherData
  } catch (error) {
    console.error('NASA API error:', error)
    throw new Error('Failed to fetch weather data from NASA')
  }
}

export function calculateAverages(data: WeatherData[]) {
  if (data.length === 0) return { temperature: 0, precipitation: 0, windSpeed: 0 }
  
  const sums = data.reduce(
    (acc, day) => ({
      temperature: acc.temperature + day.temperature,
      precipitation: acc.precipitation + day.precipitation,
      windSpeed: acc.windSpeed + day.windSpeed
    }),
    { temperature: 0, precipitation: 0, windSpeed: 0 }
  )
  
  return {
    temperature: Math.round((sums.temperature / data.length) * 10) / 10,
    precipitation: Math.round((sums.precipitation / data.length) * 100) / 100,
    windSpeed: Math.round((sums.windSpeed / data.length) * 10) / 10
  }
}