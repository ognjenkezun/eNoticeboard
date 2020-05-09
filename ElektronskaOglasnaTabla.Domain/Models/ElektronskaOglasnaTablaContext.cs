using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class ElektronskaOglasnaTablaContext : IdentityDbContext<ApplicationUser> 
    {
        public ElektronskaOglasnaTablaContext()
        {
            Database.Migrate();
        }

        public ElektronskaOglasnaTablaContext(DbContextOptions<ElektronskaOglasnaTablaContext> options)
            : base(options)
        {
            Database.Migrate();
        }

        //public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<AnnouncementImageId> AnnouncementImageId { get; set; }
        public virtual DbSet<Announcements> Announcements { get; set; }
        public virtual DbSet<Categories> Categories { get; set; }
        public virtual DbSet<Images> Images { get; set; }
        public virtual DbSet<Priorities> Priorities { get; set; }
        public virtual DbSet<UserTypes> UserTypes { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DESKTOP-71ITJPA\\SQLEXPRESS;Database=ElektronskaOglasnaTabla;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity<AnnouncementImageId>(entity =>
            {
                entity.HasKey(e => e.AnnouncementImageIds)
                    .HasName("PK_AnnouncementImage");

                entity.HasOne(d => d.Announcement)
                    .WithMany(p => p.AnnouncementImageId)
                    .HasForeignKey(d => d.AnnouncementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AnnouncementImageId_Images");
            });

            modelBuilder.Entity<Announcements>(entity =>
            {
                entity.HasKey(e => e.AnnouncementId);

                entity.Property(e => e.AnnouncementDateCreated).HasColumnType("datetime");

                entity.Property(e => e.AnnouncementDateModified).HasColumnType("datetime");

                entity.Property(e => e.AnnouncementDescription)
                    .IsRequired()
                    .HasMaxLength(1600)
                    .IsUnicode(false);

                entity.Property(e => e.AnnouncementExpiryDate).HasColumnType("datetime");

                entity.Property(e => e.AnnouncementTitle)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.AnnouncementUserModifiedNavigation)
                    .WithMany(p => p.AnnouncementsAnnouncementUserModifiedNavigation)
                    .HasForeignKey(d => d.AnnouncementUserModified)
                    .HasConstraintName("FK_Announcements_Users_Modified");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Announcements)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Announcements_Categories");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AnnouncementsUser)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Announcements_Users_Created");
            });

            modelBuilder.Entity<Categories>(entity =>
            {
                entity.HasKey(e => e.CategoryId);

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(40)
                    .IsUnicode(false);

                entity.HasOne(d => d.Priority)
                    .WithMany(p => p.Categories)
                    .HasForeignKey(d => d.PriorityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Categories_Priotities");
            });

            modelBuilder.Entity<Images>(entity =>
            {
                entity.HasKey(e => e.ImageId);

                entity.Property(e => e.ImagePath)
                    .IsRequired()
                    .HasMaxLength(400)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Priorities>(entity =>
            {
                entity.HasKey(e => e.PriorityId);

                entity.Property(e => e.PriorityValue)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserTypes>(entity =>
            {
                entity.HasKey(e => e.UserTypeId);

                entity.Property(e => e.UserTypeName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserEmail)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserFirstName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserLastName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserPassword)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserTypeId).HasDefaultValueSql("((2))");

                entity.HasOne(d => d.UserType)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.UserTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Users_UserTypes");
            });
        }
    }
}
