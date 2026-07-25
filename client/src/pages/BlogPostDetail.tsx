import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import { coreApi, BlogPost } from '../api/core';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';

export const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const data = await coreApi.getBlogPost(slug);
        setPost(data);
      } catch (err: any) {
        setError('Failed to load article.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-surface min-h-screen pt-32 pb-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-surface min-h-screen pt-32 pb-20 text-center">
        <h2 className="font-display-md text-2xl text-error mb-4">Article not found</h2>
        <Link to="/blog" className="text-primary underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="max-w-[800px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/blog" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md mb-8">
            <ChevronLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-on-surface-variant font-label-md mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{post.author_name}</span>
            </div>
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="font-body-lg text-xl text-on-surface-variant italic">
            {post.excerpt}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="aspect-[16/9] w-full bg-surface-container-lowest rounded-[2rem] overflow-hidden mb-12 shadow-sm border border-outline-variant/30"
        >
          <img 
            src={post.image_url || 'https://images.unsplash.com/photo-1542841791-1925b02a2bf5?auto=format&fit=crop&q=80&w=1200'} 
            alt={post.title}
            className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none prose-headings:font-display-md prose-headings:text-on-surface prose-p:font-body-md prose-p:text-on-surface/80 prose-p:leading-relaxed"
        >
          {/* Note: In a real app, this might be rendered with a markdown parser or dangerouslySetInnerHTML */}
          <div className="whitespace-pre-wrap font-body-lg text-on-surface/80 leading-loose text-lg">
            {post.content}
          </div>
        </motion.article>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-outline-variant/30 flex justify-center"
        >
          <Link to="/blog">
            <Button size="lg">Read More Articles</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
