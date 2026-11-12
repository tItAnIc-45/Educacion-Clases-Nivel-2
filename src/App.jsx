import { useEffect, useState } from 'react'
import Advantages from './components/Advantages'
import CohortCountdown from './components/CohortCountdown'
import Cta from './components/Cta'
import FloatingActions from './components/FloatingActions'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ProgramsSection from './components/ProgramsSection'
import SearchPalette from './components/SearchPalette'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import Toast from './components/Toast'
import { ruta } from './data/site'
import useToast from './hooks/useToast'

const leerDemo = () => {
  try {
    return window.localStorage.getItem('demo') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const { mensaje, avisar } = useToast()
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)
  const [demo, setDemo] = useState(leerDemo)

  useEffect(() => {
    document.body.dataset.pagina = 'inicio'
    document.body.dataset.raiz = ''
    document.title = 'Aprende sin límites | TUPLUSEDUCA'
  }, [])

  useEffect(() => {
    const atajos = evento => {
      if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === 'k') {
        evento.preventDefault()
        setBusquedaAbierta(abierta => !abierta)
      }
    }
    window.addEventListener('keydown', atajos)
    return () => window.removeEventListener('keydown', atajos)
  }, [])

  const alternarDemo = () => {
    const nuevo = !demo
    setDemo(nuevo)
    try {
      window.localStorage.setItem('demo', nuevo ? '1' : '0')
    } catch {
      /* almacenamiento no disponible */
    }
    avisar(
      nuevo
        ? 'Modo Demostración activado'
        : 'Modo Demostración desactivado',
    )
  }

  return (
    <>
      <Navbar
        pagina="inicio"
        demo={demo}
        onDemo={alternarDemo}
        onSearch={() => setBusquedaAbierta(true)}
      />

      <main>
        <Hero avisar={avisar} />
        <Stats />
        <CohortCountdown />
        <Advantages />
        <ProgramsSection />

        <section className="seccion">
          <Cta
            className="test-cta"
            titulo="¿No sabes por dónde empezar?"
            texto="Responde 3 preguntas y te recomendamos un programa."
            href={ruta('pages/test.html')}
            boton="Hacer el test"
          />
        </section>

        <Testimonials />

        <section className="seccion">
          <Cta
            titulo="Todo gran cambio empieza con aprender."
            texto="Déjanos tus datos y te enviamos la información del programa que elijas."
            href={ruta('pages/contacto.html')}
            boton="Quiero información"
          />
        </section>
      </main>

      <Footer avisar={avisar} />
      <FloatingActions />
      <SearchPalette
        abierta={busquedaAbierta}
        onCerrar={() => setBusquedaAbierta(false)}
      />
      <Toast mensaje={mensaje} />
    </>
  )
}
