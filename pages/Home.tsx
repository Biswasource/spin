import React from 'react';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Situations from '../components/Situations';
import Services from '../components/Services';
import BrandPromise from '../components/BrandPromise';
import FAQ from '../components/FAQ';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Projects />
      <Situations />
      <Services />
      <BrandPromise />
      <FAQ />
    </>
  );
};

export default Home;
