using Microsoft.AspNetCore.Identity;
using ProjektHausmesse.Server.Startup;

namespace ProjektHausmesse.Server.API;

public static class ApiExtensions
{
    public static void UseApi(this WebApplication app)
    {
        app.UseAuthApi();
        app.UseContainerApi();
        app.UseSensorApi();
        app.UseMeasurementApi();
        app.UseUserApi();
    }

    private static void UseAuthApi(this WebApplication app)
    {
        var userApi = app.MapGroup("/api/user").WithTags("AuthAPI");
        userApi.MapIdentityApi<IdentityUser>();
        userApi.MapGet("/check", TypedResults.NoContent).PolicyAdmin();
    }
}
