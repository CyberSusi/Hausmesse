namespace ProjektHausmesse.Server.Models.Sensor;

public record MeasurementView
{
    public required DateTime Date { get; init; }
    public required decimal Distance { get; init; }
}