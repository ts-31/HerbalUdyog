import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};
