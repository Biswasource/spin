import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { ArrowUpRight } from 'lucide-react';
import TextReveal from '../components/TextReveal';

const WORK_PROJECTS = [
  {
    id: 1,
    title: "Lumina Financial",
    description: "A complete rebranding and digital presence overhaul for a next-gen fintech startup. We focused on trust, clarity, and modern aesthetics.",
    tags: ["Branding", "Web Design", "Development"],
    image: "https://picsum.photos/id/1/1200/900",
    link: "#"
  },
  {
    id: 2,
    title: "Elevate Architects",
    description: "Minimalist portfolio showcase for an award-winning architectural firm. The design emphasizes space and visual hierarchy.",
    tags: ["UX/UI", "Development", "SEO"],
    image: "https://picsum.photos/id/2/1200/900",
    link: "#"
  },
  {
    id: 3,
    title: "Nexus AI",
    description: "Futuristic interface design for an AI-powered analytics platform. Dark mode aesthetics with neon accents.",
    tags: ["Product Design", "SaaS", "Animation"],
    image: "https://picsum.photos/id/3/1200/900",
    link: "#"
  },
  {
    id: 4,
    title: "GreenLeaf Organics",
    description: "E-commerce experience for a sustainable lifestyle brand. Seamless checkout and vibrant product storytelling.",
    tags: ["E-commerce", "Branding", "Social Media"],
    image: "https://picsum.photos/id/4/1200/900",
    link: "#"
  },
  {
    id: 5,
    title: "Velocity Motors",
    description: "Interactive showroom experience for a luxury electric vehicle manufacturer. High-performance 3D web experience.",
    tags: ["3D Experience", "Web Design", "Motion"],
    image: "https://picsum.photos/id/5/1200/900",
    link: "#"
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

                <Button variant="outline" className="flex items-center gap-2 group hover:bg-lime-400 hover:text-charcoal hover:border-lime-400">
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
