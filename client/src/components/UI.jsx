// Common UI Components Library - Inspired by modern startup design
import React from 'react'

// Reusable button component with multiple variants and sizes
export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = {
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '10px 20px',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px',
    fontWeight: 500,
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '-0.3px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    outline: 'none'
  };

  const variants = {
    primary: {
      ...baseStyles,
      background: 'linear-gradient(135deg, #ffffff 0%, #d9d9d9 100%)',
      color: '#111',
      borderColor: 'rgba(255,255,255,0.2)'
    },
    secondary: {
      ...baseStyles,
      backgroundColor: 'rgba(255,255,255,0.08)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    outline: {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    danger: {
      ...baseStyles,
      background: 'linear-gradient(135deg, #ff5f5f 0%, #d93a3a 100%)',
      color: '#fff',
    }
  };

  return (
    <button
      style={variants[variant]}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.4)';
          } else if (variant === 'secondary') {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.35)';
          } else if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.35)';
          } else if (variant === 'danger') {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.4)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = baseStyles.boxShadow;
          const style = variants[variant];
          e.currentTarget.style.background = style.background;
          e.currentTarget.style.backgroundColor = style.backgroundColor;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Card container with hover effects for displaying content
export const Card = ({ children, padding = '24px', hover = true, ...props }) => {
  return (
    <div
      style={{
        padding,
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: hover ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Text input field with label and error state styling
export const Input = ({ 
  placeholder = '', 
  type = 'text', 
  value, 
  onChange, 
  error = false,
  label = '',
  ...props 
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '8px',
          color: '#fff',
          letterSpacing: '-0.2px'
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: error ? '1px solid #ff4444' : '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
          outline: 'none',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.borderColor = error ? '#ff4444' : 'rgba(255,255,255,0.1)';
        }}
        {...props}
      />
    </div>
  );
};

// Dropdown select component with options array for forms
export const Select = ({
  label = '',
  value,
  onChange,
  options = [],
  error = false,
  ...props
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '8px',
          color: '#fff',
          letterSpacing: '-0.2px'
        }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: error ? '1px solid #ff4444' : '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
          outline: 'none',
          boxSizing: 'border-box',
          cursor: 'pointer'
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#000', color: '#fff' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Small colored label for status indicators and tags
export const Badge = ({ children, variant = 'default', ...props }) => {
  const variants = {
    default: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' },
    success: { backgroundColor: 'rgba(68,204,85,0.2)', color: '#44cc55' },
    warning: { backgroundColor: 'rgba(255,170,0,0.2)', color: '#ffaa00' },
    danger: { backgroundColor: 'rgba(255,68,68,0.2)', color: '#ff4444' },
    primary: { backgroundColor: 'rgba(100,200,255,0.2)', color: '#64c8ff' }
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '-0.2px',
        ...variants[variant]
      }}
      {...props}
    >
      {children}
    </span>
  );
};

// Page section wrapper with optional title and subtitle
export const Section = ({ title, subtitle, children, ...props }) => {
  return (
    <section style={{ marginBottom: '60px' }} {...props}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          {title && (
            <h2 style={{
              fontSize: '40px',
              fontWeight: 700,
              letterSpacing: '-1px',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{
              fontSize: '16px',
              color: '#888',
              maxWidth: '600px',
              margin: '0 auto',
              letterSpacing: '-0.2px'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

// Responsive grid layout with configurable columns and gap
export const Grid = ({ columns = 3, gap = '20px', children, ...props }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${100 / columns}%, 1fr))`,
        gap,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Modal dialog overlay with close button for popups
export const Modal = ({ isOpen, onClose, title, children, ...props }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#0a0a0a',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          {title && (
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Alert message box with success, error, warning, and info variants
export const Alert = ({ type = 'info', message, children, onClose = () => {}, ...props }) => {
  const types = {
    success: { bg: 'rgba(68,204,85,0.15)', border: '#44cc55', color: '#44cc55', icon: '✓' },
    error: { bg: 'rgba(255,68,68,0.15)', border: '#ff4444', color: '#ff4444', icon: '!' },
    warning: { bg: 'rgba(255,170,0,0.15)', border: '#ffaa00', color: '#ffaa00', icon: '⚠' },
    info: { bg: 'rgba(100,200,255,0.15)', border: '#64c8ff', color: '#64c8ff', icon: 'ⓘ' }
  };

  const config = types[type];

  return (
    <div style={{
      padding: '16px 20px',
      borderRadius: '8px',
      backgroundColor: config.bg,
      borderLeft: `4px solid ${config.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      ...props.style
    }}>
      <span style={{ color: config.color, fontSize: '18px', fontWeight: 'bold' }}>
        {config.icon}
      </span>
      <span style={{ color: '#fff', flex: 1, fontSize: '14px' }}>
        {message || children}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#888',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0'
        }}
      >
        ×
      </button>
    </div>
  );
};

// Horizontal divider line for separating content sections
export const Divider = (props) => (
  <hr style={{
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    margin: '32px 0',
    ...props.style
  }} />
);

// Removable tag chip for displaying labels or filters
export const Tag = ({ children, removable = false, onRemove = () => {}, ...props }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '6px',
      backgroundColor: 'rgba(100,200,255,0.2)',
      color: '#64c8ff',
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '-0.2px'
    }}
    {...props}
  >
    {children}
    {removable && (
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        ×
      </button>
    )}
  </span>
);

// Loading placeholder with pulsing animation for async content
export const Skeleton = ({ width = '100%', height = '20px', ...props }) => (
  <div
    style={{
      width,
      height,
      borderRadius: '8px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      ...props.style
    }}
  />
);
