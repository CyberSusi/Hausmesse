namespace ProjektHausmesse.Server.Models.Measurement;

public class MeasurementForm
{
    public required string HardwareId { get; set; }
    public required decimal Distance { get; set; }
}