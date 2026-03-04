"use client";

import Link from "next/link";
import { Cake, Facebook, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid #2A2A2A'
      }}
    >
      <div className="container py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <Cake
                className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12"
                style={{ color: '#D4AF37' }}
              />
              <span className="font-bold text-2xl" style={{ color: '#FFF8E7' }}>
                CakeCompany
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
              Creating memorable moments, one artisanal cake at a time.
            </p>
            <p className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
              Proudly serving the Western Cape
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="p-2 rounded-full transition-all duration-300"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#D4AF37'
                  }}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Shop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3
              className="font-semibold mb-6 text-sm uppercase"
              style={{
                color: '#D4AF37',
                letterSpacing: '0.1em'
              }}
            >
              Shop
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
              <li>
                <Link href="/cakes" className="hover:text-primary transition-colors">
                  All Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?category=wedding" className="hover:text-primary transition-colors">
                  Wedding Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?category=birthday" className="hover:text-primary transition-colors">
                  Birthday Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?category=corporate" className="hover:text-primary transition-colors">
                  Corporate Cakes
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Create */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3
              className="font-semibold mb-6 text-sm uppercase"
              style={{
                color: '#D4AF37',
                letterSpacing: '0.1em'
              }}
            >
              Create
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
              <li>
                <Link href="/custom-order" className="hover:text-primary transition-colors">
                  Custom Order
                </Link>
              </li>
              <li>
                <Link href="/3d-designer" className="hover:text-primary transition-colors">
                  3D Designer
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3
              className="font-semibold mb-6 text-sm uppercase"
              style={{
                color: '#D4AF37',
                letterSpacing: '0.1em'
              }}
            >
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="tel:+27210000000" className="hover:text-primary transition-colors">
                  021 000 0000
                </Link>
              </li>
              <li>
                <Link href="mailto:orders@cakecompany.co.za" className="hover:text-primary transition-colors">
                  orders@cakecompany.co.za
                </Link>
              </li>
              <li className="pt-2 font-medium" style={{ color: 'rgba(255, 248, 231, 0.8)' }}>
                Cape Town, Western Cape
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 pt-12 text-center"
          style={{ borderTop: '1px solid #2A2A2A' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-sm" style={{ color: 'rgba(255, 248, 231, 0.5)' }}>
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold" style={{ color: '#D4AF37' }}>
              CakeCompany
            </span>
            . All rights reserved.
          </p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255, 248, 231, 0.3)' }}>
            Handcrafted with love in Cape Town
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
