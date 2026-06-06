using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KontaktyAPI.Data;
using KontaktyAPI.Models;

namespace KontaktyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KontaktyController : ControllerBase
    {
        private readonly AppDbContext _db;

        public KontaktyController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Kontakt>>> VratVsechny()
        {
            return Ok(await _db.Kontakty.Include(k => k.Firma).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Kontakt>> VratPodleId(int id)
        {
            var kontakt = await _db.Kontakty
                .Include(k => k.Firma)
                .Include(k => k.Aktivity)
                .Include(k => k.Schuzky)
                .FirstOrDefaultAsync(k => k.Id == id);
            if (kontakt == null) return NotFound();
            return Ok(kontakt);
        }

        [HttpPost]
        public async Task<ActionResult<Kontakt>> Vytvor(Kontakt kontakt)
        {
            _db.Kontakty.Add(kontakt);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(VratPodleId), new { id = kontakt.Id }, kontakt);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Uprav(int id, Kontakt upraveny)
        {
            var kontakt = await _db.Kontakty.FindAsync(id);
            if (kontakt == null) return NotFound();
            kontakt.Jmeno = upraveny.Jmeno;
            kontakt.Prijmeni = upraveny.Prijmeni;
            kontakt.Email = upraveny.Email;
            kontakt.Telefon = upraveny.Telefon;
            kontakt.Mesto = upraveny.Mesto;
            kontakt.Pozice = upraveny.Pozice;
            kontakt.Typ = upraveny.Typ;
            kontakt.Tagy = upraveny.Tagy;
            kontakt.FirmaId = upraveny.FirmaId;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Smaz(int id)
        {
            var kontakt = await _db.Kontakty.FindAsync(id);
            if (kontakt == null) return NotFound();
            _db.Kontakty.Remove(kontakt);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("hledat")]
        public async Task<ActionResult<List<Kontakt>>> Hledat(string dotaz)
        {
            var vysledky = await _db.Kontakty
                .Include(k => k.Firma)
                .Where(k => k.Jmeno.Contains(dotaz) ||
                            k.Prijmeni.Contains(dotaz) ||
                            k.Email.Contains(dotaz))
                .ToListAsync();
            return Ok(vysledky);
        }
    }
}
