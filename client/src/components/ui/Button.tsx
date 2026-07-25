import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-label-md rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-primary text-on-primary hover:bg-primary/90 shadow-sm",
      secondary: "bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm",
      outline: "border border-outline bg-transparent hover:bg-surface-container text-on-surface",
      ghost: "bg-transparent hover:bg-surface-container text-on-surface"
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base"
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
