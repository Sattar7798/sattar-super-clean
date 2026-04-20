'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Works', path: '/works' },
  { name: 'Research', path: '/research' },
  { name: 'Publications', path: '/publications' },
  { name: 'Interactive', path: '/interactive-model' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FFF8EC]/92 backdrop-blur-xl border-b border-[#DCCCAC]/60 shadow-[0_2px_24px_rgba(84,107,65,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#546B41]/15 border border-[#546B41]/25 flex items-center justify-center text-[#546B41] group-hover:bg-[#546B41]/28 group-hover:border-[#546B41]/45 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="font-bold text-[#2d3d24] text-lg tracking-tight group-hover:text-[#546B41] transition-colors duration-300">
              Sattar <span className="text-[#99AD7A]">Hedayat</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-[#2d3d24]'
                      : 'text-[#546B41]/70 hover:text-[#2d3d24] hover:bg-[#546B41]/08'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-[#99AD7A]/18 border border-[#99AD7A]/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="px-4 py-2 bg-[#546B41] hover:bg-[#3d5030] border border-[#546B41] hover:border-[#2d3d24] rounded-lg text-sm font-semibold text-[#FFF8EC] transition-all duration-300 hover:shadow-[0_0_18px_rgba(84,107,65,0.4)]"
            >
              Get in Touch
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#546B41]/70 hover:text-[#546B41] hover:bg-[#546B41]/08 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <motion.div animate={isOpen ? 'open' : 'closed'}>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#FFF8EC]/97 backdrop-blur-xl border-b border-[#DCCCAC]/60"
          >
            <div className="px-5 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#99AD7A]/18 border border-[#99AD7A]/30 text-[#2d3d24]'
                        : 'text-[#546B41]/70 hover:text-[#2d3d24] hover:bg-[#546B41]/08'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-[#546B41] rounded-xl text-sm font-semibold text-[#FFF8EC] text-center hover:bg-[#3d5030] transition-colors duration-200"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
