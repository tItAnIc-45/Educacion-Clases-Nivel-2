import { useEffect, useState } from 'react'
import { ruta } from '../data/site'
import useReveal from '../hooks/useReveal'

function restante() {
  const inicio = new Date('2026-12-01T09:00:00')
  let diferencia = inicio - Date.now()
  while (diferencia < 0) {
    inicio.setDate(inicio.getDate() + 30)
    diferencia = inicio - Date.now()
  }
  const segundos = Math.floor(diferencia / 1000)
  return {
    dias: Math.floor(segundos / 86400),
    horas: Math.floor((segundos % 86400) / 3600),
    minutos: Math.floor((segundos % 3600) / 60),
    segundos: segundos % 60,
  }
}

export default function CohortCountdown() {
  const ref = useReveal()
  const [tiempo, setTiempo] = useState(restante)

  useEffect(() => {
    const intervalo = window.setInterval(() => setTiempo(restante()), 1000)
    return () => window.clearInterval(intervalo)
  }, [])

  return (
    <section className="cuenta" id="cuenta" ref={ref}>
      <div>
        <p className="etiqueta">Próxima cohorte</p>
        <h3>Las clases comienzan en</h3>
      </div>
      <div className="reloj" role="timer" aria-live="off">
        <span>
          <b id="cd-d">{tiempo.dias}</b>días
        </span>
        <span>
          <b id="cd-h">{tiempo.horas}</b>horas
        </span>
        <span>
          <b id="cd-m">{tiempo.minutos}</b>min
        </span>
        <span>
          <b id="cd-s">{tiempo.segundos}</b>seg
        </span>
      </div>
      <a href={ruta('pages/contacto.html')} className="boton">
        Reservar mi cupo
      </a>
    </section>
  )
}
