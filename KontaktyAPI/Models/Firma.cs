namespace KontaktyAPI.Models
{
    public class Firma
    {
        public int Id { get; set; }
        public string Nazev { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Mesto { get; set; } = string.Empty;
        public string Adresa { get; set; } = string.Empty;
        public string Ico { get; set; } = string.Empty;
        public string Web { get; set; } = string.Empty;
        public string Segment { get; set; } = string.Empty;
        public string Tagy { get; set; } = string.Empty;
        public DateTime VytvorenoAt { get; set; } = DateTime.Now;
        public List<Kontakt> Kontakty { get; set; } = new();
        public List<Schuzka> Schuzky { get; set; } = new();
    }
}
