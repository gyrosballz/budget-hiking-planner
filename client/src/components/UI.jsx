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
    padding: size === 'sm' ? '8px 20px' : size === 'lg' ? '14px 32px' : '12px 28px',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '15px' : '14px',
    fontWeight: 400,
    border: '1px solid #000',
    borderRadius: '24px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '0px',
    boxShadow: 'none',
    outline: 'none'
  };

  const variants = {
    primary: {
      ...baseStyles,
      backgroundColor: '#000',
      color: '#fff',
      borderColor: '#000'
    },
    secondary: {
      ...baseStyles,
      backgroundColor: '#fff',
      color: '#000',
      border: '1px solid #e5e5e5',
    },
    outline: {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: '#000',
      border: '1px solid #e5e5e5',
    },
    danger: {
      ...baseStyles,
      backgroundColor: '#ff4444',
      color: '#fff',
      borderColor: '#ff4444'
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
            e.currentTarget.style.backgroundColor = '#333';
          } else if (variant === 'secondary') {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          } else if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = '#f9f9f9';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = '#e03030';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const style = variants[variant];
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
        borderRadius: '0px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e5e5',
        transition: 'all 0.2s ease',
        cursor: hover ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = '#ccc';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = '#e5e5e5';
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
          fontSize: '13px',
          fontWeight: 400,
          marginBottom: '8px',
          color: '#666',
          letterSpacing: '0px'
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
          borderRadius: '4px',
          backgroundColor: '#fff',
          border: error ? '1px solid #ff4444' : '1px solid #e5e5e5',
          color: '#000',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
          outline: 'none',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#000';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#ff4444' : '#e5e5e5';
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
          fontSize: '13px',
          fontWeight: 400,
          marginBottom: '8px',
          color: '#666',
          letterSpacing: '0px'
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
          borderRadius: '4px',
          backgroundColor: '#fff',
          border: error ? '1px solid #ff4444' : '1px solid #e5e5e5',
          color: '#000',
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
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#fff', color: '#000' }}>
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
    default: { backgroundColor: '#f5f5f5', color: '#666' },
    success: { backgroundColor: '#f0f9f0', color: '#2d7a2d' },
    warning: { backgroundColor: '#fff8e6', color: '#996600' },
    danger: { backgroundColor: '#ffebee', color: '#c62828' },
    primary: { backgroundColor: '#e3f2fd', color: '#1976d2' }
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
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
    <section style={{ marginBottom: '80px' }} {...props}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '48px', textAlign: 'left' }}>
          {title && (
            <h1 style={{
              fontSize: '56px',
              fontWeight: 700,
              letterSpacing: '0px',
              marginBottom: '16px',
              color: '#000',
              lineHeight: 1.1
            }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{
              fontSize: '18px',
              color: '#666',
              maxWidth: '600px',
              margin: '0',
              letterSpacing: '0px',
              lineHeight: 1.6
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
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        border: '1px solid #e5e5e5',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
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
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0px',
              color: '#000'
            }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
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
    success: { bg: '#f0f9f0', border: '#2d7a2d', color: '#2d7a2d', icon: '✓' },
    error: { bg: '#ffebee', border: '#c62828', color: '#c62828', icon: '!' },
    warning: { bg: '#fff8e6', border: '#996600', color: '#996600', icon: '⚠' },
    info: { bg: '#e3f2fd', border: '#1976d2', color: '#1976d2', icon: 'ⓘ' }
  };

  const config = types[type];

  return (
    <div style={{
      padding: '16px 20px',
      borderRadius: '4px',
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
      <span style={{ color: config.color, flex: 1, fontSize: '14px' }}>
        {message || children}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: config.color,
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          opacity: 0.6
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
    borderTop: '1px solid #e5e5e5',
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
