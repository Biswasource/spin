import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Button from './Button';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Is Everything Design the best Branding Agency for B2B brands?",
    answer: "We strive to be! Our specialized focus on B2B allows us to deeply understand complex value propositions and translate them into simple, compelling visual identities that drive trust and conversion.",
  },
  {
    question: "How can a brand work with Everything Design for a branding project ?",
    answer: "It starts with a discovery session where we audit your current brand and discuss your goals. From there, we propose a tailored roadmap covering strategy, visual identity, and digital presence.",
  },
  {
    question: "Who should work with Everything Design?",
    answer: "We work best with ambitious B2B founders and marketing leaders in Tech, SaaS, and Fintech who recognize that design is a strategic differentiator, not just decoration.",
  },
  {
    question: "Which are the industries Everything Design Agency works with?",
    answer: "Our core expertise lies in Cyber Security, Ad Tech, Manufacturing, Logistics, and Enterprise SaaS. We love complex industries that need simplification.",
  },
];

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-charcoal/20">
      <button 
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <span className="text-xl md:text-2xl text-charcoal font-serif-display pr-8 group-hover:text-charcoal/70 transition-colors">
          {item.question}
        </span>
        <div className="relative flex-shrink-0">
            <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black text-white flex items-center justify-center"
            >
                <Plus size={20} />
            </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-lg text-gray-600 leading-relaxed max-w-2xl">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative bg-beige-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Header */}
        <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
                 <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold tracking-widest text-charcoal/60 uppercase mb-6 block"
                 >
                    FAQ
                 </motion.span>
                 <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-charcoal mb-8"
                 >
                    Common<br/>Questions
                 </motion.h2>
            </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block absolute left-[41.666667%] top-0 bottom-0 w-px bg-charcoal/10" />

        {/* Right Column: Accordion List */}
        <div className="lg:col-span-7 pl-0 lg:pl-12 flex flex-col justify-center">
            <div className="border-t border-charcoal/20">
                {FAQS.map((faq, index) => (
                    <AccordionItem 
                        key={index} 
                        item={faq} 
                        isOpen={openIndex === index}
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12"
            >
                <Button variant="primary" className="bg-[#D4F23D] hover:bg-[#c2df35] text-xs font-semibold px-8 py-4">
                    MORE QUESTIONS
                </Button>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;