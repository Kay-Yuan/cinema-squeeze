using System;
using CinemaSqueeze.DTOs;

namespace CinemaSqueeze.Interfaces;

public interface IRedisCacheService
{
    public Task SetMovieDataAsync(string key, MovieInRedis value, TimeSpan? expiry = null);
    public Task<MovieInRedis?> GetMoviesInRedisAsync(string key);

    public Task<IEnumerable<string>> GetKeysAsync(string pattern);
    // Task<bool> ExistsAsync(string key);
    // Task RemoveAsync(string key);
}
