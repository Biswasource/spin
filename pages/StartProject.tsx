import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { ChevronRight } from 'lucide-react';

const StartProject: React.FC = () => {
  const [formState, setFormState] = useState({
    contact: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
    // Add submission logic here
  };

  return (
    <section className="pt-24 md:pt-40 pb-12 md:pb-20 px-6 md:px-12 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <span className="text-lime-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Let's Work Together</span>
        <h1 className="font-serif-display text-5xl md:text-7xl text-charcoal mb-6 leading-tight">
          Start a Project
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl font-light">
          Tell us about your idea. We help B2B brands and startups build digital products that matter.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        onSubmit={handleSubmit}
        className="space-y-12"
      >
        <div className="group relative">
            <label htmlFor="contact" className="block text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-lime-600 transition-colors">
                Email or Phone Number
            </label>
            <input
                type="text"
                id="contact"
                required
                className="w-full bg-transparent border-b border-charcoal/20 py-4 text-2xl md:text-3xl text-charcoal focus:outline-none focus:border-lime-500 transition-colors placeholder-charcoal/20 font-serif-display"
                placeholder="john@example.com"
                value={formState.contact}
                onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
            />
        </div>

        <div className="group relative">
            <label htmlFor="details" className="block text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-lime-600 transition-colors">
                Project Details
            </label>
            <textarea
                id="details"
                rows={4}
                required
                className="w-full bg-transparent border-b border-charcoal/20 py-4 text-xl md:text-2xl text-charcoal focus:outline-none focus:border-lime-500 transition-colors placeholder-charcoal/20 resize-none font-medium"
                placeholder="Tell us about your project goals, timeline, and budget..."
                value={formState.details}
                onChange={(e) => setFormState({ ...formState, details: e.target.value })}
            />
        </div>

        <motion.div
            className="pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            <Button variant="primary" className="bg-[#D4F23D] hover:bg-[#c2df35] flex items-center gap-2 group">
                SEND MESSAGE
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
        </motion.div>
      </motion.form>
    </section>
  );
};

export default StartProject;
