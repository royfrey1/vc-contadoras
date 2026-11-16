import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'motion/react'

import { site, waLink } from '../../data/site'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { WhatsAppIcon } from '../ui/icons'

/*
 * La línea de progreso y los marcadores usan la misma referencia: una franja horizontal
 * imaginaria al 65% del alto de la pantalla. La línea se llena hasta esa altura y cada
 * marcador se activa cuando su centro la cruza, así ambos coinciden.
 */
const TRIGGER = '65%'

export default function Proceso() {
  const reduce = useReducedMotion()

  return (
    <section id="proceso" className="overflow-x-clip bg-sand py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Columna izquierda: sticky en desktop (no choca con el navbar: top-28 > 4rem) */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionTitle
              align="left"
              eyebrow="Cómo trabajamos"
              title={
                <>
                  Empezar es <em className="font-normal italic">más simple</em> de lo que pensás
                </>
              }
              description="Un proceso claro, sin letra chica, para que sepas en todo momento en qué estamos."
            />
            <Attention className="mt-12 hidden lg:block" />
          </div>

          <Timeline reduce={reduce} className="lg:col-span-7 lg:pt-3" />

          {/* En mobile y tablet, el bloque de atención va al final */}
          <Attention className="lg:hidden" />
        </div>
      </Container>
    </section>
  )
}

function Timeline({ reduce, className = '' }) {
  const listRef = useRef(null)
  const lineRef = useRef(null)
  const markersRef = useRef([])
  const [line, setLine] = useState({ top: 0, height: 0 })

  // La línea va del centro del primer marcador al centro del último
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const markers = markersRef.current.filter(Boolean)
      if (markers.length < 2) return
      const first = markers[0]
      const last = markers[markers.length - 1]
      const top = first.offsetTop + first.offsetHeight / 2
      const bottom = last.offsetTop + last.offsetHeight / 2
      setLine((prev) => (prev.top === top && prev.height === bottom - top ? prev : { top, height: bottom - top }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: [`start ${TRIGGER}`, `end ${TRIGGER}`],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })

  return (
    <ol ref={listRef} className={`relative ${className}`}>
      {/* Línea de fondo + línea de progreso (decorativas) */}
      <div
        ref={lineRef}
        aria-hidden="true"
        className="absolute left-[19.5px] w-px bg-line lg:left-[23.5px]"
        style={{ top: line.top, height: line.height }}
      >
        <motion.div
          className="absolute inset-0 origin-top bg-ink"
          style={{ scaleY: reduce ? 1 : progress }}
        />
      </div>

      {site.proceso.map((paso, i) => (
        <Step
          key={paso.numero}
          paso={paso}
          reduce={reduce}
          markerRef={(el) => {
            markersRef.current[i] = el
          }}
        />
      ))}
    </ol>
  )
}

function Step({ paso, reduce, markerRef }) {
  const { numero, icono: Icon, titulo, descripcion, etiqueta } = paso
  const ref = useRef(null)
  // "En vista" = su centro ya pasó por encima de la franja del 65% (margen superior enorme
  // para que siga activo aunque salga por arriba de la pantalla; se desactiva al volver a subir)
  const reached = useInView(ref, { margin: `100000px 0px -${100 - parseInt(TRIGGER)}% 0px`, amount: 0.5 })
  const active = reduce || reached

  return (
    <li className="flex gap-6 pb-16 last:pb-0 sm:gap-8 lg:gap-10 lg:pb-36">
      <span
        ref={(el) => {
          ref.current = el
          markerRef(el)
        }}
        aria-hidden="true"
        className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-serif text-lg leading-none lining-nums transition-colors duration-500 ease-elegant lg:size-12 lg:text-xl ${
          active ? 'border-ink bg-ink text-cream' : 'border-ink/30 bg-sand text-ink'
        }`}
      >
        {numero}
      </span>

      <Reveal x={24} y={0} className="min-w-0 pt-1 lg:pt-2">
        <Icon className="size-5 text-stone" strokeWidth={1.25} aria-hidden="true" />
        <h3 className="mt-3 text-[1.75rem] leading-tight text-ink sm:text-[2rem]">
          <span className="sr-only">Paso {Number(numero)}: </span>
          {titulo}
        </h3>
        <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed font-light text-stone">{descripcion}</p>
        <p className="mt-5 inline-flex rounded-full border border-ink/25 px-3.5 py-1.5 text-[0.62rem] font-medium tracking-[0.2em] text-ink uppercase">
          {etiqueta}
        </p>
      </Reveal>
    </li>
  )
}

function Attention({ className = '' }) {
  const atencion = site.procesoAtencion
  return (
    <Reveal className={className}>
      <div className="border-t border-line pt-8">
        <p className="eyebrow text-stone">{atencion.titulo}</p>
        <ul className="mt-6 space-y-4">
          {atencion.items.map(({ icono: Icon, texto }) => (
            <li key={texto} className="flex items-center gap-4 text-sm leading-snug text-ink/85">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink">
                <Icon className="size-4" strokeWidth={1.25} aria-hidden="true" />
              </span>
              {texto}
            </li>
          ))}
        </ul>
        <Button href={waLink(atencion.mensaje)} external className="mt-8 w-full sm:w-auto">
          <WhatsAppIcon className="size-4" />
          {atencion.boton}
        </Button>
      </div>
    </Reveal>
  )
}
