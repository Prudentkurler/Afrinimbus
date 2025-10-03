import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function extractLocationFromQuery(query: string): { location?: string, dateRange?: string } {
  // Simple extraction - in a real app, you'd use NLP or more sophisticated parsing
  const locationMatch = query.match(/(?:in|at|for)\s+([A-Za-z\s,]+?)(?:\s+(?:on|from|between|during)|$)/i)
  const dateMatch = query.match(/(?:on|from|between|during)\s+([^.!?]*)/i)
  
  return {
    location: locationMatch?.[1]?.trim(),
    dateRange: dateMatch?.[1]?.trim()
  }
}

export function generateChatId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}