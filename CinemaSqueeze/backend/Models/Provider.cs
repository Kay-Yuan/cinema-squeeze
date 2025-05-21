using System;

namespace CinemaSqueeze.DTOs;

public class Provider
{
    public required string MovieId { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }

    //used to store the last update time of the provider in redis
    public DateTime LastUpdate { get; set; }

}
