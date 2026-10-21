import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { ArrowUpRight } from 'lucide-react';
import TextReveal from '../components/TextReveal';
import { useNavigate } from 'react-router-dom';

import adnautImg from '../pages/adnaut.png';
import fortunaImg from '../pages/fortuna.png';
import goodfoodImg from '../pages/goodfood.png';

const Projects: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Left Column: Fixed Content */}
        <div className="lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="mb-8">
                     <TextReveal className="font-serif-display text-5xl md:text-7xl text-charcoal leading-[1.05]">
                        Featured Brand Design Projects
                    </TextReveal>
                </div>
        
                <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
                    The value of branding isn’t the way something looks or sounds. It’s the story, confidence, and clarity you’ve unearthed in the process that makes your:
                </p>
              

                <Button 
                    variant="primary" 
                    className="bg-[#D4F23D] hover:bg-[#c2df35]"
                    onClick={() => navigate('/work')}
                >
                    SEE MORE WORK
                </Button>
            </motion.div>
        </div>

        {/* Right Column: Scrollable Projects */}
        <div className="flex flex-col gap-12 lg:gap-32 py-20">
            
            {/* Project 1: Adnaut */}
            <motion.div 
                className="group relative cursor-pointer flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#fafaf9] flex items-center justify-center group shadow-sm">
                    <img 
                        src={adnautImg} 
                        alt="Adnaut" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="mt-6 flex flex-col items-start">
                    <h3 className="font-serif-display text-4xl text-charcoal mb-2">Adnaut</h3>
                    <p className="text-gray-500 mb-4">Digital Marketing • Branding • Strategy</p>
                    <a href="https://www.adnaut.digital/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white rounded-full hover:bg-black transition-colors font-medium">
                        Visit Website
                        <ArrowUpRight size={18} />
                    </a>
                </div>
            </motion.div>

             {/* Project 2: Fortuna */}
             <motion.div 
                className="group relative cursor-pointer flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#fafaf9] flex items-center justify-center group shadow-sm">
                    <img 
                        src={fortunaImg} 
                        alt="Fortuna" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="mt-6 flex flex-col items-start">
                    <h3 className="font-serif-display text-4xl text-charcoal mb-2">Fortuna</h3>
                    <p className="text-gray-500 mb-4">Finance • Wealth Management • Consulting</p>
                    <a href="https://www.fortunaidentity.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white rounded-full hover:bg-black transition-colors font-medium">
                        Visit Website
                        <ArrowUpRight size={18} />
                    </a>
                </div>
            </motion.div>

            {/* Project 3: Goodfood */}
            <motion.div 
                className="group relative cursor-pointer flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-sm flex items-center justify-center group">
                    <img 
                        src={goodfoodImg} 
                        alt="Good Food" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                     <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="mt-6 flex flex-col items-start">
                    <h3 className="font-serif-display text-4xl text-charcoal mb-2">Good Food</h3>
                    <p className="text-gray-500 mb-4">Food & Beverage • E-commerce • Delivery</p>
                    <a href="https://gfm.akshayakalpa.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white rounded-full hover:bg-black transition-colors font-medium">
                        Visit Website
                        <ArrowUpRight size={18} />
                    </a>
                </div>
            </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Projects;