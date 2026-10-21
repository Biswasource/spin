import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'dark' | 'outline';
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  href,
  target = "_blank"
}) => {
  const baseStyles = "px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300 uppercase inline-block text-center cursor-pointer";
  
  const variants = {
    primary: "bg-lime-400 text-charcoal hover:bg-lime-500 border border-transparent",
    dark: "bg-[#2D2D2D] text-white hover:bg-black border border-transparent",
    outline: "bg-transparent border border-charcoal/20 hover:border-charcoal text-charcoal",
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      target={href ? target : undefined}
      rel={href && target === "_blank" ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Button;