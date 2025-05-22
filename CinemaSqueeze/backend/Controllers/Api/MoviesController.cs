using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CinemaSqueeze.DTOs;
using CinemaSqueeze.Services;
using System.Text.Json;
using CinemaSqueeze.Interfaces;

namespace CinemaSqueeze.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IRedisCacheService _redis;
        ILogger<MoviesController> _logger;
        public MoviesController(IRedisCacheService redis, ILogger<MoviesController> logger)
        {
            _redis = redis;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movies = new List<MovieInRedis>();

            try
            {
                // Get all keys in Redis cache
                var movieKeys = await _redis.GetKeysAsync("movie:*"); // You need to implement GetKeysAsync in IRedisCacheService

                foreach (var key in movieKeys)
                {
                    var movie = await _redis.GetMoviesInRedisAsync(key);


                    if (movie != null && !string.IsNullOrEmpty(movie.ToString()))
                    {
                        movies.Add(movie);
                    }
                    else
                    {
                        _logger.LogInformation($"\n ======== {DateTime.Now} No movie found for key: {key} ======== \n");
                    }
                }

                if (movies.Count == 0)
                {
                    return NotFound("Movie not found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"\n ======== {DateTime.Now} Exception: {ex.Message} ======== \n");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
            return Ok(movies);
        }

        [HttpGet("{title}")]
        public async Task<IActionResult> GetByTitle(string title)
        {
            // Normalize the title to match the Redis key format
            title = title.Replace(" ", "_").ToLower();
            var movie = await _redis.GetMoviesInRedisAsync($"movie:{title}");

            if (movie == null)
            {
                return NotFound("Movie not found");
            }

            return Ok(movie);
        }
    }
}
