namespace Domain.Entities;
public class Appointment
{
    public int Id { get; set; }
    public int ServiceId { get; set; }
    public Service Service { get; set; } = default!;
    public string FirebaseUid { get; set; } = default!;
    public DateTime StartUtc { get; set; }
    public DateTime EndUtc { get; set; }
    public string Status { get; set; } = "Booked"; // Booked | Cancelled | Completed
}
