import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

import { site, waLink } from '../../data/site'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { WhatsAppIcon } from '../ui/icons'

const ease = [0.22, 1, 0.36, 1]
const inViewOnce = { once: true, margin: '0px 0px -12% 0px' }

export default function Servicios() {
  const reduce = useReducedMotion()
  const cierre = site.serviciosCierre

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.4 : 0.8, ease } },
  }

  return (
    <section id="servicios" className="bg-sand py-24 md:py-32">
      <Container>
        {/* Encabezado editorial: título a la izquierda, bajada a la derecha (desktop) */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <SectionTitle
            align="left"
            eyebrow="Servicios"
            title={
              <>
                Todo lo que tu actividad necesita, <em className="font-normal italic">en un solo lugar</em>
              </>
            }
            className="lg:col-span-7"
          />
          <Reveal delay={0.16} className="lg:col-span-5 lg:pb-2">
            <p className="max-w-md text-[0.95rem] leading-relaxed font-light text-stone sm:text-base lg:ml-auto">
              Nos ocupamos de los números y los trámites para que vos puedas enfocarte en tu trabajo.
            </p>
          </Reveal>
        </div>

        {/* Línea fina que se dibuja de izquierda a derecha */}
        <motion.div
          aria-hidden="true"
          className="mt-12 h-px origin-left bg-ink/20 md:mt-16"
          initial={{ scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={inViewOnce}
          transition={{ duration: reduce ? 0.4 : 1.2, ease }}
        />

        {/* Grilla de servicios */}
        <motion.ul
          className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {site.servicios.map((servicio) => (
            <motion.li key={servicio.id} variants={itemVariants} className="flex">
              <ServiceCard servicio={servicio} />
            </motion.li>
          ))}
        </motion.ul>

        {/* Cierre */}
        <Reveal className="mt-14 md:mt-20">
          <div className="focus-on-dark flex flex-col gap-8 rounded-3xl bg-ink px-7 py-10 text-cream sm:px-10 md:flex-row md:items-center md:justify-between md:gap-12 md:px-14 md:py-12">
            <div className="max-w-2xl">
              <p className="font-serif text-3xl leading-tight text-balance text-cream sm:text-[2.25rem]">{cierre.titulo}</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed font-light text-cream/75 sm:text-base">
                {cierre.texto}
              </p>
            </div>
            <Button
              href={waLink(cierre.mensaje)}
              external
              variant="light"
              size="lg"
              className="w-full shrink-0 max-sm:px-4 max-sm:tracking-[0.14em] sm:w-auto"
            >
              <WhatsAppIcon className="size-4" />
              {cierre.boton}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

function ServiceCard({ servicio }) {
  const { numero, icono: Icon, titulo, descripcion, detalles, consulta } = servicio

  return (
    <article className="group flex w-full flex-col rounded-2xl border border-line bg-cream p-7 transition-[transform,border-color,box-shadow] duration-[400ms] ease-elegant hover:-translate-y-1 hover:border-ink hover:shadow-[0_24px_48px_-30px_rgba(51,56,59,0.45)] sm:p-8">
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-[400ms] ease-elegant group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
          <Icon className="size-5" strokeWidth={1.25} aria-hidden="true" />
        </span>
        <span aria-hidden="true" className="font-serif text-3xl leading-none text-ink/25 lining-nums">
          {numero}
        </span>
      </div>

      <h3 className="mt-8 text-[1.7rem] leading-[1.15] text-ink">{titulo}</h3>
      <p className="mt-3 text-sm leading-relaxed font-light text-stone">{descripcion}</p>

      <ul className="mt-6 mb-8 space-y-2.5">
        {detalles.map((detalle) => (
          <li key={detalle} className="flex gap-3 text-sm leading-snug text-ink/85">
            <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-ink" />
            <span>{detalle}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-line pt-5">
        <a
          href={waLink(`Hola, quiero consultar por ${consulta}.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar por ${titulo} por WhatsApp`}
          className="inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.2em] text-ink uppercase"
        >
          Consultar
          <ArrowRight
            className="size-4 transition-transform duration-300 ease-elegant group-hover:translate-x-1.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  )
}
