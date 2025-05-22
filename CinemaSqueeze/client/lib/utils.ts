import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get time elapsed since a date
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - new Date(date).getTime()

  // Convert to minutes
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (diffInMinutes < 1) {
    return "just now"
  } else if (diffInMinutes === 1) {
    return "1 minute ago"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 120) {
    return "1 hour ago"
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`
  } else if (diffInMinutes < 2880) {
    return "1 day ago"
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }
}

// Function to find the cheapest provider
export function getCheapestProvider(providers: { name: string; price: number, lastUpdate: Date }[]) {
  if (!providers || providers.length === 0) {
    return null
  }

  return providers.reduce((cheapest, current) => {
    return current.price < cheapest.price ? current : cheapest
  }, providers[0])
}
