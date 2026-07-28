import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';

export const About = () => {
  return (
    <div className="bg-surface min-h-screen">
      <section className="relative min-h-[55vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000"
            alt="Herbal fields at dawn"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-6 w-full pb-16 pt-32">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label-sm uppercase tracking-widest text-white/80 mb-4"
          >
            Our Herbal Promise
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display-lg text-4xl md:text-6xl text-white tracking-tight leading-tight"
          >
            HerbalUdyog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body-lg text-lg md:text-xl text-white/85 mt-5 max-w-2xl font-light"
          >
            Honest botanicals, traditional wisdom, and formulations you can trust for everyday wellness.
          </motion.p>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface tracking-tight mb-6">
            What we stand for
          </h2>
          <p className="font-body-lg text-on-surface-variant text-lg leading-relaxed mb-6">
            HerbalUdyog brings Ayurvedic care into modern routines without shortcuts. We work with growers who cultivate herbs the traditional way, then prepare extracts and personal-care formulas that keep potency intact — no unnecessary fillers, no empty claims.
          </p>
          <p className="font-body-lg text-on-surface-variant text-lg leading-relaxed">
            From Ashwagandha root to Tulsi infusions, every product is chosen for purity, traceability, and how it actually feels in daily use. That is our herbal promise: plant-first ingredients, careful craftsmanship, and wellness that respects both people and the land they come from.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 space-y-10"
        >
          {[
            {
              title: 'Organic sourcing',
              body: 'We prioritize certified organic botanicals and partner with farms that grow without harmful synthetic inputs.',
            },
            {
              title: 'Transparent purity',
              body: 'Formulas stay close to their herbal roots — clear ingredients, traditional methods, and nothing you do not need.',
            },
            {
              title: 'Everyday Ayurveda',
              body: 'Supplements, oils, and personal care designed for real routines: simple to use, rooted in time-tested practice.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-headline-sm text-xl text-on-surface mb-2 tracking-tight">{item.title}</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">{item.body}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row gap-4"
        >
          <Link to="/marketplace">
            <Button size="lg" className="w-full sm:w-auto">
              Shop Wellness
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Talk to us
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
