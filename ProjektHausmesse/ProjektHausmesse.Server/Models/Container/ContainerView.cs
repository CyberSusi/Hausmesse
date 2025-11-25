using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Sensor;

namespace ProjektHausmesse.Server.Models.Container;

public record ContainerView
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required Position Position { get; init; }
    public required SensorView? Sensor { get; init; }
}
