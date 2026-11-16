import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { site } from '../../data/site'
import { WhatsAppIcon } from '../ui/icons'

const SHOW_AFTER_MS = 3500
const SHOW_AFTER_SCROLL = 320

/** Botón flotante de WhatsApp: aparece tras unos segundos o al scrollear un poco. */
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (visible) return
    const show = () => setVisible(true)
    const timer = setTimeout(show, SHOW_AFTER_MS)
    const onScroll = () => window.scrollY > SHOW_AFTER_SCROLL && show()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [visible])

  // Contenedor siempre presente: el menú mobile lo vuelve inerte aunque el botón aparezca después de abrirlo
  return (
    <div>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed right-5 bottom-5 z-40 sm:right-8 sm:bottom-8"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribinos por WhatsApp"
              className="group relative flex size-14 items-center justify-center rounded-full bg-ink text-cream shadow-[0_12px_30px_-10px_rgba(51,56,59,0.6)] ring-1 ring-cream/25 transition-[transform,background-color] focus-visible:ring-2 focus-visible:ring-cream duration-300 ease-elegant hover:-translate-y-1 hover:bg-ink-soft"
            >
              {/* Onda sutil que se repite unas pocas veces para llamar la atención */}
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-ink"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{ duration: 1.8, repeat: 3, repeatDelay: 1.2, ease: 'easeOut', delay: 0.6 }}
                />
              )}
              <WhatsAppIcon className="relative size-6" />

              {/* Tooltip (solo desktop) */}
              <span
                role="tooltip"
                className="pointer-events-none absolute top-1/2 right-full mr-4 hidden -translate-y-1/2 translate-x-2 rounded-full bg-ink px-4 py-2 font-serif text-lg whitespace-nowrap text-cream italic opacity-0 shadow-lg transition-all duration-300 ease-elegant group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
              >
                ¿Hablamos?
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
