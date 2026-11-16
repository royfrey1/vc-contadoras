import { motion, useReducedMotion } from 'motion/react'

import { site } from '../../data/site'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Button from '../ui/Button'

const ease = [0.22, 1, 0.36, 1]

/*
 * Grilla bento (desktop, 4 columnas × 3 filas, sin huecos):
 *   ┌──────────┬────┬────┐
 *   │          │ 1  │ 2  │
 *   │ destacada├────┼────┤
 *   │          │ 3  │ 4  │
 *   ├──────────┴┬───┴────┤
 *   │     5     │   6    │
 *   └───────────┴────────┘
 * Tablet: 2 columnas (destacada arriba a lo ancho). Mobile: 1 columna.
 */
export default function PorQueElegirnos() {
  const reduce = useReducedMotion()

  const grid = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  }
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0.4 : 0.7, ease } },
  }

  return (
    <section id="nosotras-numeros" data-nav-theme="dark" className="overflow-x-clip bg-ink pt-24 pb-16 text-cream md:pt-32 md:pb-20">
      <Container>
        <SectionTitle
          align="left"
          tone="dark"
          eyebrow="Por qué elegirnos"
          title={
            <>
              Dos contadoras, un mismo compromiso: <em className="font-normal italic">que entiendas tus números</em>
            </>
          }
          className="max-w-3xl"
        />

        <motion.div
          className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          variants={grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          <FeaturedCard variants={card} />

          {/* display: contents para que los <li> participen de la grilla; role="list" conserva la semántica en Safari */}
          <ul role="list" className="contents">
            {site.diferenciales.map((item) => (
              <motion.li key={item.titulo} variants={card} className={`flex ${item.ancho ? 'lg:col-span-2' : ''}`}>
                <Spotlight className="flex w-full flex-col p-7 sm:p-8">
                  <IconCircle icon={item.icono} />
                  <h3 className="mt-8 text-[1.65rem] leading-tight text-cream">{item.titulo}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed font-light text-cream/70">{item.texto}</p>
                </Spotlight>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </Container>

      <KeywordRibbon />
    </section>
  )
}

function FeaturedCard({ variants }) {
  const d = site.diferencialesDestacado
  return (
    <motion.div variants={variants} className="flex md:col-span-2 lg:row-span-2">
      <Spotlight className="flex w-full flex-col justify-between bg-ink-soft p-8 sm:p-10 lg:p-12" featured>
        {/* Monograma VC muy tenue, recortado por la tarjeta */}
        <img
          src={site.logos.claro}
          alt=""
          aria-hidden="true"
          width="320"
          height="225"
          className="pointer-events-none absolute -right-16 -bottom-24 w-[26rem] max-w-none opacity-[0.045] select-none sm:w-[32rem]"
        />
        <div className="relative">
          <p className="eyebrow text-cream/70">{d.eyebrow}</p>
          <p className="mt-6 max-w-md font-serif text-[2.4rem] leading-[1.08] text-balance text-cream sm:text-5xl lg:text-[3.4rem]">
            {d.frase}
          </p>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed font-light text-cream/75">{d.texto}</p>
        </div>
        <div className="relative mt-10">
          <Button href={d.boton.href} variant="light">
            {d.boton.label}
          </Button>
        </div>
      </Spotlight>
    </motion.div>
  )
}

/** Tarjeta con efecto spotlight: un degradado radial que sigue al cursor (solo mouse). */
function Spotlight({ className = '', featured = false, children }) {
  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      onPointerMove={onPointerMove}
      className={`group relative overflow-hidden rounded-3xl border transition-colors duration-500 ease-elegant hover:border-cream/30 ${
        featured ? 'border-cream/15' : 'border-cream/[0.13]'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgb(251 248 247 / 0.07), transparent 45%)',
        }}
      />
      {children}
    </div>
  )
}

function IconCircle({ icon: Icon }) {
  return (
    <span className="relative flex size-11 items-center justify-center rounded-full border border-cream/25 text-cream">
      <Icon className="size-[1.15rem]" strokeWidth={1.25} aria-hidden="true" />
    </span>
  )
}

/** Cinta decorativa de palabras clave: loop infinito, se pausa con el mouse y queda quieta con reduced motion. */
function KeywordSequence() {
  return (
    <div className="flex shrink-0 items-center">
      {site.palabrasClave.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-6 font-serif text-4xl whitespace-nowrap text-cream/40 italic md:px-8 md:text-6xl">
            {word}
          </span>
          <span className="text-sm text-cream/20 md:text-base">✦</span>
        </span>
      ))}
    </div>
  )
}

function KeywordRibbon() {
  return (
    <div aria-hidden="true" className="mt-20 overflow-x-clip border-t border-cream/10 bg-ink pt-10 md:mt-24 md:pt-12">
      <div className="flex w-max animate-marquee bg-ink hover:[animation-play-state:paused] motion-reduce:animate-none">
        <KeywordSequence />
        <KeywordSequence />
      </div>
    </div>
  )
}
