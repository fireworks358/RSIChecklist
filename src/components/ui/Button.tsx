import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false
}) => {
  const baseClass = variant === 'primary' ? 'nhs-button-primary' : 'nhs-button-secondary';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};
