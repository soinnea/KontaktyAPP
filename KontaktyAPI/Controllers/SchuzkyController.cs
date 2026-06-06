using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KontaktyAPI.Data;
using KontaktyAPI.Models;

namespace KontaktyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchuzkyController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SchuzkyController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Schuzka>>> VratVsechny()
        {
            return Ok(await _db.Schuzky
                .Include(s => s.Kontakt)
                .Include(s => s.Firma)
                .ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Schuzka>> VratPodleId(int id)
        {
            var schuzka = await _db.Schuzky
                .Include(s => s.Kontakt)
                .Include(s => s.Firma)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (schuzka == null) return NotFound();
            return Ok(schuzka);
        }

        [HttpPost]
        public async Task<ActionResult<Schuzka>> Vytvor(Schuzka schuzka)
        {
            _db.Schuzky.Add(schuzka);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(VratPodleId), new { id = schuzka.Id }, schuzka);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Uprav(int id, Schuzka upravena)
        {
            var schuzka = await _db.Schuzky.FindAsync(id);
            if (schuzka == null) return NotFound();
            schuzka.Nazev = upravena.Nazev;
            schuzka.Popis = upravena.Popis;
            schuzka.Datum = upravena.Datum;
            schuzka.Misto = upravena.Misto;
            schuzka.Stav = upravena.Stav;
            schuzka.KontaktId = upravena.KontaktId;
            schuzka.FirmaId = upravena.FirmaId;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Smaz(int id)
        {
            var schuzka = await _db.Schuzky.FindAsync(id);
            if (schuzka == null) return NotFound();
            _db.Schuzky.Remove(schuzka);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
