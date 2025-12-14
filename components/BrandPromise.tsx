import React from 'react';
import { motion } from 'framer-motion';

const BrandPromise: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-beige-100">
      {/* Header */}
      <div className="text-center mb-20 md:mb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-charcoal"
        >
          Our Brand Promise,<br />
          We take ownership. Period.
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Abstract Graphic */}
        <div className="relative h-full min-h-[400px] flex flex-col justify-center items-center lg:items-start select-none pointer-events-none">
          
          {/* Top Graphic */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative w-[300px] h-[150px] mb-8"
          >
            {/* Grid Lines - SVG for crisp edges */}
            <svg width="100%" height="100%" viewBox="0 0 300 150" className="absolute inset-0">
                <path d="M100,50 L250,50" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M100,100 L300,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M100,50 L100,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M150,50 L150,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M200,50 L200,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M250,50 L250,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M300,100 L300,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                
                {/* Left floating piece */}
                <path d="M0,50 L20,50" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M0,100 L20,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M20,50 L20,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
            </svg>
            
            {/* Orange Blob - "Dead End" */}
            <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="absolute bottom-[35px] left-[180px] w-16 h-6 bg-[#FF5500] rounded-full z-10"
            />
          </motion.div>

          {/* Text in middle */}
          <div className="my-8 text-center lg:text-left z-20">
             <h3 className="font-serif-display text-2xl text-charcoal max-w-[250px] leading-tight">
                Say Goodbye to Dead Ends in Design Solutions!
             </h3>
          </div>

          {/* Bottom Graphic */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-[400px] h-[200px]"
          >
             <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute inset-0">
                {/* Left Cluster */}
                <path d="M0,50 L50,50" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M0,100 L50,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M0,150 L50,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M50,50 L50,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                
                {/* Bottom Left Cluster */}
                <path d="M100,50 L150,50" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M100,50 L100,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M150,50 L150,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M100,100 L350,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M100,150 L350,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M150,100 L150,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M200,100 L200,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M250,100 L250,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M300,100 L300,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M250,150 L250,180" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M250,180 L350,180" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M300,150 L300,180" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M350,150 L350,180" stroke="#E5E5E5" strokeWidth="2" fill="none" />

                {/* Right Cluster */}
                <path d="M400,100 L450,100" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M400,150 L450,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <path d="M400,100 L400,150" stroke="#E5E5E5" strokeWidth="2" fill="none" />
             </svg>

             {/* Lime Blob */}
             <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute top-[60px] left-[38px] w-6 h-16 bg-[#D4F23D] rounded-full z-10 opacity-90 mix-blend-multiply"
             />

             {/* Cyan Blob */}
             <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute top-[145px] left-[250px] w-10 h-3 bg-cyan-300 rounded-full z-10"
             />
             
             {/* Green Half-circle right */}
             <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute top-[90px] right-[40px] w-4 h-10 bg-green-500 rounded-l-full z-10"
             />
          </motion.div>
        </div>

        {/* Right Column: List */}
        <div className="flex flex-col">
          
          {/* Item 01 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-8 py-10 border-t border-charcoal/20"
          >
            <span className="text-sm font-mono text-charcoal/60 pt-1">01</span>
            <p className="text-lg md:text-xl leading-relaxed text-gray-600">
              We help you <span className="font-semibold text-charcoal">communicate what you do, how you do it, where you have done it</span> in the past, in the most effective, simplest and interesting way possible.
            </p>
          </motion.div>

          {/* Item 02 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-8 py-10 border-t border-charcoal/20"
          >
            <span className="text-sm font-mono text-charcoal/60 pt-1">02</span>
            <p className="text-lg md:text-xl leading-relaxed text-gray-600">
              We are <span className="font-semibold text-charcoal">process oriented and quality obsessed</span> to give you the best.
            </p>
          </motion.div>

          {/* Item 03 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-8 py-10 border-t border-charcoal/20 border-b"
          >
            <span className="text-sm font-mono text-charcoal/60 pt-1">03</span>
            <p className="text-lg md:text-xl leading-relaxed text-gray-600">
              We give great importance to <span className="font-semibold text-charcoal">understanding your brand, your product, your target audience, your competition</span> and perform cross-industry learning.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BrandPromise;