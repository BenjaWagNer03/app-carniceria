// ================== CONFIGURACIÓN ==================
// Para recibir los mensajes del formulario en tu email:
// 1. Creá una cuenta gratis en https://formspree.io
// 2. Creá un formulario y copiá su URL (ej: https://formspree.io/f/abcdwxyz)
// 3. Pegala abajo en FORM_ENDPOINT.
// Si queda vacío, el formulario abre el programa de correo del visitante
// con el mensaje ya armado y dirigido a CONTACT_EMAIL.
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "contacto@elbuencorte.com";
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

// Formulario: campos según el tipo de contacto
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const mensajeLabel = document.getElementById("mensaje-label");
const placeholders = {
  Cliente: "Contanos qué necesitás: pedidos, cantidades, precios mayoristas…",
  Proveedor: "Contanos qué productos ofrecés, zona de entrega y condiciones…",
  "Quiero trabajar": "Contanos sobre tu experiencia y disponibilidad horaria…",
};

function updateFields() {
  const tipo = form.tipo.value;
  form.querySelectorAll("[data-show-for]").forEach((el) => {
    el.classList.toggle("hidden", !el.dataset.showFor.includes(tipo));
  });
  form.mensaje.placeholder = placeholders[tipo];
  mensajeLabel.textContent = tipo === "Quiero trabajar" ? "Sobre vos *" : "Mensaje *";
}
form.querySelectorAll('input[name="tipo"]').forEach((r) => r.addEventListener("change", updateFields));
updateFields();

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = "form__status " + (type || "");
}

function validate() {
  let ok = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const valid = field.checkValidity() && field.value.trim() !== "";
    field.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  return ok;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form._gotcha.value) return; // bot
  if (!validate()) {
    setStatus("Revisá los campos marcados en rojo.", "error");
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  delete data._gotcha;
  // Eliminar campos que no corresponden al tipo elegido
  form.querySelectorAll("[data-show-for].hidden input, [data-show-for].hidden select").forEach((f) => delete data[f.name]);

  if (!FORM_ENDPOINT) {
    const subject = `[Web] ${data.tipo} - ${data.nombre}`;
    const body = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Se abrió tu programa de correo para enviar el mensaje.", "ok");
    return;
  }

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  setStatus("Enviando…");
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, _subject: `[Web] ${data.tipo} - ${data.nombre}` }),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    updateFields();
    setStatus("¡Gracias! Recibimos tu mensaje y te vamos a contactar pronto.", "ok");
  } catch {
    setStatus(`No pudimos enviar el mensaje. Probá de nuevo o escribinos a ${CONTACT_EMAIL}.`, "error");
  } finally {
    btn.disabled = false;
  }
});
