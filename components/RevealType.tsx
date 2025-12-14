import React from 'react';
import { motion } from 'framer-motion';

interface RevealTypeProps {
  children: string;
  className?: string; // Additional classes for the container
  delay?: number;     // Delay before starting the animation
  charSpace?: string; // Special handling for spacing if needed
}

const RevealType: React.FC<RevealTypeProps> = ({ children, className = "", delay = 0 }) => {
  // Split text into words
  const words = children.split(" ");

  // Variants for the container of words
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Stagger each word
        delayChildren: delay,
      }
    }
  };

  // Variants for individual words (sliding up)
  const childVariant = {
    hidden: { y: "120%", opacity: 0, rotate: 5 },
    visible: { 
        y: "0%", 
        opacity: 1,
        rotate: 0,
        transition: { 
            duration: 0.8, 
            ease: [0.2, 0.65, 0.3, 0.9] 
        } 
    }
  };

  return (
    <motion.span 
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`} // inline-flex to sit nicely, gap for word spacing
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <span key={index} className="relative overflow-hidden inline-block pb-2 -mb-2"> {/* Overflow hidden for the mask effect */}
          <motion.span variants={childVariant} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default RevealType;
