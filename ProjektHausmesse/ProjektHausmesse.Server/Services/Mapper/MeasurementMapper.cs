using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Sensor;

namespace ProjektHausmesse.Server.Services.Mapper;

public static class MeasurementMapper
{
    public static MeasurementView Map(MeasurementEntity entity) =>
        new() { Date = entity.Date, Distance = entity.Distance };
}