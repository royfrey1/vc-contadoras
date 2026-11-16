import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { site } from '../../data/site'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { FacebookIcon, InstagramIcon } from '../ui/icons'

const YEAR = new Date().getFullYear()

export default function Footer() {

  const contacto = [
    { icon: Phone, label: site.whatsapp, href: site.whatsappLink, external: true },
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: `${site.direccion}${site.atencionOnline ? ' · Atención online' : ''}` },
    { icon: Clock, label: site.horarios },
  ]

  const redes = [
    { label: 'Instagram', href: site.redes.instagram, icon: InstagramIcon },
    { label: 'Facebook', href: site.redes.facebook, icon: FacebookIcon },
  ]

  return (
    <footer id="contacto" data-nav-theme="dark" className="bg-ink text-cream">
      <Container className="pt-20 pb-10 md:pt-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          {/* Marca */}
          <Reveal className="md:col-span-5">
            <a href="#inicio" aria-label={`${site.nombre}, ir al inicio`} className="inline-block">
              <img src={site.logos.claro} alt={site.nombre} width="320" height="225" className="h-20 w-auto" />
            </a>
            <p className="mt-8 max-w-xs font-serif text-2xl leading-snug text-cream/90 italic">{site.eslogan}.</p>
            <p className="eyebrow mt-6 text-cream/60">{site.subtitulo}</p>
          </Reveal>

          {/* Navegación */}
          <Reveal delay={0.08} className="md:col-span-3">
            <h2 className="eyebrow text-cream/60">Navegación</h2>
            <ul className="mt-6 space-y-3">
              {site.navegacion.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group relative text-sm font-light text-cream/75 transition-colors hover:text-cream"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cream/50 transition-transform duration-400 ease-elegant group-hover:scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contacto + redes */}
          <Reveal delay={0.16} className="md:col-span-4">
            <h2 className="eyebrow text-cream/60">Contacto</h2>
            <ul className="mt-6 space-y-4">
              {contacto.map(({ icon: Icon, label, href, external }) => {
                const content = (
                  <>
                    <Icon className="mt-0.5 size-4 shrink-0 text-cream/50" strokeWidth={1.25} />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
                  </>
                )
                return (
                  <li key={label} className="text-sm font-light text-cream/75">
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="flex items-start gap-3 transition-colors hover:text-cream"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="flex items-start gap-3">{content}</span>
                    )}
                  </li>
                )
              })}
            </ul>

            <ul className="mt-8 flex gap-3">
              {redes.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    {...(href !== '#' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-cream hover:bg-cream hover:text-ink"
                  >
                    <Icon className="size-[1.1rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 h-px w-full bg-cream/15 md:mt-20" />

        {/* pr/pb extra: deja lugar para el botón flotante de WhatsApp */}
        <div className="mt-8 flex flex-col gap-3 pb-16 text-xs font-light text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:pr-24 sm:pb-0">
          <p>
            © {YEAR} {site.nombre}. Todos los derechos reservados.
          </p>
          <p>
            Diseñado y desarrollado por{' '}
            <a
              href={site.firma.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cream/80 underline decoration-cream/30 underline-offset-4 transition-colors hover:text-cream hover:decoration-cream"
            >
              {site.firma.texto}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
