import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS, PROJECTS } from '../constants';
import logo from '../logo.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = PROJECTS.filter(
    (p) =>
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPages = NAV_LINKS.filter(
    (link) => link.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-beige-100/90 backdrop-blur-md transition-all duration-300 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                  <img src={logo} alt="SpinTech Logo" className="w-full h-full object-contain"/>
              </div>
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
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
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

      {/* Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-beige-100/95 backdrop-blur-md flex flex-col pt-24 px-6 md:px-12"
          >
            <div className="max-w-4xl mx-auto w-full relative">
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-0 top-0 p-2 text-charcoal/50 hover:text-charcoal transition-colors"
              >
                <X size={32} />
              </button>
              <div className="flex items-center border-b-2 border-charcoal/20 pb-4 mb-8 mt-12">
                <Search size={32} className="text-charcoal/50 mr-4" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search pages, projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent font-serif-display text-4xl md:text-5xl outline-none text-charcoal placeholder:text-charcoal/30"
                />
              </div>
              
              {searchQuery && (
                <div className="flex flex-col gap-8 overflow-y-auto max-h-[60vh] pb-12">
                  {filteredPages.length === 0 && filteredProjects.length === 0 && (
                    <p className="text-xl font-serif-display text-charcoal/60">No results found for "{searchQuery}"</p>
                  )}
                  
                  {filteredPages.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-2">Pages</p>
                      {filteredPages.map((page, index) => (
                        <Link 
                          key={`page-${index}`} 
                          to={page.href} 
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="group flex flex-col pb-4 border-b border-charcoal/10 hover:border-charcoal/50 transition-colors"
                        >
                          <span className="text-3xl font-serif-display text-charcoal group-hover:text-black transition-colors">{page.label}</span>
                          <span className="text-sm font-medium tracking-widest text-gray-500 uppercase mt-2">Page</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {filteredProjects.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-2">Projects</p>
                      {filteredProjects.map((project) => (
                        <Link 
                          key={project.id} 
                          to="/work" 
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="group flex flex-col pb-4 border-b border-charcoal/10 hover:border-charcoal/50 transition-colors"
                        >
                          <span className="text-3xl font-serif-display text-charcoal group-hover:text-black transition-colors">{project.client}</span>
                          <span className="text-sm font-medium tracking-widest text-gray-500 uppercase mt-2">{project.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;