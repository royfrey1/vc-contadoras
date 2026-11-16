/** Contenedor centrado con ancho máximo cómodo (~1200px) y márgenes laterales responsive. */
export default function Container({ as: Tag = 'div', className = '', children }) {
  return <Tag className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</Tag>
}
