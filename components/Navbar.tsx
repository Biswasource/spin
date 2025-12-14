import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import logo from '../logo.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-beige-100/90 backdrop-blur-md transition-all duration-300 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="w-full h-full flex items-center justify-center"
            >
                <img src={logo} alt="SpinTech Logo" className="w-full h-full object-contain"/>
            </motion.div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif-display text-2xl text-charcoal">SpinTech</span>
            <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-gray-500 ml-0.5">Design</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.label} 
              to={link.href}
              className="relative text-xs font-medium tracking-widest text-charcoal transition-colors group"
            >
              {link.label}
              <span 
                className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-charcoal origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
              />
            </Link>
          ))}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-beige-100 border-t border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.label} 
                  to={link.href}
                  className="text-sm font-medium tracking-widest text-charcoal py-2 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;