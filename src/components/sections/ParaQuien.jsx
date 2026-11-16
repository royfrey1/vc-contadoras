import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'

import { site, waLink } from '../../data/site'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { unsplashSrcSet } from '../../lib/unsplash'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { WhatsAppIcon } from '../ui/icons'

const ease = [0.22, 1, 0.36, 1]
const PANEL_ID = 'perfiles-panel'
const tabId = (id) => `perfil-tab-${id}`

/*
 * Selector de perfiles con el patrón ARIA de tabs.
 * Las pestañas son un único tablist: verticales en desktop, "pills" con scroll horizontal en mobile.
 * Los 4 contenidos se apilan en la misma celda de una grilla: el panel toma la altura del más alto
 * (no salta al cambiar), las imágenes quedan precargadas y el cambio es un crossfade.
 */
export default function ParaQuien() {
  const { perfiles } = site
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const tabsRef = useRef([])
  const listRef = useRef(null)

  const select = (index, { focus = false } = {}) => {
    setActive(index)
    const tab = tabsRef.current[index]
    if (focus) tab?.focus()

    // En mobile, centramos la pill activa dentro del scroll horizontal (sin mover la página)
    const list = listRef.current
    if (list && tab && list.scrollWidth > list.clientWidth) {
      list.scrollTo({
        left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
        behavior: reduce ? 'auto' : 'smooth',
      })
    }
  }

  const onKeyDown = (event) => {
    const last = perfiles.length - 1
    // Partimos de la pestaña con foco (no del estado) para que las teclas repetidas no se pierdan
    const focused = tabsRef.current.indexOf(document.activeElement)
    const current = focused === -1 ? active : focused
    const keys = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowRight: current === last ? 0 : current + 1,
      ArrowUp: current === 0 ? last : current - 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    select(keys[event.key], { focus: true })
  }

  return (
    <section id="para-quien" className="bg-cream py-24 md:py-32">
      <Container>
        <SectionTitle
          align="left"
          eyebrow="A quién ayudamos"
          title={
            <>
              Cada situación fiscal es distinta. <em className="font-normal italic">La tuya también.</em>
            </>
          }
          description="Elegí tu perfil y mirá cómo te podemos acompañar."
          className="max-w-3xl"
        />

        <Reveal
          delay={0.1}
          className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 md:mt-16 lg:grid-cols-12 lg:gap-14"
        >
          {/* ── Pestañas ─────────────────────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <div
              ref={listRef}
              role="tablist"
              aria-label="Perfiles de clientes"
              aria-orientation={isDesktop ? 'vertical' : 'horizontal'}
              onKeyDown={onKeyDown}
              className="relative -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:p-0 [&::-webkit-scrollbar]:hidden"
            >
              {perfiles.map((perfil, i) => {
                const selected = i === active
                const Icon = perfil.icono
                return (
                  <button
                    key={perfil.id}
                    ref={(el) => {
                      tabsRef.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={tabId(perfil.id)}
                    aria-selected={selected}
                    aria-controls={PANEL_ID}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    className={`group relative shrink-0 snap-center rounded-full border px-5 py-2.5 text-left text-[0.78rem] font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-offset-2 lg:flex lg:w-full lg:items-center lg:gap-5 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:py-6 lg:pr-2 lg:pl-7 lg:text-base lg:font-normal lg:whitespace-normal ${
                      selected
                        ? 'border-ink text-cream lg:text-ink'
                        : 'border-ink/15 text-stone hover:border-ink/40 hover:text-ink lg:hover:text-ink/80'
                    }`}
                  >
                    {/* Fondo de la pill activa (mobile) y barra indicadora (desktop), con deslizamiento */}
                    {selected && (
                      <>
                        <motion.span
                          layoutId="perfil-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-0 rounded-full bg-ink lg:hidden"
                          transition={{ duration: 0.45, ease }}
                        />
                        <motion.span
                          layoutId="perfil-bar"
                          aria-hidden="true"
                          className="absolute inset-y-5 left-0 hidden w-0.5 rounded-full bg-ink lg:block"
                          transition={{ duration: 0.45, ease }}
                        />
                      </>
                    )}

                    <span aria-hidden="true" className="eyebrow relative hidden w-6 shrink-0 text-[0.62rem] lg:inline">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="relative lg:flex-1 lg:font-serif lg:text-[2rem] lg:leading-tight">
                      {perfil.nombre}
                    </span>
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.25}
                      className={`relative hidden size-5 shrink-0 transition-opacity duration-300 lg:block ${
                        selected ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            {/* En desktop va debajo de la lista; en mobile, debajo del panel */}
            <NotListed className="mt-8 hidden lg:block" />
          </div>

          {/* ── Panel ────────────────────────────────────────── */}
          <div
            role="tabpanel"
            id={PANEL_ID}
            aria-labelledby={tabId(perfiles[active].id)}
            className="grid grid-cols-[minmax(0,1fr)] rounded-3xl bg-sand p-5 sm:p-8 lg:col-span-7 lg:p-10"
          >
            {perfiles.map((perfil, i) => (
              <ProfileContent key={perfil.id} perfil={perfil} isActive={i === active} reduce={reduce} />
            ))}
          </div>

          <NotListed className="-mt-2 lg:hidden" />
        </Reveal>
      </Container>
    </section>
  )
}

function NotListed({ className = '' }) {
  const { perfilesCierre } = site
  return (
    <p className={`text-sm font-light text-stone ${className}`}>
      {perfilesCierre.pregunta}{' '}
      <a
        href={waLink(perfilesCierre.mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-normal text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
      >
        {perfilesCierre.link}
      </a>
    </p>
  )
}

function ProfileContent({ perfil, isActive, reduce }) {
  const state = isActive ? 'active' : 'inactive'

  const container = {
    inactive: {
      opacity: 0,
      y: reduce ? 0 : -8,
      transition: { duration: 0.25, ease: 'easeIn' },
    },
    active: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0.3 : 0.45,
        delay: 0.15,
        ease,
        when: 'beforeChildren',
        staggerChildren: reduce ? 0 : 0.05,
      },
    },
  }
  const item = {
    inactive: { opacity: 0, y: reduce ? 0 : 10, transition: { duration: 0.2 } },
    active: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
  }

  return (
    <motion.div
      // Todos los contenidos ocupan la misma celda: el panel mide lo que el más alto
      className={`col-start-1 row-start-1 flex flex-col ${isActive ? '' : 'pointer-events-none'}`}
      aria-hidden={!isActive}
      inert={!isActive}
      variants={container}
      initial={false}
      animate={state}
    >
      <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-line sm:aspect-video">
        <motion.img
          src={perfil.imagen.url}
          srcSet={unsplashSrcSet(perfil.imagen.url, [640, 960, 1200])}
          sizes="(min-width: 1024px) 40rem, (min-width: 640px) 90vw, 100vw"
          alt={perfil.imagen.alt}
          width="1200"
          height="675"
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
          initial={false}
          animate={{ scale: isActive || reduce ? 1 : 1.04 }}
          transition={{ duration: isActive ? 0.7 : 0.3, ease }}
        />
      </div>

      <blockquote className="relative mt-8 pl-8 sm:mt-10 sm:pl-10">
        <span
          aria-hidden="true"
          className="absolute -top-3 left-0 font-serif text-6xl leading-none text-ink/20 sm:-top-4 sm:text-7xl"
        >
          “
        </span>
        <p className="font-serif text-[1.55rem] leading-snug text-ink italic sm:text-[1.9rem]">
          {perfil.frase}
          <span aria-hidden="true" className="text-ink/30">
            ”
          </span>
        </p>
      </blockquote>

      <p className="mt-5 text-[0.95rem] leading-relaxed font-light text-stone">{perfil.descripcion}</p>

      <p className="eyebrow mt-8 text-stone">Lo que te resolvemos</p>
      <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {perfil.puntos.map((punto) => (
          <motion.li key={punto} variants={item} className="flex gap-3 text-sm leading-snug text-ink/85">
            <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full border border-ink/25">
              <Check className="size-3" strokeWidth={1.75} aria-hidden="true" />
            </span>
            {punto}
          </motion.li>
        ))}
      </ul>

      <div className="mt-auto pt-9">
        <Button
          href={perfil.whatsapp}
          external
          className="w-full sm:w-auto"
          aria-label={`Quiero asesoramiento para ${perfil.nombre.toLowerCase()} (WhatsApp)`}
        >
          <WhatsAppIcon className="size-4" />
          Quiero asesoramiento
        </Button>
      </div>
    </motion.div>
  )
}
