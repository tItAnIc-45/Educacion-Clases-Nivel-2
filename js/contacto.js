"use strict";
/* Pantalla de contacto: envío real del formulario y datos copiables */
TP_Formularios.iniciar("contacto");
$$("[data-copiar]").forEach(b => b.addEventListener("click", () => copiar(b.dataset.copiar, "Copiado: " + b.dataset.copiar)));
