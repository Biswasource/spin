import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Services from '../components/Services';
import RevealType from '../components/RevealType';

const REVIEWS = [
  // ... existing reviews ...
  {
    id: 1,
    client: "Mohan Mohapatra",
    role: "CEO, TechFlow",
    text: "SpinTech Design completely transformed our digital presence. Their attention to detail and ability to translate our complex value proposition into a simple, beautiful website was outstanding.",
    rating: 5
  },
  {
    id: 2,
    client: "Sasmita Das",
    role: "Founder, GreenLeaf",
    text: "The team at SpinTech is top notch. They took ownership of the entire design process and delivered results that exceeded our expectations. Highly recommend!",
    rating: 5
  },
  {
    id: 3,
    client: "Sisir Charan Das",
    role: "Director, FutureCorp",
    text: "Professional, creative, and timely. Working with them was a breeze and the final output is something our whole team is proud of.",
    rating: 5
  }
];

const REVIEW_FAQS = [
  {
    question: "Bharat Jakati, what is your review about SpinTech Design's Services?",
    answer: "Everything was delivered on time and the quality was top-notch. Would definitely work with them again."
  },
  {
    question: "Sharan, what is your review about SpinTech Design's Branding and Website Design Services?",
    answer: "They have a deep understanding of B2B branding. Our new site is generating 3x more leads."
  },
  {
    question: "Was i3systems' ReBranding and Website ReDesign a successful project?",
    answer: "Absolutely. The rebrand helped us position ourselves as a market leader in our sector."
  },
  {
    question: "Did you like SpinTech Design's Project Processes?",
    answer: "Yes, their process is very transparent and collaborative. We were kept in the loop at every stage."
  }
];

const ReviewFAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-charcoal/10 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-start justify-between w-full text-left gap-4 group"
      >
        <h3 className="font-serif-display text-xl text-charcoal/80 group-hover:text-charcoal transition-colors pr-8 leading-snug">
          {question}
        </h3>
        <span className="shrink-0 p-1 rounded-full bg-black text-white transition-transform duration-300">
           {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-600 leading-relaxed text-lg">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Reviews: React.FC = () => {
  return (
    <div className="min-h-screen bg-beige-100">
      <section className="pt-24 md:pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-lime-500 font-semibold tracking-widest uppercase text-sm">Client Love</span>
          <h1 className="font-serif-display text-5xl md:text-7xl text-charcoal mt-4 mb-6">What people are saying</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">We build long-term relationships with our clients by delivering exceptional quality and reliability.</p>
        </motion.div>

        <div className="flex flex-col gap-16 max-w-3xl mx-auto mb-32">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="group relative flex flex-col justify-between border-b border-charcoal/10 pb-16 last:border-0"
            >
              {/* Big Quote Mark */}
              <div className="text-8xl font-serif-display text-lime-400 opacity-30 absolute -top-10 -left-8 select-none">“</div>
              
              <div className="relative z-10 pl-4 md:pl-8">
                  <RevealType className="text-xl md:text-3xl font-medium mb-10 block">
                    {`"${review.text}"`}
                  </RevealType>
              </div>
              
              <div className="pl-4 md:pl-8">
                  <div className="flex items-center gap-4 mb-2">
                       <h4 className="font-serif-display text-2xl text-charcoal">{review.client}</h4>
                       <span className="w-1 h-1 rounded-full bg-charcoal/30"></span>
                       <p className="text-sm text-gray-500 uppercase tracking-widest font-normal">{review.role}</p>
                  </div>
                  <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-lime-500 text-sm">★</span>
                      ))}
                  </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ / Interview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-20 border-t border-charcoal/10">
          <div>
              <h2 className="font-serif-display text-5xl md:text-6xl text-charcoal leading-tight sticky top-32">
                What makes SpinTech Design the best branding agency?
              </h2>
          </div>
          <div className="flex flex-col">
              {REVIEW_FAQS.map((faq, index) => (
                <ReviewFAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
          </div>
        </div>
      </section>
      
      <Services />
    </div>
  );
};

export default Reviews;
