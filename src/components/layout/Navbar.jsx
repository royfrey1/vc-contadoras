import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'

import { site } from '../../data/site'
import { useScrolled } from '../../hooks/useScrolled'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useNavTheme } from '../../hooks/useNavTheme'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { WhatsAppIcon } from '../ui/icons'

const ease = [0.22, 1, 0.36, 1]

// Centro del navbar compacto (h-16 = 64 px): ahí se mide qué sección hay debajo
const NAV_LINE_Y = 32

export default function Navbar() {
  const scrolled = useScrolled(24)
  const active = useActiveSection()
  const sectionTheme = useNavTheme(NAV_LINE_Y)
  // Sin scroll, la barra es transparente sobre el hero (claro): el tema oscuro aplica solo a la versión compacta
  const dark = scrolled && sectionTheme === 'dark'
  const [open, setOpen] = useState(false)
  const closeMenu = useCallback(() => setOpen(false), [])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        data-theme={dark ? 'dark' : 'light'}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-elegant ${
          !scrolled
            ? 'border-transparent bg-transparent'
            : dark
              ? 'focus-on-dark border-cream/[0.12] bg-ink/85 backdrop-blur-md'
              : 'border-ink/10 bg-cream/85 backdrop-blur-md'
        }`}
      >
        <Container
          as="nav"
          aria-label="Navegación principal"
          className={`flex items-center justify-between gap-6 transition-[height] duration-500 ease-elegant ${
            scrolled ? 'h-16' : 'h-20 md:h-24'
          }`}
        >
          {/* Logo: las dos versiones superpuestas (mismo viewBox) y se cruzan con un fundido */}
          <a
            href="#inicio"
            aria-label={`${site.nombre}, ir al inicio`}
            className={`relative shrink-0 transition-colors duration-300 ${dark ? 'text-cream' : 'text-ink'}`}
          >
            <img
              src={site.logos.oscuro}
              alt=""
              width="320"
              height="225"
              className={`block w-auto transition-[height,opacity] duration-300 ease-elegant ${
                scrolled ? 'h-10' : 'h-12 md:h-14'
              } ${dark ? 'opacity-0' : 'opacity-100'}`}
            />
            <img
              src={site.logos.claro}
              alt=""
              aria-hidden="true"
              width="320"
              height="225"
              className={`absolute inset-0 block h-full w-auto transition-opacity duration-300 ease-elegant ${
                dark ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </a>

          {/* Links desktop */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-10">
            {site.navegacion.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`group relative py-2 text-[0.7rem] font-medium whitespace-nowrap uppercase tracking-[0.2em] transition-colors duration-300 ${
                      dark
                        ? isActive
                          ? 'text-cream'
                          : 'text-cream/70 hover:text-cream'
                        : isActive
                          ? 'text-ink'
                          : 'text-stone hover:text-ink'
                    }`}
                  >
                    {item.label}
                    {/* Subrayado al hover */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-[transform,background-color] duration-400 ease-elegant group-hover:scale-x-100 ${
                        dark ? 'bg-cream/40' : 'bg-ink/40'
                      }`}
                    />
                    {/* Indicador de sección activa (se desliza entre links) */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-px transition-colors duration-300 ${
                          dark ? 'bg-cream' : 'bg-ink'
                        }`}
                        transition={{ duration: 0.5, ease }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            {/* En mobile el CTA vive en el panel del menú y en el botón flotante */}
            <div className="hidden sm:block">
              <Button href={site.whatsappLink} external size="sm" variant={dark ? 'light' : 'primary'}>
                <WhatsAppIcon className="size-3.5" />
                Consultanos
              </Button>
            </div>

            {/* Hamburguesa mobile */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`-mr-2 inline-flex size-11 items-center justify-center rounded-full transition-colors duration-300 lg:hidden ${
                dark ? 'text-cream hover:bg-cream/10' : 'text-ink hover:bg-ink/5'
              }`}
            >
              <Menu className="size-6" strokeWidth={1.25} />
            </button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={closeMenu} />}</AnimatePresence>
    </>
  )
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
}

function MobileMenu({ onClose }) {
  const reduce = useReducedMotion()
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  // A dónde vuelve el foco al cerrar: la hamburguesa, salvo que se elija una sección
  const returnFocusRef = useRef(null)
  useLockBodyScroll(true)

  useEffect(() => {
    returnFocusRef.current = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)

    // Diálogo modal: el resto de la página queda inerte (el foco no se escapa detrás del panel)
    const panel = panelRef.current
    const siblings = panel ? [...panel.parentElement.children].filter((el) => el !== panel && !el.inert) : []
    siblings.forEach((el) => (el.inert = true))

    return () => {
      window.removeEventListener('keydown', onKey)
      siblings.forEach((el) => (el.inert = false))
      returnFocusRef.current?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  // Cerramos el panel y luego scrolleamos a la sección (con el body ya desbloqueado).
  // El foco pasa a la sección elegida, para seguir tabulando desde ahí.
  const goTo = (event, id) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      returnFocusRef.current = target
    }
    onClose()
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
      history.replaceState(null, '', `#${id}`)
    })
  }

  return (
    <motion.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="focus-on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-cream lg:hidden"
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
      exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.5, ease, delay: 0.1 } }}
      transition={{ duration: 0.6, ease }}
    >
      <Container className="flex h-20 shrink-0 items-center justify-between">
        <a href="#inicio" onClick={(e) => goTo(e, 'inicio')} aria-label="Ir al inicio">
          <img src={site.logos.claro} alt={site.nombre} width="320" height="225" className="h-12 w-auto" />
        </a>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-cream/10"
        >
          <X className="size-6" strokeWidth={1.25} />
        </button>
      </Container>

      <Container className="flex flex-1 flex-col justify-center py-10">
        <motion.ul variants={listVariants} initial="hidden" animate="visible" exit="exit" className="space-y-1">
          {site.navegacion.map((item, i) => (
            <motion.li key={item.id} variants={itemVariants} className="border-b border-cream/10">
              <a
                href={`#${item.id}`}
                onClick={(e) => goTo(e, item.id)}
                className="group flex items-baseline gap-5 py-4 transition-colors"
              >
                <span className="eyebrow text-cream/60">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif text-4xl text-cream transition-transform duration-500 ease-elegant group-hover:translate-x-2 sm:text-5xl">
                  {item.label}
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.6, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="mt-12 flex flex-col gap-6"
        >
          <Button href={site.whatsappLink} external variant="light" size="lg" className="self-start">
            <WhatsAppIcon className="size-4" />
            Consultanos
          </Button>
          <div className="space-y-1 text-sm font-light text-cream/60">
            <p>{site.email}</p>
            <p>
              {site.ciudad}
              {site.atencionOnline && ' · Atención online'}
            </p>
          </div>
        </motion.div>
      </Container>
    </motion.div>
  )
}
