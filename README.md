# KontaktyAPP

## Požadavky ke spuštění

Před spuštěním je potřeba mít nainstalované tyto nástroje:

- **Node.js** – https://nodejs.org
- **.NET SDK 8** – https://dotnet.microsoft.com
- **Python 3.10+** – https://python.org

## Spuštění projektu (`start.bat`)

V kořenové složce projektu spusť soubor `start.bat`. Skript sám zkontroluje jestli máš nainstalované všechny potřebné nástroje, vytvoří Python prostředí, nainstaluje závislosti a spustí všechny tři části aplikace. Po spuštění otevři prohlížeč na `http://localhost:3000`.

---

## Python / Flask backend (`kontakty-flask`)

Flask backend běžící na `http://localhost:5001`, který poskytuje REST API pro export dat, statistiky a zálohu databáze. Vyžaduje **Python 3.10+**.

### Použité knihovny

| Knihovna | Popis |
|---|---|
| **flask** | Webový framework pro vytváření API endpointů. |
| **flask-cors** | Povoluje cross-origin requesty mezi React frontendem a Flask backendem. |
| **reportlab** | Generování PDF souborů s formátovanými tabulkami kontaktů a firem. |
| **openpyxl** | Generování Excel souborů (.xlsx) s barevným formátováním hlaviček. |
| **sqlite3** | Vestavěná Python knihovna pro přístup k SQLite databázi. |
| **smtplib** | Vestavěná Python knihovna pro odesílání hromadných emailů přes Gmail SMTP. |

### Struktura

Jednotlivé části kódu jsou uloženy v modulech. Složka `moduly/` obsahuje jednotlivé funkční celky – `generator_pdf.py`, `export_excel.py`, `zaloha_db.py` a `import_csv.py`. Soubor `hlavni.py` tyto moduly importuje a propojuje je s Flask endpointy. Vygenerované soubory se ukládají do složky `vystupy/`.

### API endpointy

| Endpoint | Metoda | Popis |
|---|---|---|
| `/api/crm/statistiky` | GET | Statistiky pro Dashboard |
| `/api/crm/export/kontakty-pdf` | GET | Export kontaktů do PDF |
| `/api/crm/export/firmy-pdf` | GET | Export firem do PDF |
| `/api/crm/export/kontakty-excel` | GET | Export kontaktů do Excelu |
| `/api/crm/export/firmy-excel` | GET | Export firem do Excelu |
| `/api/crm/zaloha` | POST | Záloha SQLite databáze |
| `/api/crm/hromadny-email` | POST | Odeslání hromadného emailu |
| `/api/import/csv` | POST | Import kontaktů z CSV souboru |

---

## C# Backend a databáze (`KontaktyAPI`)

Backend je napsaný v ASP.NET Core a běží na portu 5000. Stará se o veškerou práci s databází – ukládání, čtení, upravování a mazání dat.

### Jak to funguje

Jako databáze se používá SQLite, což znamená že celá databáze je jen jeden soubor `crm.db` – není potřeba instalovat žádný databázový server. O komunikaci s databází se stará Entity Framework Core, takže se místo SQL píše C# kód.

Při úplně prvním spuštění se databáze automaticky vytvoří a naplní testovacími daty – 30 firem, 100 kontaktů, 50 schůzek a 200 aktivit. Testovací data generuje knihovna Bogus.

### Co je kde

- `Program.cs` – hlavní soubor, nastavuje celou aplikaci, připojení k databázi a generování testovacích dat
- `Data/AppDbContext.cs` – říká Entity Frameworku jaké tabulky v databázi existují
- `Models/` – definice tabulek (Kontakt, Firma, Schuzka, Aktivita)
- `Controllers/` – zpracovávají požadavky z frontendu a volají databázi
- `Migrations/` – automaticky generované soubory které popisují strukturu databáze

### API endpointy

Backend vystavuje REST API které používá React frontend. Každá entita má své endpointy pro základní operace:

- `GET /api/kontakty` – seznam kontaktů
- `GET /api/kontakty/{id}` – detail kontaktu
- `POST /api/kontakty` – nový kontakt
- `PUT /api/kontakty/{id}` – úprava kontaktu
- `DELETE /api/kontakty/{id}` – smazání kontaktu
- `GET /api/kontakty/hledat?dotaz=...` – vyhledávání

Stejné endpointy existují i pro firmy, schůzky a aktivity.

---

## Propojení částí aplikace přes API

Všechny tři části aplikace spolu komunikují přes HTTP API. React frontend posílá požadavky na C# backend (port 5000) pro práci s kontakty, firmami, schůzkami a aktivitami, a zároveň komunikuje s Flask backendem (port 5001) pro exporty, statistiky a zálohu databáze. Každá část běží samostatně jako oddělený proces – frontend jen posílá požadavky a zobrazuje odpovědi, žádná část nemá přímý přístup k databázi jiné části. Díky tomu by šlo jednotlivé části v budoucnu snadno vyměnit nebo rozšířit bez zásahu do zbytku aplikace.

```
React (port 3000)
    ├── → C# API (port 5000) – kontakty, firmy, schůzky, aktivity
    └── → Flask API (port 5001) – statistiky, exporty, záloha
```

---

## React Frontend (`kontakty-frontend`)

Frontend je napsaný v Reactu, který jsem se učil na předchozí praxi a přišel mi zajímavý. Pro vzhled jsem použil Material UI a grafy na dashboardu jsou vytvořeny pomocí Recharts. Komunikaci s backendy obstarává Axios.
