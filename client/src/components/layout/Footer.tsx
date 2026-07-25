import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-20 mt-24">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 pr-8">
                <div className="flex items-center gap-2 mb-6">
                    <span className="font-display-lg text-3xl font-bold tracking-tight">HerbalUdyog</span>
                </div>
                <p className="font-body-md text-white/70 max-w-sm mb-10 leading-relaxed">
                  Sustainable Wellness from Root to Remedy. Connecting pure Indian herbs with the world through technology and trust.
                </p>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors backdrop-blur-sm">
                      <span className="text-sm font-bold">Ig</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors backdrop-blur-sm">
                      <span className="text-sm font-bold">Tw</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors backdrop-blur-sm">
                      <span className="text-sm font-bold">Fb</span>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 className="font-label-md text-sm text-white/50 uppercase tracking-widest mb-6">Shop</h4>
                <ul className="space-y-4">
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">Adaptogens</Link></li>
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">Digestive Care</Link></li>
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">Immunity Boosters</Link></li>
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">Wholesale</Link></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-label-md text-sm text-white/50 uppercase tracking-widest mb-6">Support</h4>
                <ul className="space-y-4">
                    <li><a href="#" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">Farmer Support</a></li>
                    <li><a href="#" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">Shipping Info</a></li>
                    <li><a href="#" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">Order Tracking</a></li>
                    <li><a href="#" className="font-body-sm text-sm text-white/80 hover:text-white transition-colors">FAQs</a></li>
                </ul>
            </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body-sm text-xs text-white/50">© 2024 HerbalUdyog. Sustainable Wellness from Root to Remedy.</p>
            <div className="flex gap-6">
                <a href="#" className="font-body-sm text-xs text-white/50 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="font-body-sm text-xs text-white/50 hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>
    </footer>
  );
};
