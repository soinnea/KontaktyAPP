# KontaktyAPP

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

Složka `moduly/` obsahuje jednotlivé funkční celky – `generator_pdf.py`, `export_excel.py`, `zaloha_db.py` a `import_csv.py`. Soubor `hlavni.py` tyto moduly importuje a propojuje je s Flask endpointy. Vygenerované soubory se ukládají do složky `vystupy/`.

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
