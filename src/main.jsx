import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Solo los pesos que se usan: Montserrat 300/400/500 y Cormorant 400/500 + 400 itálica
// (fontsource ya declara font-display: swap)
import '@fontsource/montserrat/latin-300.css'
import '@fontsource/montserrat/latin-400.css'
import '@fontsource/montserrat/latin-500.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
