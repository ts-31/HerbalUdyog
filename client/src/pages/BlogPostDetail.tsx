import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import { coreApi, BlogPost } from '../api/core';

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
      <div className="bg-[#fbfbe2] min-h-screen pt-32 pb-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-[#fbfbe2] min-h-screen pt-32 pb-20 text-center">
        <h2 className="font-display-md text-2xl text-error mb-4">Article not found</h2>
        <Link to="/blog" className="text-primary underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfbe2] min-h-screen py-16">
      <div className="max-w-[800px] mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-outline-variant hover:text-primary transition-colors font-label-md mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to all articles
        </Link>
        
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-outline-variant font-body-sm mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{post.author_name}</span>
            </div>
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-[#1b1d0e] mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="font-body-lg text-xl text-outline-variant italic">
            {post.excerpt}
          </p>
        </div>

        <div className="aspect-[16/9] w-full bg-surface-container-lowest rounded-3xl overflow-hidden mb-12 shadow-sm">
          <img 
            src={post.image_url || 'https://images.unsplash.com/photo-1542841791-1925b02a2bf5?auto=format&fit=crop&q=80&w=1200'} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="prose prose-lg prose-stone max-w-none prose-headings:font-display-md prose-headings:text-[#1b1d0e] prose-p:font-body-md prose-p:text-[#42493e] prose-p:leading-relaxed">
          {/* Note: In a real app, this might be rendered with a markdown parser or dangerouslySetInnerHTML */}
          <div className="whitespace-pre-wrap font-body-md text-[#42493e] leading-loose text-lg">
            {post.content}
          </div>
        </article>
        
        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex justify-center">
          <Link to="/blog" className="px-8 py-3 bg-[#154212] text-white rounded-xl font-label-md hover:bg-[#2d5a27] transition-colors">
            Read More Articles
          </Link>
        </div>
      </div>
    </div>
  );
};
