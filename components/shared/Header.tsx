"use client";

import Link from "next/link";
import { Cake, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <Cake
            className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12"
            style={{ color: '#D4AF37' }}
          />
          <span
            className="font-bold text-2xl transition-colors duration-300"
            style={{ color: '#FFF8E7' }}
          >
            CakeCompany
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {[
            { href: '/', label: 'Home' },
            { href: '/cakes', label: 'Gallery' },
            { href: '/custom-order', label: 'Custom Order' },
            { href: '/3d-designer', label: '3D Designer' }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-all duration-300 relative group/link"
              style={{ color: '#FFF8E7' }}
            >
              {link.label}
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 group-hover/link:w-full transition-all duration-300"
                style={{ backgroundColor: '#D4AF37' }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/custom-order" className="hidden md:inline-flex">
            <motion.button
              className="text-base px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{
                backgroundColor: '#D4AF37',
                color: '#0A0A0A',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
              }}
              whileHover={{
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
                scale: 1.02
              }}
              whileTap={{ scale: 0.98 }}
            >
              Order Now
            </motion.button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: '#FFF8E7' }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid #2A2A2A'
            }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="container flex flex-col space-y-4 py-6">
              {[
                { href: '/', label: 'Home' },
                { href: '/cakes', label: 'Gallery' },
                { href: '/custom-order', label: 'Custom Order' },
                { href: '/3d-designer', label: '3D Designer' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg transition-colors"
                  style={{ color: '#FFF8E7' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/custom-order" className="w-full mt-4 block">
                <button
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#0A0A0A'
                  }}
                >
                  Order Now
                </button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
