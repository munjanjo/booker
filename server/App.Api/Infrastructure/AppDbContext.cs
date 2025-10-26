using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Service> Services { get; set; } = null!;
    public DbSet<Appointment> Appointments { get; set; } = null!;
    public DbSet<UserProfile> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<UserProfile>()
            .HasIndex(x => x.FirebaseUid)
            .IsUnique();

        b.Entity<Service>()
            .Property(p => p.Price)
            .HasColumnType("decimal(10,2)");

        b.Entity<Appointment>()
            .HasOne(a => a.Service)
            .WithMany()
            .HasForeignKey(a => a.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
