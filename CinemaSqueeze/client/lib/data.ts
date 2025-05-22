export interface Movie {
    Id: string
  title: string
  released: string
  runtime: string
  rated: string
  year: number
  genre: string
  description: string
  poster: string
  rating: number
  plot: string
  actors: string
  director: string
  writer: string
  awards: string
  language: string
  country: string
  type: string
  metascore: number
  votes: string
  providers: {
    movieId: string
    name: string
    price: number
    lastUpdate: Date
  }[]
  lastUpdate: Date
}

// Helper function to create dates in the past (for lastUpdate)
const getRandomPastDate = (minutesAgo: number) => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - minutesAgo)
  return date
}



// Data access functions
export async function getMovies(): Promise<Movie[]> {
  const res = await fetch("https://localhost:7291/api/movies", {
    method: "GET",
  });

  const data = await res.json();

  return data;
}

export async function getMovie(id: string): Promise<Movie | undefined> {
  const decodedTitle = decodeURIComponent(id);

  const res = await fetch(`https://localhost:7291/api/movies/${decodedTitle}`, {
    method: "GET",
  });
  console.log(res);
  const data = await res.json();

  return data;
}
