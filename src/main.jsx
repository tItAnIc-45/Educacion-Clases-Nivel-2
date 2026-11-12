import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/base.css'
import '../css/componentes.css'
import '../css/paginas.css'
import '../css/animaciones.css'
import '../css/nuevo.css'
import '../css/responsive.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
