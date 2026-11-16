import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

import { SITE_URL, esDemo } from './src/config.js'
import { heroImagen } from './src/data/heroImagen.js'
import { unsplashSrcSet } from './src/lib/unsplash.js'

const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630 }

/**
 * Completa el <head> de index.html con lo que depende de la configuración:
 *  - robots noindex mientras VITE_DEMO no sea "false" (ver src/config.js);
 *  - Open Graph y Twitter Card con rutas absolutas basadas en SITE_URL;
 *  - preload de la foto del hero (LCP) con el mismo srcset/sizes que usa el componente.
 */
function headMeta(demo) {
  return {
    name: 'vc-head-meta',
    transformIndexHtml() {
      const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' })
      const ogImage = `${SITE_URL}${OG_IMAGE.path}`
      const ogImageAlt = 'VC Contadoras · Te ayudamos a ordenar tu situación fiscal'
      return [
        // DEMO: datos de ejemplo, que no se indexe. Desaparece solo con VITE_DEMO=false.
        ...(demo ? [meta({ name: 'robots', content: 'noindex, nofollow' })] : []),
        meta({ property: 'og:url', content: `${SITE_URL}/` }),
        meta({ property: 'og:image', content: ogImage }),
        meta({ property: 'og:image:type', content: 'image/png' }),
        meta({ property: 'og:image:width', content: String(OG_IMAGE.width) }),
        meta({ property: 'og:image:height', content: String(OG_IMAGE.height) }),
        meta({ property: 'og:image:alt', content: ogImageAlt }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        meta({ name: 'twitter:image', content: ogImage }),
        meta({ name: 'twitter:image:alt', content: ogImageAlt }),
        ...(demo ? [] : [{ tag: 'link', attrs: { rel: 'canonical', href: `${SITE_URL}/` }, injectTo: 'head' }]),
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'image',
            imagesrcset: unsplashSrcSet(heroImagen.url, heroImagen.anchos),
            imagesizes: heroImagen.sizes,
            fetchpriority: 'high',
          },
          injectTo: 'head',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const demo = esDemo(loadEnv(mode, process.cwd(), 'VITE_').VITE_DEMO)

  return {
    plugins: [react(), tailwindcss(), headMeta(demo)],
    build: {
      rolldownOptions: {
        output: {
          // Librerías de terceros en chunks propios: el bundle principal queda más liviano
          // y se cachean aparte (cambian mucho menos que el código del sitio).
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'motion', test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
