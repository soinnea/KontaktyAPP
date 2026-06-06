using Microsoft.EntityFrameworkCore;
using KontaktyAPI.Data;
using KontaktyAPI.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=crm.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("PovolReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Firmy.Any())
    {
        var fakerFirmy = new Bogus.Faker<Firma>("cz")
            .RuleFor(f => f.Nazev, f => f.Company.CompanyName())
            .RuleFor(f => f.Email, f => f.Internet.Email())
            .RuleFor(f => f.Telefon, f => f.Phone.PhoneNumber("### ### ###"))
            .RuleFor(f => f.Mesto, f => f.Address.City())
            .RuleFor(f => f.Adresa, f => f.Address.StreetAddress())
            .RuleFor(f => f.Ico, f => f.Random.Number(10000000, 99999999).ToString())
            .RuleFor(f => f.Web, f => f.Internet.Url())
            .RuleFor(f => f.Segment, f => f.PickRandom(new[] { "B2B", "B2C", "Startup", "Enterprise" }))
            .RuleFor(f => f.Tagy, f => f.PickRandom(new[] { "VIP", "Partner", "Zákazník", "Dodavatel" }))
            .RuleFor(f => f.VytvorenoAt, f => f.Date.Past(2));

        db.Firmy.AddRange(fakerFirmy.Generate(30));
        db.SaveChanges();
    }

    if (!db.Kontakty.Any())
    {
        var firmaIds = db.Firmy.Select(f => f.Id).ToList();

        var fakerKontakty = new Bogus.Faker<Kontakt>("cz")
            .RuleFor(k => k.Jmeno, f => f.Name.FirstName())
            .RuleFor(k => k.Prijmeni, f => f.Name.LastName())
            .RuleFor(k => k.Email, (f, k) => f.Internet.Email(k.Jmeno, k.Prijmeni))
            .RuleFor(k => k.Telefon, f => f.Phone.PhoneNumber("### ### ###"))
            .RuleFor(k => k.Mesto, f => f.Address.City())
            .RuleFor(k => k.Pozice, f => f.PickRandom(new[] { "CEO", "Manažer", "Obchodník", "Technik", "Asistent" }))
            .RuleFor(k => k.Typ, f => f.PickRandom(new[] { "Zákazník", "Partner", "Dodavatel", "Lead" }))
            .RuleFor(k => k.Tagy, f => f.PickRandom(new[] { "VIP", "Aktivní", "Nový", "Dlouhodobý" }))
            .RuleFor(k => k.FirmaId, f => f.Random.Bool(0.8f) ? f.PickRandom(firmaIds) : null)
            .RuleFor(k => k.VytvorenoAt, f => f.Date.Past(2));

        db.Kontakty.AddRange(fakerKontakty.Generate(100));
        db.SaveChanges();
    }

    if (!db.Schuzky.Any())
    {
        var kontaktIds = db.Kontakty.Select(k => k.Id).ToList();
        var firmaIds = db.Firmy.Select(f => f.Id).ToList();

        var fakerSchuzky = new Bogus.Faker<Schuzka>("cz")
            .RuleFor(s => s.Nazev, f => f.Lorem.Sentence(3))
            .RuleFor(s => s.Popis, f => f.Lorem.Paragraph())
            .RuleFor(s => s.Datum, f => f.Date.Between(DateTime.Now.AddMonths(-3), DateTime.Now.AddMonths(3)))
            .RuleFor(s => s.Misto, f => f.Address.City())
            .RuleFor(s => s.Stav, f => f.PickRandom(new[] { "Naplánovaná", "Proběhla", "Zrušená" }))
            .RuleFor(s => s.KontaktId, f => f.PickRandom(kontaktIds))
            .RuleFor(s => s.FirmaId, f => f.PickRandom(firmaIds))
            .RuleFor(s => s.VytvorenoAt, f => f.Date.Past(1));

        db.Schuzky.AddRange(fakerSchuzky.Generate(50));
        db.SaveChanges();
    }

    if (!db.Aktivity.Any())
    {
        var kontaktIds = db.Kontakty.Select(k => k.Id).ToList();

        var fakerAktivity = new Bogus.Faker<Aktivita>("cz")
            .RuleFor(a => a.Typ, f => f.PickRandom(new[] { "Hovor", "Email", "Schůzka", "Poznámka" }))
            .RuleFor(a => a.Popis, f => f.Lorem.Sentence())
            .RuleFor(a => a.Datum, f => f.Date.Past(1))
            .RuleFor(a => a.KontaktId, f => f.PickRandom(kontaktIds))
            .RuleFor(a => a.VytvorenoAt, f => f.Date.Past(1));

        db.Aktivity.AddRange(fakerAktivity.Generate(200));
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("PovolReact");
app.UseAuthorization();
app.MapControllers();
app.Run();
