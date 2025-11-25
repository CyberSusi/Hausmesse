using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.User;
using ProjektHausmesse.Server.Startup;

namespace ProjektHausmesse.Server.Services;

public class UserService(ApplicationDbContext context, UserManager<IdentityUser> userManager)
{
    // Alle Benutzer aus der Datenbank werden zurückgegeben, mit der Info ob
    // diese Admins sind oder nicht
    public async Task<List<UserListModel>> GetUsers()
    {
        var adminUsers = await userManager.GetUsersInRoleAsync(Auth.Roles.Admin);
        var adminIds = adminUsers.Select(q => q.Id);

        return await context.Users
            .Select(u => new UserListModel
            {
                Id = u.Id,
                Username = u.UserName,
                Email = u.Email,
                IsAdmin = adminIds.Contains(u.Id),
            })
            .OrderBy(u => u.Id)
            .ToListAsync();
    }

    // Für die Benutzerverwaltungsliste wird ein Benutzer ahand seiner ID gefunden
    public async Task<UserListModel?> GetUserEditView(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
        {
            return null;
        }

        return new UserListModel
        {
            Id = user.Id,
            Username = user.UserName,
            Email = user.Email,
        };
    }

    // Bevor ein Benutzer geupdated wird, muss geprüft werden, ob ein Benutzer mit dem neuen 
    // Namen oder der E-Mail existiert
    public async Task<IdentityUser?> UpdateUserExistingConflictUser(IdentityUser user, UserCreateForm form)
    {
        return await context.Users
            .Where(u => u.Id != user.Id)
            .FirstOrDefaultAsync(u =>
                u.UserName!.ToLower() == form.Username.Trim().ToLower() ||
                u.Email!.ToLower() == form.Email.Trim().ToLower());
    }
}