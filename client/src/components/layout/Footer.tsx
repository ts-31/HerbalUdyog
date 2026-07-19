import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#1b1d0e] text-[#f2f2d9] py-16 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 pr-8">
                <div className="flex items-center gap-2 mb-6">
                    <span className="font-display-lg text-3xl font-bold text-white">HerbalUdyog</span>
                </div>
                <p className="font-body-md text-sm text-outline-variant max-w-sm mb-8 leading-relaxed">
                  Sustainable Wellness from Root to Remedy. Connecting pure Indian herbs with the world through technology and trust.
                </p>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#fbfbe2] text-[#1b1d0e] flex items-center justify-center hover:bg-[#ccebc7] cursor-pointer transition-colors">
                      <span className="text-sm font-bold">Ig</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#fbfbe2] text-[#1b1d0e] flex items-center justify-center hover:bg-[#ccebc7] cursor-pointer transition-colors">
                      <span className="text-sm font-bold">Tw</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#fbfbe2] text-[#1b1d0e] flex items-center justify-center hover:bg-[#ccebc7] cursor-pointer transition-colors">
                      <span className="text-sm font-bold">Fb</span>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 className="font-label-md text-sm text-white mb-6">Shop</h4>
                <ul className="space-y-4">
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">Adaptogens</Link></li>
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">Digestive Care</Link></li>
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">Immunity Boosters</Link></li>
                    <li><Link to="/marketplace" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">Wholesale</Link></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-label-md text-sm text-white mb-6">Support</h4>
                <ul className="space-y-4">
                    <li><a href="#" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">Farmer Support</a></li>
                    <li><a href="#" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">Shipping Info</a></li>
                    <li><a href="#" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">Order Tracking</a></li>
                    <li><a href="#" className="font-body-sm text-sm text-outline-variant hover:text-white transition-colors">FAQs</a></li>
                </ul>
            </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body-sm text-xs text-outline-variant">© 2024 HerbalUdyog. Sustainable Wellness from Root to Remedy.</p>
            <div className="flex gap-6">
                <a href="#" className="font-body-sm text-xs text-outline-variant hover:text-white">Privacy Policy</a>
                <a href="#" className="font-body-sm text-xs text-outline-variant hover:text-white">Terms of Service</a>
            </div>
        </div>
    </footer>
  );
};
