import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Footer from './components/Footer';
import StartProject from './pages/StartProject';
import Work from './pages/Work';
import Lenis from 'lenis';
import ScrollToTop from './components/ScrollToTop';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // lenis.destroy()
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-beige-100 text-charcoal selection:bg-lime-400 selection:text-charcoal font-sans">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/start-project" element={<StartProject />} />
            <Route path="/work" element={<Work />} /> {/* Added route for Work component */}
          </Routes>
          
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;