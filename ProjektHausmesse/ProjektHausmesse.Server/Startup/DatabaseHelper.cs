using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.Data;

namespace ProjektHausmesse.Server.Startup;

public static class DatabaseHelper
{
    // Zugriff auf die Datenbank wird über den "context" erstellt, da dort ggf. die initialen
    // Werte eingetragen werden müssen
    public static async Task DatabaseStartupContent(this WebApplication app)
    {
        using var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

        await AddAdminRole(context);
        await AddAdminUser(context, userManager);
    }

    // Die Admin Rolle muss es immer geben
    private static async Task AddAdminRole(ApplicationDbContext context)
    {
        var adminRole = await context.Roles.FirstOrDefaultAsync(q => q.Name == Auth.Roles.Admin);
        if (adminRole == null)
        {
            Console.WriteLine("admin role null");
            await context.Roles.AddAsync(
                new IdentityRole
                {
                    Name = Auth.Roles.Admin,
                    NormalizedName = Auth.Roles.Admin.ToUpper(),
                }
            );
            await context.SaveChangesAsync();
        }
    }

    // Einen Admin Benutzer muss es immer geben
    private static async Task AddAdminUser(
        ApplicationDbContext context,
        UserManager<IdentityUser> userManager
    )
    {
        const string password = "Kürbiskernsuppe";
        var adminUser = await userManager.FindByNameAsync("admin");
        if (adminUser != null)
        {
            return;
        }

        var newUser = new IdentityUser
        {
            UserName = "admin",
            Email = "containeradmin@example.com",
            EmailConfirmed = true,
            LockoutEnabled = false,
        };

        HandleErrors(await userManager.CreateAsync(newUser, password));
        HandleErrors(await userManager.AddToRoleAsync(newUser, Auth.Roles.Admin));
        await context.SaveChangesAsync();
    }

    private static void HandleErrors(IdentityResult result)
    {
        if (result.Succeeded)
            return;

        Console.WriteLine(result.ToString());
        throw new InvalidOperationException("Errors during database bootstrap: " + result);
    }
}
