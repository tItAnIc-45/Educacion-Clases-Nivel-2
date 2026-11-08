"use strict";
/* Programas: búsqueda por tema, docente y herramienta, filtros, orden y favoritos */
(function () {
  const cont = $("#cursos"), inp = $("#buscar");
  let cat = params.get("cat") || "todos", q = sin((params.get("q") || "").trim());
  const favs = new Set(seguro(() => JSON.parse(localStorage.getItem("fav"))) || []);

  /* Redirige los enlaces antiguos ?ver= a la ficha del curso */
  if (TP.curso(params.get("ver"))) { location.replace(TP.url(params.get("ver"))); return; }

  /* Texto indexado por campo, para dar relevancia y mostrar por qué coincide */
  const indice = TP.CURSOS.map((c, i) => {
    const d = TP.DET[c.id];
    return {
      c, i, d,
      campos: [
        ["título", 10, sin(c.t)],
        ["tema", 6, sin(d.top.join(" "))],
        ["docente", 5, sin(d.doc.map(x => x.n + " " + x.c).join(" "))],
        ["área", 4, sin(c.cat + " " + c.niv)],
        ["descripción", 3, sin(c.d + " " + d.apr.join(" "))],
        ["temario", 2, sin(d.mod.map(m => m[0] + " " + m[2].join(" ")).join(" "))]
      ]
    };
  });

  function puntaje(it, palabras) {
    let total = 0; const donde = new Set();
    for (const w of palabras) {
      let mejor = 0;
      for (const [n, peso, txt] of it.campos) if (txt.includes(w)) { if (peso > mejor) mejor = peso; donde.add(n); }
      if (!mejor) return null;       // todas las palabras deben coincidir
      total += mejor;
    }
    return { total, donde: [...donde] };
  }

  const resaltar = (txt, palabras) => {
    if (!palabras.length) return esc(txt);
    const norm = sin(txt); let marcas = [];
    palabras.forEach(w => { let k = norm.indexOf(w); while (k > -1) { marcas.push([k, k + w.length]); k = norm.indexOf(w, k + w.length); } });
    if (!marcas.length) return esc(txt);
    marcas.sort((a, b) => a[0] - b[0]);
    const unidas = [marcas[0]];
    marcas.slice(1).forEach(m => { const u = unidas[unidas.length - 1]; m[0] <= u[1] ? u[1] = Math.max(u[1], m[1]) : unidas.push(m); });
    let out = "", pos = 0;
    unidas.forEach(([a, b]) => { out += esc(txt.slice(pos, a)) + "<mark>" + esc(txt.slice(a, b)) + "</mark>"; pos = b; });
    return out + esc(txt.slice(pos));
  };

  const POPULARES = ["JavaScript", "Excel", "Logo", "Redes sociales", "Lucía", "Portafolio", "Finanzas"];
  const chips = el => { el.innerHTML = POPULARES.map(p => `<button type="button" class="sug" data-q="${esc(p)}">${esc(p)}</button>`).join(""); };
  chips($("#sugerencias")); chips($("#sug-vacio"));

  function aplicar() {
    const palabras = q.split(/\s+/).filter(Boolean);
    const nivel = $("#nivel").value, tope = +$("#precio").value || Infinity, orden = $("#orden").value;
    let res = indice.map(it => ({ it, s: palabras.length ? puntaje(it, palabras) : { total: 0, donde: [] } }))
      .filter(x => x.s && (cat === "todos" || (cat === "fav" ? favs.has(x.it.c.id) : x.it.c.cat === cat)) && (!nivel || x.it.c.niv === nivel) && x.it.c.p <= tope);

    const por = {
      "": (a, b) => palabras.length ? b.s.total - a.s.total || a.it.i - b.it.i : a.it.i - b.it.i,
      val: (a, b) => b.it.d.r - a.it.d.r || b.it.d.n - a.it.d.n,
      al: (a, b) => b.it.d.al - a.it.d.al,
      "p-asc": (a, b) => a.it.c.p - b.it.c.p,
      "p-desc": (a, b) => b.it.c.p - a.it.c.p,
      "h-asc": (a, b) => a.it.c.h - b.it.c.h
    };
    res.sort(por[orden]);

    cont.innerHTML = res.map(({ it, s }) => {
      let h = TP.tarjeta(it.c, true);
      if (palabras.length) {
        h = h.replace(`<h3>${it.c.t}</h3>`, `<h3>${resaltar(it.c.t, palabras)}</h3>`)
             .replace(`<p>${it.c.d}</p>`, `<p>${resaltar(it.c.d, palabras)}</p>`);
        const extra = s.donde.filter(n => n !== "título" && n !== "descripción");
        if (extra.length) h = h.replace('<div class="valora"', `<p class="coincide">Coincide en: ${extra.join(", ")}</p><div class="valora"`);
      }
      return h;
    }).join("");
    $$(".fav", cont).forEach(f => { const on = favs.has(f.dataset.fav); f.setAttribute("aria-pressed", on); f.textContent = on ? "♥" : "♡"; });

    /* Contadores por área (respetan búsqueda, nivel y precio) */
    const base = indice.filter(it => (palabras.length ? puntaje(it, palabras) : true) && (!nivel || it.c.niv === nivel) && it.c.p <= tope);
    $$("[data-cf]").forEach(s => { const k = s.dataset.cf; s.textContent = k === "todos" ? base.length : base.filter(it => it.c.cat === k).length; });
    $("#nfav").textContent = favs.size;

    $("#vacio").hidden = res.length > 0;
    if (cat === "fav" && !res.length && !palabras.length) $("#vacio").innerHTML = `<h3>Aún no tienes favoritos</h3><p>Toca el corazón de un programa para guardarlo aquí.</p>`;
    else if (!res.length) $("#vacio").innerHTML = `<h3>No encontramos programas con esa búsqueda</h3><p>Revisa la ortografía, quita algún filtro o prueba con una de estas ideas:</p><div class="sugerencias" id="sug-vacio"></div>`, chips($("#sug-vacio"));
    $("#total").textContent = res.length === 1 ? "1 programa" : res.length + " programas";
    $("#limpiar").hidden = !inp.value;
    $("#reiniciar").hidden = !(q || nivel || tope < Infinity || cat !== "todos");
    $$(".filtro").forEach(x => x.classList.toggle("activo", x.dataset.f === cat));
  }

  $$(".filtro").forEach(b => b.addEventListener("click", () => { cat = b.dataset.f; aplicar(); }));
  inp.addEventListener("input", () => { q = sin(inp.value.trim()); aplicar(); });
  ["nivel", "precio", "orden"].forEach(id => $("#" + id).addEventListener("change", aplicar));
  $("#limpiar").addEventListener("click", () => { inp.value = ""; q = ""; aplicar(); inp.focus(); });
  $("#reiniciar").addEventListener("click", () => {
    inp.value = ""; q = ""; cat = "todos";
    ["nivel", "precio", "orden"].forEach(id => { $("#" + id).value = ""; });
    aplicar();
  });
  document.addEventListener("click", e => {
    const s = e.target.closest(".sug");
    if (s) { inp.value = s.dataset.q; q = sin(s.dataset.q); aplicar(); inp.focus(); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); inp.focus(); }
    else if (e.key === "Escape" && document.activeElement === inp && inp.value) { inp.value = ""; q = ""; aplicar(); }
  });

  /* Favoritos y apertura de la ficha al tocar la tarjeta */
  cont.addEventListener("click", e => {
    const f = e.target.closest(".fav");
    if (f) {
      const id = f.dataset.fav;
      favs.has(id) ? favs.delete(id) : favs.add(id);
      seguro(() => localStorage.setItem("fav", JSON.stringify([...favs])));
      aplicar();
      return aviso(favs.has(id) ? "Guardado en favoritos ♥" : "Quitado de favoritos");
    }
    if (e.target.closest("a")) return;
    const card = e.target.closest(".curso");
    if (card) TP.ir(TP.url(card.dataset.id));
  });

  inp.value = params.get("q") || "";
  aplicar();
})();
