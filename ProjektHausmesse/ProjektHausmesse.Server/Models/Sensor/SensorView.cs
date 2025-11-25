namespace ProjektHausmesse.Server.Models.Sensor;

public record SensorView
{
    public int Id { get; init; }
    public required string HardwareId { get; init; }

    public string? Name { get; init; }

    public decimal? CurDistance { get; init; }
    public decimal? MaxDistance { get; init; }
    public DateTime? LastUpdate { get; init; }

    public required List<MeasurementView> Measurements { get; init; }
}