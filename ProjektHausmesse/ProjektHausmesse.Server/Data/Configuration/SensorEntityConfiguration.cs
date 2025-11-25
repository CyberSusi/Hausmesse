using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProjektHausmesse.Server.Data.Configuration;

public class SensorEntityConfiguration : IEntityTypeConfiguration<SensorEntity>
{
    public void Configure(EntityTypeBuilder<SensorEntity> builder)
    {
        builder
            .HasOne<ContainerEntity>(e => e.Container)
            .WithOne(e => e.Sensor)
            .HasForeignKey<SensorEntity>(e => e.ContainerId)
            .HasPrincipalKey<ContainerEntity>(e => e.Id);
    }
}