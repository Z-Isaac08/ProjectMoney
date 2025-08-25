import { motion } from 'framer-motion';

type LoadingSize = 'sm' | 'md' | 'lg';

interface LoadingProps {
  size?: LoadingSize;
  text?: string;
}

export default function Loading({ size = 'md', text = 'Chargement...' }: LoadingProps) {
  const sizes: Record<LoadingSize, string> = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`border-4 border-primary-200 border-t-primary-500 rounded-full ${sizes[size]}`}
      />
      {text && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
    </div>
  );
}