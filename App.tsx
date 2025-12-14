import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Situations from './components/Situations';
import Services from './components/Services';
import BentoGrid from './components/BentoGrid';
import BrandPromise from './components/BrandPromise';
import FAQ from './components/FAQ';

function App() {
  return (
    <div className="min-h-screen bg-beige-100 text-charcoal selection:bg-lime-400 selection:text-charcoal font-sans">
      <Navbar />
      
      <main>
        <Hero />
        <Projects />
        <Situations />
        <Services />
        <BentoGrid />
        <BrandPromise />
        <FAQ />
        
        {/* Simple Footer Spacer to show scroll */}
        <section className="py-20 text-center text-gray-400 text-sm">
          <p>© 2024 Everything Design Clone. All rights reserved.</p>
        </section>
      </main>
    </div>
  );
}

export default App;