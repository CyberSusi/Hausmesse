using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace ProjektHausmesse.Server;

public class SensorAuthRequirement : IAuthorizationRequirement;

public class SensorAuthHandler(IOptions<SensorOptions> options)
    : AuthorizationHandler<SensorAuthRequirement>
{
    private readonly SensorOptions _options = options.Value;

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SensorAuthRequirement requirement
    )
    {
        if (context.Resource is not HttpContext httpContext)
            return Task.CompletedTask;

        var authHeader = httpContext.Request.Headers.Authorization.ToString();
        if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return Task.CompletedTask;

        var token = authHeader["Bearer ".Length..].Trim();
        if (token != _options.AuthToken)
            return Task.CompletedTask;

        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
