using Hangfire;
using StackExchange.Redis;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CinemaSqueeze.Interfaces;
using CinemaSqueeze.Services;
using Hangfire.MemoryStorage;
using CinemaSqueeze.DTOs;
using System.Reflection.Metadata.Ecma335;
using Hangfire.Redis.StackExchange;
using CinemaSqueeze.Profiles;
using CinemaSqueeze.Configurations;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection("AppSettings")
);
builder.Services.AddControllersWithViews();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));

//Cors config
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:3000") // frontend origin
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// Configure 1 Redis (shared for cache and Hangfire)
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect("localhost:6379") // adjust for your Redis setup
);

// Configure 2 distributed Redis cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "redis:6379";
    // options.InstanceName = "CinemaSqueeze:";
});

// configure 3 Register HttpClient + your background job service
builder.Services.AddHttpClient();
builder.Services.AddScoped<IMovieService, MovieService>();

// Add Hangfire services
builder.Services.AddHangfire(config =>
{
    // config.UseRedisStorage("localhost:6379"); // Uncomment if Hangfire.Redis is installed and configured
    config.UseMemoryStorage();  // Use in-memory storage for Hangfire jobs
});

builder.Services.AddHangfireServer();

//Register IMovieService in DI
builder.Services.AddScoped<IMovieService, MovieService>();
// Register RedisCacheService in DI
// builder.Services.AddScoped<RedisCacheService>();
builder.Services.AddScoped<IRedisCacheService, RedisCacheService>();

// Register ICacheInitializer in DI
// builder.Services.AddScoped<ICacheInitializer, CacheInitializer>();


//

var app = builder.Build();

// Use Hangfire Dashboard (Optional, for monitoring jobs)
app.UseHangfireDashboard();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// api test
// app.MapGet("/movies", () =>
// {
//     var movies = new[]
//     {
//         new MovieInMovies { Title = "Inception", Genre = "Sci-Fi", Year = 2010, ReleaseDate = DateTime.Now },
//         new MovieInMovies { Title = "The Matrix", Genre = "Action", Year = 1999, ReleaseDate = DateTime.Now },
//         new MovieInMovies { Title = "Interstellar", Genre = "Sci-Fi", Year = 2014, ReleaseDate = DateTime.Now },
//     };



//     return movies;
// });
// Specific route first
// app.MapControllerRoute(
//     name: "moviesRoute",
//     pattern: "movies/{action=Index}/{id?}",
//     defaults: new { controller = "Movies", action = "index" });


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

// Configure the cron job to run every 5 minutes
// Schedule the recurring job using a service scope
// RecurringJob.AddOrUpdate<IMovieService>(
//     "fetch-and-cache-movies", // recurringJobId
//     movieService => movieService.FetchAndCacheMoviesAsync(),
//     "*/10 * * * * *", // Cron expression for every 1 minute
//     new RecurringJobOptions());
BackgroundJob.Enqueue<SelfReschedulingJob>(job => job.Run());



app.MapControllers();


// Seed cache before app runs
// using (var scope = app.Services.CreateScope())
// {
//     var initializer = scope.ServiceProvider.GetRequiredService<ICacheInitializer>();
//     await initializer.SeedAsync();
// }

app.Run();
