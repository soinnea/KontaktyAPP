namespace KontaktyAPI.Models
{
    public class Kontakt
    {
        public int Id { get; set; }
        public string Jmeno { get; set; } = string.Empty;
        public string Prijmeni { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Mesto { get; set; } = string.Empty;
        public string Pozice { get; set; } = string.Empty;
        public string Typ { get; set; } = string.Empty;
        public string Tagy { get; set; } = string.Empty;
        public DateTime VytvorenoAt { get; set; } = DateTime.Now;
        public int? FirmaId { get; set; }
        public Firma? Firma { get; set; }
        public List<Schuzka> Schuzky { get; set; } = new();
        public List<Aktivita> Aktivity { get; set; } = new();
    }
}
