using System;

namespace CinemaSqueeze.Configurations;

public class AppSettings
{
    public string RedisConnection { get; set; } = string.Empty;
    public string MovieApiKey { get; set; } = string.Empty;
}
