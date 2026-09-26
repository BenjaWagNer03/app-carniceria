/**
 * Recibe los contactos del formulario de la web y los guarda como filas
 * en la hoja "Contactos" de la planilla de Google donde se instala.
 * Instrucciones de instalación: README.md, sección "Recibir los contactos".
 */
const HOJA = "Contactos";
const COLUMNAS = ["Fecha", "Categoría", "Nombre", "Teléfono", "Email"];
const CATEGORIAS = ["Comprar", "Vender", "Trabajar"];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._gotcha) return respuesta(true); // bot

  const categoria = CATEGORIAS.indexOf(p.categoria) >= 0 ? p.categoria : "Sin categoría";
  const fila = [new Date(), categoria, limpiar(p.nombre), limpiar(p.telefono), limpiar(p.email)];
  if (!fila[2] || (!fila[3] && !fila[4])) return respuesta(false);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(COLUMNAS);
      hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold");
      hoja.setFrozenRows(1);
    }
    hoja.appendRow(fila);
  } finally {
    lock.releaseLock();
  }
  return respuesta(true);
}

// Texto corto y sin fórmulas (evita que alguien inyecte "=..." en la planilla).
function limpiar(valor) {
  const texto = String(valor || "").trim().slice(0, 100);
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function respuesta(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok }))
    .setMimeType(ContentService.MimeType.JSON);
}
