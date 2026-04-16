import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variants: Record<Variant, React.CSSProperties> = {
  primary:   { background: '#569CD6', color: '#1E1E1E', border: 'none' },
  secondary: { background: '#2D2D2D', color: '#D4D4D4', border: '1px solid #3C3C3C' },
  danger:    { background: 'rgba(244,71,71,0.15)', color: '#F44747', border: '1px solid rgba(244,71,71,0.3)' },
  ghost:     { background: 'transparent', color: '#A6A6A6', border: 'none' },
}

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '5px 12px', fontSize: '0.8rem' },
  md: { padding: '8px 18px', fontSize: '0.875rem' },
  lg: { padding: '11px 24px', fontSize: '0.95rem' },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '6px',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        opacity: disabled || loading ? 0.6 : 1,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {loading && (
        <span style={{
          width: '14px', height: '14px', borderRadius: '50%',
          border: '2px solid currentColor', borderTopColor: 'transparent',
          animation: 'spin 0.6s linear infinite', display: 'inline-block',
        }} />
      )}
      {children}
    </button>
  )
}