using Microsoft.EntityFrameworkCore;
using KontaktyAPI.Models;

namespace KontaktyAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Kontakt> Kontakty { get; set; }
        public DbSet<Firma> Firmy { get; set; }
        public DbSet<Schuzka> Schuzky { get; set; }
        public DbSet<Aktivita> Aktivity { get; set; }
    }
}
