import React, { useState, useEffect } from 'react';
import { Star, Trash2, Check, X } from 'lucide-react';
import { adminTestimonialsApi } from '../../api/admin';
import { Testimonial } from '../../api/core';

export const AdminTestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await adminTestimonialsApi.list();
      setTestimonials(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleToggleApproval = async (testimonial: Testimonial) => {
    try {
      const updated = await adminTestimonialsApi.approve(testimonial.id, !testimonial.is_approved);
      setTestimonials(prev => prev.map(t => t.id === testimonial.id ? updated : t));
    } catch {
      alert('Failed to update testimonial');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await adminTestimonialsApi.delete(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch {
      alert('Failed to delete testimonial');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const pending = testimonials.filter(t => !t.is_approved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <p className="text-sm text-on-surface-variant">{testimonials.length} testimonials</p>
        {pending > 0 && (
          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">{pending} pending approval</span>
        )}
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No testimonials submitted yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className={`bg-white rounded-2xl border p-5 ${testimonial.is_approved ? 'border-outline-variant/20' : 'border-yellow-300'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {testimonial.image_url ? (
                    <img src={testimonial.image_url} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-on-surface text-sm">{testimonial.name}</p>
                    {testimonial.role && <p className="text-xs text-on-surface-variant">{testimonial.role}</p>}
                  </div>
                </div>
                <span className={`shrink-0 px-2.5 py-1 text-xs rounded-full font-medium ${testimonial.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {testimonial.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>

              <p className="text-sm text-on-surface-variant italic mb-4 line-clamp-3">"{testimonial.content}"</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApproval(testimonial)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${testimonial.is_approved ? 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                  {testimonial.is_approved ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                  {testimonial.is_approved ? 'Revoke' : 'Approve'}
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
