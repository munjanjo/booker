namespace Domain.Entities;
public class Service
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
}
