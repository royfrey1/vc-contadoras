import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

const format = (v) => Math.round(v).toLocaleString('es-AR')

/**
 * Número que cuenta desde 0 hasta `value` la primera vez que entra en pantalla.
 * Los lectores de pantalla leen directamente el valor final.
 */
export default function CountUp({ value, prefix = '', suffix = '', duration = 1.6, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const count = useMotionValue(0)
  const display = useTransform(count, format)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration, delay, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [inView, reduce, value, duration, delay, count])

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums lining-nums">
        {prefix}
        <motion.span>{display}</motion.span>
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(value)}
        {suffix}
      </span>
    </span>
  )
}
