import { Button as ShadcnButton } from './button.tsx'
import Icon from './Icon'

/**
 * Button — Wrapper adaptado al nuevo sistema premium híbrido (Shadcn + REDSAM).
 * Mantiene la compatibilidad con las llamadas antiguas (variant, icon, etc)
 * pero usa el Button globalizado.
 */
function Button({
  href = '#',
  variant = 'primary',
  tone = 'night',
  icon = null,
  iconPosition = 'end',
  className = '',
  children,
  ...rest
}) {
  void tone
  
  // Mapear variantes antiguas a variantes de Shadcn
  const mappedVariant = variant === 'primary' ? 'default' : variant === 'ghost' ? 'ghost' : 'outline'

  const iconClass = variant === 'ghost' ? 'transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1' : ''

  return (
    <ShadcnButton asChild variant={mappedVariant} className={className} {...rest}>
      <a href={href} className="group/link">
        {icon && iconPosition === 'start' && <Icon name={icon} size={18} className={iconClass} />}
        {children}
        {icon && iconPosition === 'end' && <Icon name={icon} size={18} className={iconClass} />}
      </a>
    </ShadcnButton>
  )
}

export default Button