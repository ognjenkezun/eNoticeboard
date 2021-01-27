using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class ElektronskaOglasnaTablaContext : IdentityDbContext
    {
        public ElektronskaOglasnaTablaContext()
        {
        }

        public ElektronskaOglasnaTablaContext(DbContextOptions<ElektronskaOglasnaTablaContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Announcements> Announcements { get; set; }
        public virtual DbSet<AppConfig> AppConfig { get; set; }
        public virtual DbSet<Categories> Categories { get; set; }
        public virtual DbSet<Images> Images { get; set; }
        public virtual DbSet<Priorities> Priorities { get; set; }
        public virtual DbSet<UserTypes> UserTypes { get; set; }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<Files> Files { get; set; }

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
        }
    }
}
