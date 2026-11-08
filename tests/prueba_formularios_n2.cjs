"use strict";
/* Pruebas del comportamiento, sin conexión ni credenciales reales. Node.js >=18. */
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const script=fs.readFileSync(path.join(__dirname,'../js/formularios.js'),'utf8');
const htmlContacto=fs.readFileSync(path.join(__dirname,'../pages/contacto.html'),'utf8');
let checks=0;
function ok(cond,msg){assert.ok(cond,msg);console.log('✓',msg);checks++;}
class El {
 constructor(id){this.id=id;this.name=id;this.type='text';this.tagName='INPUT';this.value='';this.checked=false;this.disabled=false;this.hidden=false;this.textContent='';this.dataset={};this.attrs={};this.events={};this.focused=false;this.children=[];this.classList={values:new Set(),add:(c)=>this.classList.values.add(c),remove:(c)=>this.classList.values.delete(c)};}
 addEventListener(event,cb){(this.events[event] ||= []).push(cb)}
 emit(event){for(const cb of (this.events[event]||[]))cb({preventDefault(){}})}
 getAttribute(a){return this.attrs[a] ?? null}
 setAttribute(a,v){this.attrs[a]=String(v)}
 removeAttribute(a){delete this.attrs[a]}
 focus(){this.focused=true}
 append(...nodes){this.children.push(...nodes)}
 insertAdjacentHTML(pos,value){this.optionHTML=value}
}
function mount(tipo,endpoint,respond){
 const els={};
 function el(id){return els[id]??(els[id]=new El(id))}
 const f=el('formulario');f.dataset.tipo=tipo;
 const btn=el('submit');btn.textContent=tipo==='contacto'?'Quiero información':'Enviar solicitud';
 f.querySelector=()=>btn;
 f.reset=()=>{for(const k of ['nombre','correo','programa'])el(k).value='';el('acepta').checked=false;};
 for(const id of ['nombre','correo','programa','acepta','error-nombre','error-correo','error-programa','error-acepta'])el(id);
 el('programa').tagName='SELECT';el('acepta').type='checkbox';
 const body=new El('body');
 const calls=[];
 const context={
  window:{ TP_FORMULARIOS_CONFIG:{contacto:endpoint,matricula:endpoint},crypto:{getRandomValues(a){for(let i=0;i<a.length;i++)a[i]=i+12;return a;}} },
  document:{getElementById:el,createElement:()=>new El(''),body},
  TP:{CURSOS:[{id:'web',t:'Desarrollo web'},{id:'excel',t:'Excel y datos'}],curso(id){return this.CURSOS.find(c=>c.id===id)}},
  esc:String,params:new URLSearchParams(''),FormData,Uint8Array,Date,AbortController,
  setTimeout,clearTimeout,fetch:async (url,opt)=>{calls.push({url,data:Object.fromEntries(opt.body)});return respond(calls.length)},
  volar:()=>{},console
 };
 vm.runInNewContext(script,context,{filename:'formularios.js'});
 context.window.TP_Formularios.iniciar(tipo);
 const toast=body.children.find(c=>c.id==='toast-formulario');
 const retryButton=toast.children[1];
 function llenar(){el('nombre').value='Ana Prueba';el('correo').value='ana@ejemplo.com';el('programa').value='web';el('acepta').checked=true}
 async function submit(){f.emit('submit');await new Promise(r=>setTimeout(r,50))}
 async function retry(){retryButton.emit('click');await new Promise(r=>setTimeout(r,50))}
 return {els:el,toast,retryButton,calls,llenar,submit,retry};
}
(async()=>{
 ok(htmlContacto.includes('<h1>Contacto</h1>'),'El titulo Contacto original se conserva');
 ok(htmlContacto.includes('>Quiero información</button>'),'El boton Contacto original se conserva');
 ok(htmlContacto.includes('>hola@tupluseduca.com</span>'),'La columna informativa original se conserva');
 ok(!htmlContacto.includes('mat-descripcion')&&!htmlContacto.includes('Formulario de matrícula'),'Contacto no es una página de matrícula');
 ok(htmlContacto.includes('data-tipo="contacto"'),'El formulario de contacto declara su tipo');
 ok(!htmlContacto.includes('id="estado-formulario"')&&!htmlContacto.includes('id="reintentar-formulario"'),'Contacto no añade estado ni botón de reintento bajo el formulario');
 ok(script.includes('notificacion-formulario'),'El aviso de estado es flotante y no ocupa espacio bajo el formulario');
 let m=mount('contacto','',()=>({ok:true,json:async()=>({ok:true})}));
 await m.submit();
 for(const id of ['nombre','correo','programa'])ok(!!m.els('error-'+id).textContent,'Error obligatorio: '+id);
 ok(m.els('nombre').focused,'Enfoque al primer campo incorrecto');
 m.llenar();m.els('correo').value='correo-equivocado';
 await m.submit();
 ok(!!m.els('error-correo').textContent,'Correo inválido rechazado');
 ok(m.els('nombre').value==='Ana Prueba','No borra los datos al validar');
 m.els('correo').value='ana@ejemplo.com';await m.submit();
 ok(m.calls.length===0,'Sin proveedor no hace solicitudes de red');
 ok(m.toast.dataset.estado==='error'&&!m.toast.hidden,'Sin proveedor muestra aviso flotante de error, sin falso éxito');
 m=mount('contacto','https://formspree.io/f/test1234',async n=>n===1?({ok:false,status:503,json:async()=>({ok:false})}):({ok:true,status:200,json:async()=>({ok:true})}));
 m.llenar();await m.submit();
 ok(m.calls.length===1,'Se intentó POST de Contacto');
 ok(m.toast.dataset.estado==='error','HTTP 503 muestra error');
 ok(!m.retryButton.hidden&&m.retryButton.focused,'HTTP 503 permite reintentar desde el aviso con foco accesible');
 ok(m.els('nombre').value==='Ana Prueba','HTTP 503 conserva los datos');
 await m.retry();
 ok(m.calls.length===2,'Reintento vuelve a enviar');
 ok(m.toast.dataset.estado==='exito'&&!m.toast.hidden&&m.retryButton.hidden,'Solo con 2xx y JSON ok:true aparece el aviso flotante de éxito');
 ok(/^CON-20\d{2}-[0-9A-F]{12}$/.test(m.calls[0].data.codigo_solicitud),'Código de consulta presente');
 ok(m.calls[0].data.codigo_solicitud===m.calls[1].data.codigo_solicitud,'Reintento conserva el código');
 ok(m.calls[0].data.tipo_solicitud==='consulta_informacion','Contacto es solicitud de información');
 ok(m.calls[0].data.email==='ana@ejemplo.com','El servicio recibe el correo de respuesta');
 m=mount('matricula','https://formspree.io/f/test1234',async()=>({ok:true,status:200,json:async()=>({ok:true})}));
 m.llenar();m.els('acepta').checked=false;await m.submit();
 ok(m.calls.length===0&&m.els('error-acepta').textContent,'Matrícula requiere autorización de envío');
 m.els('acepta').checked=true;await m.submit();
 ok(m.calls.length===1,'POST matrícula');
 ok(m.calls[0].data.tipo_solicitud==='solicitud_matricula','Matrícula distinguible de Contacto');
 ok(/^SOL-20\d{2}-[0-9A-F]{12}$/.test(m.calls[0].data.codigo_solicitud),'Código matrícula visible y registrable');
 ok(m.toast.children[0].textContent.includes(m.calls[0].data.codigo_solicitud),'Código de matrícula mostrado al usuario');
 ok(m.toast.children[0].textContent.includes('no está confirmado'),'No promete cupos reservados');
 m=mount('matricula','https://formspree.io/f/test1234',async()=>{throw Error('offline')});
 m.llenar();await m.submit();
 ok(m.toast.dataset.estado==='error'&&m.toast.getAttribute('role')==='alert','Red caída: aviso flotante de error anunciado de forma accesible');
 ok(!m.retryButton.hidden,'Red caída: opción reintentar');
 ok(m.els('programa').value==='web','Red caída: conserva curso seleccionado');
 console.log(`\nTOTAL ${checks} pruebas correctas`);
})().catch(e=>{console.error(e);process.exitCode=1});
