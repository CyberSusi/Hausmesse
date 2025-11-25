using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjektHausmesse.Server.Data;
using ProjektHausmesse.Server.Models.User;
using ProjektHausmesse.Server.Services;
using ProjektHausmesse.Server.Startup;

namespace ProjektHausmesse.Server.API;

public static class UserApi
{
    public static void UseUserApi(this WebApplication app)
    {
        app.MapGet("api/users", GetUsers).PolicyAdmin();
        app.MapGet("api/users/{id}", GetUserById).PolicyAdmin();

        app.MapPost("api/users", CreateUser).PolicyAdmin();
        app.MapPut("api/users/{id}", UpdateUser).PolicyAdmin();
        app.MapDelete("api/users/{id}", DeleteUser).PolicyAdmin();
        app.MapPut("api/users/{id}/admin", ToggleUserIsAdmin).PolicyAdmin();
    }


    private static async Task<Ok<List<UserListModel>>> GetUsers(
        ApplicationDbContext dbContext, UserService service
    ) => TypedResults.Ok(await service.GetUsers());

    private static async Task<Results<Ok<UserListModel>, BadRequest>> GetUserById(
        ApplicationDbContext dbContext, UserService service, [FromRoute] string id)
    {
        var user = await service.GetUserEditView(id);
        if (user == null)
        {
            return TypedResults.BadRequest();
        }

        return TypedResults.Ok(user);
    }

    private static async Task<Results<NoContent, BadRequest, Conflict>> CreateUser(
        ApplicationDbContext dbContext,
        UserManager<IdentityUser> userManager,
        [FromBody] UserCreateForm form
    )
    {
        if (string.IsNullOrWhiteSpace(form.Username)
            || string.IsNullOrWhiteSpace(form.Email)
            || string.IsNullOrWhiteSpace(form.Password))
        {
            return TypedResults.BadRequest();
        }

        var existing =
            await userManager.FindByEmailAsync(form.Email) ??
            await userManager.FindByNameAsync(form.Username);

        if (existing != null)
        {
            return TypedResults.Conflict();
        }

        var newUser = new IdentityUser
        {
            UserName = form.Username.Trim(),
            Email = form.Email,
        };

        var res = await userManager.CreateAsync(newUser, form.Password);
        if (!res.Succeeded)
        {
            return TypedResults.BadRequest();
        }

        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, BadRequest, Conflict>> UpdateUser(
        ApplicationDbContext dbContext,
        UserManager<IdentityUser> userManager,
        UserService userService,
        [FromRoute] string id,
        [FromBody] UserCreateForm form
    )
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
        {
            return TypedResults.BadRequest();
        }

        if (string.IsNullOrWhiteSpace(form.Username)
            || string.IsNullOrWhiteSpace(form.Email)
            || string.IsNullOrWhiteSpace(form.Password))
        {
            return TypedResults.BadRequest();
        }

        var existing = await userService.UpdateUserExistingConflictUser(user, form);
        if (existing != null)
        {
            return TypedResults.Conflict();
        }

        user.UserName = form.Username;
        user.Email = form.Email;

        // bruh
        await userManager.RemovePasswordAsync(user);
        await userManager.AddPasswordAsync(user, form.Password);

        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, BadRequest>> DeleteUser(
        ApplicationDbContext dbContext,
        UserManager<IdentityUser> userManager,
        HttpContext httpContext,
        [FromRoute] string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null || user.UserName == "admin")
        {
            return TypedResults.BadRequest();
        }

        // cannot self destruct
        if (httpContext.User.Identity?.Name == user.UserName)
        {
            return TypedResults.BadRequest();
        }

        await userManager.DeleteAsync(user);
        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, BadRequest>> ToggleUserIsAdmin(
        ApplicationDbContext dbContext,
        UserManager<IdentityUser> userManager,
        [FromRoute] string id,
        [FromBody] bool value)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null || user.UserName == "admin")
        {
            return TypedResults.BadRequest();
        }

        if (value)
        {
            await userManager.AddToRoleAsync(user, Auth.Roles.Admin);
        }
        else
        {
            await userManager.RemoveFromRoleAsync(user, Auth.Roles.Admin);
        }

        await dbContext.SaveChangesAsync();
        return TypedResults.NoContent();
    }
}