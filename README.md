# Landing page – Carnicería

Sitio estático (HTML + CSS + JS, sin dependencias) con:

- **Quiénes somos**
- **Catálogo** de productos + descarga del catálogo en PDF (`catalogo.pdf`)
- **Ubicación** con mapa, horarios y datos de contacto
- **Formulario de contacto** para clientes, proveedores y personas que quieran trabajar
- Botón flotante de **WhatsApp**

## Ver el sitio

Abrí `index.html` en el navegador, o servilo localmente:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Qué personalizar

Los datos actuales son de ejemplo. Buscá y reemplazá:

| Qué | Dónde |
| --- | --- |
| Nombre (`Buena Carne`) | `index.html`, `tools/generar_catalogo.py` |
| Dirección, horarios, teléfono, email | sección `#ubicacion` y footer de `index.html` |
| Número de WhatsApp (`5491100000000`) | enlace `wa.me` al final de `index.html` |
| Mapa | `src` del `iframe` en `#ubicacion`: cambiá `q=...` por tu dirección |
| Texto "Quiénes somos" | sección `#nosotros` |
| Email que recibe los contactos | `CONTACT_EMAIL` en `script.js` |

## Recibir los mensajes del formulario

Por defecto el formulario abre el programa de correo del visitante con el
mensaje armado. Para recibirlos directamente (recomendado):

1. Creá una cuenta gratuita en [Formspree](https://formspree.io).
2. Creá un formulario y copiá la URL (`https://formspree.io/f/xxxxxx`).
3. Pegala en `FORM_ENDPOINT` dentro de `script.js`.

## Actualizar el catálogo PDF

Editá la lista `CATALOGO` en `tools/generar_catalogo.py` y ejecutá:

```bash
pip install reportlab
python3 tools/generar_catalogo.py
```

También podés reemplazar `catalogo.pdf` por tu propio PDF con el mismo nombre.

## Publicar

Al ser un sitio estático se puede publicar gratis en GitHub Pages, Netlify o Vercel.
En GitHub Pages: *Settings → Pages → Deploy from a branch* y elegí la rama.
