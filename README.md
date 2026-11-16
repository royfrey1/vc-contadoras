# VC Contadoras · sitio web

Landing del estudio contable **VC Contadoras** (Vanesa y Carina, Rosario, Santa Fe). Página única con servicios, perfiles de clientes, proceso de trabajo, equipo, calendario de vencimientos, preguntas frecuentes y testimonios. Todas las consultas van a WhatsApp.

Hecho con React 19, Vite, Tailwind CSS 4 y Motion.

> **Estado: DEMO.** Usa datos de ejemplo y no se indexa en buscadores. Antes de publicarlo como sitio real, revisá la sección [Pasar a producción](#pasar-a-producción).

### Criterio de indexación en la demo

`public/robots.txt` **permite** el rastreo (`Allow: /`) a propósito. La demo queda fuera de los buscadores con dos señales que solo funcionan si el buscador puede leer la página:

- el meta `<meta name="robots" content="noindex, nofollow">`, que agrega `vite.config.js` mientras `VITE_DEMO` no sea `false`;
- el header HTTP `X-Robots-Tag: noindex, nofollow`, que Vercel envía en todas las rutas (`vercel.json`), incluidos la imagen OG y los demás archivos.

Con `Disallow: /`, el buscador no leería ninguna de las dos señales y la URL podría aparecer igual en los resultados si alguien la enlaza.

## Cómo levantarlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm test          # pruebas de la lógica (vencimientos, FAQ, SEO)
npm run lint      # oxlint
npm run build     # genera dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

En Vercel se detecta solo como proyecto Vite: el comando de build es `npm run build` y la carpeta de salida, `dist`. `vercel.json` agrega cache largo para los archivos con hash de `/assets`.

## Dónde se editan los datos

| Qué | Archivo |
| --- | --- |
| Textos, teléfono de WhatsApp, mail, horarios, redes, servicios, perfiles, equipo, FAQ y testimonios | `src/data/site.js` |
| Obligaciones y reglas de vencimientos (ARCA, API, Municipalidad) | `src/data/vencimientos.js` (la lógica está en `src/lib/vencimientos.js`) |
| Foto del hero | `src/data/heroImagen.js` |
| URL del sitio (`SITE_URL`) y modo demo | `src/config.js` y `.env` |
| Logos, favicon, imagen para redes (OG), manifest y robots | `public/` |

Los vencimientos se calculan con reglas (`fijo`, `porTerminacion` o `tabla`), con corrimiento al siguiente día hábil y un campo opcional `meses` para las obligaciones que no son mensuales (por ejemplo, la recategorización del Monotributo: `meses: [2, 8]`). Para cargar el cronograma oficial, usá reglas de tipo `tabla` (hay un ejemplo en el comentario de `src/data/vencimientos.js`). Los feriados se cargan en `FERIADOS` en `src/lib/vencimientos.js`.

## Qué está marcado como DEMO

Buscá `DEMO` y `PLACEHOLDER` en el código para ver cada lugar.

- **Contacto:** número de WhatsApp, teléfono visible, mail, dirección, horarios y redes sociales (`src/data/site.js`).
- **Equipo:** apellidos, formación, matrículas, LinkedIn y fotos (por ahora son ilustrativas, de Unsplash).
- **Indicadores del hero** (+10 años, +150 clientes): son valores de ejemplo.
- **Testimonios:** son ilustrativos. Se muestra el aviso "Testimonios ilustrativos para esta demo." (`testimoniosConfig.mostrarAvisoDemo`).
- **Vencimientos:** las fechas son orientativas, calculadas por reglas, y no siguen el cronograma oficial.
- **FAQ:** hay que confirmar con el estudio las respuestas sobre honorarios y abono.
- **Por qué elegirnos:** hay que confirmar el nombre exacto del Consejo Profesional y la matrícula.

## Pasar a producción

1. **Indexación:** poné `VITE_DEMO=false` en `.env` o en *Settings → Environment Variables* de Vercel. Con eso:
   - se quita `<meta name="robots" content="noindex, nofollow">`;
   - se agrega `<link rel="canonical">`;
   - se publica el JSON-LD `AccountingService` del estudio (`src/lib/seo.js`).
2. **Header `X-Robots-Tag`:** en `vercel.json`, borrá el segundo bloque de `headers` (el de `"source": "/(.*)"` con `X-Robots-Tag: noindex, nofollow`) y dejá solo el de caché de `/assets`. Mientras ese bloque esté, Vercel les pide a los buscadores que no indexen ninguna ruta, aunque `VITE_DEMO` sea `false`. `public/robots.txt` ya permite el rastreo y no hay que tocarlo.
3. **Dominio:** cambiá `SITE_URL` en `src/config.js`. Lo usan Open Graph, Twitter Card, canonical y JSON-LD.
4. **Datos reales:** completá todo lo de la lista anterior en `src/data/site.js`. Para el JSON-LD, sumá la dirección exacta y el código postal en `src/lib/seo.js`, y revisá `openingHours`.
5. **Testimonios:** cargá testimonios reales, con autorización escrita de cada cliente, y poné `mostrarAvisoDemo: false`.
6. **Aviso de demo de vencimientos:** cuando cargues el cronograma oficial, ajustá el texto "Fechas orientativas para la demo…" en `src/components/sections/Vencimientos.jsx`.
7. **Fotos del equipo:** reemplazá los retratos de Unsplash por los reales.
8. **Imagen OG:** `public/og-image.png` (1200×630). Regenerala si cambia el eslogan.
