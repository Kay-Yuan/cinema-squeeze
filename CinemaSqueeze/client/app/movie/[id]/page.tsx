"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { getMovie } from "@/lib/data"
import { ChevronLeft, Clock, Calendar, Star, DollarSign, Tag, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { getTimeAgo, getCheapestProvider } from "@/lib/utils"
import type { Movie } from "@/lib/data"

export default function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = use(params)

  useEffect(() => {
    async function loadMovie() {
      try {
        setIsLoading(true)
        const data = await getMovie(id)

        if (!data) {
          setError("Movie not found")
          return
        }

        setMovie(data)
      } catch (err) {
        console.error("Failed to load movie:", err)
        setError("Failed to load movie details")
      } finally {
        setIsLoading(false)
      }
    }

    loadMovie()
  }, [id])

  // Handle not found or error states
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4">Loading movie details...</p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-lg mb-8">{error || "The movie you're looking for doesn't exist."}</p>
        <Link href="/" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
          Return to Home
        </Link>
      </div>
    )
  }

  // Find the cheapest provider
  const cheapestProvider = getCheapestProvider(movie.providers)

  // Calculate time since last update
  const timeAgo = getTimeAgo(new Date(movie.lastUpdate))

  // Handle buy ticket action
  const handleBuyTicket = (providerName: string, price: number) => {
    alert(`Redirecting to ${providerName} to purchase ticket for $${price.toFixed(2)}`)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Link href="/" className="flex items-center text-primary hover:underline mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to movies
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="relative h-[450px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={movie.poster || "/placeholder.svg?height=500&width=300"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
            <div className="mt-2 md:mt-0 flex items-center text-yellow-500">
              <Star className="w-5 h-5 mr-1 fill-yellow-500" />
              <span className="text-lg font-semibold">{movie.rating.toFixed(1)}/10</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar className="w-5 h-5 mr-1" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock className="w-5 h-5 mr-1" />
              <span>{movie.runtime}</span>
            </div>
            <div className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm">{movie.rated}</div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{movie.plot}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Genre</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genre.split(", ").map((genre) => (
                <span key={genre} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Cast & Crew</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Director</p>
                <p className="text-gray-600 dark:text-gray-400">{movie.director}</p>
              </div>
              <div>
                <p className="font-medium">Writer</p>
                <p className="text-gray-600 dark:text-gray-400">{movie.writer}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium">Actors</p>
                <p className="text-gray-600 dark:text-gray-400">{movie.actors}</p>
              </div>
            </div>
          </div>

          {movie.awards && (
            <div className="mb-6 flex items-start">
              <Award className="w-5 h-5 mr-2 text-yellow-500 mt-1" />
              <div className="text-gray-600 dark:text-gray-400">{movie.awards}</div>
            </div>
          )}

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Ticket Information</h2>

            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Available Providers:</p>
                <div className="space-y-2">
                  {movie.providers.map((provider) => (
                    <div
                      key={provider.name}
                      className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded-md"
                    >
                      <span>{provider.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${provider.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleBuyTicket(provider.name, provider.price)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Tag className="w-4 h-4 mr-1" />
                <span>Last updated: {timeAgo}</span>
              </div>

              {cheapestProvider && (
                <div className="mt-4">
                  <button
                    onClick={() => handleBuyTicket(cheapestProvider.name, cheapestProvider.price)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium flex items-center justify-center"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Buy Ticket from {cheapestProvider.name} (${cheapestProvider.price.toFixed(2)})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
