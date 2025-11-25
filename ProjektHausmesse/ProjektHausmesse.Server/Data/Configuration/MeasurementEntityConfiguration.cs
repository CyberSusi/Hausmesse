using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProjektHausmesse.Server.Data.Configuration;

public class MeasurementEntityConfiguration : IEntityTypeConfiguration<MeasurementEntity>
{
    public void Configure(EntityTypeBuilder<MeasurementEntity> builder)
    {
        builder
            .HasOne<SensorEntity>(e => e.Sensor)
            .WithMany(e => e.Measurements)
            .HasForeignKey(e => e.SensorId)
            .HasPrincipalKey(e => e.Id);
    }
}