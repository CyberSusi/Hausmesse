using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Container;

namespace ProjektHausmesse.Server.Services.Mapper;

public static class ContainerMapper
{
    public static ContainerView Map(ContainerEntity entity) =>
        new()
        {
            Id = entity.Id,
            Name = entity.Name,
            Position = entity.Position,
            Sensor = SensorMapper.MapFlat(entity.Sensor),
        };
}