using StackExchange.Redis;
using Microsoft.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System;
using CinemaSqueeze.Interfaces;
using CinemaSqueeze.DTOs;
using CinemaSqueeze.Models;
using AutoMapper;
using System.Globalization;
using Microsoft.Extensions.Options;
using CinemaSqueeze.Configurations;

namespace CinemaSqueeze.Services;

public class MovieService : IMovieService
{
    private readonly IConnectionMultiplexer _redisConnection;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<MovieService> _logger;
    private readonly IMapper _mapper;
    private readonly IConfiguration _config;

    public MovieService(
        IConnectionMultiplexer redisConnection,
        IHttpClientFactory httpClientFactory,
        ILogger<MovieService> logger,
        IMapper mapper,
        IConfiguration config)
    {
        _redisConnection = redisConnection;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _mapper = mapper;
        _config = config;
    }

    public async Task FetchAndCacheMoviesAsync()
    {
        var httpClient = _httpClientFactory.CreateClient();
        var _db = _redisConnection.GetDatabase();
        var moviesApiKey = _config["Movies:ServiceApiKey"];
        var moviesApiBaseUrl = _config["Movies:ServiceApiBaseUrl"];


        // Movie provider URLs (Assuming both providers return a JSON array of movie objects)
        var providerUrls = new[] {
            $"{moviesApiBaseUrl}/cinemaworld/movies",
            $"{moviesApiBaseUrl}/filmworld/movies"
             };

        // Attempt to fetch data from both providers
        foreach (var url in providerUrls)
        {
            var segments = new Uri(url).Segments;
            string providerName = segments.Length >= 3 ? CultureInfo.CurrentCulture.TextInfo.ToTitleCase(segments[2].TrimEnd('/')) : "Not known provider";
            var retryCount = 0;
            var success = false;

            while (retryCount < 2 && !success)
            {
                try
                {
                    // Create and configure HttpClient with headers
                    var request = new HttpRequestMessage(HttpMethod.Get, url);
                    request.Headers.Add("x-access-token", moviesApiKey);
                    //request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", "your-token");

                    // Send request and get the response
                    // httpClient.Timeout = TimeSpan.FromSeconds(8);
                    var response = await httpClient.SendAsync(request);
                    var movies = new List<MovieInMovies>();

                    if (response.IsSuccessStatusCode)
                    {
                        // Deserialize response content
                        var res = await response.Content.ReadFromJsonAsync<MoviesResponse>();
                        movies = res?.Movies;

                        if (movies == null || movies.Count == 0)
                        {
                            _logger.LogWarning("No movies found in the response from {url}", url);
                            break;
                        }

                        // Store data separately for each movie in Redis
                        foreach (var movie in movies)
                        {
                            var key = $"movie:{movie.Title.ToLower().Replace(" ", "_")}";

                            try
                            {
                                // Create and configure HttpClient with headers
                                var request_movie = new HttpRequestMessage(HttpMethod.Get, url[..^1] + $"/{movie.Id}");
                                request_movie.Headers.Add("x-access-token", moviesApiKey);
                                //request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", "your-token");

                                // Send request and get the response. Set per-request timeout
                                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                                using var response_movie = await httpClient.SendAsync(request_movie, cts.Token);

                                if (response_movie.StatusCode != System.Net.HttpStatusCode.OK)
                                {
                                    _logger.LogWarning("Skipping movie {MovieTitle}: received status {StatusCode}", movie.Title, response.StatusCode);
                                    continue;
                                }

                                // Deserialize response content
                                var res_movie = await response_movie.Content.ReadFromJsonAsync<MovieInId>();

                                if (res_movie != null)
                                {
                                    // Map the movie object to MovieInRedis
                                    var res_movie_Redis = _mapper.Map<MovieInRedis>(res_movie);

                                    // Check if the movie already exists in Redis
                                    var keyIsExists = await _db.KeyExistsAsync(key);
                                    if (keyIsExists)
                                    {
                                        // If it exists, update the existing movie data price
                                        var existingMovie = await _db.StringGetAsync(key);
                                        var existingMovieObj = JsonSerializer.Deserialize<MovieInRedis>(existingMovie!);

                                        // Check if the provider already exists
                                        if (existingMovieObj!.Providers != null)
                                        {
                                            var provider = existingMovieObj.Providers.FirstOrDefault(p => p.Name.Equals(providerName, StringComparison.OrdinalIgnoreCase));

                                            if (provider != null)
                                            {
                                                // Update the provider, focus on price and last update for now
                                                provider.Price = res_movie.Price;
                                                provider.LastUpdate = DateTime.Now;
                                            }
                                            else
                                            {
                                                // Add the provider if not found
                                                var updatedProviders = existingMovieObj.Providers.ToList();
                                                updatedProviders.Add(new Provider
                                                {
                                                    Name = providerName,
                                                    MovieId = res_movie.Id,
                                                    Price = res_movie.Price,
                                                    LastUpdate = DateTime.Now
                                                });
                                                existingMovieObj.Providers = updatedProviders;
                                            }
                                        }
                                        else
                                        {
                                            // If Providers is null, initialize it
                                            existingMovieObj!.Providers = new List<Provider>
                                            {
                                                new Provider
                                                {
                                                    Name = providerName,
                                                    MovieId = res_movie.Id,
                                                    Price = res_movie.Price,
                                                    LastUpdate = DateTime.Now
                                                }
                                            };
                                        }

                                        // Update Redis with the modified movie object
                                        var json_movie = JsonSerializer.Serialize(existingMovieObj);
                                        await _db.StringSetAsync(key, json_movie, TimeSpan.FromDays(1));
                                        _logger.LogInformation("Updated movie {MovieTitle} in Redis with new provider {ProviderName}", res_movie.Title, providerName);
                                    }
                                    else
                                    {
                                        // Key/Movie not found, create a new one
                                        res_movie_Redis.Providers = new List<Provider>
                                        {
                                            new Provider
                                            {
                                                Name = providerName,
                                                MovieId = res_movie.Id,
                                                Price = res_movie.Price,
                                                LastUpdate = DateTime.Now
                                            }
                                        };
                                        var json_movie = JsonSerializer.Serialize(res_movie_Redis);

                                        // Store the new movie object in Redis
                                        await _db.StringSetAsync(key, json_movie, TimeSpan.FromDays(1));
                                        _logger.LogInformation("Stored new movie {MovieTitle} in Redis with provider {Url}", res_movie.Title, url);
                                    }


                                }

                            }
                            catch (TaskCanceledException)
                            {
                                // Skipped due to timeout
                                _logger.LogWarning("Request for movie {MovieTitle} timed out. Skipping.", movie.Title);
                                continue;
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError("Error storing movie {MovieTitle} in Redis: {Message}", movie.Title, ex.Message);
                            }
                        }

                        // Successfully fetched and cached movies for this provider
                        success = true;
                    }
                    else
                    {
                        // Handle unsuccessful response
                        _logger.LogError("Request failed: {StatusCode} - from Provider {Provider}", response.StatusCode, url);
                        retryCount++;
                    }
                }
                catch (Exception ex)
                {
                    retryCount++;
                    _logger.LogError("Error fetching movies from {url}. Attempt {retryCount} failed. Exception: {ex.Message}", url, retryCount, ex.Message);

                    // Retry after 2 seconds if an exception occurs
                    await Task.Delay(2000);
                }

                if (success) break; // If fetching succeeds, break out of the loop.

                if (!success)
                {
                    if (retryCount >= 2)
                    {
                        // Log the failure after 2 attempts
                        _logger.LogError("Failed to fetch and cache movies after 2 attempts.");
                    }
                    else
                    {
                        // Log the failure after each attempt
                        _logger.LogWarning("Retrying to fetch movies from {url}. Attempt {retryCount} failed.", url, retryCount);
                        break; // Exit the loop if all attempts fail
                    }
                }
            }

        }

    }

    // private async void UpdateRedisCache(string key, MovieInMovies movie, string providerName, string url, IDatabase _db, HttpClient httpClient, HttpResponseMessage response)
    // {

    // }
}

