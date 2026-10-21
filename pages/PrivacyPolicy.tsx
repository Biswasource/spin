import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-beige-100 pt-32 pb-20 px-6 md:px-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto md:p-8"
      >
        <span className="text-lime-600 font-semibold tracking-widest uppercase text-sm mb-4 block">Legal Documentation</span>
        <h1 className="font-serif-display text-4xl md:text-6xl text-charcoal mb-8 border-b border-charcoal/10 pb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none text-charcoal/80 prose-headings:font-serif-display prose-headings:text-charcoal prose-a:text-lime-600">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-8 font-semibold">Last Updated: October 2026</p>

          <p>
            At SpinTech Design, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">1. Important Information and Who We Are</h2>
          <p>
            SpinTech Design is the controller and responsible for your personal data. If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact us using the details provided below.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">2. The Data We Collect About You</h2>
          <p>
            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
          </ul>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">3. How We Use Your Personal Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, You can contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>By email: <a href="mailto:spintechdesign@gmail.com" className="font-medium hover:underline">spintechdesign@gmail.com</a></li>
            <li>By visiting our website: <a href="https://www.spintech.co.in/" className="font-medium hover:underline">https://www.spintech.co.in/</a></li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
