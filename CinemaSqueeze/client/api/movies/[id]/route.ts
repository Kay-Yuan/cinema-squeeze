import type { NextRequest } from "next/server"
import type { Movie } from "@/types/movie"
import { useMovieContext } from "@/context/MovieContext";
import { GetServerSideProps } from "next";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const title = context.params?.title;
  if (!title) {
    return {
      notFound: true,
    };
  }

  
  
  // Fetch data from your backend API
  console.log("======== Fetching movie data for title:", title);
  const response = await fetch(`https://localhost:7291/api/movies/${title}`); // Adjust to your backend API endpoint
  console.log("========= Response:", response);
  const movie = await response.json();
  
  if (!movie) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      movie,
    },
  };
};