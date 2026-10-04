import { site } from '../../data/content'

/**
 * Logo — marca de REDSAM. Muestra el emblema oficial de la
 * organización (img/logo.png): monograma SAM en degradado de
 * señal sobre fondo transparente. Con `wordmark` agrega el
 * nombre REDSAM junto al emblema.
 */
function Logo({ size = 40, wordmark = false, className = '' }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <img
        src={site.assets.logo}
        alt={wordmark ? '' : 'REDSAM'}
        width={size}
        height={size}
        className="shrink-0"
        style={{ width: size, height: size }}
      />
      {wordmark && (
        <span className="font-display text-xl font-extrabold tracking-tight text-fg-strong">
          REDSAM
        </span>
      )}
    </span>
  )
}

export default Logo