import { useEffect, useRef } from 'react'

/* Añade la animación de aparición que usa animaciones.css (.reveal / .ok). */
export default function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducir) {
      el.classList.add('ok')
      return undefined
    }

    el.classList.add('reveal')
    const observador = new IntersectionObserver(
      entradas => {
        entradas.forEach(entrada => {
          if (!entrada.isIntersecting) return
          entrada.target.classList.add('ok')
          observador.unobserve(entrada.target)
        })
      },
      { threshold: 0.12 },
    )
    observador.observe(el)

    return () => observador.disconnect()
  }, [])

  return ref
}
