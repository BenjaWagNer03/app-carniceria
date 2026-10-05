// ================== CONFIGURACIÓN ==================
// URL de la aplicación web de Google Apps Script que guarda los datos de los
// formularios en la planilla de Google. Ver README.md, "Recibir los datos".
const SHEETS_ENDPOINT = "";

// Ofertas de la semana. Si la lista está vacía, no se muestra el bloque.
// Ejemplo: { nombre: "Lomo vetado", detalle: "Por kilo", precio: "$12.990", hasta: "Válido hasta el domingo" }
const OFERTAS = [];

// Links de publicaciones de Instagram para mostrar en la página (3 o 6 quedan mejor).
// Ejemplo: "https://www.instagram.com/p/ABC123xyz/"
const INSTAGRAM_POSTS = [];
// ===================================================

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Menú móvil ----------
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

// ---------- Ofertas ----------
if (OFERTAS.length) {
  const grid = document.getElementById("offers-grid");
  OFERTAS.forEach((o) => {
    const card = document.createElement("article");
    card.className = "offer";
    [["h3", o.nombre], ["p", o.detalle], ["strong", o.precio], ["small", o.hasta]].forEach(([tag, texto]) => {
      if (!texto) return;
      const el = document.createElement(tag);
      el.textContent = texto;
      card.appendChild(el);
    });
    grid.appendChild(card);
  });
  document.getElementById("offers").classList.remove("hidden");
}

// ---------- Instagram ----------
if (INSTAGRAM_POSTS.length) {
  const grid = document.getElementById("ig-grid");
  INSTAGRAM_POSTS.forEach((url) => {
    const bq = document.createElement("blockquote");
    bq.className = "instagram-media";
    bq.dataset.instgrmPermalink = url;
    bq.dataset.instgrmVersion = "14";
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Ver esta publicación en Instagram";
    bq.appendChild(a);
    grid.appendChild(bq);
  });
  grid.classList.remove("hidden");
  document.getElementById("ig-cta").classList.add("hidden");
  const s = document.createElement("script");
  s.src = "https://www.instagram.com/embed.js";
  s.async = true;
  document.body.appendChild(s);
}

// ---------- Formularios ----------
const esEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const esTelefono = (v) => /^[+\d\s()-]{8,}$/.test(v);
// Celular chileno: 9 XXXX XXXX, con o sin +56
function normalizarCelular(v) {
  const d = v.replace(/\D/g, "").replace(/^56/, "");
  return /^9\d{8}$/.test(d) ? `+56 9 ${d.slice(1, 5)} ${d.slice(5)}` : "";
}

function marcar(campo, ok) {
  campo.classList.toggle("invalid", !ok);
  return ok;
}

// Cada validador devuelve un mensaje de error, o "" si todo está bien.
const validadores = {
  contacto(f) {
    const nombre = f.nombre.value.trim();
    const tel = f.telefono.value.trim();
    const email = f.email.value.trim();
    const telOk = esTelefono(tel);
    const emailOk = esEmail(email);
    const alguno = telOk || emailOk;
    marcar(f.nombre, nombre !== "");
    marcar(f.telefono, alguno && (tel === "" || telOk));
    marcar(f.email, alguno && (email === "" || emailOk));
    if (!nombre) return "Ingresa tu nombre.";
    if (!alguno) return "Ingresa un teléfono o un email válido para poder contactarte.";
    if (tel && !telOk) return "Revisa el teléfono ingresado.";
    if (email && !emailOk) return "Revisa el email ingresado.";
    return "";
  },
  ofertas(f) {
    const celular = normalizarCelular(f.celular.value);
    if (!marcar(f.nombre, f.nombre.value.trim() !== "")) return "Ingresa tu nombre.";
    if (!marcar(f.email, esEmail(f.email.value.trim()))) return "Ingresa un correo válido.";
    if (!marcar(f.celular, celular !== "")) return "Ingresa un celular válido (ej: +56 9 1234 5678).";
    if (!f.acepta.checked) return "Debes aceptar recibir ofertas para inscribirte.";
    f.celular.value = celular;
    return "";
  },
};

const mensajesOk = {
  contacto: "¡Gracias! Recibimos tus datos y te contactaremos pronto.",
  ofertas: "¡Listo! Te avisaremos de nuestras ofertas.",
};

document.querySelectorAll("form[id$='-form']").forEach((form) => {
  const tipo = form.formulario.value;
  const statusEl = form.querySelector(".form__status");
  const setStatus = (text, cls) => {
    statusEl.textContent = text;
    statusEl.className = "form__status " + (cls || "");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form._gotcha.value) return; // bot

    const error = validadores[tipo](form);
    if (error) {
      setStatus(error, "error");
      return;
    }

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    setStatus("Enviando…");
    try {
      const data = new URLSearchParams(new FormData(form));
      data.delete("_gotcha");
      // Netlify Forms: los datos quedan en el panel de Netlify (sección Forms).
      data.set("form-name", form.getAttribute("name"));
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      if (!res.ok) throw new Error("netlify " + res.status);
      // Opcional: copia en Google Sheets si SHEETS_ENDPOINT está configurado.
      if (SHEETS_ENDPOINT) {
        fetch(SHEETS_ENDPOINT, { method: "POST", mode: "no-cors", body: data }).catch(() => {});
      }
      form.reset();
      setStatus(mensajesOk[tipo], "ok");
    } catch {
      setStatus("No pudimos enviar tus datos. Inténtalo de nuevo o escríbenos por Instagram @buenacarne__.", "error");
    } finally {
      btn.disabled = false;
    }
  });
});
