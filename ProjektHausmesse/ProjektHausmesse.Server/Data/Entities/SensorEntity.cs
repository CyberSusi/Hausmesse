using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.Data.Configuration;

namespace ProjektHausmesse.Server.Data;

[EntityTypeConfiguration(typeof(SensorEntityConfiguration))]
public class SensorEntity
{
    public int Id { get; set; }
    public int? ContainerId { get; set; }
    public required string HardwareId { get; set; }

    public string? Name { get; set; }

    public decimal? CurDistance { get; set; }
    public decimal? MaxDistance { get; set; }
    public DateTime? LastUpdate { get; set; }

    public ContainerEntity Container { get; set; }
    public List<MeasurementEntity>? Measurements { get; set; }
}