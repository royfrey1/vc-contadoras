import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Info } from 'lucide-react'

import { waLink } from '../../data/site'
import { obligaciones } from '../../data/vencimientos'
import {
  celdasCalendario,
  conEstado,
  diaSemanaCorto,
  etiquetaEstado,
  fechaLarga,
  inicialesSemana,
  mesDesplazado,
  nombreMes,
  soloFecha,
  toISODate,
  vencimientosDelMes,
} from '../../lib/vencimientos'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { WhatsAppIcon } from '../ui/icons'

const ease = [0.22, 1, 0.36, 1]
const DIGITOS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const NBSP = '\u00a0'
const SEMANA = inicialesSemana()

export default function Vencimientos() {
  const reduce = useReducedMotion()
  const [hoy] = useState(() => soloFecha(new Date()))
  const [terminacion, setTerminacion] = useState(0)
  const [offset, setOffset] = useState(0)
  const [hoverIso, setHoverIso] = useState(null)

  const meses = [mesDesplazado(hoy, 0), mesDesplazado(hoy, 1)]
  const { year, month } = meses[offset]
  const mes = nombreMes(year, month)

  const items = conEstado(vencimientosDelMes({ obligaciones, terminacion, year, month }), hoy)
  const resumen = `${items.length} vencimientos en ${mes.toLowerCase()} para la terminación ${terminacion}`

  return (
    <section id="vencimientos" className="bg-sand py-24 md:py-32">
      <Container>
        <SectionTitle
          align="left"
          eyebrow="Próximos vencimientos"
          title={
            <>
              Tus fechas importantes, <em className="font-normal italic">siempre a la vista</em>
            </>
          }
          description="Elegí la terminación de tu CUIT y mirá qué vence este mes. Si sos cliente, te avisamos antes de cada una."
          className="max-w-3xl"
        />

        <Reveal delay={0.1} className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 md:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* ── Controles ─────────────────────────────────────── */}
          <div className="space-y-9 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <CuitSelector value={terminacion} onChange={setTerminacion} />
            <MonthToggle meses={meses} value={offset} onChange={setOffset} />
            <MiniCalendar
              year={year}
              month={month}
              hoy={hoy}
              items={items}
              hoverIso={hoverIso}
              onHover={setHoverIso}
              reduce={reduce}
            />
          </div>

          {/* ── Agenda ────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <p className="eyebrow text-stone" aria-hidden="true">
              {/* Espacios duros: el número no queda separado de su palabra al cortar la línea */}
              Terminación{NBSP}{terminacion} · {mes}{NBSP}{year} · {items.length}{NBSP}vencimientos
            </p>
            <p className="sr-only" aria-live="polite">
              {resumen}
            </p>

            <ol className="mt-5 flex flex-col gap-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((v, i) => (
                  <AgendaItem
                    // La clave incluye el mes: al cambiar de mes los ítems se reemplazan (salen y entran);
                    // al cambiar de terminación se conservan y se reordenan deslizándose.
                    key={`${v.obligacion.id}-${year}-${month}`}
                    v={v}
                    index={i}
                    highlighted={hoverIso === v.iso}
                    onHover={setHoverIso}
                    reduce={reduce}
                  />
                ))}
              </AnimatePresence>
            </ol>

            <p className="mt-6 flex gap-3 text-xs leading-relaxed text-stone">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              Fechas orientativas para la demo. El cronograma oficial puede variar según ARCA, API y feriados.
              Consultanos por tu caso particular.
            </p>

            {/* En lg la columna es angosta: texto y botón apilados; en xl vuelven a ir lado a lado */}
            <div className="focus-on-dark mt-8 flex flex-col gap-6 rounded-3xl bg-ink px-6 py-8 text-cream sm:flex-row sm:items-center sm:justify-between sm:px-9 lg:flex-col lg:items-start xl:flex-row xl:items-center">
              <p className="max-w-xs font-serif text-2xl leading-snug text-balance text-cream sm:text-[1.7rem] lg:max-w-sm xl:max-w-xs">
                ¿Querés que te avisemos antes de cada vencimiento?
              </p>
              <Button
                href={waLink(
                  `Hola, me interesa recibir recordatorios de mis vencimientos. Mi CUIT termina en ${terminacion}.`,
                )}
                external
                variant="light"
                className="w-full shrink-0 whitespace-nowrap max-sm:px-3 max-sm:text-[0.64rem] max-sm:tracking-[0.1em] sm:w-auto"
              >
                <WhatsAppIcon className="size-4" />
                Quiero recibir recordatorios
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ── Selector de terminación (radiogroup) ─────────────────────────────── */

function useRadioKeys(count, value, onChange, refs) {
  return (event) => {
    const last = count - 1
    const map = {
      ArrowRight: value === last ? 0 : value + 1,
      ArrowDown: value === last ? 0 : value + 1,
      ArrowLeft: value === 0 ? last : value - 1,
      ArrowUp: value === 0 ? last : value - 1,
      Home: 0,
      End: last,
    }
    if (!(event.key in map)) return
    event.preventDefault()
    onChange(map[event.key])
    refs.current[map[event.key]]?.focus()
  }
}

function CuitSelector({ value, onChange }) {
  const refs = useRef([])
  const onKeyDown = useRadioKeys(DIGITOS.length, value, onChange, refs)

  return (
    <div>
      <p id="cuit-label" className="eyebrow text-stone">
        Terminación de tu CUIT
      </p>
      <div
        role="radiogroup"
        aria-labelledby="cuit-label"
        onKeyDown={onKeyDown}
        className="mt-4 grid max-w-xs grid-cols-5 gap-2.5 sm:max-w-none sm:grid-cols-10 lg:max-w-sm lg:grid-cols-5 lg:gap-3"
      >
        {DIGITOS.map((d) => {
          const checked = d === value
          return (
            <button
              key={d}
              ref={(el) => {
                refs.current[d] = el
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`Terminación ${d}`}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(d)}
              className={`relative flex aspect-square items-center justify-center rounded-full border font-serif text-xl lining-nums transition-colors duration-300 lg:text-2xl ${
                checked ? 'border-ink text-cream' : 'border-ink/20 text-ink hover:border-ink/60'
              }`}
            >
              {checked && (
                <motion.span
                  layoutId="cuit-activo"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ duration: 0.35, ease }}
                />
              )}
              <span className="relative">{d}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Toggle de mes (radiogroup de 2 opciones) ─────────────────────────── */

function MonthToggle({ meses, value, onChange }) {
  const refs = useRef([])
  const onKeyDown = useRadioKeys(meses.length, value, onChange, refs)

  return (
    <div>
      <p id="mes-label" className="eyebrow text-stone">
        Mes
      </p>
      <div
        role="radiogroup"
        aria-labelledby="mes-label"
        onKeyDown={onKeyDown}
        className="mt-4 inline-flex rounded-full border border-ink/15 bg-cream p-1"
      >
        {meses.map(({ year, month }, i) => {
          const checked = i === value
          return (
            <button
              key={`${year}-${month}`}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(i)}
              className={`relative rounded-full px-5 py-2.5 text-[0.7rem] font-medium tracking-[0.2em] uppercase transition-colors duration-300 sm:px-6 ${
                checked ? 'text-cream' : 'text-stone hover:text-ink'
              }`}
            >
              {checked && (
                <motion.span
                  layoutId="mes-activo"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ duration: 0.4, ease }}
                />
              )}
              <span className="relative">{nombreMes(year, month)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Mini calendario (decorativo: la información está en la lista) ────── */

function MiniCalendar({ year, month, hoy, items, hoverIso, onHover, reduce }) {
  // Orden de aparición de los días marcados (para el "pop" escalonado)
  const marcados = new Map([...new Set(items.map((v) => v.iso))].map((iso, i) => [iso, i]))
  const hoyIso = toISODate(hoy)

  return (
    <div
      aria-hidden="true"
      className="hidden max-w-sm rounded-2xl border border-line bg-cream p-5 sm:block lg:max-w-none"
    >
      <p className="font-serif text-xl text-ink">
        {nombreMes(year, month)} <span className="text-stone">{year}</span>
      </p>
      <div className="mt-4 grid grid-cols-7 text-center">
        {SEMANA.map((d, i) => (
          <span key={i} className="pb-2 text-[0.6rem] font-medium tracking-[0.15em] text-stone">
            {d}
          </span>
        ))}
        {celdasCalendario(year, month).map((fecha, i) => {
          if (!fecha) return <span key={`vacia-${i}`} />
          const iso = toISODate(fecha)
          const marcado = marcados.has(iso)
          const pasado = fecha < hoy
          const esHoy = iso === hoyIso
          const activo = hoverIso === iso
          const delay = marcado ? 0.08 + marcados.get(iso) * 0.04 : 0
          return (
            <span
              key={iso}
              onMouseEnter={marcado ? () => onHover(iso) : undefined}
              onMouseLeave={marcado ? () => onHover(null) : undefined}
              className={`relative flex aspect-square items-center justify-center text-[0.8rem] lining-nums ${
                pasado ? 'text-ink/35' : 'text-ink'
              } ${marcado ? 'cursor-default' : ''}`}
            >
              {marcado && (
                <motion.span
                  className={`absolute inset-[14%] rounded-full border transition-colors duration-300 ${
                    activo ? 'border-ink bg-ink' : pasado ? 'border-ink/25' : 'border-ink/60'
                  }`}
                  initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: reduce ? 0.3 : 0.45, delay: reduce ? 0 : delay, ease }}
                />
              )}
              <span
                className={`relative ${activo ? 'text-cream' : ''} ${
                  esHoy ? 'font-medium underline decoration-ink decoration-[1.5px] underline-offset-[5px]' : ''
                }`}
              >
                {fecha.getDate()}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Ítem de la agenda ─────────────────────────────────────────────────── */

function AgendaItem({ v, index, highlighted, onHover, reduce }) {
  const { obligacion, fecha, iso, estado, proximo } = v
  const Icon = obligacion.icono
  const vencido = estado === 'vencido'

  return (
    <motion.li
      layout={reduce ? false : 'position'}
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: reduce ? 0 : index * 0.05, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ layout: { duration: 0.45, ease } }}
      onMouseEnter={() => onHover(iso)}
      onMouseLeave={() => onHover(null)}
      className={`grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-4 rounded-2xl border bg-cream p-4 transition-[border-color,box-shadow,opacity] duration-300 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-5 sm:p-5 ${
        highlighted
          ? 'border-ink shadow-[0_16px_34px_-24px_rgba(51,56,59,0.5)]'
          : proximo
            ? 'border-ink/40'
            : 'border-line'
      } ${vencido ? 'opacity-60' : ''}`}
    >
      {/* Fecha */}
      <time dateTime={iso} className="flex flex-col items-center border-r border-line pr-4 sm:pr-5">
        <span className="sr-only">{fechaLarga(fecha)}</span>
        <span aria-hidden="true" className="relative block h-10 w-full overflow-hidden text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={iso}
              className="block font-serif text-[2.4rem] leading-10 text-ink lining-nums"
              initial={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              {fecha.getDate()}
            </motion.span>
          </AnimatePresence>
        </span>
        <span aria-hidden="true" className="mt-1 text-[0.6rem] font-medium tracking-[0.2em] text-stone uppercase">
          {diaSemanaCorto(fecha)}
        </span>
      </time>

      {/* Obligación */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Icon className="size-4 shrink-0 text-stone" strokeWidth={1.25} aria-hidden="true" />
          <h3 className="font-serif text-[1.3rem] leading-tight text-ink sm:text-[1.4rem]">{obligacion.nombre}</h3>
          <span className="rounded-full border border-ink/20 px-2.5 py-0.5 text-[0.56rem] font-medium tracking-[0.18em] text-ink uppercase">
            {obligacion.organismo}
          </span>
        </div>
        <p className="mt-1 text-sm leading-snug font-light text-stone">{obligacion.aplica}</p>
        <StatusBadge v={v} className="mt-3 sm:hidden" />
      </div>

      <div className="hidden sm:block">
        <StatusBadge v={v} />
      </div>
    </motion.li>
  )
}

function StatusBadge({ v, className = '' }) {
  const label = etiquetaEstado(v)
  const style =
    v.estado === 'vencido'
      ? 'border-line text-stone line-through decoration-stone/50'
      : v.proximo
        ? 'border-ink bg-ink text-cream'
        : 'border-ink/20 text-ink'
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[0.6rem] font-medium tracking-[0.18em] whitespace-nowrap uppercase ${style} ${className}`}
    >
      {label}
    </span>
  )
}
