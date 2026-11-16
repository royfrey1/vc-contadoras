/**
 * Configuración general del sitio. Sin dependencias: la usan los componentes y también vite.config.js
 * (para armar los metadatos de index.html).
 */

// URL pública del sitio, SIN barra final. Se usa para las rutas absolutas de Open Graph,
// Twitter Card y JSON-LD. PLACEHOLDER: reemplazar por el dominio definitivo.
export const SITE_URL = 'https://vc-contadoras.vercel.app'

/**
 * Modo DEMO (variable de entorno VITE_DEMO, definida en .env). Mientras sea demo:
 *  - se agrega <meta name="robots" content="noindex, nofollow"> (sitio con datos de ejemplo);
 *  - el JSON-LD del estudio (AccountingService) queda desactivado.
 * Al pasar a producción: VITE_DEMO=false en .env o en las variables de entorno de Vercel,
 * y quitar el header X-Robots-Tag de vercel.json (ver README).
 * Si la variable no está definida, se asume demo (lo más seguro).
 */
export const esDemo = (valor) => String(valor ?? 'true').trim().toLowerCase() !== 'false'

export const DEMO = esDemo(import.meta.env?.VITE_DEMO)
