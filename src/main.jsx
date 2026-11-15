import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
/* Los estilos compartidos viven en public/css y se cargan con <link> en react.html.
   Importarlos desde src rompería el build al no existir ya en la raíz del proyecto. */
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
