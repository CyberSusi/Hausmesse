namespace ProjektHausmesse.Server.Models.User;

public class UserListModel
{
    public string Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public bool IsAdmin { get; set; }
}