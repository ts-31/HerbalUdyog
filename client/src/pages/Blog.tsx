import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { coreApi, BlogPost } from '../api/core';

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

  return (
    <div className="bg-[#fbfbe2] min-h-screen py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display-lg text-4xl md:text-5xl text-[#1b1d0e] mb-6">Herbal Knowledge Base</h1>
          <p className="font-body-lg text-outline-variant text-lg">
            Discover the wisdom of Ayurveda, tips for natural living, and deep dives into our organic farming practices.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-outline-variant font-body-md">
            No articles found. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10 group flex flex-col">
                <div className="aspect-[4/3] bg-surface-container-lowest overflow-hidden">
                  <img 
                    src={post.image_url || 'https://images.unsplash.com/photo-1542841791-1925b02a2bf5?auto=format&fit=crop&q=80&w=600'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-sm text-outline-variant font-body-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author_name}</span>
                    </div>
                  </div>
                  <h2 className="font-headline-md text-xl text-[#1b1d0e] mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="font-body-md text-outline-variant mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="mt-auto inline-flex items-center gap-2 text-[#154212] font-label-md font-bold hover:gap-3 transition-all"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
