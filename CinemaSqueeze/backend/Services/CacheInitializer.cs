using System;
using System.Text.Json;
using CinemaSqueeze.Interfaces;
using CinemaSqueeze.DTOs;
using AutoMapper;

namespace CinemaSqueeze.Services;

public class CacheInitializer : ICacheInitializer
{
    private readonly IRedisCacheService _redis;
    private readonly ILogger<CacheInitializer> _logger;
    private readonly IMapper _mapper;

    public CacheInitializer(IRedisCacheService redis, ILogger<CacheInitializer> logger, IMapper mapper)
    {
        _mapper = mapper;
        _logger = logger;
        _redis = redis;
    }


    public async Task SeedAsync()
    {
        var movie = new MovieInId
        {
            Title = "test Star Wars: Episode IV - A New Hope",
            Year = 1977,
            Rated = "PG",
            Released = "25 May 1977",
            Runtime = "121 min",
            Genre = "Action, Adventure, Fantasy",
            Director = "George Lucas",
            Writer = "George Lucas",
            Actors = "Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing",
            Plot = "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the galaxy from the Empire's world-destroying battle-station, while also attempting to rescue Princess Leia from the evil Darth Vader.",
            Language = "English",
            Country = "USA",
            Awards = "Won 6 Oscars. Another 48 wins & 28 nominations.",
            Poster = "https://m.media-amazon.com/images/M/MV5BOTIyMDY2NGQtOGJjNi00OTk4LWFhMDgtYmE3M2NiYzM0YTVmXkEyXkFqcGdeQXVyNTU1NTcwOTk@._V1_SX300.jpg",
            Metascore = 92,
            Rating = 8.7m,
            Votes = "915,459",
            Id = "cw0076759",
            Type = "movie",
            Price = 123.5m,

        };
        // Convert MovieInId to MovieInRedis
        var movieInRedis = _mapper.Map<MovieInRedis>(movie);
        // var dto = _mapper.Map<MovieInRedisDto>(movieInRedis);


        // Store data separately for each movie
        var key = $"movies:{movie.Title.ToLower().Replace(" ", "_")}";
        await _redis.SetMovieDataAsync(key, movieInRedis, TimeSpan.FromDays(1));


        // add data in redis cache
        // await _redis.SetMovieDataAsync("movies:data", movies, TimeSpan.FromMinutes(30));

        Console.WriteLine($"\n ======== {DateTime.Now} Seeded Redis Cache ======== \n");

        _logger.LogInformation("Seeded Redis cache with initial movie data.");
    }
}
