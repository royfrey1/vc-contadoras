import { ArrowUpDown, Building2, Landmark, Percent, ReceiptText, UserRound, UsersRound } from 'lucide-react'

/*
 * DEMO: reemplazar por cronograma oficial ARCA/API.
 *
 * Fechas ORIENTATIVAS calculadas por reglas para la demo. Para usar el cronograma real,
 * cambiá la `regla` de cada obligación por una de tipo 'tabla' (ver src/lib/vencimientos.js):
 *
 *   regla: {
 *     tipo: 'tabla',
 *     fechas: {
 *       '2026-11': [18, 18, 19, 19, 20, 20, 23, 23, 24, 24], // un día por terminación 0…9
 *       '2026-12': 21,                                       // o un solo día para todas
 *     },
 *   }
 *
 * `rangos`: [desde, hasta, día] por terminación de CUIT (inclusive).
 * `meses` (opcional): meses en que vence (1 = enero … 12 = diciembre); sin él, vence todos los meses.
 */
export const obligaciones = [
  {
    id: 'monotributo',
    nombre: 'Monotributo',
    organismo: 'ARCA',
    aplica: 'Si sos monotributista',
    icono: ReceiptText,
    regla: { tipo: 'fijo', dia: 20 },
  },
  {
    // Semestral desde 2026: hasta el día 5 de febrero y de agosto (se evalúan los últimos 12 meses)
    id: 'recategorizacion',
    nombre: 'Recategorización del Monotributo',
    organismo: 'ARCA',
    aplica: 'Si sos monotributista',
    icono: ArrowUpDown,
    regla: { tipo: 'fijo', dia: 5, meses: [2, 8] },
  },
  {
    id: 'iva',
    nombre: 'IVA · declaración jurada',
    organismo: 'ARCA',
    aplica: 'Si sos Responsable Inscripto',
    icono: Percent,
    regla: {
      tipo: 'porTerminacion',
      rangos: [
        [0, 1, 18],
        [2, 3, 19],
        [4, 5, 20],
        [6, 7, 21],
        [8, 9, 22],
      ],
    },
  },
  {
    id: 'f931',
    nombre: 'Cargas sociales (F.931)',
    organismo: 'ARCA',
    aplica: 'Si tenés empleados a cargo',
    icono: UsersRound,
    regla: {
      tipo: 'porTerminacion',
      rangos: [
        [0, 3, 9],
        [4, 6, 10],
        [7, 9, 11],
      ],
    },
  },
  {
    id: 'autonomos',
    nombre: 'Autónomos',
    organismo: 'ARCA',
    aplica: 'Si aportás como trabajador autónomo',
    icono: UserRound,
    regla: {
      tipo: 'porTerminacion',
      rangos: [
        [0, 3, 5],
        [4, 6, 6],
        [7, 9, 7],
      ],
    },
  },
  {
    id: 'iibb',
    nombre: 'Ingresos Brutos',
    organismo: 'API',
    aplica: 'Si tributás Ingresos Brutos en Santa Fe',
    icono: Landmark,
    regla: {
      tipo: 'porTerminacion',
      rangos: [
        [0, 1, 13],
        [2, 3, 14],
        [4, 5, 15],
        [6, 7, 16],
        [8, 9, 17],
      ],
    },
  },
  {
    id: 'drei',
    nombre: 'DReI',
    organismo: 'Municipalidad',
    aplica: 'Si tenés un comercio o actividad en Rosario',
    icono: Building2,
    regla: { tipo: 'fijo', dia: 15 },
  },
]
