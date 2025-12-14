import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Button from './Button';

interface Situation {
  id: number;
  quote: string;
  role: string;
  description: string;
  highlight: string;
}

const SITUATIONS: Situation[] = [
  {
    id: 1,
    quote: "“We need branding and website which will communicate what we do, to our target audience in a simple manner.”",
    role: "- B2B Cross Border Trade Platform",
    description: "Everything Design Agency worked with Ximkart to do a brand refresh, build a visual identity, design & develop the website in webflow.",
    highlight: "Ximkart"
  },
  {
    id: 2,
    quote: "“We find it difficult to convey what our brand stands for and attract great talent.”",
    role: "- Cyber Security Company",
    description: "Everything Design Agency worked with Fortuna Identity to give the brand a long needed update to be at par with the industry’s advancements whilst retaining domain expertise to attract better talent.",
    highlight: "Fortuna Identity"
  }
];

const SituationCard: React.FC<{ data: Situation }> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
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

  // Highlighting the specific word in bold
  const parts = data.description.split(data.highlight);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="bg-transparent p-0 group perspective-1000 w-full"
    >
        <div className="bg-beige-50/50 p-8 md:p-12 rounded-3xl border border-charcoal/5 hover:border-charcoal/10 transition-colors duration-500 shadow-sm flex flex-col gap-8 h-full">
            <blockquote className="font-serif-display text-3xl md:text-4xl lg:text-[2.5rem] text-charcoal leading-[1.15]">
            {data.quote}
            </blockquote>
            
            <p className="text-lg text-gray-500 font-medium">
            {data.role}
            </p>

            <div className="h-px w-full bg-charcoal/10" />

            <p className="text-gray-600 leading-relaxed text-lg">
            {parts[0]}
            <span className="font-bold text-charcoal">{data.highlight}</span>
            {parts[1]}
            </p>

            <div>
             <Button variant="primary" className="text-xs px-8 py-3 bg-[#D4F23D] hover:bg-[#c2df35]">SEE FINAL OUTPUT</Button>
            </div>
        </div>
    </motion.div>
  );
};

const Situations: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sticky Left Column */}
        <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
                 <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-charcoal mb-8"
                 >
                    Does any of these situations sound familiar to you?
                 </motion.h2>
            </div>
        </div>

        {/* Divider Line (Visual) */}
        <div className="hidden lg:block absolute left-[41.666667%] top-0 bottom-0 w-px bg-charcoal/10" />

        {/* Scrollable Right Column */}
        <div className="lg:col-span-7 flex flex-col gap-16 pl-0 lg:pl-12">
            {SITUATIONS.map(situation => (
                <SituationCard key={situation.id} data={situation} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Situations;