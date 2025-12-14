import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const BlogDetail: React.FC = () => {
  const { id } = useParams();

  // In a real app, you'd fetch the post based on ID. 
  // For this demo, we'll hardcode the content for the requested topic.
  
  return (
    <article className="pt-40 pb-20 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
      <div className="mb-12">
        <Link to="/blog" className="text-sm font-semibold tracking-widest uppercase text-gray-400 hover:text-charcoal transition-colors mb-8 inline-block">
          ← Back to Blog
        </Link>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <span className="text-lime-500 font-semibold tracking-widest uppercase text-xs md:text-sm">Strategy</span>
            <h1 className="font-serif-display text-5xl md:text-6xl lg:text-7xl text-charcoal mt-6 mb-8 leading-[1.1]">
              How Design Attracts Clients
            </h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm font-medium tracking-wide">
                <span>Dec 14, 2024</span>
                <span>•</span>
                <span>5 min read</span>
            </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full aspect-video rounded-3xl overflow-hidden mb-16 bg-gray-200"
      >
        <img 
            src="https://picsum.photos/id/48/1200/800" 
            alt="Design Strategy" 
            className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="prose prose-lg prose-headings:font-serif-display prose-headings:font-normal prose-headings:text-charcoal prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-lime-600 max-w-none"
      >
        <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium mb-12">
          In the crowded digital marketplace of 2024, aesthetics are no longer just "nice to have"—they are a business imperative. Design is the silent ambassador of your brand.
        </p>

        <h2 className="text-4xl mt-16 mb-8">First Impressions Matter (A Lot)</h2>
        <p>
          It takes about 50 milliseconds (that’s 0.05 seconds) for users to form an opinion about your website that determines whether they’ll stay or leave. Visual appeal can be assessed within 50ms. This first impression depends heavily on design—layout, color, symmetry, and font choice.
        </p>
        <p>
          At <strong>SpinTech Design</strong>, we believe that if you look expensive, you can charge expensive. High-end execution signals competence and trustworthiness before a single word is read.
        </p>

        <h2 className="text-4xl mt-16 mb-8">Clarity Builds Trust</h2>
        <p>
          Confusion is the enemy of conversion. Good design isn't just about decoration; it's about communication. By using clear typography, generous whitespace, and intuitive navigation, you reduce the cognitive load on your potential clients.
        </p>
        <ul className="list-disc pl-6 space-y-4 my-8 text-gray-600">
            <li><strong>Hierarchy:</strong> guiding the eye to the most important information first.</li>
            <li><strong>Consistency:</strong> creating a cohesive experience that feels professional.</li>
            <li><strong>Intentionality:</strong> every pixel should serve a purpose.</li>
        </ul>

        <h2 className="text-4xl mt-16 mb-8">Emotion Drives Decisions</h2>
        <p>
          People buy with emotion and justify with logic. Color psychology and imagery play a massive role in how a brand <em>feels</em>. A tech startup might use electric blues and lime greens (like us!) to convey energy and innovation, while a luxury law firm might use deep charcoal and serif fonts to convey heritage and stability.
        </p>

        <blockquote className="border-l-4 border-lime-400 pl-8 italic text-2xl text-charcoal my-16 font-serif-display">
            "Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs
        </blockquote>

        <h2 className="text-4xl mt-16 mb-8">The SpinTech Approach</h2>
        <p>
            We don't just make pretty pictures. We partner with B2B brands to rebrand and redesign their websites with a focus on business outcomes. By combining strategic thinking with flawless visual execution, we turn passive visitors into active leads.
        </p>
        
        <div className="mt-16 p-12 bg-gray-50 rounded-3xl border border-gray-100 text-center">
            <h3 className="font-serif-display text-3xl mb-6">Ready to attract more clients?</h3>
            <p className="mb-8">Let's craft a digital presence that does the selling for you.</p>
            <Button variant="primary">START A PROJECT</Button>
        </div>

      </motion.div>
    </article>
  );
};

export default BlogDetail;
