import { useEffect, useRef, useState } from 'react'
import { animate, AnimatePresence, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'

import { site } from '../../data/site'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Reveal from '../ui/Reveal'

const ease = [0.22, 1, 0.36, 1]
const ITEMS = site.testimonios
const TOTAL = ITEMS.length
const CONFIG = site.testimoniosConfig
const SWIPE_UMBRAL = 60 // px de arrastre para cambiar de testimonio
const pad = (n) => String(n).padStart(2, '0')

const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Testimonios() {
  const reduce = useReducedMotion()
  const isTouch = useMediaQuery('(pointer: coarse)')
  const sectionRef = useRef(null)

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  // Con prefers-reduced-motion arranca pausado (sin autoplay)
  const [playing, setPlaying] = useState(() => !prefiereMenosMovimiento())
  const [hovered, setHovered] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const inView = useInView(sectionRef, { amount: 0.3 })

  // El autoplay corre solo si nada lo está pausando
  const running = playing && !hovered && !focusWithin && inView && pageVisible

  // Progreso del testimonio activo (0 → 1). Se congela al pausar y continúa al reanudar.
  const progress = useMotionValue(0)

  const goTo = (target, dir) => {
    const next = (target + TOTAL) % TOTAL
    if (next === index) return
    setDirection(dir)
    setIndex(next)
    progress.set(0)
  }
  const next = () => goTo(index + 1, 1)
  const prev = () => goTo(index - 1, -1)

  useEffect(() => {
    if (!running) return
    const remaining = (1 - progress.get()) * CONFIG.intervalo
    const controls = animate(progress, 1, {
      duration: remaining / 1000,
      ease: 'linear',
      onComplete: () => {
        setDirection(1)
        setIndex((i) => (i + 1) % TOTAL)
        progress.set(0)
      },
    })
    return () => controls.stop()
  }, [running, index, progress])

  // Pestaña oculta → pausa
  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    }
  }

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false)
  }

  const controls = (
    <Controls
      index={index}
      direction={direction}
      playing={playing}
      onPrev={prev}
      onNext={next}
      onTogglePlay={() => setPlaying((p) => !p)}
      reduce={reduce}
    />
  )

  return (
    <section
      ref={sectionRef}
      id="testimonios"
      aria-roledescription="carrusel"
      aria-label="Testimonios de clientes"
      className="overflow-x-clip bg-sand py-24 md:py-32"
    >
      <Container>
        <div
          onKeyDown={onKeyDown}
          onFocus={() => setFocusWithin(true)}
          onBlur={onBlur}
        >
          {/* Encabezado + controles (desktop) */}
          <div className="flex items-end justify-between gap-10">
            <SectionTitle
              align="left"
              eyebrow="Testimonios"
              title={
                <>
                  Lo que dicen quienes <em className="font-normal italic">ya trabajan con nosotras</em>
                </>
              }
              className="max-w-2xl"
            />
            <Reveal delay={0.2} className="hidden shrink-0 pb-2 lg:block">
              {controls}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-12 md:mt-16">
            {/* Tarjeta: todos los testimonios superpuestos en la misma celda (la altura no salta) */}
            <motion.div
              className={`relative rounded-3xl border border-line bg-cream px-6 pt-16 pb-8 sm:px-12 sm:pt-20 sm:pb-10 lg:px-20 lg:pt-24 lg:pb-12 ${
                isTouch ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''
              }`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              drag={isTouch ? 'x' : false}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_UMBRAL || info.velocity.x < -500) next()
                else if (info.offset.x > SWIPE_UMBRAL || info.velocity.x > 500) prev()
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-4 font-serif text-[8rem] leading-none text-ink/[0.09] select-none sm:-top-4 sm:left-8 sm:text-[11rem] lg:-top-6 lg:left-12 lg:text-[14rem]"
              >
                “
              </span>

              <div className="relative grid" aria-live={running ? 'off' : 'polite'}>
                {ITEMS.map((t, i) => (
                  <Slide key={t.id} t={t} i={i} active={i === index} direction={direction} reduce={reduce} />
                ))}
              </div>
            </motion.div>

            {/* Segmentos de progreso + controles (mobile/tablet) */}
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:mt-8">
              <Segments index={index} progress={progress} onSelect={(i) => goTo(i, i > index ? 1 : -1)} />
              <div className="lg:hidden">{controls}</div>
            </div>

            {CONFIG.mostrarAvisoDemo && <p className="mt-8 text-xs text-stone">{CONFIG.aviso}</p>}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ── Un testimonio ─────────────────────────────────────────────────────── */

const slideVariants = {
  enter: (dir) => ({
    opacity: [0, 1],
    x: [dir * 40, 0],
    transition: { duration: 0.6, ease, delay: 0.1 },
  }),
  exit: (dir) => ({
    opacity: 0,
    x: dir * -40,
    transition: { duration: 0.35, ease: 'easeIn' },
  }),
}
const fadeVariants = {
  enter: { opacity: 1, transition: { duration: 0.4, delay: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}
const captionVariants = {
  enter: { opacity: [0, 1], y: [8, 0], transition: { duration: 0.5, ease, delay: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

function Slide({ t, i, active, direction, reduce }) {
  return (
    // role="group" va en un div (no está permitido sobre <figure>); el figure conserva cita + autor
    <motion.div
      role="group"
      aria-roledescription="testimonio"
      aria-label={`${i + 1} de ${TOTAL}`}
      aria-hidden={!active}
      inert={!active}
      custom={direction}
      variants={reduce ? fadeVariants : slideVariants}
      initial={false}
      animate={active ? 'enter' : 'exit'}
      className={`col-start-1 row-start-1 flex flex-col ${active ? '' : 'pointer-events-none opacity-0'}`}
    >
      <figure className="flex flex-1 flex-col">
        <blockquote className="flex-1">
          <p className="max-w-[46rem] font-serif text-[1.45rem] leading-[1.38] text-ink sm:text-[1.75rem] lg:text-[2.15rem] lg:leading-[1.32]">
            {t.texto}
          </p>
        </blockquote>

        <motion.figcaption
          variants={reduce ? fadeVariants : captionVariants}
          className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-6 lg:mt-12"
        >
          <span className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-lg tracking-wide text-cream"
            >
              {t.iniciales}
            </span>
            <span className="flex flex-col">
              <span className="text-[0.95rem] font-medium text-ink">{t.nombre}</span>
              <span className="text-sm font-light text-stone">
                {t.actividad} · {t.ubicacion}
              </span>
            </span>
          </span>
          <span className="rounded-full border border-ink/20 px-3.5 py-1.5 text-[0.62rem] font-medium tracking-[0.18em] text-ink uppercase">
            {t.perfil}
          </span>
        </motion.figcaption>
      </figure>
    </motion.div>
  )
}

/* ── Controles: contador, flechas y pausa ──────────────────────────────── */

function Controls({ index, direction, playing, onPrev, onNext, onTogglePlay, reduce }) {
  const circle =
    'flex items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream'

  return (
    <div className="flex items-center gap-3">
      <p className="mr-2 flex items-center font-serif text-2xl leading-8 text-ink lining-nums" aria-hidden="true">
        <span className="relative inline-block h-8 w-[1.6ch] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.span
              key={index}
              custom={direction}
              className="absolute inset-0 block leading-8"
              initial={reduce ? { opacity: 0 } : { y: `${direction * 100}%`, opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: `${direction * -100}%`, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              {pad(index + 1)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="mx-1.5 h-8 text-stone">/</span>
        <span className="h-8 text-stone">{pad(TOTAL)}</span>
      </p>

      <button type="button" onClick={onPrev} aria-label="Testimonio anterior" className={`${circle} size-12`}>
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button type="button" onClick={onNext} aria-label="Testimonio siguiente" className={`${circle} size-12`}>
        <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? 'Pausar el pase automático' : 'Reanudar el pase automático'}
        aria-pressed={!playing}
        className={`${circle} ml-1 size-9`}
      >
        {playing ? (
          <Pause className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Play className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

/* ── Segmentos (barra de progreso del autoplay) ────────────────────────── */

function Segments({ index, progress, onSelect }) {
  return (
    <div className="flex flex-1 gap-2 sm:max-w-md lg:max-w-none">
      {ITEMS.map((t, i) => {
        const active = i === index
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Ir al testimonio ${i + 1} de ${TOTAL}`}
            aria-current={active ? 'true' : undefined}
            className="group flex h-8 flex-1 items-center"
          >
            <span
              className={`relative block h-0.5 w-full overflow-hidden rounded-full transition-colors duration-300 ${
                active ? 'bg-ink/25' : 'bg-ink/12 group-hover:bg-ink/30'
              }`}
            >
              {active && (
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-ink"
                  style={{ scaleX: progress }}
                />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
