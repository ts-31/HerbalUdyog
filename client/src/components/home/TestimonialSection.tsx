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
    <section className="py-24 bg-surface-container-lowest">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display-md text-3xl md:text-5xl text-[#1b1d0e] mb-6">What Our Customers Say</h2>
          <p className="font-body-lg text-outline-variant max-w-2xl mx-auto">
            Real experiences from people who have embraced the Ayurvedic lifestyle with Herbal Udyog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-6 text-[#154212]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-outline-variant/30'}`} />
                ))}
              </div>
              
              <p className="font-body-lg text-[#1b1d0e] italic mb-8 flex-grow">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                {testimonial.image_url ? (
                  <img src={testimonial.image_url} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-label-lg font-bold text-[#1b1d0e]">{testimonial.name}</h4>
                  {testimonial.role && <p className="text-sm text-outline-variant">{testimonial.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
