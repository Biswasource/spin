import React from 'react';
import { motion } from 'framer-motion';
import RevealType from '../components/RevealType';
import Services from '../components/Services';
import TextReveal from '../components/TextReveal';
import { FaRocket, FaRobot } from 'react-icons/fa';

const About: React.FC = () => {
  return (
    <>
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[60vh]">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
        >
          <span className="text-lime-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Who We Are</span>
          <h1 className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-charcoal mb-12">
            <RevealType delay={0.1}>We build digital</RevealType>
            <br />
            <RevealType delay={0.3}>products that matter.</RevealType>
          </h1>
          
          <div className="max-w-4xl">
             <RevealType delay={0.5} className="text-xl md:text-3xl text-charcoal font-medium">
                At SpinTech Design, we merge creative strategy with engineering excellence. We don't just design websites; we craft complete digital ecosystems.
             </RevealType>
          </div>
        </motion.div>

        {/* Specializations: SaaS & AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-10 rounded-3xl border border-charcoal/5 hover:border-lime-400/50 transition-colors group"
            >
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FaRocket size={24} color="#65a30d" />
                </div>
                <h3 className="font-serif-display text-3xl text-charcoal mb-4">SaaS Solutions</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                    Specialized in building robust platforms like <strong>TMS (Task Management Systems)</strong> that streamline operations and boost productivity for enterprise clients.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-charcoal p-10 rounded-3xl border border-charcoal group"
            >
                 <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FaRobot size={24} color="#a3e635" />
                </div>
                <h3 className="font-serif-display text-3xl text-white mb-4">AI-Based Websites</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                    Leveraging the power of Artificial Intelligence to create intelligent, adaptive, and personalized web experiences that stay ahead of the curve.
                </p>
            </motion.div>
        </div>

        {/* Happy Customers Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-20 border-t border-charcoal/10 mb-20">
             <StatItem number="150+" label="Happy Customers" />
             <StatItem number="300+" label="Projects Delivered" />
             <StatItem number="98%" label="Retention Rate" />
             <StatItem number="5⭐" label="Average Rating" />
        </div>

      </section>

      {/* Services Section */}
      <Services />
    </>
  );
};

const StatItem: React.FC<{ number: string; label: string }> = ({ number, label }) => (
    <div className="text-center">
        <h4 className="font-serif-display text-4xl md:text-5xl text-charcoal mb-2">{number}</h4>
        <p className="text-sm font-semibold tracking-widest uppercase text-gray-500">{label}</p>
    </div>
);

export default About;
