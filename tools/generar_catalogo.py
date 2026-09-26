"""Genera catalogo.pdf a partir de la lista CATALOGO (solo nombres de productos).

Uso:
    pip install reportlab
    python3 tools/generar_catalogo.py
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

NOMBRE = "Carnicería Buena Carne"
DATOS = "14 Norte con San Antonio 1291, Viña del Mar, Chile · Instagram @buenacarne__ · TikTok @buena.carne"

CATALOGO = {
    "Vacuno": [
        "Abastero", "Aletilla", "Asado carnicero", "Asado de tira", "Asiento", "Choclillo",
        "Churrascos congelados", "Ganso", "Grasa", "Huachalomo", "Hueso", "Hueso pelado",
        "Lomo liso", "Lomo liso (pieza)", "Lomo vetado", "Lomo vetado (pieza)",
        "Molida corriente", "Molida especial", "Osobuco", "Palanca", "Pollo ganso",
        "Posta negra", "Posta paleta", "Posta rosada", "Punta de ganso", "Punta de picana",
        "Punta de picana (pieza)", "Sobrecostilla", "Sobrecostilla (pieza)", "Tapabarriga",
        "Tapapecho", "Tapapecho (pieza)",
    ],
    "Interiores": [
        "Chunchules", "Guata callo", "Guatita", "Hígado", "Patas de vacuno",
    ],
    "Cerdo": [
        "Caja de costillar", "Cazuela de cerdo", "Chicharrón de cerdo", "Chuleta centro",
        "Chuleta vetada", "Costillar", "Costillar americano", "Lomo de cerdo", "Patas de cerdo",
        "Pulpa con hueso", "Pulpa deshuesada", "Pulpa deshuesada (pieza)",
    ],
    "Pollo": [
        "Caja de pechuga deshuesada (12 kg)", "Caja de pechuga entera", "Caja de trutro",
        "Cazuela de ave", "Nuggets de pollo", "Patas de pollo", "Pechuga deshuesada",
        "Pechuga entera", "Pollo entero", "Trutro ala", "Trutro congelado", "Trutro fresco",
    ],
    "Cecinas y embutidos": [
        "Arrollado huaso", "Chorizos", "Longaniza", "Longaniza (3 unidades)", "Prieta",
        "Salchicha Montina de pollo", "Tocino", "Vienesa Cartuja",
        "Vienesas Montina tradicional (5 unidades)", "Vienesas Montina tradicional (20 unidades)",
    ],
    "Congelados y preparados": [
        "Arvejas", "Burritos y wraps XL (8 unidades)", "Choclo", "Habas", "Lasaña",
        "Lasaña precocida", "Papas prefritas", "Papas rústicas", "Porotos verdes", "Primavera",
        "Quesadillas M (8 unidades)", "Ravioles Carozzi",
    ],
    "Huevos": [
        "Bandeja primera", "Bandeja extra (30 unidades)", "Bandeja súper extra (20 unidades)",
    ],
    "Lácteos y quesos": [
        "Crema de leche", "Crema de leche Surlat 200 g", "Leche descremada", "Leche entera Colún",
        "Leche entera Soprole", "Leche semidescremada", "Leche sin lactosa", "Mantequilla 125 g",
        "Mantequilla Quillayes 250 g", "Mantequilla Soprole (cuarto)", "Mantequilla Surlat",
        "Queso gauda Soprole (kilo)", "Queso gauda laminado", "Queso gauda 9 láminas",
        "Queso gauda 15 láminas", "Queso gauda trozo", "Queso llanero", "Queso madurado",
        "Queso mantecoso Quilque 150 g", "Queso mantecoso Soprole 250 g", "Queso parmesano",
        "Queso parmesano 80 g", "Queso parmesano Quillayes", "Queso rallado Colún 40 g",
        "Quillayes 100 g", "Ricolate",
    ],
    "Pastas": [
        "Cabello de ángel", "Cabello de ángel San Remo", "Capellini", "Corbatas Carozzi",
        "Corbatas San Remo", "Corbatitas Carozzi", "Dedalitos", "Espirales", "Espirales San Remo",
        "Fideos Carozzi N° 3", "Fideos Carozzi N° 5", "Mostaccioli Carozzi", "Mostaccioli San Remo",
        "Spaghetti San Remo N° 5", "Tallarines Carozzi 87", "Tallarines San Remo 87",
    ],
    "Almacén": [
        "Aceite", "Aceite Bonanza", "Aceite Coliseo", "Aceitunas Huasco en vinagre Don Juan 180 g",
        "Arroz Miraflores 1 kg", "Arroz Miraflores grado medio", "Arroz Tucapel 500 g",
        "Arroz Tucapel 900 g", "Atún en aceite", "Atún en agua", "Azúcar Iansa 400 g",
        "Azúcar Iansa 750 g", "Café Gold", "Caldo Gourmet tocino", "Caldo Maggi costilla",
        "Caldo Maggi de carne", "Caldo Maggi gallina", "Champiñón laminado", "Crema sabor pollo",
        "Duraznos en conserva", "Fondo de alcachofa", "Garbanzos", "Gelatina", "Harina Juana",
        "Harina La Criolla", "Harina Mont Blanc sin polvos 1 kg", "Harina sin polvos",
        "Jugo de limón 500 ml", "Ketchup Kraft", "Lomitos de atún en agua San Remo",
        "Mayonesa Hellmann's", "Mostaza Don Juan 100 g", "Palmitos laminados", "Pantruca",
        "Pepinillos en vinagre Don Juan 180 g", "Puré de papas 250 g", "Sal Lobos", "Salsa BBQ",
        "Salsa de tomate Pomarola 200 g", "Salsa San Remo", "Sopa de costillas con fideos",
        "Sopa de pollo con arroz", "Sopa de pollo con fideos", "Sopa de posta con cabellos",
        "Surtido de mariscos 425 g", "Té",
    ],
    "Bebidas": [
        "Coca-Cola original (350 ml, 591 ml, 1,5 L)", "Coca-Cola retornable 2 L",
        "Coca-Cola sin azúcar (350 ml, 591 ml, 1,5 L)", "Coca-Cola light (350 ml, 591 ml)",
        "Mini Coca-Cola", "Mini Coca-Cola sin azúcar", "Fanta (350 ml, 591 ml, 1,5 L)", "Mini Fanta",
        "Sprite (350 ml, 591 ml)", "Sprite retornable 2 L", "Mini Sprite",
        "Agua Vital con gas (600 ml, 1,6 L)", "Agua Vital sin gas (600 ml, 1,5 L)",
        "Agua Aloe durazno", "Agua Watter coco", "Aquarius (manzana, uva, limón)",
        "Monster Energy", "Monster Ultra", "Monster blanca", "Monster Lemonade", "Monster Pipeline",
        "Powerade 1,1 L (uva, rojo, limón)", "Powerade 850 ml (naranja, rojo, azul, verde)",
    ],
    "Jugos": [
        "Andina durazno", "Jumex (manzana, piña, piña coco, durazno, mango)", "Kapo",
        "Livean (mango, huesillo, naranja, melón tuna, frutilla, piña)", "Refreskids", "Safari",
        "Sprim (mango, melón, naranja)", "Zuko (mango, naranja, piña, manzana)",
    ],
    "Snacks y dulces": [
        "Abolengo XL", "Amberries", "Caracoquesos", "Chocman", "Combo Frutillar", "Flipy",
        "Galletas de mantequilla", "Golazo", "Gomitas Loop", "Inkat", "Kryzpo original 37 g",
        "Mecano", "Mentitas", "Natur cereal (natural, maíz, trigo)", "Tuyo",
    ],
    "Hogar": [
        "Carbón", "Confort", "Confort 4 unidades 22 m", "Lavalozas Don Tito 5 L",
        "Manga de Confort", "Trapero",
    ],
}

ROJO = colors.HexColor("#9e1b1b")
OSCURO = colors.HexColor("#1e1a17")
CREMA = colors.HexColor("#faf6f0")
COLUMNAS = 2


def tabla_categoria(productos, ancho):
    productos = sorted(productos, key=str.lower)
    filas_n = -(-len(productos) // COLUMNAS)
    columnas = [productos[i * filas_n:(i + 1) * filas_n] for i in range(COLUMNAS)]
    celda = ParagraphStyle("p", fontName="Helvetica", fontSize=9.5, leading=12)
    filas = [[Paragraph(col[r] if r < len(col) else "", celda) for col in columnas] for r in range(filas_n)]
    t = Table(filas, colWidths=[ancho / COLUMNAS] * COLUMNAS)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, CREMA]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor("#e4dcd2")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def main():
    out = Path(__file__).resolve().parent.parent / "catalogo.pdf"
    doc = SimpleDocTemplate(
        str(out), pagesize=A4, title=f"Catálogo - {NOMBRE}",
        leftMargin=2 * cm, rightMargin=2 * cm, topMargin=1.8 * cm, bottomMargin=1.8 * cm,
    )
    titulo = ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=26, textColor=OSCURO, leading=30)
    subtitulo = ParagraphStyle("h", parent=titulo, fontSize=14, leading=18, textColor=ROJO)
    sub = ParagraphStyle("s", fontName="Helvetica", fontSize=10, textColor=colors.grey, leading=14)
    cat = ParagraphStyle("c", fontName="Helvetica-Bold", fontSize=14, textColor=ROJO, spaceBefore=14, spaceAfter=6)
    nota = ParagraphStyle("n", fontName="Helvetica-Oblique", fontSize=9, textColor=colors.grey, leading=12)

    story = [
        Paragraph(NOMBRE, titulo),
        Spacer(1, 4),
        Paragraph("Catálogo de productos", subtitulo),
        Spacer(1, 4),
        Paragraph(DATOS, sub),
        Spacer(1, 8),
    ]
    for categoria, productos in CATALOGO.items():
        story.append(KeepTogether([Paragraph(categoria, cat), tabla_categoria(productos, doc.width)]))

    story += [
        Spacer(1, 18),
        Paragraph("La disponibilidad de los productos puede variar. Consulta en el local.", nota),
    ]
    doc.build(story)
    print(f"Catálogo generado: {out} ({sum(map(len, CATALOGO.values()))} productos)")


if __name__ == "__main__":
    main()
