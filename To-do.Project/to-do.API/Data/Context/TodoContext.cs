using Microsoft.EntityFrameworkCore;

using Task = to_do.API.Data.Entities.Task;

namespace to_do.API.Data.Context
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options) : base(options) { }

        public DbSet<Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Task>(entity =>
            {
                entity.ToTable("Tasks");

                entity.HasKey(t => t.Id);
                entity.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(255);

                entity.Property(e => e.Content)
                .HasColumnType("nvarchar(MAX)");

                entity.Property(e => e.IsCompleted)
                          .IsRequired()
                          .HasDefaultValue(false);
            }

      );}
    }
}
