using System;

namespace CinemaSqueeze.DTOs;

public class MovieInRedisDto
{
    public required string Title { get; set; }
    public decimal CheapestPrice { get; set; }
    public required string CheapestProvider { get; set; }
    public DateTime LastUpdate { get; set; }
}
