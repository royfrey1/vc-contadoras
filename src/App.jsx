import { MotionConfig } from 'motion/react'

import { DEMO, SITE_URL } from './config'
import { site } from './data/site'
import { jsonParaScript } from './lib/faq'
import { accountingServiceJsonLd } from './lib/seo'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/layout/WhatsAppButton'

import Hero from './components/sections/Hero'
import Servicios from './components/sections/Servicios'
import ParaQuien from './components/sections/ParaQuien'
import Proceso from './components/sections/Proceso'
import PorQueElegirnos from './components/sections/PorQueElegirnos'
import QuienesSomos from './components/sections/QuienesSomos'
import Vencimientos from './components/sections/Vencimientos'
import Faq from './components/sections/Faq'
import Testimonios from './components/sections/Testimonios'

// JSON-LD del estudio: preparado, pero desactivado mientras sea DEMO (se publica con VITE_DEMO=false)
const ESTUDIO_JSON_LD = DEMO ? null : jsonParaScript(accountingServiceJsonLd(site, SITE_URL))

export default function App() {
  return (
    // reducedMotion="user": respeta prefers-reduced-motion en todas las animaciones de motion
    <MotionConfig reducedMotion="user">
      {/* Primer elemento con foco: visible solo al tabular */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-[0.72rem] focus:font-medium focus:tracking-[0.18em] focus:text-cream focus:uppercase focus:shadow-lg focus-visible:outline-ink"
      >
        Saltar al contenido
      </a>

      {ESTUDIO_JSON_LD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ESTUDIO_JSON_LD }} />}

      <Navbar />
      {/* tabIndex -1: el skip link le pasa el foco (sin sumarlo al orden de tabulación) */}
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Servicios />
        <ParaQuien />
        <Proceso />
        <PorQueElegirnos />
        <QuienesSomos />
        <Vencimientos />
        <Faq />
        <Testimonios />
      </main>
      <Footer />
      <WhatsAppButton />
    </MotionConfig>
  )
}
