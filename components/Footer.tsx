import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-white pt-20 pb-10 px-6 md:px-12 rounded-t-[3rem] mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand Column */}
            <div className="lg:col-span-2">
                <Link to="/" className="flex items-center gap-2 group mb-8 inline-block">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                         <div className="text-lime-400">
                             <Sparkles size={32} strokeWidth={1} fill="currentColor" />
                         </div>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-lg tracking-tight">SpinTech</span>
                        <span className="font-light text-lg tracking-tight text-white/80">Design</span>
                    </div>
                </Link>
                <h2 className="font-serif-display text-4xl md:text-5xl leading-tight mb-8">
                    Let's build something <span className="text-lime-400">extraordinary</span> together.
                </h2>
                <div className="flex gap-4">
                     <a href="https://www.linkedin.com/company/spintech-solutions/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-lime-400 hover:text-charcoal hover:border-lime-400 transition-all">
                        <Linkedin size={18} />
                     </a>
                     <a href="mailto:spintechdesign@gmail.com" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-lime-400 hover:text-charcoal hover:border-lime-400 transition-all">
                        <Mail size={18} />
                     </a>
                </div>
            </div>

            {/* Links Column 1 */}
            <div>
                <h4 className="font-semibold text-lime-400 tracking-widest uppercase text-sm mb-6">Explore</h4>
                <ul className="space-y-4">
                    <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                    <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                    <li><Link to="/reviews" className="text-gray-400 hover:text-white transition-colors">Reviews</Link></li>
                    <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                </ul>
            </div>

             {/* Links Column 2 */}
             <div>
                <h4 className="font-semibold text-lime-400 tracking-widest uppercase text-sm mb-6">Services</h4>
                <ul className="space-y-4">
                    <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Brand Strategy</Link></li>
                    <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Web Design</Link></li>
                    <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Development</Link></li>
                    <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">SaaS Solutions</Link></li>
                    <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">AI Websites</Link></li>
                </ul>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 SpinTech Design. All rights reserved.</p>
            <div className="flex gap-6 md:gap-8 flex-wrap">
                <Link to="/employee" onClick={() => window.scrollTo(0,0)} className="hover:text-lime-400 transition-colors">Employee Portal</Link>
                <Link to="/privacy-policy" onClick={() => window.scrollTo(0,0)} className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" onClick={() => window.scrollTo(0,0)} className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
