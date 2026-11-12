/* Datos compartidos por los componentes React.
   Se mantienen en sincronía con js/datos.js del sitio estático. */

export const BASE = import.meta.env.BASE_URL

export const PAGINAS = [
  { id: 'inicio', t: 'Inicio', u: 'index.html' },
  { id: 'programas', t: 'Programas', u: 'pages/programas.html' },
  { id: 'test', t: 'Test', u: 'pages/test.html' },
  { id: 'nosotros', t: 'Nosotros', u: 'pages/nosotros.html' },
  { id: 'planificador', t: 'Planificador', u: 'pages/planificador.html' },
  { id: 'contacto', t: 'Contacto', u: 'pages/contacto.html' },
]

export const CURSOS = [
  {
    id: 'web',
    cat: 'Tecnología',
    t: 'Desarrollo web',
    s: '</>',
    g: ['#2b5c72', '#122b40'],
    imagen: 'assets/desarrollo-web.jpg',
    etiqueta: 'Popular',
    d: 'Aprende HTML, CSS y JavaScript desde cero y publica tu propio sitio.',
    dur: '12 semanas',
    niv: 'Inicial',
    p: 249,
    h: 60,
    r: 4.8,
    n: 312,
    l: ['Maquetación con HTML y CSS', 'JavaScript e interactividad', 'Proyecto final publicado'],
  },
  {
    id: 'datos',
    cat: 'Tecnología',
    t: 'Excel y análisis de datos',
    s: 'Σ',
    g: ['#2c6b57', '#10302c'],
    imagen: 'assets/excel-datos.jpg',
    d: 'Ordena, analiza y presenta datos para tomar mejores decisiones.',
    dur: '8 semanas',
    niv: 'Inicial',
    p: 189,
    h: 40,
    r: 4.7,
    n: 244,
    l: ['Fórmulas y tablas dinámicas', 'Gráficos y paneles', 'Caso práctico con datos reales'],
  },
  {
    id: 'diseno',
    cat: 'Creatividad',
    t: 'Diseño gráfico',
    s: '✧',
    g: ['#6c4d78', '#29233f'],
    imagen: 'assets/diseno-grafico.jpg',
    etiqueta: 'Popular',
    d: 'Transforma tus ideas en diseños atractivos y profesionales.',
    dur: '10 semanas',
    niv: 'Inicial',
    p: 219,
    h: 50,
    r: 4.9,
    n: 287,
    l: ['Color, tipografía y composición', 'Identidad de marca', 'Portafolio de 3 proyectos'],
  },
  {
    id: 'video',
    cat: 'Creatividad',
    t: 'Edición de video',
    s: '▶',
    g: ['#7a3f4d', '#2b1e2e'],
    imagen: 'assets/edicion-video.jpg',
    d: 'Edita videos para redes y proyectos con un flujo de trabajo ordenado.',
    dur: '8 semanas',
    niv: 'Intermedio',
    p: 199,
    h: 40,
    r: 4.6,
    n: 168,
    l: ['Montaje y ritmo', 'Audio y color', 'Video final para redes'],
  },
  {
    id: 'marketing',
    cat: 'Negocios',
    t: 'Marketing digital',
    s: '↗',
    g: ['#7a6031', '#2a2b31'],
    imagen: 'assets/marketing.png',
    d: 'Aprende a promocionar marcas y proyectos en redes y buscadores.',
    dur: '10 semanas',
    niv: 'Inicial',
    p: 229,
    h: 50,
    r: 4.7,
    n: 259,
    l: ['Estrategia y contenido', 'Publicidad en redes', 'Métricas y resultados'],
  },
  {
    id: 'emprende',
    cat: 'Negocios',
    t: 'Emprendimiento',
    s: '◆',
    g: ['#3d5a80', '#1b2a41'],
    imagen: 'assets/emprendimiento.jpg',
    etiqueta: 'Nuevo',
    d: 'Convierte una idea en un negocio con un plan claro y validado.',
    dur: '6 semanas',
    niv: 'Inicial',
    p: 169,
    h: 30,
    r: 4.6,
    n: 96,
    l: ['Validación de la idea', 'Modelo de negocio', 'Plan de lanzamiento'],
  },
]

export const DESTACADOS = ['web', 'diseno', 'marketing']

export const VENTAJAS = [
  {
    icono: '◆',
    t: 'Aprende haciendo',
    d: 'Practica con proyectos reales desde la primera semana.',
  },
  {
    icono: '◐',
    t: 'Docentes expertos',
    d: 'Profesionales en actividad que te guían y resuelven tus dudas.',
  },
  {
    icono: '◷',
    t: 'A tu ritmo',
    d: 'Organiza tus horarios y estudia desde cualquier lugar.',
  },
  {
    icono: '▲',
    t: 'Crece profesionalmente',
    d: 'Certificado y portafolio para mostrar lo que sabes hacer.',
  },
]

export const ESTADISTICAS = [
  { n: 12000, s: '+', t: 'Estudiantes' },
  { n: 85, s: '+', t: 'Cursos' },
  { n: 96, s: '%', t: 'Satisfacción' },
  { n: 40, s: '+', t: 'Docentes' },
]

export const TESTIMONIOS = [
  {
    t: 'Empecé sin saber nada de código y hoy publiqué la web de mi negocio. Los proyectos reales hicieron la diferencia.',
    n: 'María P.',
    c: 'Desarrollo web',
  },
  {
    t: 'Estudio de noche, después del trabajo. Poder avanzar a mi ritmo me permitió terminar el programa.',
    n: 'Jorge L.',
    c: 'Marketing digital',
  },
  {
    t: 'Armé mi portafolio de diseño en tres meses y ya tengo mis primeros clientes.',
    n: 'Camila R.',
    c: 'Diseño gráfico',
  },
]

export const PALABRAS = CURSOS.map(c => c.t.toLowerCase())

export const WHATSAPP =
  'https://wa.me/51999999999?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20los%20programas'

export const soles = n => `S/ ${n}`

export const estrellas = r =>
  '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))

export const sinAcentos = texto =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export const ruta = archivo => `${BASE}${archivo}`

export const urlCurso = id => `${BASE}pages/curso.html?id=${id}`

export const curso = id => CURSOS.find(c => c.id === id)
