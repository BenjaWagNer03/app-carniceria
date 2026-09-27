# Carnicería Buena Carne – Landing page

Sitio estático (HTML + CSS + JS, sin dependencias) con:

- **Quiénes somos**
- **Productos** y descarga del catálogo en PDF (`catalogo.pdf`, solo nombres, sin precios)
- **Ubicación** con mapa (14 Norte con San Antonio 1291, Viña del Mar) y redes sociales
- **Ofertas**: ofertas de la semana (opcional) y formulario "Quiero enterarme de todas las ofertas"
  (nombre, correo y celular)
- **Instagram**: publicaciones de Instagram o, si no hay, un acceso a Instagram y TikTok
- **Preguntas frecuentes**
- **Formulario de contacto**: nombre, teléfono y/o email, y categoría
  (quiere **comprar**, **vendernos** o **trabajar** con nosotros).

Los datos de ambos formularios se guardan en una planilla de Google.

## Ver el sitio

Abre `index.html` en el navegador, o sírvelo localmente:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Recibir los datos en Google Sheets

Se hace una sola vez (unos 5 minutos):

1. Crea una planilla nueva en [sheets.google.com](https://sheets.google.com) (por ejemplo "Contactos web Buena Carne").
2. En la planilla, ve a **Extensiones → Apps Script**.
3. Borra lo que aparece y pega el contenido de `tools/google-apps-script.gs`. Guarda (ícono de disquete).
4. Toca **Implementar → Nueva implementación**.
   - En el engranaje, elige el tipo **Aplicación web**.
   - **Ejecutar como:** Yo.
   - **Quién tiene acceso:** Cualquier usuario.
   - Toca **Implementar** y autoriza los permisos con tu cuenta de Google
     (si aparece "Google no verificó esta app", toca *Configuración avanzada → Ir a ... (no seguro)*: es tu propio script).
5. Copia la **URL de la aplicación web** (termina en `/exec`).
6. Pégala en `SHEETS_ENDPOINT` al inicio de `script.js`:
   ```js
   const SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```

Los datos llegan a dos hojas que se crean solas:

- **Contactos**: Fecha, Categoría, Nombre, Teléfono y Email. Filtra por *Categoría* para ver por separado clientes, proveedores y postulantes.
- **Ofertas**: Fecha, Nombre, Email, Celular y Acepta recibir ofertas.

> Si más adelante cambias el script, usa **Implementar → Administrar implementaciones → Editar → Nueva versión**
> para mantener la misma URL.

## Cargar ofertas y publicaciones de Instagram

Al inicio de `script.js`:

- `OFERTAS`: lista de ofertas de la semana. Si está vacía, el bloque no se muestra.
  ```js
  const OFERTAS = [
    { nombre: "Lomo vetado", detalle: "Por kilo", precio: "$12.990", hasta: "Válido hasta el domingo" },
  ];
  ```
- `INSTAGRAM_POSTS`: links de publicaciones de Instagram (3 o 6 quedan mejor). Si está vacía, se muestra un acceso a Instagram y TikTok.
  ```js
  const INSTAGRAM_POSTS = ["https://www.instagram.com/p/ABC123xyz/"];
  ```

## Actualizar el catálogo PDF

Edita la lista `CATALOGO` en `tools/generar_catalogo.py` y ejecuta:

```bash
pip install reportlab
python3 tools/generar_catalogo.py
```

## Publicar

Al ser un sitio estático se puede publicar gratis en Netlify, Vercel o GitHub Pages (este último requiere repositorio público).
