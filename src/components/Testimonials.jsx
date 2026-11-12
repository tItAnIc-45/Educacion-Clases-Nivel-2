import { useEffect, useState } from 'react'
import { TESTIMONIOS } from '../data/site'
import useReveal from '../hooks/useReveal'

export default function Testimonials() {
  const ref = useReveal()
  const [indice, setIndice] = useState(0)
  const [pausa, setPausa] = useState(false)
  const [ciclo, setCiclo] = useState(0)

  useEffect(() => {
    if (pausa) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const intervalo = window.setInterval(() => {
      setIndice(actual => (actual + 1) % TESTIMONIOS.length)
    }, 6000)

    return () => window.clearInterval(intervalo)
  }, [pausa, ciclo])

  const mover = paso => {
    setIndice(
      actual => (actual + paso + TESTIMONIOS.length) % TESTIMONIOS.length,
    )
    setCiclo(valor => valor + 1)
  }

  const irA = destino => {
    setIndice(destino)
    setCiclo(valor => valor + 1)
  }

  return (
    <section className="seccion programas" id="historias" ref={ref}>
      <p className="etiqueta">Historias reales</p>
      <h2>
        Lo que dicen <span>nuestros estudiantes.</span>
      </h2>
      <div
        className="carrusel"
        aria-roledescription="carrusel"
        onMouseEnter={() => setPausa(true)}
        onMouseLeave={() => setPausa(false)}
      >
        <div
          className="pista"
          id="pista"
          style={{ transform: `translateX(-${indice * 100}%)` }}
        >
          {TESTIMONIOS.map(testimonio => (
            <figure key={testimonio.n}>
              <blockquote>{testimonio.t}</blockquote>
              <figcaption>
                <b>{testimonio.n}</b> · {testimonio.c}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="ctrl">
          <button
            type="button"
            className="icono"
            id="prev"
            aria-label="Anterior"
            onClick={() => mover(-1)}
          >
            ‹
          </button>
          <div id="puntos" className="puntos">
            {TESTIMONIOS.map((testimonio, posicion) => (
              <button
                key={testimonio.n}
                type="button"
                aria-label={`Ir al testimonio ${posicion + 1}`}
                aria-current={posicion === indice}
                onClick={() => irA(posicion)}
              />
            ))}
          </div>
          <button
            type="button"
            className="icono"
            id="next"
            aria-label="Siguiente"
            onClick={() => mover(1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
