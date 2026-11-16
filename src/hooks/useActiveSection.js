import { useEffect, useState } from 'react'

/**
 * Detecta qué sección (<section id> dentro de <main>, o el <footer id="contacto">) ocupa la franja central
 * del viewport, usando IntersectionObserver.
 */
export function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = document.querySelectorAll('main section[id], footer[id]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))

    // Al llegar al final de la página, la última sección queda activa aunque sea corta
    const last = sections[sections.length - 1]
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) setActive(last.id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return active
}
