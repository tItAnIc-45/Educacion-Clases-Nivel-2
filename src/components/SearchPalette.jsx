import { useEffect, useMemo, useRef, useState } from 'react'
import { CURSOS, PAGINAS, ruta, sinAcentos, urlCurso } from '../data/site'

export default function SearchPalette({ abierta, onCerrar }) {
  const dialogo = useRef(null)
  const entrada = useRef(null)
  const [consulta, setConsulta] = useState('')
  const [seleccion, setSeleccion] = useState(0)

  const items = useMemo(
    () => [
      ...PAGINAS.map(p => ({
        t: `Ir a ${p.t}`,
        s: 'Página',
        u: ruta(p.u),
      })),
      ...CURSOS.map(c => ({
        t: c.t,
        s: c.cat,
        u: urlCurso(c.id),
      })),
    ],
    [],
  )

  const lista = useMemo(() => {
    const q = sinAcentos(consulta)
    return items.filter(item => sinAcentos(`${item.t} ${item.s}`).includes(q))
  }, [consulta, items])

  const activo = Math.min(seleccion, Math.max(lista.length - 1, 0))

  useEffect(() => {
    const d = dialogo.current
    if (!d) return

    if (abierta && !d.open) {
      setConsulta('')
      setSeleccion(0)
      d.showModal()
      window.requestAnimationFrame(() => entrada.current?.focus())
    } else if (!abierta && d.open) {
      d.close()
    }
  }, [abierta])

  const ir = item => {
    if (!item) return
    onCerrar()
    window.location.href = item.u
  }

  const alTeclear = evento => {
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
      evento.preventDefault()
      const paso = evento.key === 'ArrowDown' ? 1 : -1
      const total = Math.max(lista.length, 1)
      setSeleccion((activo + paso + total) % total)
    } else if (evento.key === 'Enter') {
      evento.preventDefault()
      ir(lista[activo])
    } else if (evento.key === 'Escape') {
      onCerrar()
    }
  }

  return (
    <dialog
      id="paleta"
      ref={dialogo}
      aria-label="Buscar en el sitio"
      onClose={onCerrar}
      onClick={evento => {
        if (evento.target === evento.currentTarget) {
          evento.currentTarget.close()
        }
      }}
    >
      <input
        id="pq"
        type="search"
        ref={entrada}
        value={consulta}
        placeholder="Busca una página o un programa…"
        autoComplete="off"
        aria-label="Buscar"
        onChange={evento => {
          setConsulta(evento.target.value)
          setSeleccion(0)
        }}
        onKeyDown={alTeclear}
      />
      <ul id="pl" role="listbox">
        {lista.length ? (
          lista.map((item, indice) => (
            <li
              key={item.u}
              role="option"
              aria-selected={indice === activo}
              onClick={() => ir(item)}
            >
              <span>{item.t}</span>
              <small>{item.s}</small>
            </li>
          ))
        ) : (
          <li>
            <small>No encontramos nada con esa búsqueda.</small>
          </li>
        )}
      </ul>
      <small>↑ ↓ para moverte · Enter para abrir · Esc para cerrar</small>
    </dialog>
  )
}
