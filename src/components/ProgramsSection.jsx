import { DESTACADOS, curso, ruta } from '../data/site'
import CourseCard from './CourseCard'
import useReveal from '../hooks/useReveal'

export default function ProgramsSection() {
  const ref = useReveal()
  const destacados = DESTACADOS.map(id => curso(id)).filter(Boolean)

  return (
    <section className="seccion programas" ref={ref}>
      <p className="etiqueta">Programas destacados</p>
      <h2>
        Empieza por <span>donde más te guste.</span>
      </h2>
      <div className="cursos destacados" id="destacados">
        {destacados.map(programa => (
          <CourseCard key={programa.id} curso={programa} />
        ))}
      </div>
      <a className="enlace-flecha" href={ruta('pages/programas.html')}>
        Ver los 6 programas →
      </a>
    </section>
  )
}
