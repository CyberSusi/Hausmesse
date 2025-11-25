using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Container;
using ProjektHausmesse.Server.Services.Mapper;

namespace ProjektHausmesse.Server.Services;

public class ContainerService(ApplicationDbContext dbContext)
{
    // Container aus der Datenbank werden abgerufen, mit dem Zusatz, dass man über den Namen eines Containers
    // diesen finden kann 
    public async Task<List<ContainerView>> GetContainers(ContainerSearchForm search)
    {
        var query = dbContext.Containers.Include(q => q.Sensor).AsQueryable();
        if (search.Name is not null)
            query = query.Where(q => EF.Functions.Like(q.Name, $"%{search.Name}%"));

        return (await query.ToListAsync()).Select(ContainerMapper.Map).ToList();
    }

    public async Task<ContainerEntity?> GetContainerById(int containerId)
    {
        return await dbContext.Containers.FirstOrDefaultAsync(q => q.Id == containerId);
    }

    // 
    public async Task<ContainerEntity?> GetExisting(ContainerForm form)
    {
        return await dbContext
            .Containers.Include(q => q.Sensor)
            .FirstOrDefaultAsync(q =>
                q.Name.ToLower() == form.Name.Trim().ToLower() || q.Sensor.Id == form.SensorId
            );
    }
}
