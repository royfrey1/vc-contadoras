// Pruebas de la lógica de preguntas frecuentes: `npm test`.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { coincide, faqJsonLd, filtrarFaq, jsonParaScript, normalizar, partesResaltadas } from '../src/lib/faq.js'
import { site } from '../src/data/site.js'

test('normalizar quita tildes y mayúsculas sin cambiar la longitud', () => {
  assert.equal(normalizar('Recategorización ÁRBOL Ñandú'), 'recategorizacion arbol nandu')
  assert.equal(normalizar('¿Cuánto?').length, '¿Cuánto?'.length)
})

test('búsqueda sin distinguir mayúsculas ni tildes', () => {
  assert.ok(coincide('¿Cuándo tengo que recategorizarme?', 'CUANDO'))
  assert.ok(coincide('Planes de pago', 'pagó'))
  assert.ok(!coincide('Monotributo', 'ganancias'))
  assert.ok(coincide('cualquier cosa', '   ')) // búsqueda vacía coincide
})

test('resaltado conserva el texto original', () => {
  const partes = partesResaltadas('La recategorización es semestral. Recategorización…', 'recategorizacion')
  assert.deepEqual(
    partes.filter((p) => p.marca).map((p) => p.texto),
    ['recategorización', 'Recategorización'],
  )
  assert.equal(partes.map((p) => p.texto).join(''), 'La recategorización es semestral. Recategorización…')
})

test('filtros por categoría y texto combinados', () => {
  const { faq } = site
  assert.equal(filtrarFaq(faq).length, 11)
  assert.equal(filtrarFaq(faq, { categoria: 'Empezar' }).length, 4)
  assert.equal(filtrarFaq(faq, { categoria: 'Monotributo e impuestos' }).length, 4)
  assert.equal(filtrarFaq(faq, { categoria: 'Honorarios y modalidad' }).length, 3)
  const deudas = filtrarFaq(faq, { busqueda: 'DEUDAS' })
  assert.deepEqual(deudas.map((f) => f.id), ['deudas'])
  assert.equal(filtrarFaq(faq, { categoria: 'Empezar', busqueda: 'monotributo' }).length, 0)
  assert.equal(filtrarFaq(faq, { busqueda: 'xyz inexistente' }).length, 0)
})

test('datos de FAQ: ids únicos (slugs) y categorías válidas', () => {
  const ids = site.faq.map((f) => f.id)
  assert.equal(new Set(ids).size, ids.length)
  ids.forEach((id) => assert.match(id, /^[a-z0-9-]+$/))
  site.faq.forEach((f) => assert.ok(site.faqCategorias.includes(f.categoria), f.id))
})

test('JSON-LD FAQPage válido', () => {
  const ld = JSON.parse(jsonParaScript(faqJsonLd(site.faq)))
  assert.equal(ld['@context'], 'https://schema.org')
  assert.equal(ld['@type'], 'FAQPage')
  assert.equal(ld.mainEntity.length, site.faq.length)
  for (const q of ld.mainEntity) {
    assert.equal(q['@type'], 'Question')
    assert.ok(q.name.length > 5)
    assert.equal(q.acceptedAnswer['@type'], 'Answer')
    assert.ok(q.acceptedAnswer.text.length > 20)
  }
  assert.ok(!jsonParaScript({ a: '</script>' }).includes('</script>'))
})
