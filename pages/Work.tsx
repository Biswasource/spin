import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { ArrowUpRight } from 'lucide-react';
import TextReveal from '../components/TextReveal';

const WORK_PROJECTS = [
  {
    id: 1,
    title: "Tribes India",
    description: "An authentic e-commerce platform showcasing handcrafted tribal arts, heritage handlooms, and organic produce. We focused on a design that honors India's rich tribal legacy while providing a modern shopping experience.",
    tags: ["E-commerce", "Handicrafts", "Culture"],
    image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=1200",
    link: "https://tribesindia.com/"
  },
  {
    id: 2,
    title: "ShopClues",
    description: "One of India's largest value-store marketplaces. Our work involved optimizing the user journey for a massive product catalog and implementing complex promotional engines for value-conscious shoppers.",
    tags: ["Marketplace", "Logistics", "Scale"],
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1200",
    link: "https://www.shopclues.com/"
  },
  {
    id: 3,
    title: "Udaan",
    description: "India's leading B2B trade platform connecting retailers, manufacturers, and wholesalers. We redesigned the interface to handle high-frequency trade volumes and complex supply chain logistics.",
    tags: ["B2B", "Trade", "Supply Chain"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    link: "https://udaan.com/"
  },
  {
    id: 4,
    title: "Shiprocket",
    description: "A comprehensive e-commerce growth partner and logistics aggregator. We developed a powerful dashboard to manage automated shipping, real-time tracking, and multi-channel fulfillment.",
    tags: ["Logistics", "SaaS", "Automation"],
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=1200",
    link: "https://www.shiprocket.in/"
  },
  {
    id: 5,
    title: "BuyGlass",
    description: "A specialized e-commerce solution for custom-cut glass and mirrors. Features an intuitive configuration engine for precise measurements and a secure delivery tracking system for fragile goods.",
    tags: ["D2C", "Customization", "Manufacturing"],
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200",
    link: "https://www.buyglass.in/"
  },
  {
    id: 6,
    title: "Lumina Financial",
    description: "A complete rebranding and digital presence overhaul for a next-gen fintech startup. We focused on trust, clarity, and modern aesthetics.",
    tags: ["Branding", "Web Design", "Development"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    link: "https://lumina-fin.vercel.app"
  },
  {
    id: 7,
    title: "Elevate Architects",
    description: "Minimalist portfolio showcase for an award-winning architectural firm. The design emphasizes space and visual hierarchy.",
    tags: ["UX/UI", "Development", "SEO"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    link: "https://elevate-arch.vercel.app"
  }
];

const Work: React.FC = () => {
  return (
    <section className="pt-24 md:pt-40 pb-12 md:pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-24 text-center md:text-left"
      >
        <span className="text-lime-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Our Portfolio</span>
        <h1 className="font-serif-display text-5xl md:text-7xl text-charcoal mb-6">Selected Works</h1>
        <p className="text-xl text-gray-500 max-w-2xl font-light">
          A showcase of our passion for design, technology, and storytelling.
        </p>
      </motion.div>

      <div className="flex flex-col gap-32">
        {WORK_PROJECTS.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
          >
            {/* Left Side: Image */}
            <div className="w-full md:w-1/2">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-xl shadow-lime-500/10">
                    <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
            </div>

            {/* Right Side: Text */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full border border-charcoal/20 text-xs text-charcoal/60 uppercase tracking-wider font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <h2 className="font-serif-display text-4xl md:text-5xl text-charcoal mb-6">
                    {project.title}
                </h2>
                
                <TextReveal className="text-lg font-medium leading-relaxed mb-8 max-w-md block">
                    {project.description}
                </TextReveal>

                <Button 
                    variant="outline" 
                    href={project.link}
                    className="flex items-center gap-2 group hover:bg-lime-400 hover:text-charcoal hover:border-lime-400"
                >
                    VIEW SITE
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Work;
