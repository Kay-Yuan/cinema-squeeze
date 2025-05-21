using CinemaSqueeze.DTOs;
using Xunit;


namespace CinemaSqueeze.Tests;

public class MovieServiceTests
{
    [Fact]
    public void GetMovieTitle_ReturnsCorrectTitle()
    {
        // Arrange
        var movie = new MovieInId
        {
            Title = "Star Wars: Episode IV - A New Hope",
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
            Price = 123.5m
        };

        // Act
        var result = movie.Title;

        // Assert
        Assert.Equal("Inception", result);
    }
}

