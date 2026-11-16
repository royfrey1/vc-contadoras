/**
 * Lógica de vencimientos (pura, sin React): calcula fechas a partir de reglas.
 * Las reglas viven en src/data/vencimientos.js.
 *
 * Tipos de regla soportados:
 *  - { tipo: 'fijo', dia }                       → mismo día para todas las terminaciones.
 *  - { tipo: 'porTerminacion', rangos: [[desde, hasta, dia], …] }
 *  - { tipo: 'tabla', fechas: { 'AAAA-MM': dia | [d0, d1, …, d9] } }
 *      → para cargar el cronograma OFICIAL mes a mes (un número para todas las
 *        terminaciones o un array de 10 días). Si el mes no está cargado, no se muestra.
 *
 * Campo opcional para cualquier tipo: `meses: [2, 8]` (1 = enero … 12 = diciembre)
 *   → la obligación vence SOLO en esos meses (ej. la recategorización del Monotributo,
 *     en febrero y agosto). Sin `meses`, vence todos los meses.
 *
 * El corrimiento por fin de semana se aplica a los tipos 'fijo' y 'porTerminacion'.
 * En 'tabla' se asume que las fechas ya son las oficiales (ya corridas).
 */

const DAY_MS = 24 * 60 * 60 * 1000
const LOCALE = 'es-AR'

// TODO feriados: cargar acá las fechas no hábiles (formato 'AAAA-MM-DD') o reemplazar
// esFeriado() por una consulta a un calendario oficial. ajustarDiaHabil() ya las respeta.
const FERIADOS = new Set([])

/** 'AAAA-MM-DD' en hora local (sin corrimientos por zona horaria). */
export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Fecha a medianoche local (descarta la hora). */
export function soloFecha(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function esFeriado(date) {
  return FERIADOS.has(toISODate(date))
}

export function esFinDeSemana(date) {
  const d = date.getDay()
  return d === 0 || d === 6
}

/** Si la fecha cae sábado, domingo (o feriado), la corre al siguiente día hábil. */
export function ajustarDiaHabil(date) {
  const result = soloFecha(date)
  while (esFinDeSemana(result) || esFeriado(result)) {
    result.setDate(result.getDate() + 1)
  }
  return result
}

/** ¿La regla aplica en ese mes (0-11)? Sin `meses`, aplica todos los meses. */
export function aplicaEnMes(regla, month) {
  return !Array.isArray(regla.meses) || regla.meses.includes(month + 1)
}

/** Día base (sin corrimiento) que fija una regla para una terminación y un mes. */
export function diaSegunRegla(regla, terminacion, year, month) {
  if (!aplicaEnMes(regla, month)) return null
  switch (regla.tipo) {
    case 'fijo':
      return regla.dia
    case 'porTerminacion': {
      const rango = regla.rangos.find(([desde, hasta]) => terminacion >= desde && terminacion <= hasta)
      return rango ? rango[2] : null
    }
    case 'tabla': {
      const key = `${year}-${String(month + 1).padStart(2, '0')}`
      const valor = regla.fechas?.[key]
      if (valor == null) return null
      return Array.isArray(valor) ? (valor[terminacion] ?? null) : valor
    }
    default:
      return null
  }
}

/** Fecha de vencimiento de una obligación (con corrimiento a día hábil cuando corresponde). */
export function fechaVencimiento(obligacion, terminacion, year, month) {
  const dia = diaSegunRegla(obligacion.regla, terminacion, year, month)
  if (dia == null) return null
  const fecha = new Date(year, month, dia)
  return obligacion.regla.tipo === 'tabla' ? fecha : ajustarDiaHabil(fecha)
}

/** Vencimientos de un mes para una terminación, ordenados por fecha (y por orden de la lista). */
export function vencimientosDelMes({ obligaciones, terminacion, year, month }) {
  return obligaciones
    .map((obligacion, orden) => {
      const fecha = fechaVencimiento(obligacion, terminacion, year, month)
      return fecha ? { obligacion, fecha, iso: toISODate(fecha), orden } : null
    })
    .filter(Boolean)
    .sort((a, b) => a.fecha - b.fecha || a.orden - b.orden)
}

/** Días de diferencia entre dos fechas (sin hora). */
export function diasEntre(desde, hasta) {
  return Math.round((soloFecha(hasta) - soloFecha(desde)) / DAY_MS)
}

/**
 * Agrega a cada vencimiento su estado respecto de `hoy`:
 *  - estado: 'vencido' | 'hoy' | 'manana' | 'futuro'
 *  - dias: días que faltan (negativo si venció)
 *  - proximo: true para el primero que todavía no venció (y los que caen ese mismo día)
 */
export function conEstado(vencimientos, hoy) {
  const proximoIso = vencimientos.find((v) => diasEntre(hoy, v.fecha) >= 0)?.iso
  return vencimientos.map((v) => {
    const dias = diasEntre(hoy, v.fecha)
    const estado = dias < 0 ? 'vencido' : dias === 0 ? 'hoy' : dias === 1 ? 'manana' : 'futuro'
    return { ...v, dias, estado, proximo: v.iso === proximoIso }
  })
}

/** Texto del badge de estado. */
export function etiquetaEstado({ estado, dias, proximo }) {
  if (estado === 'vencido') return 'Vencido'
  if (estado === 'hoy') return 'Hoy'
  if (estado === 'manana') return 'Mañana'
  if (proximo) return 'Próximo'
  return `En ${dias} días`
}

/**
 * Próximo vencimiento de una obligación a partir de `hoy`: el de este mes si todavía
 * no pasó (hoy cuenta), si no el del primer mes siguiente en que aplique
 * (se buscan hasta 13 meses, para cubrir las obligaciones que no son mensuales).
 */
export function proximoVencimiento(obligacion, hoy, terminacion = 0) {
  const base = soloFecha(hoy)
  for (let offset = 0; offset <= 12; offset++) {
    const ref = new Date(base.getFullYear(), base.getMonth() + offset, 1)
    const fecha = fechaVencimiento(obligacion, terminacion, ref.getFullYear(), ref.getMonth())
    if (fecha && fecha >= base) return fecha
  }
  return null
}

/** Año y mes (0-11) desplazados `offset` meses desde `fecha`. */
export function mesDesplazado(fecha, offset) {
  const d = new Date(fecha.getFullYear(), fecha.getMonth() + offset, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

// ── Formatos (Intl, es-AR) ────────────────────────────────────────────────

const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/** "20 de noviembre" */
export function formatearDiaMes(date) {
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long' }).format(date)
}

/** "Noviembre" */
export function nombreMes(year, month) {
  return capitalizar(new Intl.DateTimeFormat(LOCALE, { month: 'long' }).format(new Date(year, month, 1)))
}

/** "vie" */
export function diaSemanaCorto(date) {
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(date).replace('.', '')
}

/** "viernes 20 de noviembre" (para lectores de pantalla) */
export function fechaLarga(date) {
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
}

/** Iniciales de los días de la semana empezando en lunes: L M M J V S D */
export function inicialesSemana() {
  const fmt = new Intl.DateTimeFormat(LOCALE, { weekday: 'narrow' })
  // 2024-01-01 fue lunes
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)).toUpperCase())
}

/** Celdas de un calendario mensual que empieza en lunes (null = celda vacía). */
export function celdasCalendario(year, month) {
  const primero = new Date(year, month, 1)
  const vacias = (primero.getDay() + 6) % 7
  const diasMes = new Date(year, month + 1, 0).getDate()
  return [
    ...Array.from({ length: vacias }, () => null),
    ...Array.from({ length: diasMes }, (_, i) => new Date(year, month, i + 1)),
  ]
}
