"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Movie } from "@/types/movie"
import { MovieImage } from "@/components/MovieImage"
import Link from "next/link"
import { useMovieContext } from "@/context/MovieContext"
import { useRouter } from 'next/navigation'

export default function MovieList() {
    const [searchQuery, setSearchQuery] = useState("")
  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [movies, setMovies] = useState<Movie[]>([])
  const { setSelectedMovie } = useMovieContext()
  const router = useRouter();
  


  useEffect(() => {
        // // Fetch movies from the API
    // TODO: hide token
    fetch("https://localhost:7291/api/movies", {
      method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {

      if (data) {
      setMovies(data);
      console.log("Movies:", data);
      }
      else {
        console.error("No movies found, check API response");
      }
      
    })
    .catch((err) => console.error("API error:", err));
  }, [])

  

  // Filter movies based on search query
  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  // Check scroll position to show/hide arrows
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("scroll", handleScroll)
      // Initial check
      handleScroll()
      return () => slider.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Reset scroll position when search changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0
      handleScroll()
    }
  }, [searchQuery])

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    
    // normalize the title for the URL
    const normalizedTitle = movie.title.toLowerCase().replace(/\s+/g, '_');
   
    router.push(`/movies/${normalizedTitle}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Movie Squeeze</h1>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-10">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search movies..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Movie Slider */}
      {filteredMovies.length > 0 ? (
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm",
              !showLeftArrow && "hidden",
            )}
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredMovies.map((movie) => (
              <div key={movie.title} className="flex-none w-[250px] snap-start">
                <Link href={`/movies/${movie.title.toLowerCase().replace(/\s+/g, '_')}`} onClick={() => handleMovieClick(movie)}>
                <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
                  <div className="aspect-[3/4] relative bg-muted">
                    <MovieImage movie={movie} />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="font-semibold">
                        {movie.rating.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h2 className="font-bold text-lg line-clamp-3 break-words">{movie.title}</h2>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <span>{movie.year}</span>
                      <span className="mx-2">•</span>
                      <span>{movie.genre || "No genre available"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-tight line-clamp-5">{movie.plot || "No description available."}</p>

                    {/* Display the cheapest price */}
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg">Cheapest Price:</h3>
                      <p className="text-xl font-bold text-green-600">
                        ${Math.min(...movie.providers.map((provider) => provider.price)).toFixed(2)}
                        - {Math.floor(
                          (new Date().getTime() - 
                            new Date(
                              movie.providers.find(
                                (provider) => provider.price === Math.min(...movie.providers.map((p) => p.price))
                              )?.lastUpdate!
                            ).getTime()) / 1000 / 60
                        )} minutes ago from {movie.providers.find(provider => provider.price === Math.min(...movie.providers.map((provider) => provider.price)))?.name}
                      </p>
                    </div>
                    
                    {/* Buttons */}
                    <div className="mt-4 flex justify-between space-x-4">
                      <button 
                        className="bg-green-500 text-white rounded-full py-2 px-6 text-sm shadow-md hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out transform"
                        // onClick={() => handleBuyTicketClick(movie)}
                      >
                        Buy Ticket
                      </button>
                      <button
                        className="bg-blue-500 text-white rounded-full py-2 px-6 text-sm shadow-md hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out transform"
                        onClick={() => handleMovieClick(movie)}
                      >
                        Movie Details
                      </button>
                    </div>

                  </CardContent>
                </Card>
              </Link>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm",
              !showRightArrow && "hidden",
            )}
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No movies found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}