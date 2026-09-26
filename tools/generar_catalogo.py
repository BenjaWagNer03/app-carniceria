"""Genera catalogo.pdf a partir de la lista CATALOGO.

Uso:
    pip install reportlab
    python tools/generar_catalogo.py
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

NOMBRE = "Carnicería El Buen Corte"
DATOS = "Av. Siempre Viva 742, Ciudad · Tel/WhatsApp: +54 9 11 0000-0000 · contacto@elbuencorte.com"

# (producto, descripción, unidad)
CATALOGO = {
    "Vacuno": [
        ("Asado de tira", "Corte clásico para parrilla", "kg"),
        ("Vacío", "Jugoso, ideal para parrilla u horno", "kg"),
        ("Lomo", "El corte más tierno", "kg"),
        ("Bife de chorizo", "Con su grasa justa", "kg"),
        ("Entraña", "Sabor intenso", "kg"),
        ("Matambre", "Para parrilla o arrollado", "kg"),
        ("Colita de cuadril", "Magra y tierna", "kg"),
        ("Nalga", "Para milanesas y bifes", "kg"),
        ("Carne picada especial", "Molida en el momento", "kg"),
    ],
    "Cerdo": [
        ("Bondiola", "Entera o en bifes", "kg"),
        ("Pechito", "Para parrilla u horno", "kg"),
        ("Matambrito", "Tierno, ideal a la pizza", "kg"),
        ("Carré", "Con o sin hueso", "kg"),
    ],
    "Pollo": [
        ("Pollo entero", "Fresco", "kg"),
        ("Pechuga", "Con o sin hueso", "kg"),
        ("Pata-muslo", "", "kg"),
        ("Alitas", "", "kg"),
    ],
    "Embutidos y achuras": [
        ("Chorizo puro cerdo", "Elaboración propia", "kg"),
        ("Morcilla", "", "kg"),
        ("Salchicha parrillera", "", "kg"),
        ("Chinchulines", "", "kg"),
        ("Molleja", "", "kg"),
    ],
    "Elaborados": [
        ("Milanesas de carne", "Rebozadas y listas", "kg"),
        ("Milanesas de pollo", "Rebozadas y listas", "kg"),
        ("Hamburguesas caseras", "Pack x 4", "pack"),
        ("Brochetes", "Carne, pollo y verduras", "unidad"),
    ],
    "Cordero (según temporada)": [
        ("Pierna", "", "kg"),
        ("Paleta", "", "kg"),
        ("Costillar", "", "kg"),
    ],
}

ROJO = colors.HexColor("#9e1b1b")
OSCURO = colors.HexColor("#1e1a17")
CREMA = colors.HexColor("#faf6f0")


def main():
    out = Path(__file__).resolve().parent.parent / "catalogo.pdf"
    doc = SimpleDocTemplate(
        str(out), pagesize=A4, title=f"Catálogo - {NOMBRE}",
        leftMargin=2 * cm, rightMargin=2 * cm, topMargin=1.8 * cm, bottomMargin=1.8 * cm,
    )
    titulo = ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=26, textColor=OSCURO, leading=30)
    sub = ParagraphStyle("s", fontName="Helvetica", fontSize=10, textColor=colors.grey, leading=14)
    cat = ParagraphStyle("c", fontName="Helvetica-Bold", fontSize=15, textColor=ROJO, spaceBefore=14, spaceAfter=6)
    nota = ParagraphStyle("n", fontName="Helvetica-Oblique", fontSize=9, textColor=colors.grey, leading=12)

    story = [
        Paragraph(NOMBRE, titulo),
        Spacer(1, 4),
        Paragraph("Catálogo de productos", ParagraphStyle("h", parent=titulo, fontSize=14, textColor=ROJO)),
        Spacer(1, 4),
        Paragraph(DATOS, sub),
        Spacer(1, 10),
    ]

    for categoria, productos in CATALOGO.items():
        story.append(Paragraph(categoria, cat))
        filas = [["Producto", "Descripción", "Unidad"]] + [list(p) for p in productos]
        t = Table(filas, colWidths=[6 * cm, 8 * cm, 3 * cm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), OSCURO),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CREMA]),
            ("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor("#e4dcd2")),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(t)

    story += [
        Spacer(1, 18),
        Paragraph(
            "Precios mayoristas y pedidos especiales: consultanos por WhatsApp o desde el formulario de la web. "
            "La disponibilidad de algunos productos puede variar según temporada.",
            nota,
        ),
    ]
    doc.build(story)
    print(f"Catálogo generado: {out}")


if __name__ == "__main__":
    main()
