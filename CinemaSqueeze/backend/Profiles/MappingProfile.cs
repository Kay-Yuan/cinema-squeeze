using AutoMapper;
using CinemaSqueeze.DTOs;
using System.Linq;

namespace CinemaSqueeze.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Map from MovieInId to MovieInRedis
        CreateMap<MovieInId, MovieInRedis>()
            .ForMember(dest => dest.Providers, opt => opt.Ignore()) // You may populate this separately
            .ForMember(dest => dest.LastUpdate, opt => opt.MapFrom(_ => DateTime.Now));


        // Map from MovieInRedis to MovieInRedisDto
        CreateMap<MovieInRedis, MovieInRedisDto>()
            .ForMember(dest => dest.CheapestPrice,
                opt => opt.MapFrom(src =>
                    src.Providers != null && src.Providers.Any()
                        ? src.Providers.Min(p => p.Price)
                        : 0m)) // fallback to 0

            .ForMember(dest => dest.CheapestProvider,
                opt => opt.MapFrom(src =>
                    src.Providers != null && src.Providers.Any()
                        ? src.Providers.OrderBy(p => p.Price).First().Name
                        : "N/A")) // fallback to "N/A"

            .ForMember(dest => dest.Title,
                opt => opt.MapFrom(src => src.Title))

            .ForMember(dest => dest.LastUpdate,
                opt => opt.MapFrom(src => src.LastUpdate));




    }
}
