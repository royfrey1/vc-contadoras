/**
 * Utilidades de las preguntas frecuentes (puras, sin React).
 */

const DIACRITICOS = /\p{Diacritic}/gu

/** Normaliza un carácter: sin tildes y en minúscula (siempre devuelve 1 carácter). */
function normalizarCaracter(c) {
  const n = c.normalize('NFD').replace(DIACRITICOS, '').toLowerCase()
  return n.length === 1 ? n : c.toLowerCase().charAt(0) || c
}

/** Texto sin tildes y en minúscula, con la MISMA longitud que el original (para mapear índices). */
export function normalizar(texto) {
  return Array.from(texto, normalizarCaracter).join('')
}

/** ¿El texto contiene la búsqueda (sin distinguir mayúsculas ni tildes)? */
export function coincide(texto, busqueda) {
  const q = normalizar(busqueda.trim())
  return q === '' || normalizar(texto).includes(q)
}

/**
 * Divide un texto en partes marcadas / no marcadas según la búsqueda.
 * Devuelve [{ texto, marca: boolean }, …]. Respeta tildes y mayúsculas del original.
 */
export function partesResaltadas(texto, busqueda) {
  const q = normalizar(busqueda.trim())
  if (!q) return [{ texto, marca: false }]
  const chars = Array.from(texto)
  const base = chars.map(normalizarCaracter).join('')
  const partes = []
  let desde = 0
  let i = base.indexOf(q)
  while (i !== -1) {
    if (i > desde) partes.push({ texto: chars.slice(desde, i).join(''), marca: false })
    partes.push({ texto: chars.slice(i, i + q.length).join(''), marca: true })
    desde = i + q.length
    i = base.indexOf(q, desde)
  }
  if (desde < chars.length) partes.push({ texto: chars.slice(desde).join(''), marca: false })
  return partes
}

/** Filtra preguntas por categoría ('todas' o una categoría) y por texto (pregunta + respuesta). */
export function filtrarFaq(faq, { categoria = 'todas', busqueda = '' } = {}) {
  return faq.filter(
    (item) =>
      (categoria === 'todas' || item.categoria === categoria) &&
      (coincide(item.pregunta, busqueda) || coincide(item.respuesta, busqueda)),
  )
}

/** Schema.org FAQPage con todas las preguntas. */
export function faqJsonLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
    })),
  }
}

/** JSON seguro para incrustar dentro de <script> (escapa "<" para que no cierre la etiqueta). */
export function jsonParaScript(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
