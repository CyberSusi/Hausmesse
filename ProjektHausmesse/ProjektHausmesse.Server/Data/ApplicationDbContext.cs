using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ProjektHausmesse.Server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<SensorEntity> Sensors { get; set; }
    public DbSet<ContainerEntity> Containers { get; set; }
    public DbSet<MeasurementEntity> Measurements { get; set; }
}
