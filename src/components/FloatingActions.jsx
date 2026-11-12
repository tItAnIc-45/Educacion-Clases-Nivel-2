import { useEffect, useState } from 'react'
import { WHATSAPP } from '../data/site'

export default function FloatingActions() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY >= 600)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  const subir = () => {
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' })
  }

  return (
    <>
      <a
        className="whatsapp"
        href={WHATSAPP}
        target="_blank"
        rel="noopener"
        aria-label="Escribir por WhatsApp"
      >
        💬
      </a>
      <button
        type="button"
        id="subir"
        className="icono"
        aria-label="Volver arriba"
        hidden={!visible}
        onClick={subir}
      >
        ↑
      </button>
    </>
  )
}
