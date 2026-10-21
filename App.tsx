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
import BookCall from './pages/BookCall';
import Lenis from 'lenis';
import ScrollToTop from './components/ScrollToTop';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import JobApplication from './pages/JobApplication';
import WhatsAppButton from './components/WhatsAppButton';
import EmployeePortal from './pages/EmployeePortal';
import EmployeeTaskDetail from './pages/EmployeeTaskDetail';
import { db } from './lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

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

    // Visit tracking
    const trackVisit = async () => {
      if (!sessionStorage.getItem('spintech_visited')) {
        sessionStorage.setItem('spintech_visited', 'true');
        try {
          const statsRef = doc(db, 'stats', 'visits');
          const docSnap = await getDoc(statsRef);
          if (docSnap.exists()) {
             await updateDoc(statsRef, { count: increment(1) });
          } else {
             await setDoc(statsRef, { count: 1313 });
          }
        } catch (e) {
          console.error("Visit tracking failed", e);
        }
      }
    };
    trackVisit();

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
            <Route path="/book-call" element={<BookCall />} />
            <Route path="/careers" element={<Jobs />} />
            <Route path="/careers/:id" element={<JobDetails />} />
            <Route path="/careers/:id/apply" element={<JobApplication />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/employee" element={<EmployeePortal />} />
            <Route path="/employee/task/:id" element={<EmployeeTaskDetail />} />
          </Routes>
          
          <Footer />
          <WhatsAppButton />
        </main>
      </div>
    </Router>
  );
}

export default App;