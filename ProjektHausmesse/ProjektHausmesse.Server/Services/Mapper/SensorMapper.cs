using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Sensor;

namespace ProjektHausmesse.Server.Services.Mapper;

public static class SensorMapper
{
    public static SensorView Map(SensorEntity entity) =>
        new()
        {
            Id = entity.Id,
            Name = entity.Name,
            HardwareId = entity.HardwareId,
            CurDistance = entity.CurDistance,
            MaxDistance = entity.MaxDistance,
            LastUpdate = entity.LastUpdate,
            Measurements = entity.Measurements?.Select(MeasurementMapper.Map).ToList() ?? [],
        };

    public static SensorView? MapFlat(SensorEntity? entity) =>
        entity == null
            ? null
            : new SensorView
            {
                Id = entity.Id,
                Name = entity.Name,
                HardwareId = entity.HardwareId,
                CurDistance = entity.CurDistance,
                MaxDistance = entity.MaxDistance,
                LastUpdate = entity.LastUpdate,
                Measurements = [],
            };
}