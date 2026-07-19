import React from 'react';
import { Link } from 'react-router-dom';
export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000" 
            alt="Farm landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-20">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-primary-container text-on-primary-container font-label-sm mb-6 uppercase tracking-wider">
              From nature to your wellness
            </span>
            <h1 className="font-display-lg text-5xl md:text-7xl text-on-primary mb-6 drop-shadow-sm">
              Cultivating a Better Tomorrow.
            </h1>
            <p className="font-body-lg text-xl text-surface-container-highest mb-10 max-w-xl drop-shadow-sm">
              Discover 100% organic, pure herbal, high-quality Ayurvedic medicines and personal care products for daily wellness.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary-fixed text-on-primary-fixed font-label-md rounded-full hover:bg-primary-fixed-dim transition-colors shadow-lg">
                Shop Wellness
              </button>
              <button className="px-8 py-4 bg-surface/10 backdrop-blur-md text-on-primary border border-surface/20 font-label-md rounded-full hover:bg-surface/20 transition-colors">
                Our Herbal Promise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline-lg text-4xl mb-4">Natural Healing</h2>
            <p className="font-body-md text-outline-variant max-w-lg">
              Explore our curated selection of Ayurvedic supplements and personal care formulations designed for your daily routine.
            </p>
          </div>
          <button className="hidden md:block font-label-md text-primary hover:text-tertiary transition-colors border-b border-primary pb-1">
            View All Categories
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Ayurvedic Supplements", img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800", slug: "ayurvedic-supplements" },
            { title: "Personal Care", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800", slug: "personal-care" },
            { title: "Daily Wellness", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800", slug: "daily-wellness" }
          ].map((category, idx) => (
            <Link to={`/marketplace?category=${category.slug}`} key={idx} className="group cursor-pointer block">
              <div className="relative h-[400px] rounded-2xl overflow-hidden mb-6">
                <img 
                  src={category.img} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              </div>
              <h3 className="font-headline-md text-2xl mb-2 group-hover:text-primary transition-colors">{category.title}</h3>
              <p className="font-body-sm text-outline-variant">Explore collection</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-primary-container text-on-primary-container py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-fixed mb-6 mx-auto md:mx-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4 className="font-headline-md text-xl mb-3">Certified Organic</h4>
              <p className="font-body-md opacity-80">Every product is rigorously vetted to ensure it meets our strict ecological standards.</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-fixed mb-6 mx-auto md:mx-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
              </div>
              <h4 className="font-headline-md text-xl mb-3">Pure & Natural</h4>
              <p className="font-body-md opacity-80">Formulated with pure botanical extracts, crafted to preserve peak freshness and natural potency.</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-fixed mb-6 mx-auto md:mx-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h4 className="font-headline-md text-xl mb-3">Cruelty-Free</h4>
              <p className="font-body-md opacity-80">Our products are never tested on animals, and we source all our ingredients ethically.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
