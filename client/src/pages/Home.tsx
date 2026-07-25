import React from 'react';
import { Link } from 'react-router-dom';
import { TestimonialsSection } from '../components/home/TestimonialSection';
import { Button } from '../components/ui/Button';

export const Home = () => {
  return (
    <div className="bg-surface">
      {/* Hero Section - Immersive Apple Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000" 
            alt="Farm landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-20 flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-white font-label-sm mb-8 uppercase tracking-widest border border-white/20">
            Pure Botanical Wellness
          </span>
          <h1 className="font-display-lg text-6xl md:text-8xl text-white mb-6 tracking-tighter leading-[1.1] max-w-4xl">
            Cultivating a <br className="hidden md:block"/> Better Tomorrow.
          </h1>
          <p className="font-body-lg text-xl md:text-2xl text-white/80 mb-12 max-w-2xl font-light">
            Discover 100% organic, pure herbal, high-quality Ayurvedic medicines and personal care products for daily wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/marketplace">
              <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-white/90">
                Shop Wellness
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-white/10 border border-white/30">
                Our Herbal Promise
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories - Minimalist Grid */}
      <section className="py-32 max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-6 tracking-tight">Natural Healing.</h2>
            <p className="font-body-lg text-on-surface-variant text-lg md:text-xl">
              Explore our curated selection of Ayurvedic supplements and personal care formulations designed for your daily routine.
            </p>
          </div>
          <Link to="/marketplace" className="hidden md:block font-label-md text-primary hover:opacity-70 transition-opacity border-b border-primary pb-1">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Ayurvedic Supplements", img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800", slug: "ayurvedic-supplements" },
            { title: "Personal Care", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800", slug: "personal-care" },
            { title: "Daily Wellness", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800", slug: "daily-wellness" }
          ].map((category, idx) => (
            <Link to={`/marketplace?category=${category.slug}`} key={idx} className="group cursor-pointer block">
              <div className="relative h-[480px] rounded-2xl overflow-hidden mb-6 bg-surface-container-low">
                <img 
                  src={category.img} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <h3 className="font-headline-md text-2xl mb-2">{category.title}</h3>
              <p className="font-body-md text-on-surface-variant flex items-center gap-2 group-hover:text-primary transition-colors">
                Explore collection <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Banner - Clean & Monochromatic */}
      <section className="bg-surface-container-lowest border-y border-outline-variant/50 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4 className="font-headline-sm text-xl mb-3 tracking-tight">Certified Organic</h4>
              <p className="font-body-md text-on-surface-variant">Every product is rigorously vetted to ensure it meets our strict ecological standards.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
              </div>
              <h4 className="font-headline-sm text-xl mb-3 tracking-tight">Pure & Natural</h4>
              <p className="font-body-md text-on-surface-variant">Formulated with pure botanical extracts, crafted to preserve peak freshness and natural potency.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h4 className="font-headline-sm text-xl mb-3 tracking-tight">Cruelty-Free</h4>
              <p className="font-body-md text-on-surface-variant">Our products are never tested on animals, and we source all our ingredients ethically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
};
