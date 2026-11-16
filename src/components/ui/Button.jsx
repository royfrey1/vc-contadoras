const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] transition-all duration-300 ease-elegant focus-visible:outline-offset-4 active:scale-[0.98]'

// Cada variante define el color del anillo de foco para que se vea sobre su fondo habitual
const variants = {
  // Sólido grafito (CTA principal)
  primary: 'focus-visible:outline-ink bg-ink text-cream shadow-[0_1px_0_rgba(51,56,59,0.08)] hover:bg-ink-soft hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(51,56,59,0.55)]',
  // Contorno fino grafito
  outline: 'focus-visible:outline-ink border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-cream',
  // Sólido crema (para fondos oscuros)
  light: 'focus-visible:outline-cream bg-cream text-ink hover:bg-sand hover:-translate-y-0.5',
  // Contorno crema (para fondos oscuros)
  'outline-light': 'focus-visible:outline-cream border border-cream/35 text-cream hover:border-cream hover:bg-cream hover:text-ink',
}

const sizes = {
  sm: 'px-5 py-2.5 text-[0.68rem]',
  md: '',
  lg: 'px-8 py-4',
}

/**
 * Botón reutilizable. Si recibe `href` renderiza un <a>; con `external` abre en pestaña nueva.
 */
export default function Button({
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = `${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? ''} ${className}`

  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
