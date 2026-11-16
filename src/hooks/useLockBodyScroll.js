import { useLayoutEffect } from 'react'

/** Bloquea el scroll del body mientras `locked` sea true (compensa el ancho de la scrollbar). */
export function useLockBodyScroll(locked) {
  useLayoutEffect(() => {
    if (!locked) return
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [locked])
}
