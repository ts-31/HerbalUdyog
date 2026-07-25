import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { coreApi, BlogPost } from '../api/core';
import { motion } from 'motion/react';

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await coreApi.getBlogPosts();
        setPosts(Array.isArray(data) ? data : (data as any).results || []);
      } catch (err) {
        console.error('Failed to load blog posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface mb-6 tracking-tight">Herbal Knowledge Base</h1>
          <p className="font-body-lg text-on-surface-variant text-lg">
            Discover the wisdom of Ayurveda, tips for natural living, and deep dives into our organic farming practices.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant font-body-md bg-surface-container-low rounded-3xl border border-outline-variant/30">
            No articles found. Check back later!
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map(post => (
              <motion.article 
                variants={itemVariants}
                key={post.id} 
                className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/30 group flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-surface-container overflow-hidden">
                  <img 
                    src={post.image_url || 'https://images.unsplash.com/photo-1542841791-1925b02a2bf5?auto=format&fit=crop&q=80&w=600'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-on-surface-variant font-label-md mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author_name}</span>
                    </div>
                  </div>
                  <h2 className="font-headline-md text-xl text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="font-body-md text-on-surface-variant mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="mt-auto inline-flex items-center gap-2 text-primary font-label-md font-bold hover:gap-3 transition-all"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
