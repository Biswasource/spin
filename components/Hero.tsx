import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Button from './Button';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Text */}
        <div className="space-y-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-charcoal"
          >
            We partner with B2B brands to{' '}
            <span className="relative inline-block">
              rebrand
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-1 md:bottom-2 left-0 h-[3px] bg-charcoal"
              />
            </span>{' '}
            &{' '}
            <span className="relative inline-block">
              redesign
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-1 md:bottom-2 left-0 h-[3px] bg-charcoal"
              />
            </span>{' '}
            their websites
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed"
          >
            We help you communicate your value proposition clearly and differentiate your brand in a way that resonates with your target audience.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Button variant="primary" onClick={() => console.log('Chat GPT')}>
              CHAT GPT US
            </Button>
            <Button variant="dark" onClick={() => console.log('Do not click')}>
              DON'T CLICK HERE
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Video/Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="relative aspect-square md:aspect-[4/3] w-full"
        >
          <div className="absolute inset-0 bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            {/* Placeholder Image using Picsum with specific ID for office vibe */}
            <img 
              src="https://picsum.photos/id/60/1200/900" 
              alt="Office Video Thumbnail" 
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Video Overlay Info */}
            <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col md:flex-row items-end justify-between gap-4">
              <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg text-white max-w-xs">
                <p className="font-serif-display text-xl leading-tight">
                  "Uh, that shows how happy we all are with the output today."
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-charcoal px-6 py-3 rounded-full flex items-center gap-3 font-medium shadow-lg group"
              >
                Play Video
                <div className="w-8 h-8 bg-charcoal rounded-full flex items-center justify-center text-white group-hover:bg-lime-400 group-hover:text-charcoal transition-colors">
                  <Play size={14} fill="currentColor" />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;