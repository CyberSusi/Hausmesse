using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Sensor;
using ProjektHausmesse.Server.Services;
using ProjektHausmesse.Server.Startup;

namespace ProjektHausmesse.Server.API;

public static class SensorApi
{
    public static void UseSensorApi(this WebApplication app)
    {
        app.MapGet("api/sensors", GetSensors);
        app.MapGet("api/sensors/{id:int}", GetSensorById);

        app.MapPost("api/sensors", CreateSensor).PolicyAdmin();
        app.MapPut("api/sensors/{id:int}", UpdateSensor).PolicyAdmin();
        app.MapDelete("api/sensors/{id:int}", DeleteSensor).PolicyAdmin();
    }

    private static async Task<Ok<List<SensorView>>> GetSensors(
        ApplicationDbContext dbContext, SensorService service
    ) => TypedResults.Ok(await service.GetSensors());

    private static async Task<Results<NoContent, BadRequest>> CreateSensor(
        ApplicationDbContext dbContext, SensorService service, [FromBody] SensorForm form)
    {
        var existing = await service.GetExisting(form);
        if (existing != null)
        {
            return TypedResults.BadRequest();
        }

        var entry = new SensorEntity
        {
            Name = form.Name?.Trim(),
            ContainerId = form.ContainerId,
            HardwareId = form.HardwareId,
            CurDistance = 0,
            MaxDistance = form.MaxDistance,
        };

        await dbContext.Sensors.AddAsync(entry);
        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<Results<Ok<SensorEntity>, BadRequest>> GetSensorById(
        ApplicationDbContext dbContext, SensorService service, [FromRoute] int id)
    {
        var sensor = await service.GetSensorById(id);
        if (sensor == null)
        {
            return TypedResults.BadRequest();
        }

        return TypedResults.Ok(sensor);
    }

    private static async Task<Results<NoContent, BadRequest>> UpdateSensor(
        ApplicationDbContext dbContext, SensorService service, [FromRoute] int id, [FromBody] SensorForm form)
    {
        var existing = await service.GetExisting(form);
        if (existing == null)
        {
            return TypedResults.BadRequest();
        }

        existing.Name = form.Name;
        existing.ContainerId = form.ContainerId;
        existing.HardwareId = form.HardwareId;
        existing.MaxDistance = form.MaxDistance;
        existing.CurDistance = form.CurDistance;

        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, BadRequest>> DeleteSensor(
        ApplicationDbContext dbContext, SensorService service, [FromRoute] int id)
    {
        var entry = await service.GetSensorById(id);
        if (entry == null)
        {
            return TypedResults.BadRequest();
        }

        dbContext.Remove(entry);
        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }
}