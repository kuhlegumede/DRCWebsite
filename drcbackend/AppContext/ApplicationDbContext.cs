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
    public DbSet<NewsPost> NewsPosts => Set<NewsPost>();
    public DbSet<NewsImage> NewsImages => Set<NewsImage>();

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

        modelBuilder.Entity<NewsPost>(entity =>
        {
            entity.ToTable("NewsPosts");

            entity.HasKey(np => np.Id);

            entity.Property(np => np.Id)
                .ValueGeneratedOnAdd();

            entity.Property(np => np.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(np => np.Content)
                .IsRequired();

            entity.Property(np => np.PublishedAtUtc)
                .IsRequired();

            entity.Property(np => np.CreatedAtUtc)
                .IsRequired();

            entity.HasMany(np => np.Images)
                .WithOne(ni => ni.NewsPost)
                .HasForeignKey(ni => ni.NewsPostId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<NewsImage>(entity =>
        {
            entity.ToTable("NewsImages");

            entity.HasKey(ni => ni.Id);

            entity.Property(ni => ni.Id)
                .ValueGeneratedOnAdd();

            entity.Property(ni => ni.ImageUrl)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(ni => ni.Caption)
                .HasMaxLength(500);
        });
    }
}