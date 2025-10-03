# NASA Weather Companion

A **Next.js 14 (App Router)** Progressive Web App that provides AI-powered weather insights using NASA meteorological data and Google Gemini AI.

## Features

- 🛰️ **NASA Data Integration**: Real meteorological data from NASA's POWER database
- 🤖 **AI-Powered Analysis**: Intelligent weather interpretation using Google Gemini
- 🌙 **Dark Modern UI**: Minimal, professional design inspired by Google AI Search
- 📊 **Interactive Charts**: Beautiful weather visualizations with Recharts
- 📱 **Progressive Web App**: Installable with offline support
- 🎨 **Smooth Animations**: Fluid transitions powered by Framer Motion
- 📤 **Data Export**: Download weather data as CSV/JSON
- 🔗 **Easy Sharing**: QR code sharing and social media integration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI**: Google Generative AI (Gemini)
- **Icons**: Lucide React
- **PWA**: Custom Service Worker

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key

### Installation

1. **Clone and setup**:
   ```bash
   cd kubo
   npm install
   ```

2. **Environment Variables**:
   Create `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Gemini AI integration
│   │   └── weather/route.ts       # NASA POWER API integration
│   ├── share/page.tsx             # QR code sharing page
│   ├── offline/page.tsx           # PWA offline fallback
│   ├── layout.tsx                 # Root layout with PWA setup
│   ├── page.tsx                   # Main landing page
│   ├── loading.tsx                # Loading component
│   └── globals.css                # Global styles
├── components/
│   ├── HomePage.tsx               # Landing page with search
│   ├── ChatInterface.tsx          # Google AI-style chat UI
│   ├── WeatherChart.tsx           # Interactive charts
│   ├── ResultCards.tsx            # Weather data cards
│   └── ServiceWorkerRegistration.tsx
├── lib/
│   ├── nasa-api.ts                # NASA POWER API utilities
│   └── utils.ts                   # Utility functions
└── types/
    └── index.ts                   # TypeScript definitions
```

## Usage Examples

### Example Queries
- "What's the weather like for my camping trip in Yosemite this weekend?"
- "Will it rain during my outdoor wedding in Miami next month?"
- "Temperature trends in Tokyo for the Olympics"
- "Is it good weather for hiking in Colorado next week?"

## API Endpoints

### `POST /api/weather`
Fetches NASA weather data for a location and date range.

### `POST /api/chat`
Processes natural language queries with AI analysis.

## Deployment

### Production Build
```bash
npm run build
npm start
```

