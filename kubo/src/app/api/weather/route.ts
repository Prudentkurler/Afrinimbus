import { NextRequest, NextResponse } from 'next/server'
import { geocodeLocation, fetchNASAWeatherData, calculateAverages } from '@/lib/nasa-api'
import { WeatherApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { location, startDate, endDate } = body

    // Validate input parameters
    if (!location || typeof location !== 'string' || location.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Location is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: startDate, endDate' },
        { status: 400 }
      )
    }

    const trimmedLocation = location.trim()

    // Geocode the location
    const coordinates = await geocodeLocation(trimmedLocation)
    if (!coordinates) {
      console.error(`Geocoding failed for location: "${trimmedLocation}"`)
      return NextResponse.json(
        { success: false, error: 'Location not found. Please try a more specific location.' },
        { status: 404 }
      )
    }

    // Format dates for NASA API (YYYYMMDD)
    const formatDateForNASA = (dateStr: string) => {
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date')
        }
        return date.getFullYear().toString() + 
               (date.getMonth() + 1).toString().padStart(2, '0') + 
               date.getDate().toString().padStart(2, '0')
      } catch (error) {
        throw new Error(`Invalid date format: ${dateStr}`)
      }
    }

    const nasaStartDate = formatDateForNASA(startDate)
    const nasaEndDate = formatDateForNASA(endDate)

    // Fetch weather data from NASA
    const weatherData = await fetchNASAWeatherData(
      coordinates.lat,
      coordinates.lon,
      nasaStartDate,
      nasaEndDate
    )

    if (!weatherData || weatherData.length === 0) {
      console.error(`No weather data returned for coordinates: ${coordinates.lat}, ${coordinates.lon}`)
      return NextResponse.json(
        { success: false, error: 'No weather data available for the specified location and dates' },
        { status: 404 }
      )
    }

    const averages = calculateAverages(weatherData)

    const response: WeatherApiResponse = {
      location: {
        lat: coordinates.lat,
        lon: coordinates.lon,
        address: coordinates.display_name
      },
      data: weatherData,
      averages,
      summary: `Weather data for ${trimmedLocation} from ${startDate} to ${endDate}`
    }

    return NextResponse.json({ success: true, ...response })

  } catch (error: any) {
    console.error('Weather API error:', error.message || error)
    
    // Handle specific error types
    if (error.message?.includes('Invalid date format')) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Please use YYYY-MM-DD format.' },
        { status: 400 }
      )
    }
    
    if (error.message?.includes('NASA API request failed')) {
      return NextResponse.json(
        { success: false, error: 'NASA weather service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data. Please try again later.' },
      { status: 500 }
    )
  }
}