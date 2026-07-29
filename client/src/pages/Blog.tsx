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
    <div className="bg-surface min-h-screen pt-8 pb-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight">Herbal Knowledge Base</h1>
          <p className="font-body-md text-on-surface-variant mt-1 text-sm">
            Ayurveda wisdom, natural living tips, and organic farming stories.
          </p>
        </motion.div>

        {loading ? null : posts.length === 0 ? (
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
                    src={post.image_url}
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
