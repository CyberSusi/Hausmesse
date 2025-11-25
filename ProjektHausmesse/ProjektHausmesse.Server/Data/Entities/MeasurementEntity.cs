using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.Data.Configuration;

namespace ProjektHausmesse.Server.Data;

[EntityTypeConfiguration(typeof(MeasurementEntityConfiguration))]
public class MeasurementEntity
{
    public int Id { get; set; }
    public required int SensorId { get; set; }
    public required DateTime Date { get; set; }
    public required decimal Distance { get; set; }

    public SensorEntity? Sensor { get; set; }
}