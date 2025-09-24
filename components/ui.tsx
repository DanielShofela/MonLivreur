import React, { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';

// Utility function
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Button Component
export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background';
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </motion.button>
  );
};


// Input Component
export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
        className
      )}
      {...props}
    />
  );
};


// Card Component
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={cn('bg-card text-card-foreground rounded-xl shadow-lg', className)}>
      {children}
    </div>
  );
};
export const CardHeader: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
};
export const CardTitle: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => {
  return <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
};
export const CardContent: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};


// Icon Component
type IconName = keyof typeof Lucide;
interface IconProps extends Lucide.LucideProps {
  name: IconName;
  className?: string;
}
export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = Lucide[name] as React.ElementType;
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
};