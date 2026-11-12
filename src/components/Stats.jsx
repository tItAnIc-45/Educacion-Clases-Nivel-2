import { useEffect, useState } from 'react'
import { ESTADISTICAS } from '../data/site'
import useReveal from '../hooks/useReveal'

export default function Stats() {
  const ref = useReveal()
  const [valores, setValores] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? ESTADISTICAS.map(est => est.n)
      : ESTADISTICAS.map(() => 0),
  )

  useEffect(() => {
    const seccion = ref.current
    if (!seccion) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let cuadro = 0
    const observador = new IntersectionObserver(
      entradas => {
        if (!entradas.some(entrada => entrada.isIntersecting)) return
        observador.disconnect()

        const inicio = performance.now()
        const paso = ahora => {
          const avance = Math.min((ahora - inicio) / 1400, 1)
          setValores(
            ESTADISTICAS.map(est =>
              Math.round(est.n * (1 - Math.pow(1 - avance, 3))),
            ),
          )
          if (avance < 1) cuadro = window.requestAnimationFrame(paso)
        }
        cuadro = window.requestAnimationFrame(paso)
      },
      { threshold: 0.12 },
    )

    observador.observe(seccion)
    return () => {
      observador.disconnect()
      window.cancelAnimationFrame(cuadro)
    }
  }, [ref])

  return (
    <section className="estadisticas" ref={ref}>
      {ESTADISTICAS.map((est, indice) => (
        <div key={est.t}>
          <strong data-n={est.n} data-s={est.s}>
            {valores[indice].toLocaleString('es-PE')}
            {valores[indice] === est.n ? est.s : ''}
          </strong>
          <small>{est.t}</small>
        </div>
      ))}
    </section>
  )
}
