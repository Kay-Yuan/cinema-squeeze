"use client"

import React from "react"

import Image from "next/image"
import Link from "next/link"
import { getTimeAgo, getCheapestProvider } from "@/lib/utils"
import { Clock, DollarSign, Tag, Calendar } from "lucide-react"
import type { Movie } from "@/lib/data"

export default function MovieCard({ movie }: { movie: Movie }) {
  const [imgSrc, setImgSrc] = React.useState(movie.poster)
  // Find the cheapest provider
  const cheapestProvider = getCheapestProvider(movie.providers)

  // Calculate time since last update
  const timeAgo = getTimeAgo(new Date(cheapestProvider!.lastUpdate))

  // Handle buy ticket action
  const handleBuyTicket = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real app, this would navigate to a checkout page or provider site
    alert(`Redirecting to ${cheapestProvider?.name} to purchase ticket for $${cheapestProvider?.price.toFixed(2)}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      <div className="relative h-64">
        <Image src={imgSrc} alt={movie.title || 'No Image'} fill className="object-cover" onError={() => {
        setImgSrc("/No-Image-Placeholder.svg")
        }}/>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-1">{movie.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{movie.plot}</p>

        <div className="flex flex-col gap-2 mb-4">
          {/* Movie details */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{movie.year}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{movie.runtime}</span>
          </div>

          {/* Provider and price */}
          {cheapestProvider && (
            <div className="flex items-center text-sm font-medium">
              <Tag className="w-4 h-4 mr-1 text-primary" />
              <span className="mr-1">{cheapestProvider.name}:</span>
              <span className="text-green-600 dark:text-green-400">${cheapestProvider.price.toFixed(2)}</span>
            </div>
          )}

          {/* Last update */}
          <div className="text-xs text-gray-500 dark:text-gray-400">Updated {timeAgo}</div>
        </div>

        <div className="flex items-center justify-between">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">{movie.rating.toFixed(1)} ★</span>

          <div className="flex gap-2">
            <button
              onClick={handleBuyTicket}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Buy
            </button>

            <Link
              href={`/movie/${movie.title.toLowerCase().replace(/\s+/g, '_')}`}
              className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
