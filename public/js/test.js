"use strict";
/* Test de afinidad: cada respuesta suma afinidad (0 a 1) a cada programa, ponderada por la
   importancia de la pregunta.  Coincidencia = Σ(peso × afinidad) ÷ Σ(pesos respondidos). */
(function () {
  const ORDEN = ["web", "datos", "diseno", "video", "marketing", "emprende"];
  const V = (...a) => Object.fromEntries(ORDEN.map((k, i) => [k, a[i]]));
  const IC = {
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 0 0 3-3c0-5-4-11-8-11z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    trend: '<path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3 3 7 3s7-1.3 7-3"/>',
    seed: '<path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
    tool: '<path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0-2-2z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
    rocket: '<path d="M5 19c1-4 3-6 3-6M14 4c4 0 6 2 6 6-3 4-6 6-9 6l-3-3c0-3 2-6 6-9zM9 16l-2 4 4-2"/><circle cx="15" cy="9" r="1"/>',
    play: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    app: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10 18h4"/>',
    layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16v-3M12 16V9M17 16v-5"/>',
    plan: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>'
  };
  const svg = k => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;

  const PREG = [
    { q: "¿Qué actividad te llama más la atención?", crit: "Interés principal", w: 3, o: [
      ["Lógica y programación", "code", V(1, .55, .1, .05, .1, .15), "te interesa resolver problemas con lógica y programación"],
      ["Diseño visual y creatividad", "palette", V(.15, .05, 1, .7, .35, .2), "te atrae el diseño visual y la creatividad"],
      ["Negocios y marketing digital", "trend", V(.1, .25, .2, .25, 1, .8), "te interesan los negocios y el marketing digital"],
      ["Análisis de datos e investigación", "db", V(.35, 1, .05, .05, .45, .35), "disfrutas analizar datos e investigar"]] },
    { q: "¿Cuál es tu punto de partida?", crit: "Nivel actual", w: 1.5, o: [
      ["Desde cero absoluto", "seed", V(1, 1, 1, .3, 1, 1), "prefieres aprender desde cero absoluto"],
      ["Ya probé algunas herramientas", "tool", V(.8, .8, .9, .9, .9, .9), "ya probaste algunas herramientas"],
      ["Tengo bases y quiero profesionalizarme", "layers", V(.6, .7, .8, 1, .8, .7), "ya tienes bases y buscas profesionalizarte"]] },
    { q: "¿Qué quieres lograr primero?", crit: "Objetivo", w: 2.5, o: [
      ["Crear mi sitio o mi portafolio", "layout", V(1, .1, .8, .3, .2, .1), "quieres crear tu sitio o tu portafolio"],
      ["Conseguir un mejor empleo", "brief", V(.8, .9, .6, .5, .7, .1), "buscas mejorar tu situación laboral"],
      ["Lanzar mi propio proyecto o negocio", "rocket", V(.3, .2, .4, .4, .8, 1), "quieres lanzar tu propio proyecto"],
      ["Crear contenido para redes", "play", V(.1, .1, .6, 1, .9, .3), "quieres crear contenido para redes"]] },
    { q: "¿Cuánto tiempo tienes cada semana?", crit: "Disponibilidad", w: 1, o: [
      ["2 a 4 horas", "clock", V(.5, .7, .6, .7, .6, 1), "tienes entre 2 y 4 horas por semana"],
      ["4 a 6 horas", "clock", V(.8, .9, .9, .9, .9, .9), "tienes entre 4 y 6 horas por semana"],
      ["6 a 10 horas", "clock", V(1, 1, 1, 1, 1, .8), "puedes dedicar de 6 a 10 horas por semana"],
      ["Más de 10 horas", "clock", V(1, 1, 1, 1, 1, .7), "puedes dedicar más de 10 horas por semana"]] },
    { q: "¿Qué te gustaría mostrar al terminar?", crit: "Resultado final", w: 2, o: [
      ["Una aplicación o sitio funcional", "app", V(1, .2, .4, .1, .2, .2), "buscas desarrollar aplicaciones funcionales"],
      ["Un portafolio visual", "palette", V(.3, .05, 1, .8, .3, .1), "quieres terminar con un portafolio visual"],
      ["Un panel o informe con datos", "panel", V(.2, 1, .1, .05, .6, .4), "quieres presentar un panel o informe con datos"],
      ["Un plan de negocio o una campaña", "plan", V(.1, .3, .2, .2, 1, 1), "quieres presentar un plan de negocio o una campaña"]] }
  ];
  const DEMO = [0, 0, 0, 1, 0];       // perfil de ejemplo del modo demostración

  const izq = $("#t-izq"), rec = $("#recom");
  let resp = (seguro(() => JSON.parse(localStorage.getItem("test-resp"))) || []).slice(0, PREG.length);
  resp = resp.filter((r, i) => Number.isInteger(r) && PREG[i] && r >= 0 && r < PREG[i].o.length);
  let paso = Math.min(resp.length, PREG.length), esperando = false;
  const guardar = () => seguro(() => localStorage.setItem("test-resp", JSON.stringify(resp)));

  /* ---------- Cálculo ---------- */
  function calcular() {
    const sumaPesos = resp.reduce((a, r, i) => a + PREG[i].w, 0);
    if (!sumaPesos) return null;
    const pesoTotal = PREG.reduce((a, q) => a + q.w, 0), neutro = .5 * (pesoTotal - sumaPesos);   // lo no respondido cuenta como afinidad neutra (50%)
    const lista = ORDEN.map(id => {
      const aporte = resp.map((r, i) => ({ i, w: PREG[i].w, a: PREG[i].o[r][2][id], tx: PREG[i].o[r][3], crit: PREG[i].crit, resp: PREG[i].o[r][0] }));
      const puntos = aporte.reduce((s, x) => s + x.w * x.a, 0);
      return { id, pct: Math.min(99, Math.round((puntos + neutro) / pesoTotal * 100)), aporte };
    }).sort((a, b) => b.pct - a.pct);
    const margen = lista[0].pct - lista[1].pct;
    const n = resp.length;
    const conf = n < 3 ? ["Baja", 1] : n >= 4 && margen >= 10 ? ["Alta", 3] : ["Media", 2];
    return { lista, top: lista[0], margen, conf, n };
  }

  const razones = top => {
    const r = [...top.aporte].filter(x => x.a >= .6).sort((a, b) => b.w * b.a - a.w * a.a).slice(0, 3).map(x => x.tx);
    if (!r.length) return "Es la opción con mayor afinidad según lo que respondiste hasta ahora.";
    const txt = r.length > 1 ? r.slice(0, -1).join(", ") + " y " + r[r.length - 1] : r[0];
    return `Indicaste que ${txt}.`;
  };

  /* ---------- Panel derecho ---------- */
  function pintarRec() {
    const res = calcular();
    if (!res) {
      rec.innerHTML = `<h2>Tu recomendación personalizada</h2>
        <div class="rec-vacio"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">${IC.target}</svg>
        <p>Responde la primera pregunta y aquí verás qué programa encaja mejor contigo, con su porcentaje de coincidencia.</p>
        ${TP.demo ? `<button type="button" class="boton sec" data-demo-perfil>Cargar perfil de ejemplo</button>` : ""}</div>`;
      return;
    }
    const { lista, top, conf, n } = res, c = TP.curso(top.id), alt = lista.slice(1, 3);
    rec.innerHTML = `<h2>Tu recomendación personalizada</h2>
      <div class="rec-card">
        <div class="rec-cab"><div><p class="rec-pct"><b>${top.pct}%</b> de coincidencia con tu perfil</p><h3>${esc(c.t)}</h3></div><span class="rec-tag">${n === PREG.length ? "Recomendado" : "Provisional"}</span></div>
        <div class="rec-medidor" role="img" aria-label="Coincidencia ${top.pct}%"><i style="width:${top.pct}%"></i></div>
        <div class="rec-razon"><b>Razones de esta sugerencia:</b><p>${esc(razones(top))}</p></div>
        <p class="rec-conf">Confianza del resultado: <b>${conf[0]}</b> <span class="niveles" aria-hidden="true">${[1, 2, 3].map(k => `<i${k <= conf[1] ? ' class="on"' : ""}></i>`).join("")}</span><small>${n} de ${PREG.length} respuestas</small></p>
        <h4>Alternativas para ti</h4>
        <div class="rec-alt">${alt.map(a => `<a href="${TP.url(a.id)}"><b>${esc(TP.curso(a.id).t)}</b><span>${a.pct}% afinidad</span></a>`).join("")}</div>
        <details class="rec-calc"><summary>Cómo se calculó</summary>
          <p>Coincidencia = Σ(peso × afinidad) ÷ Σ(pesos). Las preguntas sin responder cuentan como 50%. Cada respuesta tiene una afinidad de 0 a 100% con el programa y cada pregunta pesa distinto.</p>
          <table><thead><tr><th>Criterio</th><th>Peso</th><th>Afinidad</th></tr></thead><tbody>${top.aporte.map(x => `<tr><td>${esc(x.crit)}<small>${esc(x.resp)}</small></td><td>×${x.w}</td><td>${Math.round(x.a * 100)}%</td></tr>`).join("")}</tbody></table>
        </details>
      </div>
      <a class="boton rec-b1" href="${TP.url(top.id)}">Ver ficha del curso</a>
      <a class="boton sec rec-b2" href="${ruta("pages/planificador.html")}?programa=${top.id}">Planificar mis horarios para este curso</a>`;
  }

  /* ---------- Panel izquierdo ---------- */
  function segmentos() {
    return `<div class="t-prog" role="list" aria-label="Progreso">${PREG.map((p, i) => {
      const est = i < paso ? "hecho" : i === paso ? "actual" : "";
      return `<button type="button" role="listitem" class="seg ${est}" data-ir="${i}" ${i > resp.length ? "disabled" : ""} aria-label="Pregunta ${i + 1}${i < resp.length ? " (respondida)" : ""}"${i === paso ? ' aria-current="step"' : ""}></button>`;
    }).join("")}</div>`;
  }

  function pintar() {
    esperando = false;
    if (paso < PREG.length) {
      const p = PREG[paso];
      izq.innerHTML = `<p class="t-num">Pregunta ${paso + 1} de ${PREG.length}</p>${segmentos()}
        <h1 class="t-preg">${esc(p.q)}</h1>
        <div class="t-opts" role="radiogroup" aria-label="${esc(p.q)}">${p.o.map((o, i) => `
          <button type="button" class="t-opt${resp[paso] === i ? " sel" : ""}" role="radio" aria-checked="${resp[paso] === i}" data-o="${i}"><span class="ico">${svg(o[1])}</span><span>${esc(o[0])}</span><kbd aria-hidden="true">${i + 1}</kbd></button>`).join("")}</div>
        <div class="t-pie"><button type="button" class="atras" data-atras ${paso ? "" : "disabled"}>← Atrás</button><span class="guardado"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>Respuestas guardadas localmente</span></div>`;
    } else {
      const res = calcular();
      seguro(() => localStorage.setItem("test", res.top.id));
      izq.innerHTML = `<p class="t-num">Test completado</p>${segmentos()}
        <h1 class="t-preg">Tu perfil de afinidad</h1>
        <p class="t-sub">Así quedó cada programa según tus ${PREG.length} respuestas.</p>
        <ol class="ranking">${res.lista.map((x, i) => `<li${i === 0 ? ' class="top"' : ""}><a href="${TP.url(x.id)}"><span class="rk-n">${esc(TP.curso(x.id).t)}</span><i><b style="width:${x.pct}%"></b></i><span class="rk-p">${x.pct}%</span></a></li>`).join("")}</ol>
        <div class="t-pie"><button type="button" class="atras" data-atras>← Cambiar respuestas</button><button type="button" class="boton sec" data-reiniciar>Repetir test</button><span class="guardado"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>Respuestas guardadas localmente</span></div>`;
      if (!pintar.celebrado) { pintar.celebrado = true; chispas(innerWidth * .3, innerHeight / 3, 16, 60); }
    }
    pintarRec();
  }

  function responder(i) {
    if (esperando) return;
    resp = resp.slice(0, paso); resp[paso] = i; guardar();
    const botones = $$(".t-opt", izq);
    botones.forEach((b, k) => { b.classList.toggle("sel", k === i); b.setAttribute("aria-checked", k === i); });
    pintarRec();
    esperando = true;
    setTimeout(() => { paso++; pintar(); }, mov ? 0 : 380);
  }

  izq.addEventListener("click", e => {
    const o = e.target.closest("[data-o]"), seg = e.target.closest("[data-ir]");
    if (o) return responder(+o.dataset.o);
    if (seg && !seg.disabled) { paso = +seg.dataset.ir; return pintar(); }
    if (e.target.closest("[data-atras]")) { if (paso > 0 && !esperando) { paso--; pintar(); } return; }
    if (e.target.closest("[data-reiniciar]")) { resp = []; paso = 0; pintar.celebrado = false; guardar(); pintar(); }
  });
  document.addEventListener("keydown", e => {
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = +e.key;
    if (paso < PREG.length && k >= 1 && k <= PREG[paso].o.length) responder(k - 1);
  });

  /* Modo demostración: perfil de ejemplo */
  const cargarDemo = () => { resp = DEMO.slice(); paso = PREG.length; pintar.celebrado = true; guardar(); pintar(); aviso("Perfil de ejemplo cargado"); };
  rec.addEventListener("click", e => { if (e.target.closest("[data-demo-perfil]")) cargarDemo(); });
  document.addEventListener("demo", e => { if (e.detail && !resp.length) { cargarDemo(); } else pintarRec(); });
  if (TP.demo && !resp.length) { resp = DEMO.slice(0, 1); paso = 1; }   // muestra el panel ya con una respuesta

  pintar();
})();
