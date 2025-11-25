namespace ProjektHausmesse.Server.Startup;

public static class PolicyAuthorizationEndpointConventionExtensions
{
    public static TBuilder PolicyAdmin<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder =>
        builder.RequireAuthorization(Auth.Policies.Admin);

    public static TBuilder PolicySensor<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder =>
        builder.RequireAuthorization(Auth.Policies.Sensor);
}
