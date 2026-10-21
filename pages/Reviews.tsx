import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Services from '../components/Services';
import RevealType from '../components/RevealType';

const REVIEWS = [
  {
    id: 3,
    client: "Sisir Charan Das",
    text: "Professional, creative, and timely. Working with them was a breeze and the final output is something our whole team is proud of.",
    rating: 5
  },
  {
    id: 4,
    client: "Anita Sharma",
    text: "We wanted a brand that truly stood out, and SpinTech delivered exactly that. The new brand identity has dramatically increased our market trust.",
    rating: 5
  },
  {
    id: 5,
    client: "Rahul Verma",
    text: "They have a deep understanding of the B2B space. The new messaging and visual identity completely changed how prospects perceive us.",
    rating: 5
  },
  {
    id: 6,
    client: "Priya Menon",
    text: "SpinTech has a fantastic process. We never felt lost during the project, and the result was a sophisticated brand that positions us as industry leaders.",
    rating: 5
  },
  {
    id: 7,
    client: "Arjun Reddy",
    text: "Outstanding work on our web app's UI/UX. The user retention increased by 40% after the redesign. They truly understand user-centric design.",
    rating: 5
  },
  {
    id: 8,
    client: "Neha Gupta",
    text: "From start to finish, the SpinTech team was incredibly responsive and strategic. They don't just design; they solve real business problems.",
    rating: 5
  },
  {
    id: 9,
    client: "Vikram Singh",
    text: "We gave them a very tight deadline and a complex product. They managed to simplify our story beautifully without compromising on quality.",
    rating: 5
  },
  {
    id: 10,
    client: "Anjali Desai",
    text: "The website they built for us is not only stunning but highly functional. The conversion rate went up by 60% within the first month.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto mb-32">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative flex flex-col justify-between p-8 md:p-16 border-charcoal/10 border-b ${index % 2 === 0 ? 'md:border-r' : ''} ${index >= REVIEWS.length - 2 ? 'md:border-b-0' : ''} ${index === REVIEWS.length - 1 ? 'border-b-0' : ''}`}
            >
              {/* Big Quote Mark */}
              <div className="text-8xl font-serif-display text-lime-400 opacity-30 absolute top-4 left-6 select-none">“</div>
              
              <div className="relative z-10 mt-6 mb-12">
                  <RevealType className="text-lg md:text-xl font-medium block leading-relaxed">
                    {`"${review.text}"`}
                  </RevealType>
              </div>
              
              <div className="relative z-10">
                  <div className="flex flex-col gap-1 mb-3">
                       <h4 className="font-serif-display text-2xl text-charcoal">{review.client}</h4>
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
