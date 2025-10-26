namespace Domain.Entities;
public class UserProfile
{
    public int Id { get; set; }
    public string FirebaseUid { get; set; } = default!;
    public string Role { get; set; } = "User"; // User | Owner | Admin
    public string? Email { get; set; }
    public string? DisplayName { get; set; }
}
