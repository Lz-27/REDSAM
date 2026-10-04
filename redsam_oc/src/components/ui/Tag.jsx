/**
 * Tag — píldora del sistema.
 * `variant`: signal (relleno de marca), outline (borde), soft (relleno suave).
 * Los colores dependen del tema global (data-theme).
 */
function Tag({ children, variant = 'outline', tone = 'night', className = '', ...rest }) {
  void tone
  const styles = {
    signal: 'signal-bg text-night-950 font-bold',
    outline: 'border border-fg-line text-fg',
    soft: 'bg-surface-soft text-fg-strong',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}

export default Tag