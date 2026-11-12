import { useEffect, useState } from 'react'
import { PAGINAS, ruta } from '../data/site'

const ACENTOS = [
  { c: '', c2: '', color: '#d4af37', nombre: 'Dorado' },
  { c: '#35b8a0', c2: '#7fe0cc', color: '#35b8a0', nombre: 'Turquesa' },
  { c: '#e0749b', c2: '#f5a3bf', color: '#e0749b', nombre: 'Rosa' },
  { c: '#6fa8ff', c2: '#a9ccff', color: '#6fa8ff', nombre: 'Azul' },
]

const leer = (clave, porDefecto = '') => {
  try {
    return window.localStorage.getItem(clave) ?? porDefecto
  } catch {
    return porDefecto
  }
}

const guardar = (clave, valor) => {
  try {
    window.localStorage.setItem(clave, valor)
  } catch {
    /* almacenamiento no disponible */
  }
}

export default function Navbar({ pagina = 'inicio', onSearch, onDemo, demo }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [tema, setTema] = useState(
    () => document.documentElement.dataset.tema || 'oscuro',
  )
  const [acento, setAcento] = useState(() => leer('acento'))
  const [sombra, setSombra] = useState(false)
  const [progreso, setProgreso] = useState(0)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    guardar('tema', tema)
  }, [tema])

  useEffect(() => {
    const estilo = document.documentElement.style
    const elegido = ACENTOS.find(a => a.c === acento)
    if (!elegido || !elegido.c) {
      estilo.removeProperty('--dorado')
      estilo.removeProperty('--dorado2')
    } else {
      estilo.setProperty('--dorado', elegido.c)
      estilo.setProperty('--dorado2', elegido.c2)
    }
    guardar('acento', acento)
  }, [acento])

  useEffect(() => {
    const alScroll = () => {
      const maximo =
        document.documentElement.scrollHeight - window.innerHeight
      setProgreso(maximo > 0 ? (window.scrollY / maximo) * 100 : 0)
      setSombra(window.scrollY > 10)
    }
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  const claro = tema === 'claro'

  return (
    <>
      <div className="progreso" id="progreso" style={{ width: `${progreso}%` }} />
      <header className={`header${sombra ? ' sombra' : ''}`} id="header">
        <a href={ruta('index.html')} className="logo">
          <img
            className="colibri"
            src={ruta('assets/colibri-mini.png')}
            alt=""
            aria-hidden="true"
          />
          TUPLUS<b>EDUCA</b>
        </a>

        <nav
          id="menu"
          aria-label="Principal"
          className={menuAbierto ? 'abierto' : undefined}
        >
          {PAGINAS.map(p => (
            <a
              key={p.id}
              href={ruta(p.u)}
              className={p.id === pagina ? 'activo' : undefined}
              aria-current={p.id === pagina ? 'page' : undefined}
              onClick={() => setMenuAbierto(false)}
            >
              {p.t}
            </a>
          ))}
        </nav>

        <div className="acciones">
          <button
            type="button"
            className="demo-pill"
            aria-pressed={demo}
            title="Carga datos de ejemplo en el test y el planificador"
            onClick={onDemo}
          >
            <i aria-hidden="true" />
            <span>Modo Demostración</span>
          </button>

          <div className="acentos" role="group" aria-label="Color de acento">
            {ACENTOS.map(a => (
              <button
                key={a.nombre}
                type="button"
                className="punto"
                data-c={a.c}
                style={{ '--c': a.color }}
                aria-label={a.nombre}
                aria-pressed={acento === a.c}
                onClick={() => setAcento(a.c)}
              />
            ))}
          </div>

          <button
            type="button"
            className="icono"
            id="abrirPaleta"
            aria-label="Buscar en el sitio (Ctrl+K)"
            onClick={onSearch}
          >
            ⌕
          </button>
          <button
            type="button"
            className="icono"
            id="tema"
            aria-label={claro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            onClick={() => setTema(claro ? 'oscuro' : 'claro')}
          >
            {claro ? '☀' : '☾'}
          </button>
          <button
            type="button"
            className="icono"
            id="hamburguesa"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            aria-controls="menu"
            onClick={() => setMenuAbierto(abierto => !abierto)}
          >
            {menuAbierto ? '✕' : '☰'}
          </button>
        </div>
      </header>
    </>
  )
}
