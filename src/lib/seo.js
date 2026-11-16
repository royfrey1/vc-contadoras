/**
 * Datos estructurados del estudio (puros, sin React).
 */

/**
 * Schema.org AccountingService con los datos de contacto de site.js.
 * En la DEMO no se publica (ver DEMO en src/config.js): se activa solo con VITE_DEMO=false,
 * cuando el teléfono, el mail, la dirección y las redes sean los reales.
 */
export function accountingServiceJsonLd(site, siteUrl) {
  const redes = Object.values(site.redes).filter((url) => url && url !== '#')
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${siteUrl}/#estudio`,
    name: site.nombre,
    description: `Estudio contable en ${site.ciudad}. ${site.eslogan}.`,
    url: `${siteUrl}/`,
    logo: `${siteUrl}${site.logos.oscuro}`,
    image: `${siteUrl}/og-image.png`,
    email: site.email,
    // Teléfono en formato internacional, tomado del número del link de WhatsApp
    telephone: `+${new URL(site.whatsappLink).pathname.slice(1)}`,
    address: {
      '@type': 'PostalAddress',
      // Completar streetAddress y postalCode cuando estén los datos reales
      addressLocality: 'Rosario',
      addressRegion: 'Santa Fe',
      addressCountry: 'AR',
    },
    areaServed: [
      { '@type': 'City', name: 'Rosario' },
      { '@type': 'State', name: 'Santa Fe' },
      { '@type': 'Country', name: 'Argentina' }, // atención online en todo el país
    ],
    openingHours: 'Mo-Fr 09:00-17:00', // coincide con site.horarios
    knowsLanguage: 'es',
    ...(redes.length ? { sameAs: redes } : {}),
  }
}
