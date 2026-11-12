export default function Cta({ titulo, texto, href, boton, className = '' }) {
  return (
    <div className={`cta ${className}`.trim()}>
      <div>
        <h2>{titulo}</h2>
        <p>{texto}</p>
      </div>
      <a className="boton" href={href}>
        {boton}
      </a>
    </div>
  )
}
