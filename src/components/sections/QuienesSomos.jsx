import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { BadgeCheck } from 'lucide-react'

import { site, waLink } from '../../data/site'
import { unsplashSrcSet } from '../../lib/unsplash'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { LinkedInIcon, WhatsAppIcon } from '../ui/icons'

const ease = [0.22, 1, 0.36, 1]
// Parallax distinto para cada retrato (refuerza el desfase tipo revista)
const PARALLAX = [18, 36]

export default function QuienesSomos() {
  const cierre = site.equipoCierre

  return (
    <section id="quienes-somos" className="bg-cream py-24 md:py-32">
      <Container>
        {/* Encabezado editorial: título a la izquierda, presentación a la derecha (desktop) */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <SectionTitle
            align="left"
            eyebrow="Quiénes somos"
            title={
              <>
                Detrás de VC, dos contadoras que <em className="font-normal italic">te conocen por tu nombre</em>
              </>
            }
            className="lg:col-span-7"
          />
          <Reveal delay={0.16} className="lg:col-span-5 lg:pb-2">
            <p className="max-w-md text-[0.95rem] leading-relaxed font-light text-stone sm:text-base lg:ml-auto">
              {site.equipoIntro}
            </p>
          </Reveal>
        </div>

        {/* Perfiles: 1 columna (mobile), retrato + texto lado a lado (tablet), 2 columnas desfasadas (desktop) */}
        <div className="mt-16 grid gap-y-20 md:mt-20 md:gap-y-24 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          {site.equipo.map((persona, i) => (
            <Profile key={persona.id} persona={persona} index={i} className={i === 1 ? 'lg:mt-40' : ''} />
          ))}
        </div>

        {/* Cierre */}
        <Reveal className="mt-24 border-t border-line pt-16 text-center md:mt-32 md:pt-20">
          <p className="mx-auto max-w-2xl font-serif text-[2rem] leading-tight text-balance text-ink italic sm:text-4xl md:text-[2.75rem]">
            {cierre.frase}
          </p>
          <Button
            href={waLink(cierre.mensaje)}
            external
            size="lg"
            className="mt-9 w-full max-sm:px-4 max-sm:tracking-[0.14em] sm:w-auto"
          >
            <WhatsAppIcon className="size-4" />
            {cierre.boton}
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}

function Profile({ persona, index, className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const baseDelay = index * 0.15

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const amount = PARALLAX[index] ?? 24
  const photoY = useTransform(scrollYProgress, [0, 1], [amount, -amount])

  const text = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : baseDelay + 0.55 } },
  }
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.4 : 0.7, ease } },
  }

  return (
    <article
      ref={ref}
      aria-labelledby={`${persona.id}-nombre`}
      className={`md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:items-start md:gap-10 lg:block ${className}`}
    >
      <Portrait persona={persona} photoY={reduce ? 0 : photoY} delay={baseDelay} reduce={reduce} />

      <motion.div
        className="mt-10 md:mt-0 lg:mt-12"
        variants={text}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      >
        <motion.p variants={item} className="eyebrow text-stone">
          {persona.cargo}
        </motion.p>
        <motion.h3
          variants={item}
          id={`${persona.id}-nombre`}
          className="mt-4 text-[2.6rem] leading-none text-ink sm:text-5xl"
        >
          {persona.nombre} <em className="font-normal italic">{persona.apellido}</em>
        </motion.h3>

        <motion.blockquote variants={item} className="mt-7">
          <p className="font-serif text-[1.45rem] leading-snug text-ink/90 italic sm:text-2xl">
            <span aria-hidden="true" className="text-ink/30">
              “
            </span>
            {persona.frase}
            <span aria-hidden="true" className="text-ink/30">
              ”
            </span>
          </p>
        </motion.blockquote>

        <motion.p variants={item} className="mt-5 max-w-lg text-[0.95rem] leading-relaxed font-light text-stone">
          {persona.bio}
        </motion.p>

        <motion.ul variants={item} className="mt-6 flex flex-wrap gap-2" aria-label="Especialidades">
          {persona.especialidades.map((esp) => (
            <li
              key={esp}
              className="rounded-full border border-ink/20 px-3.5 py-1.5 text-[0.62rem] font-medium tracking-[0.18em] text-ink uppercase"
            >
              {esp}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={item} className="mt-8 border-t border-line pt-5">
          <Formation persona={persona} reduce={reduce} />
        </motion.div>
      </motion.div>
    </article>
  )
}

function Portrait({ persona, photoY, delay, reduce }) {
  return (
    <figure className="group relative mx-auto w-full max-w-md md:max-w-none">
      {/* Marco fino desplazado detrás: se acerca un poco al pasar el mouse */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-ink/20 transition-transform duration-700 ease-elegant group-hover:translate-x-1.5 group-hover:translate-y-1.5 sm:translate-x-5 sm:translate-y-5 sm:group-hover:translate-x-3 sm:group-hover:translate-y-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1, delay: reduce ? 0 : delay + 0.5, ease }}
      />

      {/* Retrato en arco: clip-path de abajo hacia arriba al entrar en pantalla */}
      <motion.div
        className="relative aspect-[8/9] overflow-hidden rounded-t-full bg-sand md:aspect-[4/5]"
        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: reduce ? 0.5 : 1.2, delay: reduce ? 0 : delay, ease }}
      >
        {/* Capa de parallax (más alta que el arco para que no se vean bordes) */}
        <motion.div className="absolute inset-x-0 -top-[7%] h-[114%]" style={{ y: photoY }}>
          {/* Capa de zoom-out de entrada */}
          <motion.div
            className="size-full"
            initial={{ scale: reduce ? 1 : 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.6, delay: reduce ? 0 : delay, ease }}
          >
            <img
              src={persona.foto.url}
              srcSet={unsplashSrcSet(persona.foto.url, [480, 720, 900])}
              sizes="(min-width: 1024px) 34rem, (min-width: 768px) 45vw, 28rem"
              alt={persona.foto.alt}
              width="900"
              height="1125"
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-[50%_25%] transition-transform duration-700 ease-elegant group-hover:scale-[1.04]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tarjeta de matrícula sobre la parte inferior del retrato */}
      <motion.figcaption
        className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 rounded-xl border border-line/80 bg-cream/85 py-2 pr-4 pl-2.5 text-xs text-ink shadow-[0_14px_30px_-20px_rgba(51,56,59,0.4)] backdrop-blur-md sm:bottom-6 sm:left-6"
        initial={{ opacity: 0, y: reduce ? 0 : 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.7, delay: reduce ? 0 : delay + 0.9, ease }}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-cream">
          <BadgeCheck className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        {persona.matricula}
      </motion.figcaption>
    </figure>
  )
}

function Formation({ persona, reduce }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const external = persona.linkedin && persona.linkedin !== '#'

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="group/acc -ml-1 flex items-center gap-3 rounded-full py-2 pr-3 pl-1 text-[0.7rem] font-medium tracking-[0.2em] text-ink uppercase"
        >
          {/* Ícono + que rota a − */}
          <span
            aria-hidden="true"
            className="relative flex size-7 items-center justify-center rounded-full border border-ink/25 transition-colors duration-300 group-hover/acc:border-ink"
          >
            <span className="absolute h-px w-3 bg-ink" />
            <span
              className={`absolute h-3 w-px bg-ink transition-transform duration-[400ms] ease-elegant ${
                open ? 'rotate-90 scale-y-0' : ''
              }`}
            />
          </span>
          Formación y trayectoria
        </button>

        <a
          href={persona.linkedin}
          aria-label={`LinkedIn de ${persona.nombre}`}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream"
        >
          <LinkedInIcon className="size-3.5" />
        </a>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="formacion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.38, ease }}
            className="overflow-hidden"
          >
            <ol className="mt-4 ml-3.5 space-y-5 border-l border-line pb-1 pl-6">
              {persona.formacion.map((f) => (
                <li key={f.titulo} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-[0.45rem] -left-[calc(1.5rem+3.5px)] size-1.5 rounded-full bg-ink"
                  />
                  <p className="text-sm font-medium text-ink">{f.titulo}</p>
                  <p className="mt-0.5 text-sm font-light text-stone">
                    {f.institucion} <span aria-hidden="true">·</span> <span className="whitespace-nowrap">{f.anio}</span>
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
