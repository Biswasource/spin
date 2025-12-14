import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
}

const TextReveal: React.FC<TextRevealProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.25"],
  });

  const words = children.split(" ");

  return (
    <p ref={containerRef} className={`flex flex-wrap leading-tight ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word: React.FC<{ children: string; range: [number, number]; progress: MotionValue<number> }> = ({ children, range, progress }) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const color = useTransform(progress, range, ["#d1d5db", "#1A1A1A"]); // Gray-300 to Charcoal

  return (
    <span className="relative mr-2 lg:mr-3 mt-2">
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ opacity, color }}>{children}</motion.span>
    </span>
  );
};

export default TextReveal;
