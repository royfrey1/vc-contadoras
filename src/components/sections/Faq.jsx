import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Search, X } from 'lucide-react'

import { site, waLink } from '../../data/site'
import { faqJsonLd, filtrarFaq, jsonParaScript, partesResaltadas } from '../../lib/faq'
import Container from '../ui/Container'
import SectionTitle from '../ui/SectionTitle'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { WhatsAppIcon } from '../ui/icons'

const ease = [0.22, 1, 0.36, 1]
const CATEGORIAS = ['todas', ...site.faqCategorias]
const TOTAL = site.faq.length
// Schema FAQPage con TODAS las preguntas (no solo las filtradas)
const JSON_LD = jsonParaScript(faqJsonLd(site.faq))

const itemId = (id) => `faq-${id}`

export default function Faq() {
  const reduce = useReducedMotion()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [abierta, setAbierta] = useState(site.faq[0].id)

  const visibles = filtrarFaq(site.faq, { categoria, busqueda })

  // Al buscar o filtrar, si la abierta deja de verse se abre la primera visible
  const aplicarFiltros = (nuevaCategoria, nuevaBusqueda) => {
    setCategoria(nuevaCategoria)
    setBusqueda(nuevaBusqueda)
    const resultado = filtrarFaq(site.faq, { categoria: nuevaCategoria, busqueda: nuevaBusqueda })
    if (!resultado.some((f) => f.id === abierta)) setAbierta(resultado[0]?.id ?? null)
  }

  // Deep links: #faq-{id} abre y scrollea a esa pregunta (al cargar y si cambia el hash)
  useEffect(() => {
    const abrirDesdeHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (!hash.startsWith('faq-')) return
      const id = hash.slice(4)
      if (!site.faq.some((f) => f.id === id)) return
      setCategoria('todas')
      setBusqueda('')
      setAbierta(id)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => document.getElementById(itemId(id))?.scrollIntoView({ block: 'start' }))
      })
    }
    abrirDesdeHash()
    window.addEventListener('hashchange', abrirDesdeHash)
    return () => window.removeEventListener('hashchange', abrirDesdeHash)
  }, [])

  return (
    <section id="faq" className="bg-cream py-24 md:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ── Columna izquierda (sticky en desktop) ─────────── */}
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <SectionTitle
              align="left"
              eyebrow="Preguntas frecuentes"
              title={
                <>
                  Lo que más <em className="font-normal italic">nos consultan</em>
                </>
              }
              description="Si tu duda no está acá, escribinos y te respondemos personalmente."
            />
            <AskCard className="mt-12 hidden lg:block" />
          </div>

          {/* ── Buscador, filtros y acordeón ─────────────────── */}
          <Reveal delay={0.1} className="lg:col-span-8">
            <SearchBox value={busqueda} onChange={(v) => aplicarFiltros(categoria, v)} />
            <CategoryChips value={categoria} onChange={(c) => aplicarFiltros(c, busqueda)} />

            <p className="sr-only" aria-live="polite">
              {visibles.length === 1 ? '1 pregunta encontrada' : `${visibles.length} preguntas encontradas`}
            </p>

            <ul className="mt-8 border-b border-line">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibles.map((item) => (
                  <FaqItem
                    key={item.id}
                    item={item}
                    open={abierta === item.id}
                    onToggle={() => setAbierta((actual) => (actual === item.id ? null : item.id))}
                    busqueda={busqueda}
                    reduce={reduce}
                  />
                ))}
              </AnimatePresence>
            </ul>

            <AnimatePresence initial={false}>
              {visibles.length === 0 && (
                <motion.p
                  key="vacio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center text-[0.95rem] font-light text-stone"
                >
                  No encontramos esa pregunta.{' '}
                  <a
                    href={waLink(site.faqContacto.mensaje)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-normal text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                  >
                    Escribinos y te respondemos.
                  </a>
                </motion.p>
              )}
            </AnimatePresence>

            <p className="mt-6 text-xs text-stone">
              Mostrando {visibles.length} de {TOTAL} preguntas
            </p>
          </Reveal>

          {/* En mobile y tablet la tarjeta va al final */}
          <AskCard className="lg:hidden" />
        </div>
      </Container>
    </section>
  )
}

function SearchBox({ value, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="faq-busqueda" className="sr-only">
        Buscar en las preguntas frecuentes
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-stone"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <input
        id="faq-busqueda"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscá tu duda (ej. monotributo, deudas…)"
        autoComplete="off"
        className="w-full rounded-full border border-ink/20 bg-cream py-3.5 pr-12 pl-12 text-[0.95rem] text-ink transition-colors placeholder:font-light placeholder:text-stone hover:border-ink/40 focus:border-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone transition-colors hover:bg-sand hover:text-ink"
        >
          <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function CategoryChips({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filtrar por categoría"
      className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 py-1.5 sm:scroll-px-8 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {CATEGORIAS.map((cat) => {
        const activa = cat === value
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={activa}
            onClick={() => onChange(cat)}
            className={`relative shrink-0 snap-start rounded-full border px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-300 focus-visible:outline-offset-2 ${
              activa ? 'border-ink text-cream' : 'border-ink/15 text-stone hover:border-ink/40 hover:text-ink'
            }`}
          >
            {activa && (
              <motion.span
                layoutId="faq-chip"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ duration: 0.4, ease }}
              />
            )}
            <span className="relative">{cat === 'todas' ? 'Todas' : cat}</span>
          </button>
        )
      })}
    </div>
  )
}

function Resaltado({ texto, busqueda }) {
  return partesResaltadas(texto, busqueda).map((p, i) =>
    p.marca ? (
      <mark
        key={i}
        className="rounded-[3px] bg-sand px-0.5 text-inherit shadow-[inset_0_-1px_0_rgba(51,56,59,0.35)]"
      >
        {p.texto}
      </mark>
    ) : (
      p.texto
    ),
  )
}

function FaqItem({ item, open, onToggle, busqueda, reduce }) {
  const panelId = `${itemId(item.id)}-respuesta`
  const buttonId = `${itemId(item.id)}-pregunta`

  return (
    <motion.li
      id={itemId(item.id)}
      layout={reduce ? false : 'position'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ layout: { duration: 0.4, ease }, opacity: { duration: 0.3 } }}
      className="scroll-mt-10 border-t border-line"
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left focus-visible:outline-offset-2 sm:py-7"
        >
          <span className="font-serif text-[1.45rem] leading-snug text-ink sm:text-[1.7rem]">
            <Resaltado texto={item.pregunta} busqueda={busqueda} />
          </span>
          {/* + que rota a × */}
          <span
            aria-hidden="true"
            className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,rotate] duration-[350ms] ease-elegant ${
              open
                ? 'rotate-45 border-ink bg-ink text-cream'
                : 'border-ink/25 text-ink group-hover:border-ink'
            }`}
          >
            <span className="relative block size-3.5">
              <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
              <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
            </span>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="respuesta"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.35, ease }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pr-14 pb-7 text-[0.95rem] leading-relaxed font-light text-stone">
              <Resaltado texto={item.respuesta} busqueda={busqueda} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function AskCard({ className = '' }) {
  const c = site.faqContacto
  return (
    <div className={className}>
      <div className="focus-on-dark rounded-3xl bg-ink px-7 py-8 text-cream sm:px-9 sm:py-10">
        <p className="font-serif text-[1.9rem] leading-tight text-balance text-cream">{c.titulo}</p>
        <p className="mt-3 text-sm leading-relaxed font-light text-cream/75">{c.texto}</p>
        <Button
          href={waLink(c.mensaje)}
          external
          variant="light"
          className="mt-7 w-full whitespace-nowrap max-sm:px-4 max-sm:text-[0.66rem] max-sm:tracking-[0.12em] sm:w-auto lg:w-full lg:px-4 lg:text-[0.65rem] lg:tracking-[0.12em]"
        >
          <WhatsAppIcon className="size-4" />
          {c.boton}
        </Button>
      </div>
    </div>
  )
}
