from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os
import urllib.request


def _registruj_fonty():
    if 'DejaVuSans' not in pdfmetrics.getRegisteredFontNames():
        urls = {
            'DejaVuSans.ttf': 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf',
            'DejaVuSans-Bold.ttf': 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf'
        }
        font_dir = os.path.dirname(__file__)
        for soubor, url in urls.items():
            cesta_fontu = os.path.join(font_dir, soubor)
            if not os.path.exists(cesta_fontu):
                urllib.request.urlretrieve(url, cesta_fontu)
            pdfmetrics.registerFont(TTFont(soubor.replace('.ttf', ''), cesta_fontu))

        addMapping('DejaVuSans', 0, 0, 'DejaVuSans')
        addMapping('DejaVuSans', 1, 0, 'DejaVuSans-Bold')
        addMapping('DejaVuSans', 0, 1, 'DejaVuSans')
        addMapping('DejaVuSans', 1, 1, 'DejaVuSans-Bold')

_registruj_fonty()


def vytvor_pdf(kontakty):
    nazev = f"kontakty_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    cesta = os.path.join("vystupy", nazev)

    pdf = canvas.Canvas(cesta)
    pdf.setFont("DejaVuSans-Bold", 16)
    pdf.drawString(50, 800, "Přehled kontaktů CRM")

    y = 760
    pdf.setFont("DejaVuSans", 11)

    for kontakt in kontakty:
        pdf.drawString(50, y, f"{kontakt['jmeno']} - {kontakt['email']}")
        y -= 20
        if y < 50:
            pdf.showPage()
            y = 800

    pdf.save()
    return cesta


def vytvor_pdf_crm(kontakty, nazev_souboru="crm_export"):
    nazev = f"{nazev_souboru}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    cesta = os.path.join("vystupy", nazev)

    doc = SimpleDocTemplate(cesta, pagesize=A4)
    styles = getSampleStyleSheet()
    styles['Title'].fontName = 'DejaVuSans-Bold'
    styles['Normal'].fontName = 'DejaVuSans'
    elements = []

    elements.append(Paragraph("CRM - Seznam kontaktů", styles['Title']))
    elements.append(Paragraph(f"Vygenerováno: {datetime.now().strftime('%d.%m.%Y %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 20))

    data = [['Jméno', 'Příjmení', 'Email', 'Telefon', 'Město', 'Pozice', 'Firma']]
    for k in kontakty:
        data.append([
            k.get('Jmeno', ''),
            k.get('Prijmeni', ''),
            k.get('Email', ''),
            k.get('Telefon', ''),
            k.get('Mesto', ''),
            k.get('Pozice', ''),
            k.get('FirmaNazev', 'Solo')
        ])

    tabulka = Table(data, colWidths=[65, 65, 120, 80, 65, 65, 70])
    tabulka.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1976d2')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 7),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))

    elements.append(tabulka)
    doc.build(elements)
    return cesta


def vytvor_pdf_firmy(firmy):
    nazev = f"firmy_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    cesta = os.path.join("vystupy", nazev)

    doc = SimpleDocTemplate(cesta, pagesize=A4)
    styles = getSampleStyleSheet()
    styles['Title'].fontName = 'DejaVuSans-Bold'
    styles['Normal'].fontName = 'DejaVuSans'
    elements = []

    elements.append(Paragraph("CRM - Seznam firem", styles['Title']))
    elements.append(Paragraph(f"Vygenerováno: {datetime.now().strftime('%d.%m.%Y %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 20))

    data = [['Název', 'Email', 'Telefon', 'Město', 'IČO', 'Segment']]
    for f in firmy:
        data.append([
            f.get('Nazev', ''),
            f.get('Email', ''),
            f.get('Telefon', ''),
            f.get('Mesto', ''),
            f.get('Ico', ''),
            f.get('Segment', '')
        ])

    tabulka = Table(data, colWidths=[100, 110, 80, 70, 70, 70])
    tabulka.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1976d2')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))

    elements.append(tabulka)
    doc.build(elements)
    return cesta