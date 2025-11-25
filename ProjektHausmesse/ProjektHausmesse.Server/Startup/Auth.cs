using Microsoft.AspNetCore.Authorization;

namespace ProjektHausmesse.Server.Startup;

public static class Auth
{
    public static class Policies
    {
        public const string Admin = "admin";
        public const string Sensor = "sensor";
    }

    public static class Roles
    {
        public const string Admin = "admin";
    }

    public static void AddAuthorizationPolicies(this AuthorizationBuilder builder) =>
        builder
            .AddPolicy(Policies.Admin, p => p.RequireRole(Roles.Admin))
            .AddPolicy(Policies.Sensor, p => p.AddRequirements(new SensorAuthRequirement()));
}
