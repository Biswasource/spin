import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Calculate rotation based on mouse position relative to center of card
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Shine effect movement
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate normalized position (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col gap-3 group perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer ${project.color}`}
      >
        {/* Shine Gradient Overlay */}
        <motion.div 
            style={{ 
                background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.2) 0%, transparent 80%)`,
                z: 50
            }}
            className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Content Container (Pushed back in 3D space slightly) */}
        <div className="absolute inset-0 flex items-center justify-center transform translate-z-10">
          <h3 className={`text-5xl md:text-6xl font-bold tracking-tighter ${project.textColor}`}>
            {project.logoText}
          </h3>
        </div>

        {/* Floating Button (Pushed forward in 3D space) */}
        <motion.div 
          className="absolute bottom-6 right-6 z-20"
          style={{ translateZ: "40px" }}
        >
          <div className="bg-white text-charcoal px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            {project.linkText}
            <div className="bg-charcoal text-white rounded-full p-0.5">
               <ChevronRight size={12} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Metadata Below Card */}
      <div className="flex justify-between items-center text-xs tracking-widest font-medium text-gray-500 uppercase mt-2">
        <span className="text-red-500/80 group-hover:text-red-500 transition-colors">{project.client}</span>
        <span>{project.category}</span>
      </div>
    </div>
  );
};

export default ProjectCard;