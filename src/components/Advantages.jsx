import { VENTAJAS, ruta } from '../data/site'
import useReveal from '../hooks/useReveal'

export default function Advantages() {
  const ref = useReveal()

  return (
    <section className="seccion" id="nosotros" ref={ref}>
      <p className="etiqueta">Nuestra esencia</p>
      <h2>
        Aprende con propósito. <span>Crece sin límites.</span>
      </h2>
      <p className="descripcion">
        En TUPLUSEDUCA creemos que aprender es el punto de partida para crear
        oportunidades. Te damos recursos prácticos y herramientas digitales para
        avanzar.
      </p>
      <div className="ventajas">
        {VENTAJAS.map(ventaja => (
          <article key={ventaja.t}>
            <i aria-hidden="true">{ventaja.icono}</i>
            <h3>{ventaja.t}</h3>
            <p>{ventaja.d}</p>
          </article>
        ))}
      </div>
      <a className="enlace-flecha" href={ruta('pages/nosotros.html')}>
        Conoce nuestra historia →
      </a>
    </section>
  )
}
