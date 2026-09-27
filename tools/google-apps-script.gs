/**
 * Recibe los datos de los formularios de la web y los guarda como filas
 * en la planilla de Google donde se instala:
 *   - Hoja "Contactos": formulario de contacto (comprar, vender, trabajar).
 *   - Hoja "Ofertas":   personas que quieren enterarse de las ofertas.
 * Instrucciones de instalación: README.md, sección "Recibir los datos".
 */
const HOJAS = {
  contacto: { nombre: "Contactos", columnas: ["Fecha", "Categoría", "Nombre", "Teléfono", "Email"] },
  ofertas: { nombre: "Ofertas", columnas: ["Fecha", "Nombre", "Email", "Celular", "Acepta recibir ofertas"] },
};
const CATEGORIAS = ["Comprar", "Vender", "Trabajar"];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._gotcha) return respuesta(true); // bot

  let tipo, fila;
  if (p.formulario === "ofertas") {
    tipo = "ofertas";
    fila = [new Date(), limpiar(p.nombre), limpiar(p.email), limpiar(p.celular), p.acepta === "Sí" ? "Sí" : "No"];
    if (!fila[1] || !fila[2] || !fila[3] || fila[4] !== "Sí") return respuesta(false);
  } else {
    tipo = "contacto";
    const categoria = CATEGORIAS.indexOf(p.categoria) >= 0 ? p.categoria : "Sin categoría";
    fila = [new Date(), categoria, limpiar(p.nombre), limpiar(p.telefono), limpiar(p.email)];
    if (!fila[2] || (!fila[3] && !fila[4])) return respuesta(false);
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    obtenerHoja(HOJAS[tipo]).appendRow(fila);
  } finally {
    lock.releaseLock();
  }
  return respuesta(true);
}

function obtenerHoja(config) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName(config.nombre) || libro.insertSheet(config.nombre);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(config.columnas);
    hoja.getRange(1, 1, 1, config.columnas.length).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }
  return hoja;
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
