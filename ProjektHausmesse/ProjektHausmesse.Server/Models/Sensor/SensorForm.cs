namespace ProjektHausmesse.Server.Models.Sensor;

public class SensorForm
{
    public int? ContainerId { get; set; }
    public required string HardwareId { get; set; }

    public string? Name { get; set; }

    public decimal? CurDistance { get; set; }
    public decimal? MaxDistance { get; set; }
}