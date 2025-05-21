import type { NextRequest } from "next/server"
import type { Movie } from "@/types/movie"
import { useMovieContext } from "@/context/MovieContext";

// Sample movie data - in a real app, this would come from a database


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    //Get data from context
    const { selectedMovie } = useMovieContext();
    const id = params.id

    // Check if movie exists
    if (!selectedMovie && selectedMovie!.Id !== id) {
        return new Response(JSON.stringify({ error: "Movie not found" }), {
        status: 404,
        headers: {
            "Content-Type": "application/json",
        },
        })
  }

  // Return the movie data
  return new Response(JSON.stringify(selectedMovie), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
