"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
      }} />

      {/* Full-bleed background image with dark overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(to right, #0A0A0A 0%, rgba(10, 10, 10, 0.95) 50%, rgba(10, 10, 10, 0.8) 100%)'
        }} />
        <img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&h=1080&fit=crop&q=80"
          alt="Luxury cake background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.4 }}
        />
      </motion.div>

      {/* Content - Asymmetric Layout */}
      <motion.div
        className="container relative z-20 py-32"
        style={{ opacity }}
      >
        <div className="max-w-4xl">
          {/* Small label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-medium mb-8 uppercase"
              style={{
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#D4AF37',
                letterSpacing: '0.1em'
              }}
            >
              Premium Artisanal Cakes
            </span>
          </motion.div>

          {/* Massive headline */}
          <motion.h1
            className="font-black leading-none mb-8"
            style={{
              fontSize: 'clamp(4.5rem, 8vw, 7.5rem)',
              color: '#FFF8E7',
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Artisanal Cakes,<br />
            <span style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Crafted to Perfection
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="max-w-xl mb-12 leading-relaxed"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: 'rgba(255, 248, 231, 0.6)'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Experience luxury cake design with our revolutionary 3D visualization tool. Each creation is meticulously crafted for your special moments.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link href="/custom-order">
              <motion.button
                className="text-lg px-10 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#0A0A0A',
                  boxShadow: '0 20px 60px rgba(212, 175, 55, 0.3)'
                }}
                whileHover={{
                  backgroundColor: '#B8941F',
                  boxShadow: '0 25px 70px rgba(212, 175, 55, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Begin Your Order
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>

            <Link href="/3d-designer">
              <motion.button
                className="text-lg px-10 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
                style={{
                  border: '2px solid #D4AF37',
                  color: '#D4AF37',
                  backgroundColor: 'transparent'
                }}
                whileHover={{
                  backgroundColor: '#D4AF37',
                  color: '#0A0A0A'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Explore 3D Designer
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats - Minimal and elegant */}
          <motion.div
            className="flex flex-wrap gap-8 mt-20 pt-12"
            style={{ borderTop: '1px solid #2A2A2A' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div>
              <div className="text-4xl font-bold mb-1" style={{ color: '#D4AF37' }}>1,247+</div>
              <div className="text-sm uppercase" style={{ color: 'rgba(255, 248, 231, 0.6)', letterSpacing: '0.1em' }}>
                Cakes Delivered
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1" style={{ color: '#D4AF37' }}>5.0</div>
              <div className="text-sm uppercase" style={{ color: 'rgba(255, 248, 231, 0.6)', letterSpacing: '0.1em' }}>
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1" style={{ color: '#D4AF37' }}>24/7</div>
              <div className="text-sm uppercase" style={{ color: 'rgba(255, 248, 231, 0.6)', letterSpacing: '0.1em' }}>
                Western Cape
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10" style={{
        background: 'linear-gradient(to top, #0A0A0A, transparent)'
      }} />
    </section>
  );
}
