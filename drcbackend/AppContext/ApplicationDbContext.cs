using drcbackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DrcPrimarySchool.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<EventItem> Events => Set<EventItem>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<EventItem>(entity =>
        {
            entity.ToTable("Events");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Date)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(e => e.Time)
                .HasMaxLength(20);

            entity.Property(e => e.Location)
                .HasMaxLength(300);

            entity.Property(e => e.Description)
                .HasMaxLength(5000);

            entity.Property(e => e.CreatedAtUtc)
                .IsRequired();
        });
    }
}