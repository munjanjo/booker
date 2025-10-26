using Domain.Entities;

namespace Infrastructure;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (!db.Services.Any())
        {
            db.Services.AddRange(
                new Service { Name = "Šišanje", DurationMinutes = 30, Price = 12 },
                new Service { Name = "Brijanje", DurationMinutes = 20, Price = 8 }
            );
            await db.SaveChangesAsync();
        }
    }
}
