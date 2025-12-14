import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-beige-100/90 backdrop-blur-md transition-all duration-300 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="text-orange-500"
            >
                <Sparkles size={32} strokeWidth={1} fill="currentColor" />
            </motion.div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg tracking-tight">SpinTech</span>
            <span className="font-light text-lg tracking-tight">Design</span>
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