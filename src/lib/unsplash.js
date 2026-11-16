/**
 * Genera un srcSet a partir de una URL de images.unsplash.com que ya trae w y h,
 * manteniendo la proporción original.
 */
export function unsplashSrcSet(url, widths) {
  const base = new URL(url)
  const w = Number(base.searchParams.get('w'))
  const h = Number(base.searchParams.get('h'))
  return widths
    .map((width) => {
      const u = new URL(url)
      u.searchParams.set('w', String(width))
      if (w && h) u.searchParams.set('h', String(Math.round((width * h) / w)))
      return `${u.toString()} ${width}w`
    })
    .join(', ')
}
