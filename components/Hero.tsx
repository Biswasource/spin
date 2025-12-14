import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import ThreeDText from './ThreeDText';
import RevealType from './RevealType';

import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 md:pt-36 pb-12 md:pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-5xl">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-2"
        >
             <span className="text-lime-500 font-semibold tracking-widest uppercase text-xs md:text-sm">SpinTech Design</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 1 }} 
          className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-charcoal mb-10 tracking-tight"
        >
          <ThreeDText className="inline-block" depth={5}>
            <RevealType delay={0.2} className="text-charcoal">Crafting digital designs.</RevealType>
          </ThreeDText>
          <br />
          <ThreeDText className="inline-block" depth={5}>
            <RevealType delay={0.6} className="text-charcoal">Refining content flawlessly.</RevealType>
          </ThreeDText>
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-12 items-start text-lg md:text-xl text-gray-600">
            <div className="max-w-md text-lg md:text-xl text-gray-600">
              <RevealType delay={0.1} className="leading-relaxed">
                We are a creative agency specializing in high-end execution. We help B2B brands and startups look their absolute best.
              </RevealType>
            </div>
            
          
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-6"
        >
          <Button variant="primary" onClick={() => navigate('/start-project')}>
            START A PROJECT
          </Button>
          <Button variant="outline" onClick={() => navigate('/work')}>
            VIEW OUR WORK
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;