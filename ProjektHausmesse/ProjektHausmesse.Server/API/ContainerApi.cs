using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Container;
using ProjektHausmesse.Server.Services;
using ProjektHausmesse.Server.Startup;

namespace ProjektHausmesse.Server.API;

public static class ContainerApi
{
    public static void UseContainerApi(this WebApplication app)
    {
        app.MapGet("api/containers", GetContainers);
        app.MapGet("api/containers/{id:int}", GetContainerById);

        app.MapPost("api/containers", CreateContainer).PolicyAdmin();
        app.MapPut("api/containers/{id:int}", UpdateContainer).PolicyAdmin();
        app.MapDelete("api/containers/{id:int}", DeleteContainer).PolicyAdmin();
    }

    private static async Task<Ok<List<ContainerView>>> GetContainers(
        ApplicationDbContext dbContext,
        ContainerService service,
        [AsParameters] ContainerSearchForm search
    ) => TypedResults.Ok(await service.GetContainers(search));

    private static async Task<Results<NoContent, BadRequest>> CreateContainer(
        ApplicationDbContext dbContext,
        ContainerService containerService,
        SensorService sensorService,
        [FromBody] ContainerForm form
    )
    {
        var existing = await containerService.GetExisting(form);
        if (existing != null)
        {
            // specified sensor is in use or a container with specified name already exists
            return TypedResults.BadRequest();
        }

        var sensor = await sensorService.GetSensorById(form.SensorId);
        if (sensor == null)
        {
            return TypedResults.BadRequest();
        }

        var entry = new ContainerEntity
        {
            Name = form.Name.Trim(),
            Position = new Position { Latitude = form.Latitude, Longitude = form.Longitude },
            Sensor = sensor,
        };

        await dbContext.Containers.AddAsync(entry);
        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<Results<Ok<ContainerEntity>, BadRequest>> GetContainerById(
        ApplicationDbContext dbContext,
        ContainerService service,
        [FromRoute] int id
    )
    {
        var container = await service.GetContainerById(id);
        if (container == null)
        {
            return TypedResults.BadRequest();
        }

        return TypedResults.Ok(container);
    }

    private static async Task<Results<NoContent, BadRequest>> UpdateContainer(
        ApplicationDbContext dbContext,
        ContainerService containerService,
        SensorService sensorService,
        [FromRoute] int id,
        [FromBody] ContainerForm form
    )
    {
        var existing = await containerService.GetContainerById(id);
        if (existing == null)
        {
            return TypedResults.BadRequest();
        }

        var sensor = await sensorService.GetSensorById(form.SensorId);
        if (sensor == null)
        {
            return TypedResults.BadRequest();
        }

        existing.Name = form.Name;
        existing.Sensor = sensor;
        existing.Position = new Position { Latitude = form.Latitude, Longitude = form.Longitude };

        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, BadRequest>> DeleteContainer(
        ApplicationDbContext dbContext,
        ContainerService service,
        [FromRoute] int id
    )
    {
        var entry = await service.GetContainerById(id);
        if (entry == null)
        {
            return TypedResults.BadRequest();
        }

        dbContext.Remove(entry);
        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }
}
