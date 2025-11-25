namespace ProjektHausmesse.Server;

public static class HttpContextExtensions
{
    public static bool IsServerRoute(this HttpContext context) =>
        context.Request.Path.StartsWithSegments("/api")
        || context.Request.Path.StartsWithSegments("/swagger");
}
