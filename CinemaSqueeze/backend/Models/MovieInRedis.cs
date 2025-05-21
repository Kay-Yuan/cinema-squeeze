using System;

namespace CinemaSqueeze.DTOs;

public class MovieInRedis
{
    public required string Title { get; set; }
    public int Year { get; set; }
    public string? Rated { get; set; }
    public string? Released { get; set; }
    public required string Runtime { get; set; }
    public required string Genre { get; set; }
    public required string Director { get; set; }
    public required string Writer { get; set; }
    public required string Actors { get; set; }
    public required string Plot { get; set; }
    public required string Language { get; set; }
    public required string Country { get; set; }
    public required string? Awards { get; set; }
    public required string? Poster { get; set; }
    public int? Metascore { get; set; }
    public decimal? Rating { get; set; }
    public string? Votes { get; set; }
    public required string Type { get; set; }

    public List<Provider>? Providers { get; set; }

    public required DateTime LastUpdate { get; set; }
}
