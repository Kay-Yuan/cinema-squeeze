// API client for movie data

import { Movie } from "@/types/movie"



/**
 * Fetch all movies for the movie list
 */
export async function getMovies(): Promise<Movie[]> {
  try {
    const response = await fetch("/api/movies")

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching movies:", error)
    throw error
  }
}

/**
 * Fetch a single movie by ID
 */
export async function getMovie(id: string): Promise<Movie> {
  try {
    const response = await fetch(`/api/movie/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error)
    throw error
  }
}

/**
 * Search movies by title
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error searching movies:", error)
    throw error
  }
}
