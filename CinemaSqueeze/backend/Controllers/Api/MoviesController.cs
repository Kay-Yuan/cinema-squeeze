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

        public MoviesController(IRedisCacheService redis)
        {
            _redis = redis;
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
                        Console.WriteLine($"\n ======== {DateTime.Now} No movie found for key: {key} ======== \n");
                    }
                }

                if (movies.Count == 0)
                {
                    return NotFound("Movie not found");
                }

                Console.WriteLine($"\n ======== Get Redis Cache ======== \n");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n ======== {DateTime.Now} Exception: {ex.Message} ======== \n");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
            return Ok(movies);

            // return Ok("movies");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var movie = await _redis.GetMoviesInRedisAsync($"movie:{id}");

            if (movie == null)
            {
                return NotFound("Movie not found");
            }

            Console.WriteLine($"\n ======== Get Redis Cache ======== \n");
            return Ok(movie);
        }
    }
}
