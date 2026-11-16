// Pruebas de configuración y datos estructurados: `npm test`.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { SITE_URL, esDemo } from '../src/config.js'
import { accountingServiceJsonLd } from '../src/lib/seo.js'
import { site } from '../src/data/site.js'

test('modo demo: solo "false" lo desactiva (sin variable, se asume demo)', () => {
  assert.equal(esDemo(undefined), true)
  assert.equal(esDemo('true'), true)
  assert.equal(esDemo(''), true)
  assert.equal(esDemo('false'), false)
  assert.equal(esDemo(' FALSE '), false)
})

test('SITE_URL es absoluta y sin barra final', () => {
  assert.match(SITE_URL, /^https:\/\/[^/]+$/)
})

test('JSON-LD AccountingService con los datos de site.js', () => {
  const ld = accountingServiceJsonLd(site, SITE_URL)
  assert.equal(ld['@type'], 'AccountingService')
  assert.equal(ld.name, site.nombre)
  assert.equal(ld.email, site.email)
  assert.match(ld.telephone, /^\+\d{10,15}$/)
  assert.equal(ld.address.addressLocality, 'Rosario')
  assert.equal(ld.address.addressRegion, 'Santa Fe')
  assert.ok(ld.areaServed.some((a) => a.name === 'Rosario'))
  assert.equal(ld.url, `${SITE_URL}/`)
  assert.equal(ld.sameAs, undefined) // las redes todavía son '#': no se publican
})
