"use client"

import { useState, useEffect } from "react"
import { getMovies } from "@/lib/data"
import MovieCard from "@/components/movie-card"
import SearchBar from "@/components/search-bar"
import type { Movie } from "@/lib/data"

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getMovies()
        setMovies(data)
        setFilteredMovies(data)
      } catch (error) {
        console.error("Failed to load movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMovies()
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredMovies(movies)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const results = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowercaseQuery) ||
        movie.plot.toLowerCase().includes(lowercaseQuery) ||
        movie.genre.toLowerCase().includes(lowercaseQuery) ||
        movie.actors.toLowerCase().includes(lowercaseQuery),
    )

    setFilteredMovies(results)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Movie Tickets</h1>

      {/* Search bar at the top center */}
      <SearchBar onSearch={handleSearch} />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4">Loading movies...</p>
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.title} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl">No movies found matching your search.</p>
          <button onClick={() => setFilteredMovies(movies)} className="mt-4 text-primary hover:underline">
            Clear search
          </button>
        </div>
      )}
    </main>
  )
}
