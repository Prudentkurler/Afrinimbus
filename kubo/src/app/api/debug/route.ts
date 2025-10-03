import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test with a simple request to NASA API
    const lat = 40.7128 // New York latitude
    const lon = -74.0060 // New York longitude
    const startDate = '20241001' // October 1, 2024
    const endDate = '20241003' // October 3, 2024
    
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOT,WS2M&community=AG&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`
    
    console.log('NASA API URL:', url)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('NASA API Response:', JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      url,
      responseStatus: response.status,
      data
    })
    
  } catch (error) {
    console.error('NASA API Debug Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}