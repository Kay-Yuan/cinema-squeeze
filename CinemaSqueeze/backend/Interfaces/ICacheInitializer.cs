using System;

namespace CinemaSqueeze.Interfaces;

public interface ICacheInitializer
{
    Task SeedAsync();
}   
