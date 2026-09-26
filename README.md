# Carnicería Buena Carne – Landing page

Sitio estático (HTML + CSS + JS, sin dependencias) con:

- **Quiénes somos**
- **Productos** y descarga del catálogo en PDF (`catalogo.pdf`, solo nombres, sin precios)
- **Ubicación** con mapa (14 Norte con San Antonio 1291, Viña del Mar) y redes sociales
- **Formulario de contacto**: nombre, teléfono y/o email, y categoría
  (quiere **comprar**, **vendernos** o **trabajar** con nosotros). Los datos se guardan en una planilla de Google.

## Ver el sitio

Abre `index.html` en el navegador, o sírvelo localmente:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Recibir los contactos en Google Sheets

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

Cada contacto aparecerá como una fila en la hoja **Contactos** con: Fecha, Categoría, Nombre, Teléfono y Email.
Puedes filtrar por la columna *Categoría* para ver por separado clientes, proveedores y postulantes.

> Si más adelante cambias el script, usa **Implementar → Administrar implementaciones → Editar → Nueva versión**
> para mantener la misma URL.

## Actualizar el catálogo PDF

Edita la lista `CATALOGO` en `tools/generar_catalogo.py` y ejecuta:

```bash
pip install reportlab
python3 tools/generar_catalogo.py
```

## Publicar

Al ser un sitio estático se puede publicar gratis en Netlify, Vercel o GitHub Pages (este último requiere repositorio público).
