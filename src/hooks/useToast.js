import { useCallback, useEffect, useRef, useState } from 'react'

/* Aviso flotante compartido por navbar, hero, pie y formularios. */
export default function useToast() {
  const [mensaje, setMensaje] = useState('')
  const temporizador = useRef(null)

  const avisar = useCallback(texto => {
    setMensaje(texto)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => setMensaje(''), 2800)
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(temporizador.current)
    },
    [],
  )

  return { mensaje, avisar }
}
