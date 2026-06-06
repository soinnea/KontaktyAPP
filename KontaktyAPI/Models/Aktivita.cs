namespace KontaktyAPI.Models
{
    public class Aktivita
    {
        public int Id { get; set; }
        public string Typ { get; set; } = string.Empty;
        public string Popis { get; set; } = string.Empty;
        public DateTime Datum { get; set; } = DateTime.Now;
        public DateTime VytvorenoAt { get; set; } = DateTime.Now;
        public int? KontaktId { get; set; }
        public Kontakt? Kontakt { get; set; }
    }
}
