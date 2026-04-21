import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export default function Input({ label, error, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '0.8rem', color: '#A6A6A6', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input
        style={{
          background: '#2D2D2D',
          border: `1px solid ${error ? '#F44747' : '#3C3C3C'}`,
          borderRadius: '6px',
          padding: '9px 12px',
          color: '#D4D4D4',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          outline: 'none',
          width: '100%',
          transition: 'border-color 0.2s',
          ...style,
        }}
        onFocus={e => e.target.style.borderColor = error ? '#F44747' : '#569CD6'}
        onBlur={e => e.target.style.borderColor = error ? '#F44747' : '#3C3C3C'}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#F44747' }}>{error}</span>
      )}
    </div>
  )
}