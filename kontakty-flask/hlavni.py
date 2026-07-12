from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from moduly.import_csv import zpracuj_csv
from moduly.generator_pdf import vytvor_pdf, vytvor_pdf_crm, vytvor_pdf_firmy
from moduly.export_excel import export_kontakty_excel, export_firmy_excel
from moduly.zaloha_db import vytvor_zalohu
import sqlite3
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

print("WORKING DIR:", os.getcwd())

app = Flask(__name__, template_folder="templates")
CORS(app)

SLOZKA_VYSTUPY = "vystupy"
os.makedirs(SLOZKA_VYSTUPY, exist_ok=True)

DB_PATH = "../KontaktyAPI/crm.db"

nactene_kontakty = []




def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ENDPOINTY

@app.route("/")
def uvod():
    return render_template("index.html")


@app.route("/api/import/csv", methods=["POST"])
def import_csv():
    global nactene_kontakty
    soubor = request.files.get("file")
    if not soubor:
        return jsonify({"chyba": "Nebyl nahrán soubor"}), 400
    kontakty, chyby = zpracuj_csv(soubor)
    nactene_kontakty = kontakty
    return jsonify({"kontakty": kontakty, "chyby": chyby, "pocet": len(kontakty)})


@app.route("/api/pdf/report", methods=["POST"])
def pdf_report():
    global nactene_kontakty
    if not nactene_kontakty:
        return jsonify({"chyba": "Nejsou načtené kontakty"}), 400
    cesta = vytvor_pdf(nactene_kontakty)
    return jsonify({"zprava": "PDF vytvořeno", "cesta": cesta})


@app.route("/stahnout/<nazev>")
def stahnout(nazev):
    return send_file(os.path.join(SLOZKA_VYSTUPY, nazev), as_attachment=True)


# CRM STATISTIKY - pro grafy na uvodni strance (vykreslene pomoci react knihovny)

@app.route("/api/crm/statistiky", methods=["GET"])
def statistiky():
    conn = get_db()
    try:
        pocet_kontaktu = conn.execute("SELECT COUNT(*) FROM Kontakty").fetchone()[0]
        pocet_firem = conn.execute("SELECT COUNT(*) FROM Firmy").fetchone()[0]
        pocet_schuzek = conn.execute("SELECT COUNT(*) FROM Schuzky").fetchone()[0]
        pocet_aktivit = conn.execute("SELECT COUNT(*) FROM Aktivity").fetchone()[0]

        kontakty_podle_typu = conn.execute(
            "SELECT Typ, COUNT(*) as pocet FROM Kontakty GROUP BY Typ"
        ).fetchall()

        kontakty_podle_mesta = conn.execute(
            "SELECT Mesto, COUNT(*) as pocet FROM Kontakty GROUP BY Mesto ORDER BY pocet DESC LIMIT 10"
        ).fetchall()

        firmy_podle_segmentu = conn.execute(
            "SELECT Segment, COUNT(*) as pocet FROM Firmy GROUP BY Segment"
        ).fetchall()

        schuzky_podle_stavu = conn.execute(
            "SELECT Stav, COUNT(*) as pocet FROM Schuzky GROUP BY Stav"
        ).fetchall()

        aktivity_podle_typu = conn.execute(
            "SELECT Typ, COUNT(*) as pocet FROM Aktivity GROUP BY Typ"
        ).fetchall()

        return jsonify({
            "celkem": {
                "kontakty": pocet_kontaktu,
                "firmy": pocet_firem,
                "schuzky": pocet_schuzek,
                "aktivity": pocet_aktivit
            },
            "kontakty_podle_typu": [dict(r) for r in kontakty_podle_typu],
            "kontakty_podle_mesta": [dict(r) for r in kontakty_podle_mesta],
            "firmy_podle_segmentu": [dict(r) for r in firmy_podle_segmentu],
            "schuzky_podle_stavu": [dict(r) for r in schuzky_podle_stavu],
            "aktivity_podle_typu": [dict(r) for r in aktivity_podle_typu]
        })
    finally:
        conn.close()


# PDF EXPORT

@app.route("/api/crm/export/kontakty-pdf", methods=["GET"])
def export_kontakty_pdf():
    conn = get_db()
    try:
        rows = conn.execute("""
            SELECT k.*, f.Nazev as FirmaNazev
            FROM Kontakty k
            LEFT JOIN Firmy f ON k.FirmaId = f.Id
        """).fetchall()
        kontakty = [dict(r) for r in rows]
        cesta = vytvor_pdf_crm(kontakty)
        nazev = os.path.basename(cesta)
        return send_file(os.path.join(SLOZKA_VYSTUPY, nazev), as_attachment=True)
    finally:
        conn.close()


@app.route("/api/crm/export/firmy-pdf", methods=["GET"])
def export_firmy_pdf():
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM Firmy").fetchall()
        firmy = [dict(r) for r in rows]
        cesta = vytvor_pdf_firmy(firmy)
        nazev = os.path.basename(cesta)
        return send_file(os.path.join(SLOZKA_VYSTUPY, nazev), as_attachment=True)
    finally:
        conn.close()


# EXCEL EXPORT

@app.route("/api/crm/export/kontakty-excel", methods=["GET"])
def export_kontakty_excel_route():
    conn = get_db()
    try:
        rows = conn.execute("""
            SELECT k.*, f.Nazev as FirmaNazev
            FROM Kontakty k
            LEFT JOIN Firmy f ON k.FirmaId = f.Id
        """).fetchall()
        cesta = export_kontakty_excel([dict(r) for r in rows])
        return send_file(os.path.abspath(cesta), as_attachment=True)
    finally:
        conn.close()


@app.route("/api/crm/export/firmy-excel", methods=["GET"])
def export_firmy_excel_route():
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM Firmy").fetchall()
        cesta = export_firmy_excel([dict(r) for r in rows])
        return send_file(os.path.abspath(cesta), as_attachment=True)
    finally:
        conn.close()


# ZÁLOHA DB - dostupne tlacitko pouze ze zalozky firem na strance

@app.route("/api/crm/zaloha", methods=["POST"])
def zaloha():
    try:
        cesta = vytvor_zalohu()
        return jsonify({"zprava": "Záloha vytvořena", "cesta": cesta})
    except Exception as e:
        return jsonify({"chyba": str(e)}), 500


# HROMADNÝ EMAIL - moznost poslat email vsem vybranym kontaktum- prislo mi to zajimave pri projizdeni moznosti v dokumentaci k python Flask- nevyzkouseno

@app.route("/api/crm/hromadny-email", methods=["POST"])
def hromadny_email():
    data = request.json
    predmet = data.get("predmet", "")
    zprava = data.get("zprava", "")
    smtp_email = data.get("email", "")
    smtp_heslo = data.get("heslo", "")
    vybrani_ids = data.get("ids", [])

    conn = get_db()
    try:
        if vybrani_ids:
            placeholders = ",".join("?" * len(vybrani_ids))
            rows = conn.execute(
                f"SELECT * FROM Kontakty WHERE Id IN ({placeholders})", vybrani_ids
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM Kontakty WHERE Email != ''").fetchall()

        kontakty = [dict(r) for r in rows]
    finally:
        conn.close()

    odeslano = 0
    chyby = []

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(smtp_email, smtp_heslo)

        for k in kontakty:
            try:
                msg = MIMEMultipart()
                msg["From"] = smtp_email
                msg["To"] = k["Email"]
                msg["Subject"] = predmet
                msg.attach(MIMEText(zprava, "plain"))
                server.sendmail(smtp_email, k["Email"], msg.as_string())
                odeslano += 1
            except Exception as e:
                chyby.append(f"{k['Email']}: {str(e)}")

        server.quit()
        return jsonify({"uspech": True, "odeslano": odeslano, "chyby": chyby})

    except Exception as e:
        return jsonify({"uspech": False, "chyba": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)