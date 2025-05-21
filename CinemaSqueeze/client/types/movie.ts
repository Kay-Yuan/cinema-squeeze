/*
{
    "title": "Star Wars: Episode IV - A New Hope",
    "year": 1977,
    "rated": "PG",
    "released": "25 May 1977",
    "runtime": "121 min",
    "genre": "Action, Adventure, Fantasy",
    "director": "George Lucas",
    "writer": "George Lucas",
    "actors": "Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing",
    "plot": "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the galaxy from the Empire's world-destroying battle-station, while also attempting to rescue Princess Leia from the evil Darth Vader.",
    "language": "English",
    "country": "USA",
    "awards": "Won 6 Oscars. Another 48 wins & 28 nominations.",
    "poster": "https://m.media-amazon.com/images/M/MV5BOTIyMDY2NGQtOGJjNi00OTk4LWFhMDgtYmE3M2NiYzM0YTVmXkEyXkFqcGdeQXVyNTU1NTcwOTk@._V1_SX300.jpg",
    "metascore": 92,
    "rating": 8.7,
    "votes": "915,459",
    "type": "movie",
    "providers": [
        {
            "movieId": "cw0076759",
            "name": "Cinemaworld",
            "price": 123.5,
            "lastUpdate": "2025-05-21T00:53:22.079096+10:00"
        },
        {
            "movieId": "fw0076759",
            "name": "Filmworld",
            "price": 29.5,
            "lastUpdate": "2025-05-21T00:53:31.658712+10:00"
        }
    ],
    "lastUpdate": "2025-05-20T23:08:13.365515+10:00"
}
    */
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