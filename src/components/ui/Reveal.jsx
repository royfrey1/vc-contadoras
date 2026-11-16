import { motion, useReducedMotion } from 'motion/react'

/**
 * Animación de entrada al hacer scroll: fade + leve desplazamiento (vertical por defecto,
 * o lateral con `x`), una sola vez.
 * Con prefers-reduced-motion activo, solo hace un fade corto (sin desplazamiento).
 *
 * <Reveal delay={0.1} y={24} as="li">...</Reveal>
 * <Reveal x={24} y={0}>...</Reveal>
 */
export default function Reveal({
  as = 'div',
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.8,
  margin = '0px 0px -12% 0px',
  className = '',
  children,
  ...rest
}) {
  const reduce = useReducedMotion()
  const Component = motion[as] ?? motion.div

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y, x: reduce ? 0 : x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin }}
      transition={{ duration: reduce ? 0.3 : duration, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Component>
  )
}
