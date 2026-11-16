import { useEffect, useState } from 'react'

/**
 * Tema ('light' | 'dark') de la sección que está debajo del navbar.
 *
 * Las secciones se marcan con un atributo, sin depender de ids:
 *   <section data-nav-theme="dark">…</section>
 * Lo que no está marcado cuenta como 'light'.
 *
 * Usa un IntersectionObserver cuya zona de detección es una línea de 1 px a la altura del centro
 * del navbar (`lineY`, en px desde el borde superior). Así el cambio ocurre justo cuando el borde
 * de la sección cruza el medio de la barra, sin ambigüedad cuando está a caballo entre dos.
 * Si hay elementos marcados anidados, gana el más interno (el último en el orden del documento).
 */
export function useNavTheme(lineY = 32) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const targets = [...document.querySelectorAll('[data-nav-theme]')]
    if (!targets.length) return

    const inside = new Set()
    let observer

    const update = () => {
      const current = targets.filter((el) => inside.has(el)).at(-1)
      setTheme(current?.dataset.navTheme === 'dark' ? 'dark' : 'light')
    }

    // El margen inferior depende del alto de la ventana: se recrea el observer al redimensionar
    const create = () => {
      observer?.disconnect()
      inside.clear()
      const bottom = Math.max(0, window.innerHeight - lineY - 1)
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => (entry.isIntersecting ? inside.add(entry.target) : inside.delete(entry.target)))
          update()
        },
        { rootMargin: `-${lineY}px 0px -${bottom}px 0px`, threshold: 0 },
      )
      targets.forEach((el) => observer.observe(el))
    }

    create()
    window.addEventListener('resize', create)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', create)
    }
  }, [lineY])

  return theme
}
