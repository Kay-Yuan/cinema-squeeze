using System;
using CinemaSqueeze.Interfaces;
using Hangfire;

namespace CinemaSqueeze.Services;

public class SelfReschedulingJob
{
    private readonly IMovieService _movieService;

    public SelfReschedulingJob(IMovieService movieService)
    {
        _movieService = movieService;
    }

    public async Task Run()
    {
        await _movieService.FetchAndCacheMoviesAsync();
        BackgroundJob.Schedule<SelfReschedulingJob>(job => job.Run(), TimeSpan.FromSeconds(250));
    }
}

