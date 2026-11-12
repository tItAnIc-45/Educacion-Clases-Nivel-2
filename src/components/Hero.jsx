import { useEffect, useRef, useState } from 'react'
import { PALABRAS, ruta } from '../data/site'

const quieto = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Hero({ avisar }) {
  const visual = useRef(null)
  const [texto, setTexto] = useState(() => (quieto() ? PALABRAS[0] : ''))

  useEffect(() => {
    if (quieto()) return undefined

    let palabra = 0
    let letra = 0
    let borrando = false
    let temporizador

    const escribir = () => {
      const actual = PALABRAS[palabra]
      letra += borrando ? -1 : 1
      setTexto(actual.slice(0, letra))

      let espera = borrando ? 40 : 90
      if (!borrando && letra === actual.length) {
        borrando = true
        espera = 1400
      } else if (borrando && letra === 0) {
        borrando = false
        palabra = (palabra + 1) % PALABRAS.length
        espera = 300
      }

      temporizador = window.setTimeout(escribir, espera)
    }

    temporizador = window.setTimeout(escribir, 90)
    return () => window.clearTimeout(temporizador)
  }, [])

  const inclinar = evento => {
    if (
      !visual.current ||
      quieto() ||
      !window.matchMedia('(hover: hover)').matches
    ) {
      return
    }
    const caja = visual.current.getBoundingClientRect()
    const x = (evento.clientX - caja.left) / caja.width - 0.5
    const y = (evento.clientY - caja.top) / caja.height - 0.5
    visual.current.style.setProperty('--ry', `${x * 22}deg`)
    visual.current.style.setProperty('--rx', `${y * -22}deg`)
  }

  return (
    <section className="hero" id="inicio" onMouseMove={inclinar}>
      <div className="hero-text">
        <p className="etiqueta">Cursos online para crecer</p>
        <h1>
          Tu futuro empieza con una idea. <span>La tuya.</span>
        </h1>
        <p className="rota">
          Hoy quiero aprender <b id="rota">{texto}</b>
          <i className="cursor">|</i>
        </p>
        <p className="lead">
          Aprende habilidades que el mercado pide, con proyectos reales y
          docentes que te acompañan. Estudia desde donde quieras, a tu ritmo.
        </p>
        <div className="botones">
          <a href={ruta('pages/programas.html')} className="boton">
            Ver programas
          </a>
          <a href={ruta('pages/test.html')} className="boton sec">
            Descubre tu programa
          </a>
        </div>
        <div className="estudiantes">
          <strong>+12,000 estudiantes</strong>
          <small>ya están construyendo su futuro</small>
        </div>
      </div>

      <div className="hero-visual" id="visual" ref={visual}>
        <button
          type="button"
          className="colibri-btn"
          id="saludo"
          aria-label="Saludar al colibrí"
          onClick={() => avisar('¡Los colibríes nunca dejan de aprender!')}
        >
          <img
            className="colibri"
            id="colibriHero"
            src={ruta('assets/colibri.png')}
            alt="Colibrí dorado de TUPLUSEDUCA"
            width="270"
            height="227"
          />
        </button>
        <div className="libro" aria-hidden="true">
          <span>APRENDE</span>
          <strong>∞</strong>
          <small>Crece, crea, logra</small>
        </div>
        <div className="tarjeta t1">
          ✦ Aprendizaje flexible
          <small>A tu propio ritmo</small>
        </div>
        <div className="tarjeta t2">
          ✓ Educación de calidad
          <small>Impulsa tu futuro</small>
        </div>
      </div>
    </section>
  )
}
