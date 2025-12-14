import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "How Design Attracts Clients",
    excerpt: "Why aesthetics are a business imperative in 2025.",
    date: "Dec 12, 2024",
    category: "Design Trends",
    image: "https://picsum.photos/id/1/800/600"
  },
  {
    id: 2,
    title: "How to Communicate Value Instantly",
    excerpt: "Strategies for crafting hero sections that convert visitors into leads.",
    date: "Nov 28, 2024",
    category: "Strategy",
    image: "https://picsum.photos/id/20/800/600"
  },
  {
    id: 3,
    title: "Typography in Modern Branding",
    excerpt: "Exploring the impact of custom serif fonts in digital products.",
    date: "Oct 15, 2024",
    category: "Branding",
    image: "https://picsum.photos/id/26/800/600"
  }
];

const Blog: React.FC = () => {
  return (
    <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <span className="text-lime-500 font-semibold tracking-widest uppercase text-sm">Our Thoughts</span>
        <h1 className="font-serif-display text-5xl md:text-7xl text-charcoal mt-4 mb-6">Latest from the Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Insights on design, strategy, and technology from the SpinTech team.</p>
      </motion.div>

      <div className="flex flex-col gap-16 max-w-3xl mx-auto">
        {BLOG_POSTS.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="group cursor-pointer border-b border-gray-100 pb-16 last:border-0"
          >
            <Link to={`/blog/${post.id}`} className="block">
                <div className="overflow-hidden rounded-2xl mb-8 bg-gray-100 aspect-[16/9]">
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                <div className="flex items-center gap-4 mb-4 text-xs font-semibold tracking-widest uppercase text-gray-400">
                    <span className="text-lime-600">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                </div>
                <h3 className="font-serif-display text-3xl md:text-4xl text-charcoal mb-4 group-hover:underline decoration-lime-400 decoration-2 underline-offset-4 transition-all">
                    {post.title}
                </h3>
            </Link>
            <p className="text-gray-600 text-lg leading-relaxed">
                {post.excerpt}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Blog;
