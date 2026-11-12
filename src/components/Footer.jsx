import { useState } from 'react'
import { PAGINAS, ruta } from '../data/site'

export default function Footer({ avisar }) {
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')

  const enviar = evento => {
    evento.preventDefault()
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())
    if (!valido) {
      setError('Escribe un correo válido, por ejemplo nombre@correo.com.')
      return
    }
    setError('')
    setCorreo('')
    avisar('¡Listo! Te avisaremos de las novedades.')
  }

  return (
    <footer>
      <div className="pie">
        <div>
          <a href={ruta('index.html')} className="logo">
            <img
              className="colibri"
              src={ruta('assets/colibri-mini.png')}
              alt=""
              aria-hidden="true"
            />
            TUPLUS<b>EDUCA</b>
          </a>
          <p>Aprende hoy. Construye tu mañana.</p>
        </div>

        <div>
          <h4>Explora</h4>
          <ul>
            {PAGINAS.map(pagina => (
              <li key={pagina.id}>
                <a href={ruta(pagina.u)}>{pagina.t}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Recibe novedades</h4>
          <p>Un correo al mes con programas y consejos. Sin spam.</p>
          <form className="boletin" id="boletin" noValidate onSubmit={enviar}>
            <input
              type="email"
              id="bcorreo"
              placeholder="tu@correo.com"
              autoComplete="email"
              aria-label="Correo para recibir novedades"
              aria-invalid={Boolean(error)}
              value={correo}
              onChange={evento => setCorreo(evento.target.value)}
            />
            <button className="boton" type="submit">
              Suscribirme
            </button>
          </form>
          <small className="error" id="berr" role="alert">
            {error}
          </small>
        </div>
      </div>
      <div className="abajo">
        © <span id="anio">{new Date().getFullYear()}</span> TUPLUSEDUCA
      </div>
    </footer>
  )
}
