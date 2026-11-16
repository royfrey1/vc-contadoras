import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, CalendarDays, Check } from 'lucide-react'

import { site } from '../../data/site'
import { obligaciones } from '../../data/vencimientos'
import { formatearDiaMes, proximoVencimiento } from '../../lib/vencimientos'
import { unsplashSrcSet } from '../../lib/unsplash'
import Container from '../ui/Container'
import Button from '../ui/Button'
import CountUp from '../ui/CountUp'
import { WhatsAppIcon } from '../ui/icons'

const { hero } = site
const ease = [0.22, 1, 0.36, 1]

// Próximo vencimiento del Monotributo (misma lógica que la sección Vencimientos), ej. "20 de noviembre"
const proximoMonotributo = proximoVencimiento(
  obligaciones.find((o) => o.id === 'monotributo'),
  new Date(),
)
const FECHA_VENCIMIENTO = proximoMonotributo ? formatearDiaMes(proximoMonotributo) : ''

/*
 * Línea de tiempo de la entrada (segundos desde la carga):
 * 0.15 eyebrow · 0.30–0.95 título palabra por palabra · 0.95 subrayado de "ordenar"
 * 0.75 bajada · 0.90 botones · 0.10–1.10 imagen (clip-path + zoom-out; arranca enseguida porque es el LCP)
 * 1.25 / 1.45 tarjetas flotantes · 1.10 indicadores (cuentan hasta ~2.4)
 */
const T = {
  eyebrow: 0.15,
  title: 0.3,
  wordStagger: 0.07,
  underline: 0.95,
  lead: 0.75,
  ctas: 0.9,
  image: 0.1,
  frame: 0.9,
  card1: 1.25,
  card2: 1.45,
  stats: 1.1,
}

// Mismo srcset que el <link rel="preload"> que vite.config.js agrega en index.html
const HERO_SRCSET = unsplashSrcSet(hero.imagen.url, hero.imagen.anchos)

export default function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)

  // Parallax muy leve de la foto dentro del arco
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['-3%', '4%'])

  const fade = (delay, y = 18) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.4 : 0.8, delay: reduce ? 0 : delay, ease },
  })

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative overflow-hidden bg-cream pt-28 pb-20 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-24 lg:pb-28"
    >
      {/* lg:pb-28: deja lugar abajo para el indicador "Deslizá" (no se monta sobre los indicadores en notebooks) */}
      {/* Fondo: panel sand a la derecha (desktop) y monograma VC muy tenue abajo a la izquierda */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[34%] bg-sand lg:block" />
      <img
        src={site.logos.oscuro}
        alt=""
        aria-hidden="true"
        width="320"
        height="225"
        className="pointer-events-none absolute -bottom-24 -left-28 hidden w-[30rem] opacity-[0.025] select-none lg:block"
      />

      <Container className="relative">
        <div className="grid gap-y-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:grid-rows-[auto_auto] lg:gap-x-14 lg:gap-y-10 xl:gap-x-20">
          {/* ── Texto ─────────────────────────────────────────── */}
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <motion.p {...fade(T.eyebrow, 0)} className="eyebrow flex items-center gap-4 text-stone">
              <span aria-hidden="true" className="h-px w-8 shrink-0 bg-ink/30 sm:w-10" />
              {hero.eyebrow}
            </motion.p>

            <HeroTitle reduce={reduce} />

            <motion.p
              {...fade(T.lead)}
              className="mt-6 max-w-[34rem] text-[0.95rem] leading-relaxed font-light text-stone sm:text-base lg:text-[1.05rem]"
            >
              {hero.bajada}
            </motion.p>

            <motion.div {...fade(T.ctas)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button href={site.whatsappLink} external size="lg" className="w-full max-sm:px-4 max-sm:text-[0.68rem] max-sm:tracking-[0.12em] sm:w-auto sm:px-7">
                <WhatsAppIcon className="size-4" />
                {hero.ctaPrincipal}
              </Button>
              <Button href={hero.ctaSecundario.href} variant="outline" size="lg" className="w-full max-sm:px-4 max-sm:text-[0.68rem] max-sm:tracking-[0.12em] sm:w-auto sm:px-7">
                {hero.ctaSecundario.label}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Button>
            </motion.div>
          </div>

          {/* ── Imagen ────────────────────────────────────────── */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <figure className="relative mx-auto w-full max-w-[24rem] sm:max-w-[28rem] lg:mr-0 lg:max-w-[30rem]">
              {/* Marco fino desplazado detrás */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-ink/20 sm:translate-x-5 sm:translate-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: reduce ? 0 : T.frame, ease }}
              />

              {/* Foto en arco: se revela de abajo hacia arriba con un leve zoom-out */}
              <motion.div
                className="relative aspect-square overflow-hidden rounded-t-full bg-sand lg:aspect-auto lg:h-[min(37rem,calc(100svh-12rem))] lg:min-h-[28rem]"
                initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: reduce ? 0.5 : 1, delay: reduce ? 0 : T.image, ease }}
              >
                <motion.div className="absolute inset-x-0 -top-[6%] h-[112%]" style={reduce ? undefined : { y: photoY }}>
                  <motion.img
                    src={hero.imagen.url}
                    srcSet={HERO_SRCSET}
                    sizes={hero.imagen.sizes}
                    alt={hero.imagen.alt}
                    width={hero.imagen.ancho}
                    height={hero.imagen.alto}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="size-full object-cover object-[50%_65%]"
                    initial={{ scale: reduce ? 1 : 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.6, delay: T.image, ease }}
                  />
                </motion.div>
              </motion.div>

              {/* Tarjeta 1: solo desde sm, sobresale a la izquierda de la foto */}
              <FloatingCard
                reduce={reduce}
                delay={T.card1}
                floatDelay={0}
                className="absolute top-[36%] -left-6 hidden sm:block lg:-left-14"
                icon={Check}
                title={hero.tarjetas.monotributo.titulo}
                text={hero.tarjetas.monotributo.texto}
              />

              {/* Tarjeta 2: en mobile queda dentro de la foto, abajo a la izquierda */}
              <FloatingCard
                reduce={reduce}
                delay={T.card2}
                floatDelay={1.8}
                className="absolute bottom-4 left-3 sm:-right-6 sm:bottom-10 sm:left-auto lg:-right-8"
                icon={CalendarDays}
                title={hero.tarjetas.vencimiento.titulo}
                text={FECHA_VENCIMIENTO}
                detail={hero.tarjetas.vencimiento.detalle}
              />
            </figure>
          </div>

          {/* ── Indicadores de confianza ─────────────────────── */}
          <motion.dl
            {...fade(T.stats, 12)}
            className="grid grid-cols-3 divide-x divide-line border-t border-line pt-7 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-8"
          >
            {hero.indicadores.map((item, i) => (
              <div key={item.etiqueta} className={`flex flex-col ${i === 0 ? 'pr-3' : 'px-3 sm:px-6'} lg:px-8 lg:first:pl-0`}>
                <dt className="order-2 mt-2 text-[0.58rem] leading-snug font-medium tracking-[0.16em] text-stone uppercase sm:text-[0.62rem] sm:tracking-[0.2em]">
                  {item.etiqueta}
                </dt>
                <dd className="order-1 font-serif text-[2.1rem] leading-none text-ink lining-nums sm:text-[2.6rem] lg:text-5xl">
                  <CountUp
                    value={item.valor}
                    prefix={item.prefijo}
                    suffix={item.sufijo}
                    delay={reduce ? 0 : T.stats + i * 0.12}
                  />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>

      <ScrollCue reduce={reduce} />
    </section>
  )
}

/** Título con revelado palabra por palabra (máscara + translateY) y subrayado trazado en "ordenar". */
function HeroTitle({ reduce }) {
  const { antes, destacado, despues } = hero.titulo
  const words = [
    ...antes.split(' ').map((w) => ({ w })),
    { w: destacado, highlight: true },
    ...despues.split(' ').map((w) => ({ w })),
  ]

  return (
    <h1 className="mt-6 text-[2.9rem] leading-[1.04] text-ink sm:text-6xl lg:text-[4.1rem] xl:text-[4.6rem]">
      <span className="sr-only">{`${antes} ${destacado} ${despues}`}</span>
      <span aria-hidden="true">
        {words.map(({ w, highlight }, i) => (
          <span key={`${w}-${i}`}>
            <span className="relative inline-block">
              {/* Máscara: padding vertical para no recortar acentos ni descendentes */}
              <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] pr-[0.04em]">
                <motion.span
                  className={`inline-block ${highlight ? 'font-normal italic' : ''}`}
                  initial={reduce ? { opacity: 0 } : { y: '110%' }}
                  animate={reduce ? { opacity: 1 } : { y: '0%' }}
                  transition={{
                    duration: reduce ? 0.5 : 0.9,
                    delay: reduce ? 0 : T.title + i * T.wordStagger,
                    ease,
                  }}
                >
                  {w}
                </motion.span>
              </span>
              {highlight && (
                <svg
                  className="pointer-events-none absolute -bottom-[0.06em] left-0 h-[0.16em] w-full overflow-visible text-ink/70"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M3 8.5C48 3.5 118 2.5 197 6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: reduce ? 0.4 : 0.9, delay: reduce ? 0.2 : T.underline, ease: 'easeInOut' }}
                  />
                </svg>
              )}
            </span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </h1>
  )
}

/** Tarjeta flotante: entra con fade + desplazamiento y luego flota lentamente (sin flotación si reduce). */
function FloatingCard({ reduce, delay, floatDelay, className, icon: Icon, title, text, detail }) {
  return (
    <motion.div
      className={`z-10 ${className}`}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: reduce ? 0 : delay, ease }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.8 + floatDelay }}
        className="flex items-center gap-3 rounded-2xl border border-line/80 bg-cream/80 py-2.5 pr-4 pl-2.5 shadow-[0_18px_40px_-22px_rgba(51,56,59,0.35)] backdrop-blur-md sm:gap-3.5 sm:py-3 sm:pr-5 sm:pl-3"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-cream sm:size-9">
          <Icon className="size-4" strokeWidth={1.5} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.58rem] font-medium tracking-[0.18em] text-stone uppercase sm:text-[0.62rem]">
            {title}
          </span>
          <span className="mt-1 font-serif text-[1.05rem] leading-tight text-ink sm:text-lg">{text}</span>
          {detail && <span className="mt-0.5 hidden text-[0.68rem] font-light text-stone sm:block">{detail}</span>}
        </span>
      </motion.div>
    </motion.div>
  )
}

/** Indicador de scroll discreto (solo desktop): etiqueta + línea fina con un tramo que baja. */
function ScrollCue({ reduce }) {
  return (
    <motion.a
      href="#servicios"
      aria-label="Deslizá para ver los servicios"
      className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-stone transition-colors hover:text-ink lg:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduce ? 0 : 2, duration: 0.8 }}
    >
      <span className="eyebrow text-[0.58rem]">Deslizá</span>
      <span className="relative h-10 w-px overflow-hidden bg-ink/15">
        {!reduce && (
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-ink/70"
            animate={{ y: ['-100%', '250%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1], repeatDelay: 0.4 }}
          />
        )}
      </span>
    </motion.a>
  )
}
