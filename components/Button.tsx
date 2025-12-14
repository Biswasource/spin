import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'dark' | 'outline';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', onClick }) => {
  const baseStyles = "px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300 uppercase inline-block";
  
  const variants = {
    primary: "bg-lime-400 text-charcoal hover:bg-lime-500 border border-transparent",
    dark: "bg-[#2D2D2D] text-white hover:bg-black border border-transparent",
    outline: "bg-transparent border border-charcoal/20 hover:border-charcoal text-charcoal",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default Button;