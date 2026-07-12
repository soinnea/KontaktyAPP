using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KontaktyAPI.Data;
using KontaktyAPI.Models;

namespace KontaktyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FirmyController : ControllerBase
    {
        private readonly AppDbContext _db;

        public FirmyController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Firma>>> VratVsechny()
        {
            return Ok(await _db.Firmy.Include(f => f.Kontakty).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Firma>> VratPodleId(int id)
        {
            var firma = await _db.Firmy
                .Include(f => f.Kontakty)
                .Include(f => f.Schuzky)
                .FirstOrDefaultAsync(f => f.Id == id);
            if (firma == null) return NotFound();
            return Ok(firma);
        }

        [HttpPost]
        public async Task<ActionResult<Firma>> Vytvor(Firma firma)
        {
            _db.Firmy.Add(firma);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(VratPodleId), new { id = firma.Id }, firma);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Uprav(int id, Firma upravena)
        {
            var firma = await _db.Firmy.FindAsync(id);
            if (firma == null) return NotFound();
            firma.Nazev = upravena.Nazev;
            firma.Email = upravena.Email;
            firma.Telefon = upravena.Telefon;
            firma.Mesto = upravena.Mesto;
            firma.Adresa = upravena.Adresa;
            firma.Ico = upravena.Ico;
            firma.Web = upravena.Web;
            firma.Segment = upravena.Segment;
            firma.Tagy = upravena.Tagy;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Smaz(int id)
        {
            var firma = await _db.Firmy.FindAsync(id);
            if (firma == null) return NotFound();
            _db.Firmy.Remove(firma);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("hledat")]
        public async Task<ActionResult<List<Firma>>> Hledat(string dotaz)
        {
            var vysledky = await _db.Firmy
                .Where(f => f.Nazev.Contains(dotaz) || f.Mesto.Contains(dotaz))
                .ToListAsync();
            return Ok(vysledky);
        }
    }
}
