import csv
import io
import re

EMAIL_REGEX = r"^[^@]+@[^@]+\.[^@]+$"


def zpracuj_csv(soubor):
    kontakty = []
    chyby = []
    emaily = set()

    obsah = soubor.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(obsah))

    for i, row in enumerate(reader, start=2):
        jmeno = row.get("name", "").strip()
        email = row.get("email", "").strip()

        if not jmeno:
            chyby.append(f"Řádek {i}: chybí jméno")
            continue

        if not re.match(EMAIL_REGEX, email):
            chyby.append(f"Řádek {i}: neplatný email")
            continue

        if email in emaily:
            chyby.append(f"Řádek {i}: duplicitní email")
            continue

        emaily.add(email)
        kontakty.append({"jmeno": jmeno, "email": email})

    return kontakty, chyby
