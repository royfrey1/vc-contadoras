/**
 * Foto del hero (es el LCP de la página). Vive en un archivo aparte, sin dependencias, porque la usan
 * el componente Hero y también vite.config.js, que agrega en index.html un <link rel="preload">
 * con EXACTAMENTE el mismo srcset y sizes (si no coinciden, el navegador la descargaría dos veces).
 *
 * Foto de Unsplash: las versiones más chicas se generan cambiando w/h en la URL.
 */
export const heroImagen = {
  url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&h=1500&q=75&auto=format&fit=crop&crop=focalpoint&fp-x=0.32&fp-y=0.5',
  alt: 'Escritorio de madera luminoso junto a una ventana, con una laptop abierta, una planta y una lámpara',
  ancho: 1200,
  alto: 1500,
  // Anchos del srcset y tamaño de la imagen en pantalla (arco: 30rem desktop, 28rem tablet, 24rem mobile)
  anchos: [480, 640, 800, 960, 1200],
  sizes: '(min-width: 1024px) 30rem, (min-width: 640px) 28rem, min(24rem, calc(100vw - 2.5rem))',
}
