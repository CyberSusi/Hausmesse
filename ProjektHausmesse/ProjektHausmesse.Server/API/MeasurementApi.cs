using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.Measurement;
using ProjektHausmesse.Server.Services;
using ProjektHausmesse.Server.Startup;

namespace ProjektHausmesse.Server.API;

public static class MeasurementApi
{
    public static void UseMeasurementApi(this WebApplication app)
    {
        app.MapGet("/api/measurements/{id:int}", GetMeasurements);
        app.MapGet("/api/measurements/check", CheckAuth).PolicySensor();
        app.MapPost("/api/measurements", AddMeasurement).PolicySensor();
    }

    private static async Task<Ok<List<MeasurementEntity>>> GetMeasurements(
        ApplicationDbContext dbContext,
        MeasurementService service,
        [FromRoute] int id,
        int? limit
    ) => TypedResults.Ok(await service.GetMeasurements(id, Math.Min(limit ?? 20, 200)));

    private static async Task<Results<NoContent, BadRequest>> AddMeasurement(
        ApplicationDbContext dbContext,
        MeasurementService service,
        [FromBody] MeasurementForm form
    ) => await service.AddMeasurement(form) ? TypedResults.NoContent() : TypedResults.BadRequest();

    private static Task<NoContent> CheckAuth() => Task.FromResult(TypedResults.NoContent());
}
