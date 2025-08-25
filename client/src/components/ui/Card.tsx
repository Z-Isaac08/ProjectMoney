import type { ComponentProps } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends ComponentProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
  ...props
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl shadow-lg overflow-hidden';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}