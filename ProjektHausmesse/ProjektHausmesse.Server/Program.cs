using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.API;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Services;
using ProjektHausmesse.Server.Startup;

namespace ProjektHausmesse.Server;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.AddDbContext();
        builder.ConfigureServices();

        var app = builder.Build();
        app.ConfigureApp();

        await app.ApplyMigrationsAsync();
        await app.DatabaseStartupContent();
        await app.RunAsync();
    }

    // alle benötigten Services werden registriert, unter Anderem alles was mit der Authentifizierung und
    // Autorisierung zu tun hat, wir verwenden dafür das JWT-Bearer Token
    private static void ConfigureServices(this WebApplicationBuilder builder)
    {
        var services = builder.Services;

        services.AddCors(config =>
            config.AddDefaultPolicy(policy =>
                policy
                    .WithOrigins("https://localhost:65298")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
            )
        );

        services.AddSpaStaticFiles(config => config.RootPath = "ProjektHausmesse.Client/dist");
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddAuthentication().AddJwtBearer();
        services.AddAuthorization().AddAuthorizationBuilder().AddAuthorizationPolicies();
        services
            .AddIdentityApiEndpoints<IdentityUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
        services.Configure<IdentityOptions>(config => config.Password.RequireDigit = false);

        services.AddOptions<SensorOptions>().BindConfiguration(nameof(SensorOptions));
        services.AddSingleton<IAuthorizationHandler, SensorAuthHandler>();

        services.AddTransient<ContainerService>();
        services.AddTransient<SensorService>();
        services.AddTransient<MeasurementService>();
        services.AddTransient<UserService>();
    }

    private static void ConfigureApp(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapSwagger();
            app.UseSwaggerUI();
            app.UseWhen(
                context => !context.IsServerRoute(),
                configuration => configuration.UseSpaProxy()
            );
        }
        else
        {
            app.UseForwardedHeaders(
                new ForwardedHeadersOptions
                {
                    ForwardedHeaders =
                        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
                }
            );
            app.UseWhen(
                context => !context.IsServerRoute(),
                configuration => configuration.UseSpa(_ => { })
            );
        }

        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseSpaStaticFiles();
        app.UseHttpsRedirection();

        app.UseApi();
    }

    private static void AddDbContext(this WebApplicationBuilder builder)
    {
        var path = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var connectionString = $"Data Source={Path.Join(path, "ProjektHausmesse.db")}";

        builder.Services.AddDbContext<ApplicationDbContext>(
            opt =>
            {
                opt.UseSqlite(connectionString);
                if (builder.Environment.IsDevelopment())
                    opt.EnableSensitiveDataLogging();
            },
            optionsLifetime: ServiceLifetime.Singleton
        );
        builder.Services.AddDbContextFactory<ApplicationDbContext>(opt =>
        {
            opt.UseSqlite(connectionString);
            if (builder.Environment.IsDevelopment())
                opt.EnableSensitiveDataLogging();
        });
    }

    private static async Task ApplyMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
        await scope
            .ServiceProvider.GetRequiredService<ApplicationDbContext>()
            .Database.MigrateAsync();
    }
}
