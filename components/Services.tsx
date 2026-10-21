import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const SERVICES_LIST = [
  "Branding & Strategy",
  "Website Design",
  "Website Development",
  "Video & Animation"
];

const Block: React.FC<{ 
  className?: string; 
  type?: 'outline' | 'solid' | 'triangle'; 
  delay?: number 
}> = ({ className = '', type = 'outline', delay = 0 }) => {
  const baseStyles = "w-16 h-16 md:w-20 md:h-20 border border-charcoal/80 absolute box-border";
  
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, delay: delay, ease: "backOut" }
    }
  };

  if (type === 'triangle') {
    return (
      <motion.div 
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`absolute w-16 h-16 md:w-20 md:h-20 ${className}`}
      >
        {/* CSS Triangle specifically for bottom-right 90deg or similar effect */}
        <div className="w-full h-full bg-lime-400" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
      </motion.div>
    );
  }

  // To match the image exactly, the triangle actually looks like a right-angled triangle 
  // filling the bottom-right half? No, looking closely at the user image:
  // It's a triangle where the hypotenuse goes from top-left to bottom-right? 
  // No, it occupies the bottom-left half of the square? 
  // Actually, let's use a simpler clip path that looks like the image (slope up-right).
  if (type === 'triangle-slope') {
      return (
        <motion.div 
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`absolute w-16 h-16 md:w-20 md:h-20 bg-lime-400 ${className}`}
            style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)' }} // Bottom-right filled
        />
      );
  }
  
  // Actually the image shows the triangle is the 4th block in the bottom row.
  // It looks like the green part is on the bottom-right.
  
  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`${baseStyles} ${type === 'solid' ? 'bg-lime-400 border-none' : 'bg-transparent'} ${className}`} 
    />
  );
};

const Services: React.FC = () => {
  // Grid Unit Size calculation for positioning
  // Using w-20 (80px) for calculation, but Tailwind arbitrary values for exact placement
  
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative bg-beige-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Heading & Illustration */}
        <div className="lg:col-span-5 relative flex flex-col justify-between min-h-[500px] border-r border-charcoal/10">
           <div>
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-charcoal mb-20"
                >
                    What we do
                </motion.h2>

                {/* Geometric Illustration */}
                {/* 
                   Grid Map (6 cols x 3 rows):
                   Unit size ~80px (md)
                   (2,0) Green
                   (0,1) Outline | (3,1) Green | (4,1) Outline
                   (0,2) Outline | (1,2) Outline | (2,2) Outline | (3,2) Triangle | (4,2) Outline
                */}
                <div className="relative h-[240px] w-full max-w-[400px] mt-12 hidden md:block">
                    {/* Row 0 */}
                    <Block type="solid" className="left-[160px] top-0" delay={0.1} />

                    {/* Row 1 */}
                    <Block type="outline" className="left-0 top-[80px]" delay={0.2} />
                    <Block type="solid" className="left-[240px] top-[80px]" delay={0.3} />
                    <Block type="outline" className="left-[320px] top-[80px]" delay={0.4} />

                    {/* Row 2 */}
                    <Block type="outline" className="left-0 top-[160px]" delay={0.5} />
                    <Block type="outline" className="left-[80px] top-[160px]" delay={0.6} />
                    <Block type="outline" className="left-[160px] top-[160px]" delay={0.7} />
                    {/* Triangle: The image shows a triangle filling the bottom-left? No, looks like bottom-left to top-right diagonal, filling bottom-right side. */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="absolute w-20 h-20 left-[240px] top-[160px]"
                    >
                         {/* SVG for precise triangle shape */}
                         <svg width="100%" height="100%" viewBox="0 0 100 100">
                             <path d="M0 100 L100 100 L100 0 Z" fill="#D4F23D" />
                         </svg>
                    </motion.div>
                    <Block type="outline" className="left-[320px] top-[160px]" delay={0.9} />
                </div>

                {/* Mobile version of illustration (scaled down) */}
                 <div className="relative h-[192px] w-full mt-12 md:hidden scale-75 origin-top-left">
                    {/* Row 0 */}
                    <Block type="solid" className="left-[128px] top-0 w-16 h-16" delay={0.1} />

                    {/* Row 1 */}
                    <Block type="outline" className="left-0 top-[64px] w-16 h-16" delay={0.2} />
                    <Block type="solid" className="left-[192px] top-[64px] w-16 h-16" delay={0.3} />
                    <Block type="outline" className="left-[256px] top-[64px] w-16 h-16" delay={0.4} />

                    {/* Row 2 */}
                    <Block type="outline" className="left-0 top-[128px] w-16 h-16" delay={0.5} />
                    <Block type="outline" className="left-[64px] top-[128px] w-16 h-16" delay={0.6} />
                    <Block type="outline" className="left-[128px] top-[128px] w-16 h-16" delay={0.7} />
                     <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="absolute w-16 h-16 left-[192px] top-[128px]"
                    >
                         <svg width="100%" height="100%" viewBox="0 0 100 100">
                             <path d="M0 100 L100 100 L100 0 Z" fill="#D4F23D" />
                         </svg>
                    </motion.div>
                    <Block type="outline" className="left-[256px] top-[128px] w-16 h-16" delay={0.9} />
                </div>
           </div>
        </div>

        {/* Right Column: Services List */}
        <div className="lg:col-span-7 flex flex-col justify-center">
            <ul className="flex flex-col gap-6 md:gap-8 mb-16">
                {SERVICES_LIST.map((service, index) => (
                    <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-charcoal/60" />
                        <span className="font-serif-display text-2xl md:text-3xl text-charcoal/80">
                            {service}
                        </span>
                    </motion.li>
                ))}
            </ul>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
            >
                <Button variant="primary" className="text-xs font-semibold px-8 py-4 bg-[#D4F23D] hover:bg-[#c2df35]">
                    OUR SERVICES
                </Button>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Services;