using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Measurement;

namespace ProjektHausmesse.Server.Services;

public class MeasurementService(ApplicationDbContext dbContext, SensorService sensorService)
{
    // Alle Messungen aus der Datenbank werden abgerufen, mit dem Zusatz eines Limits
    public async Task<List<MeasurementEntity>> GetMeasurements(int id, int limit)
    {
        return await dbContext
            .Measurements.Where(e => e.SensorId == id)
            .OrderByDescending(e => e.Date)
            .Take(limit)
            .ToListAsync();
    }

    // Eine Messung kann der Datenbank durch ein Formular hinzugefügt werden.
    public async Task<bool> AddMeasurement(MeasurementForm form)
    {
        var sensor = await sensorService.GetSensorByHardwareId(form.HardwareId);
        if (sensor == null)
            return false;

        var entry = new MeasurementEntity
        {
            SensorId = sensor.Id,
            Date = DateTime.Now,
            Distance = form.Distance,
        };

        sensor.LastUpdate = entry.Date;
        sensor.CurDistance = entry.Distance;

        await dbContext.Measurements.AddAsync(entry);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
