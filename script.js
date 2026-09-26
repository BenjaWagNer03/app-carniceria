// ================== CONFIGURACIÓN ==================
// URL de la aplicación web de Google Apps Script que guarda los contactos
// en la planilla de Google. Ver README.md, sección "Recibir los contactos".
const SHEETS_ENDPOINT = "";
// ===================================================

document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Formulario de contacto
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = "form__status " + (type || "");
}

function validate() {
  const { nombre, telefono, email } = form;
  const nombreOk = nombre.value.trim() !== "";
  const telOk = /^[+\d\s()-]{8,}$/.test(telefono.value.trim());
  const emailOk = email.value.trim() !== "" && email.checkValidity();
  const alguno = telOk || emailOk;

  nombre.classList.toggle("invalid", !nombreOk);
  telefono.classList.toggle("invalid", !alguno || (telefono.value.trim() !== "" && !telOk));
  email.classList.toggle("invalid", !alguno || (email.value.trim() !== "" && !emailOk));

  if (!nombreOk) return "Ingresa tu nombre.";
  if (!alguno) return "Ingresa un teléfono o un email válido para poder contactarte.";
  if (telefono.value.trim() && !telOk) return "Revisa el teléfono ingresado.";
  if (email.value.trim() && !emailOk) return "Revisa el email ingresado.";
  return "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form._gotcha.value) return; // bot

  const error = validate();
  if (error) {
    setStatus(error, "error");
    return;
  }
  if (!SHEETS_ENDPOINT) {
    setStatus("El formulario todavía no está configurado. Escríbenos por Instagram @buenacarne__.", "error");
    return;
  }

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  setStatus("Enviando…");
  try {
    const data = new URLSearchParams(new FormData(form));
    data.delete("_gotcha");
    // Apps Script no devuelve cabeceras CORS legibles: se envía en modo no-cors.
    await fetch(SHEETS_ENDPOINT, { method: "POST", mode: "no-cors", body: data });
    form.reset();
    setStatus("¡Gracias! Recibimos tus datos y te contactaremos pronto.", "ok");
  } catch {
    setStatus("No pudimos enviar tus datos. Inténtalo de nuevo o escríbenos por Instagram @buenacarne__.", "error");
  } finally {
    btn.disabled = false;
  }
});
