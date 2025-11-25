using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Sensor;
using ProjektHausmesse.Server.Services.Mapper;

namespace ProjektHausmesse.Server.Services;

public class SensorService(ApplicationDbContext dbContext)
{
    // Alle Sensoren der Datenbank werden abgerufen und über den Mapper in ein
    // für den Client verwertbares Model verwandelt
    public async Task<List<SensorView>> GetSensors()
    {
        return (
            await dbContext
                .Sensors.Include(q => q.Measurements)
                .ToListAsync()
        )
            .Select(SensorMapper.Map)
            .ToList();
    }

    public async Task<SensorEntity?> GetSensorById(int sensorId)
    {
        return await dbContext.Sensors.FirstOrDefaultAsync(q => q.Id == sensorId);
    }

    public async Task<SensorEntity?> GetSensorByHardwareId(string hardwareId)
    {
        return await dbContext.Sensors.FirstOrDefaultAsync(q => q.HardwareId == hardwareId);
    }

    // Es wird geprüft, ob bereits ein Sensor mit dem Namen aus dem Formular existiert. Wenn
    // der Name nicht ausgefüllt wurde, wird die hardewareId, welche immer gesetzt ist geprüft
    public async Task<SensorEntity?> GetExisting(SensorForm form)
    {
        return form.Name != null
            ? await dbContext
                .Sensors.Where(q =>
                    q.Name != null && q.Name.ToLower() == form.Name.Trim().ToLower()
                    || q.HardwareId == form.HardwareId
                )
                .FirstOrDefaultAsync()
            : await dbContext.Sensors.FirstOrDefaultAsync(q => q.HardwareId == form.HardwareId);
    }
}
