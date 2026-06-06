namespace KontaktyAPI.Models
{
    public class Schuzka
    {
        public int Id { get; set; }
        public string Nazev { get; set; } = string.Empty;
        public string Popis { get; set; } = string.Empty;
        public DateTime Datum { get; set; }
        public string Misto { get; set; } = string.Empty;
        public string Stav { get; set; } = "Naplánovaná";
        public DateTime VytvorenoAt { get; set; } = DateTime.Now;
        public int? KontaktId { get; set; }
        public Kontakt? Kontakt { get; set; }
        public int? FirmaId { get; set; }
        public Firma? Firma { get; set; }
    }
}
