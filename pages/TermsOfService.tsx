import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
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
          Terms of Service
        </h1>
        
        <div className="prose prose-lg max-w-none text-charcoal/80 prose-headings:font-serif-display prose-headings:text-charcoal prose-a:text-lime-600">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-8 font-semibold">Last Updated: October 2026</p>

          <p>
            Please read these Terms of Service carefully before using the SpinTech Design website and services operated by SpinTech Design. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">2. Intellectual Property</h2>
          <p>
            The Service and its original content, features and functionality are and will remain the exclusive property of SpinTech Design and its licensors. The Service is protected by copyright, trademark, and other laws of both the country and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of SpinTech Design.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">3. Client Projects and Deliverables</h2>
          <p>
            For design, branding, and development projects, specific terms regarding intellectual property transfer, payment milestones, and deliverables will be outlined in a separate written Master Services Agreement (MSA) or Statement of Work (SOW). In the event of a conflict between these general Terms of Service and a signed MSA/SOW, the signed MSA/SOW shall prevail.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">4. Links To Other Web Sites</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by SpinTech Design. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that SpinTech Design shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">5. Limitation Of Liability</h2>
          <p>
            In no event shall SpinTech Design, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-3xl mt-12 mb-4 text-charcoal">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: <a href="mailto:spintechdesign@gmail.com" className="font-medium hover:underline">spintechdesign@gmail.com</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
