import Reveal from './Reveal'

/**
 * Encabezado de sección: etiqueta en mayúsculas espaciadas + título serif + bajada opcional.
 * - align: 'center' | 'left'
 * - tone: 'light' (sobre fondos claros) | 'dark' (sobre fondo grafito)
 */
export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  as: Heading = 'h2',
  className = '',
}) {
  const centered = align === 'center'
  const dark = tone === 'dark'

  return (
    <header className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <Reveal
          className={`eyebrow flex items-center gap-4 ${centered ? 'justify-center' : ''} ${
            dark ? 'text-cream/70' : 'text-stone'
          }`}
        >
          <span aria-hidden="true" className={`h-px w-8 ${dark ? 'bg-cream/40' : 'bg-ink/30'}`} />
          {eyebrow}
          {centered && <span aria-hidden="true" className={`h-px w-8 ${dark ? 'bg-cream/40' : 'bg-ink/30'}`} />}
        </Reveal>
      )}

      <Reveal delay={0.08}>
        <Heading
          className={`mt-5 text-4xl leading-[1.08] sm:text-5xl md:text-[3.5rem] ${dark ? 'text-cream' : 'text-ink'}`}
        >
          {title}
        </Heading>
      </Reveal>

      {description && (
        <Reveal delay={0.16}>
          <p
            className={`mt-6 text-[0.95rem] font-light leading-relaxed sm:text-base ${
              dark ? 'text-cream/75' : 'text-stone'
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </header>
  )
}
