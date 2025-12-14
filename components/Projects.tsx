import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './Button';
import { Play } from 'lucide-react';
import TextReveal from '../components/TextReveal';

const Projects: React.FC = () => {
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
              

                <Button variant="primary" className="bg-[#D4F23D] hover:bg-[#c2df35]">
                    SEE MORE WORK
                </Button>
            </motion.div>
        </div>

        {/* Right Column: Scrollable Projects */}
        <div className="flex flex-col gap-12 lg:gap-32 py-20">
            
            {/* Project 1: Showreel */}
            <motion.div 
                className="group relative cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-900">
                    <img 
                        src="https://picsum.photos/id/12/800/600" 
                        alt="Showreel 2024" 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                             <Play size={32} className="text-white fill-white ml-2" />
                        </div>
                    </div>
                     <div className="absolute bottom-6 right-6">
                        <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2">
                             <span className="text-sm font-semibold">Play Video</span>
                             <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                <Play size={10} fill="currentColor" />
                             </div>
                        </div>
                    </div>
                </div>
                <h3 className="font-serif-display text-4xl mt-6 text-charcoal">Showreel 2024</h3>
            </motion.div>

             {/* Project 2: Botim */}
             <motion.div 
                className="group relative cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#e0f2fe] p-8 flex items-center justify-center">
                    {/* Mock UI for Botim */}
                    <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
                         <div className="absolute top-0 left-0 w-full h-16 bg-white border-b flex items-center px-6 justify-between">
                            <span className="font-bold text-xl text-blue-500">Botim</span>
                            <span className="text-xs bg-black text-white px-3 py-1 rounded-full">Download Now</span>
                         </div>
                         <div className="mt-24 px-8 text-center">
                             <h4 className="text-4xl font-bold mb-4">UAE's First & Only <br/> Ultra Platform</h4>
                         </div>
                         <img src="https://picsum.photos/id/1015/800/600" className="opacity-20 absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="font-serif-display text-4xl text-charcoal mb-2">Botim</h3>
                    <p className="text-gray-500">Super App • FinTech • UAE</p>
                </div>
            </motion.div>

            {/* Project 3: PayBy */}
            <motion.div 
                className="group relative cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#0F172A] p-8 text-white relative">
                    <img 
                        src="https://picsum.photos/id/445/800/600" 
                        alt="PayBy"
                        className="absolute inset-0 w-full h-full object-cover opacity-50" 
                    />
                    <div className="relative z-10 flex flex-col h-full justify-end p-4">
                        <h2 className="text-5xl font-bold mb-2">PayBy</h2>
                        <p className="text-xl text-gray-300">Seamless Payments Everywhere.</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="font-serif-display text-4xl text-charcoal mb-2">PayBy</h3>
                    <p className="text-gray-500">FinTech • Payments • Global</p>
                </div>
            </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Projects;