
import React from 'react';
import { cn } from '@/lib/utils';

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  children: React.ReactNode;
  onClick?: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({ 
  variant = 'default', 
  className, 
  children, 
  onClick,
  ...props 
}) => {
  const baseStyles = "rounded-xl border p-6 transition-all duration-300";
  
  const variantStyles = {
    default: "bg-white shadow-card hover:shadow-md",
    glass: "glass-panel backdrop-blur-lg hover:shadow-md",
    elevated: "bg-white shadow-elevated hover:translate-y-[-2px]"
  };
  
  return (
    <div 
      className={cn(
        baseStyles,
        variantStyles[variant],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default CustomCard;
