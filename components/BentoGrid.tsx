import React from 'react';
import { motion } from 'framer-motion';
import { Github, Cloud, Sparkles, Globe, Terminal, BarChart3, PieChart, Layout } from 'lucide-react';

const Card: React.FC<{ 
    children: React.ReactNode; 
    className?: string; 
    title: string;
    description: string;
    delay?: number;
}> = ({ children, className = "", title, description, delay = 0 }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -5 }}
            className={`bg-white rounded-[2rem] p-8 md:p-10 border border-charcoal/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between overflow-hidden relative group ${className}`}
        >
            <div className="z-10 relative">
                <h3 className="font-serif-display text-2xl md:text-3xl text-charcoal mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base max-w-xs">{description}</p>
            </div>
            <div className="mt-8 flex-grow relative min-h-[160px] flex items-center justify-center">
                {children}
            </div>
        </motion.div>
    );
};

const MockDashboard = ({ className = "" }: { className?: string }) => (
    <div className={`w-full h-full bg-beige-50 rounded-xl border border-charcoal/5 p-4 flex flex-col gap-3 ${className}`}>
        <div className="flex gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="flex gap-4 h-full">
            <div className="w-1/4 h-full flex flex-col gap-2">
                 <div className="h-2 w-12 bg-gray-200 rounded-full" />
                 <div className="h-2 w-16 bg-gray-200 rounded-full" />
                 <div className="h-2 w-10 bg-gray-200 rounded-full" />
            </div>
            <div className="w-3/4 h-full bg-white rounded-lg border border-charcoal/5 p-3 relative overflow-hidden">
                <div className="flex justify-between items-end h-full px-2 pb-2 gap-2">
                     {[40, 70, 50, 90, 60, 80].map((h, i) => (
                         <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className="w-full bg-lime-400/50 rounded-t-sm"
                         />
                     ))}
                </div>
            </div>
        </div>
    </div>
);

const GlobeGraphic = () => {
    return (
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center overflow-hidden">
             {/* Simple Globe Simulation */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-charcoal to-black opacity-90 overflow-hidden shadow-2xl">
                {/* Rotating Dots */}
                <motion.div 
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                    className="absolute inset-y-0 flex gap-4 opacity-30"
                    style={{ width: '200%' }}
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-4 justify-center">
                            {Array.from({ length: 10 }).map((_, j) => (
                                <div key={j} className="w-1 h-1 bg-white rounded-full" style={{ opacity: Math.random() }} />
                            ))}
                        </div>
                    ))}
                </motion.div>
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
             </div>
        </div>
    );
};

const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif-display text-4xl md:text-5xl text-charcoal mb-4"
            >
                Powerful Features
            </motion.h2>
            <p className="text-gray-500 max-w-xl mx-auto">
                Everything you need to build, launch, and scale your brand's digital presence with speed and precision.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* 1. One Click Deploy */}
            <Card 
                className="md:col-span-3"
                title="One click deploy"
                description="Deploy your app in seconds with our streamlined pipeline."
                delay={0.1}
            >
                <div className="flex items-center gap-4 md:gap-8 w-full justify-center">
                    {/* Terminal */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-charcoal text-white text-[10px] md:text-xs p-3 rounded-lg font-mono shadow-lg w-32 shrink-0 z-10"
                    >
                        <div className="flex gap-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="opacity-80">
                            $ git add .<br/>
                            $ git commit -m "up"<br/>
                            $ git push
                        </div>
                    </motion.div>

                    {/* Connector */}
                    <svg className="w-16 h-8 text-gray-300 absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                         <path d="M0,16 C20,16 44,16 64,16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                    </svg>

                    {/* Logos */}
                    <div className="flex gap-4 md:gap-6 bg-white p-4 rounded-xl shadow-md border border-gray-100 z-10">
                        <Github className="w-6 h-6 md:w-8 md:h-8 text-charcoal" />
                        <div className="w-px h-8 bg-gray-200" />
                        <Cloud className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                    </div>
                </div>
            </Card>

            {/* 2. Intuitive Workflow */}
            <Card 
                className="md:col-span-3"
                title="Intuitive workflow"
                description="Easily manage your app without complex steps."
                delay={0.2}
            >
                 <div className="w-full max-w-sm mx-auto transform translate-y-4 hover:translate-y-0 transition-transform duration-500">
                    <MockDashboard className="h-48 shadow-lg" />
                 </div>
            </Card>

            {/* 3. Hosting */}
            <Card 
                className="md:col-span-2 min-h-[300px] md:min-h-0"
                title="Hosting over the edge"
                description="Global low-latency network."
                delay={0.3}
            >
                <div className="absolute -bottom-12 -right-12 md:-bottom-20 md:-right-20">
                     <GlobeGraphic />
                </div>
            </Card>

            {/* 4. Copy Generation */}
            <Card 
                className="md:col-span-4"
                title="Running out of copy"
                description="We can generate copy for your website automatically using AI."
                delay={0.4}
            >
                <div className="flex gap-4 w-full items-end h-full pl-4 md:pl-10 pb-4">
                     {/* Editor Mock */}
                     <div className="flex-1 bg-white border border-gray-200 rounded-tl-xl shadow-lg p-6 h-40 md:h-48 relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <Sparkles className="w-5 h-5 text-lime-500 animate-pulse" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">New Project</h4>
                        <div className="space-y-2">
                             <div className="h-2 bg-gray-100 rounded-full w-3/4" />
                             <div className="h-2 bg-gray-100 rounded-full w-full" />
                             <div className="h-2 bg-gray-100 rounded-full w-5/6" />
                             <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '60%' }}
                                transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                                className="h-2 bg-lime-200 rounded-full" 
                             />
                        </div>
                     </div>
                     
                     {/* Side Palette Mock */}
                     <div className="w-24 bg-charcoal rounded-t-xl h-32 p-3 flex flex-col gap-3 shadow-xl shrink-0">
                         <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                             <Layout className="w-4 h-4 text-white/70" />
                         </div>
                         <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                             <BarChart3 className="w-4 h-4 text-white/70" />
                         </div>
                         <div className="w-8 h-8 rounded bg-lime-400 flex items-center justify-center text-charcoal">
                             <Terminal className="w-4 h-4" />
                         </div>
                     </div>
                </div>
            </Card>

        </div>
    </section>
  );
};

export default BentoGrid;