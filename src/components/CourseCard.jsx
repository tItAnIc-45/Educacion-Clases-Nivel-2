import { estrellas, ruta, sinAcentos, soles, urlCurso } from '../data/site'

export default function CourseCard({ curso }) {
  return (
    <article className="curso" data-cat={curso.cat} data-id={curso.id}>
      <div
        className="curso-cabecera"
        style={{
          background: `linear-gradient(135deg, ${curso.g[0]}, ${curso.g[1]})`,
        }}
      >
        <img
          src={ruta(curso.imagen)}
          alt={curso.t}
          className="curso-img"
          loading="lazy"
          width="640"
          height="360"
        />
        {curso.etiqueta && (
          <span className={`badge badge-${sinAcentos(curso.etiqueta)}`}>
            {curso.etiqueta}
          </span>
        )}
      </div>
      <div className="curso-cont">
        <small>{curso.cat}</small>
        <h3>{curso.t}</h3>
        <p>{curso.d}</p>
        <div className="valora" aria-label={`Valoración ${curso.r} de 5`}>
          <b>{curso.r.toFixed(1)}</b>
          <span aria-hidden="true">{estrellas(curso.r)}</span>
          <small>({curso.n})</small>
        </div>
        <div className="meta">
          {curso.dur} · {curso.niv} · {soles(curso.p)}
        </div>
        <a className="ver" href={urlCurso(curso.id)}>
          Ver curso
        </a>
      </div>
    </article>
  )
}
