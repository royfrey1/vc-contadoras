// Pruebas rápidas de la lógica de vencimientos: `npm test` (usa el runner nativo de Node).
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  ajustarDiaHabil,
  celdasCalendario,
  conEstado,
  diaSegunRegla,
  etiquetaEstado,
  fechaVencimiento,
  formatearDiaMes,
  nombreMes,
  proximoVencimiento,
  toISODate,
  vencimientosDelMes,
} from '../src/lib/vencimientos.js'
import { obligaciones } from '../src/data/vencimientos.js'

const iso = (d) => (d ? toISODate(d) : null)
const ob = (id) => obligaciones.find((o) => o.id === id)
// Noviembre 2026: el 1 es domingo; el 20 es viernes; el 21 y 22, fin de semana.
const NOV = { year: 2026, month: 10 }

test('corrimiento de fin de semana', () => {
  assert.equal(iso(ajustarDiaHabil(new Date(2026, 10, 20))), '2026-11-20') // viernes: no cambia
  assert.equal(iso(ajustarDiaHabil(new Date(2026, 10, 21))), '2026-11-23') // sábado → lunes
  assert.equal(iso(ajustarDiaHabil(new Date(2026, 10, 22))), '2026-11-23') // domingo → lunes
  assert.equal(iso(ajustarDiaHabil(new Date(2026, 9, 31))), '2026-11-02') // sábado fin de mes → lunes del mes siguiente
})

test('rangos de terminación de IVA', () => {
  const regla = ob('iva').regla
  const esperado = [18, 18, 19, 19, 20, 20, 21, 21, 22, 22]
  esperado.forEach((dia, t) => assert.equal(diaSegunRegla(regla, t, NOV.year, NOV.month), dia, `terminación ${t}`))
})

test('rangos de F.931, Autónomos e Ingresos Brutos', () => {
  const casos = {
    f931: [9, 9, 9, 9, 10, 10, 10, 11, 11, 11],
    autonomos: [5, 5, 5, 5, 6, 6, 6, 7, 7, 7],
    iibb: [13, 13, 14, 14, 15, 15, 16, 16, 17, 17],
  }
  for (const [id, dias] of Object.entries(casos)) {
    dias.forEach((dia, t) => assert.equal(diaSegunRegla(ob(id).regla, t, NOV.year, NOV.month), dia, `${id} t${t}`))
  }
})

test('cada regla por terminación cubre 0-9 sin huecos ni superposiciones', () => {
  for (const o of obligaciones.filter((x) => x.regla.tipo === 'porTerminacion')) {
    for (let t = 0; t <= 9; t++) {
      const hits = o.regla.rangos.filter(([a, b]) => t >= a && t <= b).length
      assert.equal(hits, 1, `${o.id}: terminación ${t} aparece en ${hits} rangos`)
    }
  }
})

test('fechas con corrimiento: Autónomos terminación 7 (sábado 7/11 → lunes 9/11)', () => {
  assert.equal(iso(fechaVencimiento(ob('autonomos'), 7, NOV.year, NOV.month)), '2026-11-09')
  assert.equal(iso(fechaVencimiento(ob('autonomos'), 0, NOV.year, NOV.month)), '2026-11-05')
})

test('vencimientosDelMes devuelve las 6 obligaciones ordenadas por fecha', () => {
  const lista = vencimientosDelMes({ obligaciones, terminacion: 0, ...NOV })
  assert.equal(lista.length, 6)
  assert.deepEqual(
    lista.map((v) => `${v.obligacion.id}:${v.iso}`),
    [
      'autonomos:2026-11-05',
      'f931:2026-11-09',
      'iibb:2026-11-13',
      'drei:2026-11-16', // 15/11 es domingo → lunes 16
      'iva:2026-11-18',
      'monotributo:2026-11-20',
    ],
  )
})

test('estados y etiquetas respecto de hoy', () => {
  const hoy = new Date(2026, 10, 13, 15, 30) // viernes 13/11, con hora
  const lista = conEstado(vencimientosDelMes({ obligaciones, terminacion: 0, ...NOV }), hoy)
  assert.deepEqual(
    lista.map((v) => etiquetaEstado(v)),
    ['Vencido', 'Vencido', 'Hoy', 'En 3 días', 'En 5 días', 'En 7 días'],
  )
  assert.deepEqual(
    lista.map((v) => v.proximo),
    [false, false, true, false, false, false],
  )
  const manana = conEstado(vencimientosDelMes({ obligaciones, terminacion: 0, ...NOV }), new Date(2026, 10, 12))
  assert.equal(etiquetaEstado(manana[2]), 'Mañana')
  const proximo = conEstado(vencimientosDelMes({ obligaciones, terminacion: 0, ...NOV }), new Date(2026, 10, 14))
  assert.equal(etiquetaEstado(proximo[3]), 'Próximo') // DReI, el 16
})

test('próximo vencimiento del Monotributo (tarjeta del hero)', () => {
  const mono = ob('monotributo')
  assert.equal(iso(proximoVencimiento(mono, new Date(2026, 10, 13))), '2026-11-20')
  assert.equal(iso(proximoVencimiento(mono, new Date(2026, 10, 20, 18))), '2026-11-20') // el mismo día cuenta
  // Pasado el 20/11 → 20/12/2026 es domingo → lunes 21/12
  assert.equal(iso(proximoVencimiento(mono, new Date(2026, 10, 21))), '2026-12-21')
  assert.equal(formatearDiaMes(new Date(2026, 11, 21)), '21 de diciembre')
})

test('regla tipo tabla (para el cronograma oficial)', () => {
  const regla = { tipo: 'tabla', fechas: { '2026-11': [18, 18, 19, 19, 20, 20, 23, 23, 24, 24], '2026-12': 21 } }
  assert.equal(diaSegunRegla(regla, 6, 2026, 10), 23)
  assert.equal(diaSegunRegla(regla, 3, 2026, 11), 21)
  assert.equal(diaSegunRegla(regla, 3, 2027, 0), null) // mes no cargado
})

test('formatos y calendario', () => {
  assert.equal(nombreMes(2026, 10), 'Noviembre')
  const celdas = celdasCalendario(2026, 10)
  assert.equal(celdas.filter((c) => c === null).length, 6) // 1/11/2026 es domingo → 6 vacías (L a S)
  assert.equal(celdas.filter(Boolean).length, 30)
})

// ── Recategorización del Monotributo: día 5, solo en febrero y agosto ────────
test('recategorización: vence el 5 de febrero y de agosto, igual para todas las terminaciones', () => {
  const recat = ob('recategorizacion')
  for (let t = 0; t <= 9; t++) {
    assert.equal(iso(fechaVencimiento(recat, t, 2027, 1)), '2027-02-05', `febrero, terminación ${t}`) // viernes
    assert.equal(iso(fechaVencimiento(recat, t, 2027, 7)), '2027-08-05', `agosto, terminación ${t}`) // jueves
  }
})

test('recategorización: no aparece en los demás meses', () => {
  const recat = ob('recategorizacion')
  for (let m = 0; m < 12; m++) {
    const esperado = m === 1 || m === 7
    assert.equal(fechaVencimiento(recat, 0, 2027, m) !== null, esperado, `mes ${m + 1}`)
    const enLista = vencimientosDelMes({ obligaciones, terminacion: 0, year: 2027, month: m }).some(
      (v) => v.obligacion.id === 'recategorizacion',
    )
    assert.equal(enLista, esperado, `lista del mes ${m + 1}`)
  }
  // Noviembre 2026 sigue con las mismas 6 obligaciones mensuales
  assert.equal(vencimientosDelMes({ obligaciones, terminacion: 3, ...NOV }).length, 6)
})

test('recategorización: corrimiento si el 5 cae en fin de semana', () => {
  const recat = ob('recategorizacion')
  assert.equal(iso(fechaVencimiento(recat, 0, 2028, 1)), '2028-02-07') // sábado 5/2/2028 → lunes 7
  assert.equal(iso(fechaVencimiento(recat, 0, 2028, 7)), '2028-08-07') // sábado 5/8/2028 → lunes 7
  assert.equal(iso(fechaVencimiento(recat, 0, 2029, 7)), '2029-08-06') // domingo 5/8/2029 → lunes 6
})

test('recategorización: próximo vencimiento salta a febrero o agosto', () => {
  const recat = ob('recategorizacion')
  assert.equal(iso(proximoVencimiento(recat, new Date(2026, 10, 13))), '2027-02-05') // desde noviembre
  assert.equal(iso(proximoVencimiento(recat, new Date(2027, 1, 5, 18))), '2027-02-05') // el mismo día cuenta
  assert.equal(iso(proximoVencimiento(recat, new Date(2027, 1, 6))), '2027-08-05') // pasado febrero → agosto
})

test('campo meses: se combina con cualquier tipo de regla sin afectar a las que no lo usan', () => {
  const porTerminacion = { tipo: 'porTerminacion', rangos: [[0, 4, 10], [5, 9, 12]], meses: [3] }
  assert.equal(diaSegunRegla(porTerminacion, 7, 2027, 2), 12) // marzo
  assert.equal(diaSegunRegla(porTerminacion, 7, 2027, 3), null) // abril
  const tabla = { tipo: 'tabla', fechas: { '2027-02': 9, '2027-03': 9 }, meses: [2] }
  assert.equal(diaSegunRegla(tabla, 0, 2027, 1), 9)
  assert.equal(diaSegunRegla(tabla, 0, 2027, 2), null) // cargado en la tabla, pero fuera de `meses`
  for (const o of obligaciones.filter((x) => !x.regla.meses)) {
    for (let m = 0; m < 12; m++) assert.notEqual(fechaVencimiento(o, 0, 2027, m), null, `${o.id} mes ${m + 1}`)
  }
})
