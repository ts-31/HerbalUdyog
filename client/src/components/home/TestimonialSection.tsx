import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { coreApi, Testimonial } from '../../api/core';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isPaused, setIsPaused] = useState(false);

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

  if (testimonials.length === 0) return null;

  // Duplicate list for seamless CSS marquee loop
  const loopItems = [...testimonials, ...testimonials];

  return (
    <section className="py-32 bg-surface overflow-hidden">
      <style>{`
        @keyframes testimonial-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .testimonial-marquee-track {
          animation: testimonial-marquee 40s linear infinite;
          width: max-content;
        }
        .testimonial-marquee-track.is-paused {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-display-md text-4xl md:text-5xl mb-6 tracking-tight">What Our Customers Say.</h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto text-lg md:text-xl">
            Real experiences from people who have embraced the Ayurvedic lifestyle with Herbal Udyog.
          </p>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`testimonial-marquee-track flex gap-8 px-4 ${isPaused ? 'is-paused' : ''}`}>
          {loopItems.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 w-[350px] md:w-[400px] bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm border border-outline-variant/30 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-8 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-outline-variant/30'}`}
                  />
                ))}
              </div>

              <p className="font-body-lg text-on-surface italic mb-10 flex-grow leading-relaxed line-clamp-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 mt-auto">
                {testimonial.user_profile_image_url ? (
                  <img
                    src={testimonial.user_profile_image_url}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                  />
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
      </div>
    </section>
  );
};
