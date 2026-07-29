import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { coreApi, Testimonial } from '../../api/core';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await coreApi.getTestimonials();
        setTestimonials(Array.isArray(data) ? data : (data as any).results || []);
      } catch (err) {
        console.error('Failed to load testimonials', err);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollContainerRef.current || testimonials.length <= 3 || isPaused) return;

    const scrollContainer = scrollContainerRef.current;
    let scrollAmount = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const cardWidth = 400; // approximate card width including gap

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollAmount += scrollSpeed;
        scrollContainer.scrollLeft = scrollAmount;

        // Reset to start when reaching end
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
          scrollContainer.scrollLeft = 0;
        }
      }
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [testimonials.length, isPaused]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="py-32 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-display-md text-4xl md:text-5xl mb-6 tracking-tight">What Our Customers Say.</h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto text-lg md:text-xl">
            Real experiences from people who have embraced the Ayurvedic lifestyle with Herbal Udyog.
          </p>
        </div>

        <div className="relative">
          {/* Scroll Controls */}
          {testimonials.length > 3 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all -ml-6 hidden md:flex"
              >
                <ChevronLeft className="w-6 h-6 text-on-surface" />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all -mr-6 hidden md:flex"
              >
                <ChevronRight className="w-6 h-6 text-on-surface" />
              </button>
            </>
          )}

          {/* Testimonials Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto pb-8 pt-4 px-4 hide-scrollbar snap-x snap-mandatory"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[350px] md:w-[400px] bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm border border-outline-variant/30 hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1 snap-start"
              >
                <div className="flex items-center gap-1 mb-8 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-outline-variant/30'}`} />
                  ))}
                </div>
                
                <p className="font-body-lg text-on-surface italic mb-10 flex-grow leading-relaxed line-clamp-6">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  {testimonial.user_profile_image_url ? (
                    <img src={testimonial.user_profile_image_url} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-surface-container-low text-primary flex items-center justify-center font-bold text-xl shadow-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-label-lg font-semibold">{testimonial.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Scroll Indicator */}
          {testimonials.length > 3 && (
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              <button
                onClick={scrollLeft}
                className="p-3 bg-surface-container rounded-full shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-3 bg-surface-container rounded-full shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
