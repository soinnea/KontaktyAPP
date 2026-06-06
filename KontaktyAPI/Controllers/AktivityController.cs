using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KontaktyAPI.Data;
using KontaktyAPI.Models;

namespace KontaktyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AktivityController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AktivityController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Aktivita>>> VratVsechny()
        {
            return Ok(await _db.Aktivity.Include(a => a.Kontakt).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Aktivita>> VratPodleId(int id)
        {
            var aktivita = await _db.Aktivity
                .Include(a => a.Kontakt)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (aktivita == null) return NotFound();
            return Ok(aktivita);
        }

        [HttpGet("kontakt/{kontaktId}")]
        public async Task<ActionResult<List<Aktivita>>> VratPodleKontaktu(int kontaktId)
        {
            var aktivity = await _db.Aktivity
                .Where(a => a.KontaktId == kontaktId)
                .OrderByDescending(a => a.Datum)
                .ToListAsync();
            return Ok(aktivity);
        }

        [HttpPost]
        public async Task<ActionResult<Aktivita>> Vytvor(Aktivita aktivita)
        {
            _db.Aktivity.Add(aktivita);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(VratPodleId), new { id = aktivita.Id }, aktivita);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Smaz(int id)
        {
            var aktivita = await _db.Aktivity.FindAsync(id);
            if (aktivita == null) return NotFound();
            _db.Aktivity.Remove(aktivita);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
