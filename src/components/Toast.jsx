export default function Toast({ mensaje }) {
  return (
    <div
      id="toast"
      className={mensaje ? 'ver' : undefined}
      role="status"
      aria-live="polite"
    >
      {mensaje}
    </div>
  )
}
