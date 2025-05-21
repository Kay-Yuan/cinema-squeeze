"use client"

import { ChevronLeft, Clock, Calendar, Star, Award, Globe, Users, Film, DollarSign } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMovie } from "@/services/movie"
import { notFound } from "next/navigation"
import { useMovieContext } from "@/context/MovieContext"

export default function MovieDetail({ params }: { params: { id: string } }) {
  const { selectedMovie } = useMovieContext();

  if (!selectedMovie) {
    notFound()
  }

  // Parse genres into an array
  const genres = selectedMovie.genre.split(", ")

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="pl-0 hover:pl-1 transition-all">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Movie Poster */}
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={selectedMovie.poster || "/placeholder.svg?height=600&width=400"}
              alt={selectedMovie.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Movie Info */}
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedMovie.title}</h1>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-sm font-medium">
              {selectedMovie.rated}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{selectedMovie.runtime}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>
                {selectedMovie.released} ({selectedMovie.year})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex items-center mb-6">
            <div className="bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center px-3 py-1 rounded-md mr-4">
              <Star className="h-5 w-5 fill-current mr-1" />
              <span className="font-bold">{selectedMovie.rating}</span>
              <span className="text-sm text-muted-foreground ml-1">/10</span>
            </div>
            {selectedMovie.metascore && (
              <div className="bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 px-3 py-1 rounded-md">
                <span className="font-bold">Metascore: {selectedMovie.metascore}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Plot</h2>
            <p className="text-muted-foreground">{selectedMovie.plot}</p>
          </div>

          {selectedMovie.awards && (
            <div className="flex items-start mb-6">
              <Award className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{selectedMovie.awards}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cast & Crew */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Cast & Crew</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-2">
                <Film className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-semibold">Director</h3>
              </div>
              <p>{selectedMovie.director}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-semibold">Cast</h3>
              </div>
              <p>{selectedMovie.actors}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-semibold">Writer</h3>
              </div>
              <p>{selectedMovie.writer}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Details</h2>
          <div className="space-y-3">
            {selectedMovie.language && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language</span>
                <span>{selectedMovie.language}</span>
              </div>
            )}
            {selectedMovie.country && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Country</span>
                <span>{selectedMovie.country}</span>
              </div>
            )}
            {selectedMovie.type && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{selectedMovie.type}</span>
              </div>
            )}
            {selectedMovie.votes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Votes</span>
                <span>{selectedMovie.votes}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{new Date(selectedMovie.lastUpdate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Providers */}
        {selectedMovie.providers && selectedMovie.providers.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Where to Watch</h2>
            <div className="space-y-4">
              {selectedMovie.providers.map((provider) => (
                <Card key={provider.movieId}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Updated: {new Date(provider.lastUpdate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center text-lg font-bold">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        {provider.price.toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
