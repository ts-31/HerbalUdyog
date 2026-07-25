import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { coreApi } from '../api/core';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      const errMsg = err.message || 'Failed to send message. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-surface min-h-screen py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface mb-6 tracking-tight">Contact Us</h1>
          <p className="font-body-lg text-on-surface-variant text-lg">
            Have questions about our products, sourcing, or organic methods? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Info Section */}
          <motion.div variants={itemVariants} className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-sm border border-outline-variant/30">
            <h2 className="font-headline-md text-2xl text-on-surface mb-8 tracking-tight">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-lg mb-1 text-on-surface">Email Us</h3>
                  <p className="text-on-surface-variant font-body-md mb-1">Our friendly team is here to help.</p>
                  <a href="mailto:hello@herbaludyog.com" className="font-medium text-primary hover:underline">hello@herbaludyog.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-lg mb-1 text-on-surface">Visit Us</h3>
                  <p className="text-on-surface-variant font-body-md mb-1">Come say hello at our headquarters.</p>
                  <p className="font-medium text-on-surface">123 Wellness Avenue<br />Dehradun, Uttarakhand 248001</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-lg mb-1 text-on-surface">Call Us</h3>
                  <p className="text-on-surface-variant font-body-md mb-1">Mon-Fri from 9am to 6pm.</p>
                  <a href="tel:+919876543210" className="font-medium text-primary hover:underline">+91 98765 43210</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div variants={itemVariants} className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-sm border border-outline-variant/30">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="font-headline-md text-2xl text-on-surface mb-4 tracking-tight">Message Sent!</h3>
                <p className="font-body-md text-on-surface-variant mb-8">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button 
                  onClick={() => setSuccess(false)}
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-error-container text-on-error-container rounded-xl font-body-sm text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Name"
                    type="text" 
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Jane Doe"
                  />
                  <Input 
                    label="Email"
                    type="email" 
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="jane@example.com"
                  />
                </div>

                <Input 
                  label="Subject"
                  type="text" 
                  required
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  placeholder="How can we help?"
                />

                <div>
                  <label className="block font-label-md text-on-surface mb-2">Message</label>
                  <textarea 
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:ring-2 focus:ring-primary outline-none transition-all font-body-md resize-y"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button 
                  type="submit" 
                  isLoading={submitting}
                  className="w-full h-14 text-lg"
                  rightIcon={<Send className="w-5 h-5" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
