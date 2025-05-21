using System;

namespace CinemaSqueeze.Interfaces;

public interface IMovieService
{
    Task FetchAndCacheMoviesAsync();
    // Add other methods as needed, e.g., GetMovies, GetMovieById, etc.
}
