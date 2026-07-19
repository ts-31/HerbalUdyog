import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { coreApi } from '../api/core';

export const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await coreApi.submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbfbe2] min-h-screen py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display-lg text-4xl md:text-5xl text-[#1b1d0e] mb-6">Contact Us</h1>
          <p className="font-body-lg text-outline-variant text-lg">
            Have questions about our products, sourcing, or organic methods? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/20">
            <h2 className="font-headline-md text-2xl text-[#1b1d0e] mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f5f5dc] text-[#154212] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-lg mb-1">Email Us</h3>
                  <p className="text-outline-variant font-body-md mb-1">Our friendly team is here to help.</p>
                  <a href="mailto:hello@herbaludyog.com" className="font-medium text-[#154212] hover:underline">hello@herbaludyog.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f5f5dc] text-[#154212] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-lg mb-1">Visit Us</h3>
                  <p className="text-outline-variant font-body-md mb-1">Come say hello at our headquarters.</p>
                  <p className="font-medium text-[#1b1d0e]">123 Wellness Avenue<br />Dehradun, Uttarakhand 248001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f5f5dc] text-[#154212] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-lg mb-1">Call Us</h3>
                  <p className="text-outline-variant font-body-md mb-1">Mon-Fri from 9am to 6pm.</p>
                  <a href="tel:+919876543210" className="font-medium text-[#154212] hover:underline">+91 98765 43210</a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/20">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#ccebc7] text-[#154212] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="font-headline-md text-2xl text-[#1b1d0e] mb-4">Message Sent!</h3>
                <p className="font-body-md text-outline-variant mb-8">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 bg-[#154212] text-white rounded-xl font-label-md hover:bg-[#2d5a27] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-error/10 text-error rounded-xl font-body-sm text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-md text-on-surface mb-2">Name</label>
                    <input 
                      type="text" 
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:ring-2 focus:ring-[#154212] outline-none transition-all font-body-md"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface mb-2">Email</label>
                    <input 
                      type="email" 
                      required
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:ring-2 focus:ring-[#154212] outline-none transition-all font-body-md"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-2">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:ring-2 focus:ring-[#154212] outline-none transition-all font-body-md"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-2">Message</label>
                  <textarea 
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:ring-2 focus:ring-[#154212] outline-none transition-all font-body-md resize-y"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-4 bg-[#154212] text-white rounded-xl font-label-md text-lg hover:bg-[#2d5a27] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending...' : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
