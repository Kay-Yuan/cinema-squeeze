using System;
using System.Text.Json;
using CinemaSqueeze.Interfaces;
using CinemaSqueeze.DTOs;
using StackExchange.Redis;

namespace CinemaSqueeze.Services;

public class RedisCacheService(IConnectionMultiplexer redis) : IRedisCacheService
{

    private readonly IDatabase _db = redis.GetDatabase();
    private readonly IConnectionMultiplexer _redis = redis;

    // TODO: change type to List<MovieInRedis>
    public async Task SetMovieDataAsync(string key, MovieInRedis value, TimeSpan? expiry = null)
    {
        Console.WriteLine($"\n ======== {DateTime.Now} Set Redis Cache start ======== \n");
        Console.WriteLine(value);
        Console.WriteLine($"\n ======== {DateTime.Now} Set Redis Cache end ======== \n");
        var json = JsonSerializer.Serialize(value);
        bool success = await _db.StringSetAsync(key, json, expiry);

        // // Log the result?
        // if (success)
        // {
        //     Console.WriteLine($"\n ======== {DateTime.Now} Redis Cache Set Successfully ======== \n");
        // }
        // else
        // {
        //     Console.WriteLine($"\n ======== {DateTime.Now} Redis Cache Set Failed ======== \n");
        // }
    }

    public async Task<MovieInRedis?> GetMoviesInRedisAsync(string key)
    {
        var res = await _db.StringGetAsync(key);
        if (res.IsNullOrEmpty)
        {
            return null;
        }

        Console.WriteLine($"\n ======== {DateTime.Now} Get Redis Cache ======== \n");
        Console.WriteLine(res.ToString());

        var movie = JsonSerializer.Deserialize<MovieInRedis>(res!);
        return movie;
    }

    public async Task<IEnumerable<string>> GetKeysAsync(string pattern)
    {
        var server = GetServer();
        return await Task.Run(() =>
        server.Keys(pattern: pattern)
              .Select(k => k.ToString())
              .ToList()); ;
    }

    private IServer GetServer()
    {
        // Assumes only one endpoint is configured
        var endpoint = _redis.GetEndPoints()[0];
        return _redis.GetServer(endpoint);
    }
}
