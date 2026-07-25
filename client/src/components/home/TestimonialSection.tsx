import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { coreApi, Testimonial } from '../../api/core';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

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

  return (
    <section className="py-32 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-display-md text-4xl md:text-5xl mb-6 tracking-tight">What Our Customers Say.</h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto text-lg md:text-xl">
            Real experiences from people who have embraced the Ayurvedic lifestyle with Herbal Udyog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm border border-outline-variant/30 hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-8 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-outline-variant/30'}`} />
                ))}
              </div>
              
              <p className="font-body-lg text-on-surface italic mb-10 flex-grow leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                {testimonial.image_url ? (
                  <img src={testimonial.image_url} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-surface-container-low text-primary flex items-center justify-center font-bold text-xl shadow-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-label-lg font-semibold">{testimonial.name}</h4>
                  {testimonial.role && <p className="text-sm text-on-surface-variant mt-0.5">{testimonial.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
