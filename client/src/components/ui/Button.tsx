import type { ComponentProps } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ComponentProps<'button'>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-primary-500 hover:bg-primary-600 text-dark-900 focus:ring-primary-500 hover:shadow-lg',
    secondary:
      'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500 hover:shadow-lg',
    outline:
      'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
    ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100'
    : '';

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}