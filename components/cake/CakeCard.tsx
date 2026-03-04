"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ArrowRight } from "lucide-react";

interface CakeCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  servings: number;
}

export function CakeCard({
  id,
  name,
  description,
  price,
  image,
  category,
  servings,
}: CakeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -12 }}
    >
      <Card
        className="overflow-hidden group cursor-pointer transition-all duration-500"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #2A2A2A',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Link href={`/cakes/${id}`}>
          {/* Image with overlay */}
          <div
            className="relative overflow-hidden"
            style={{
              height: '400px',
              backgroundColor: '#141414'
            }}
          >
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            />

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 40%, rgba(10, 10, 10, 0.5) 100%)'
              }}
            />

            {/* Category badge - minimal */}
            <div className="absolute top-4 left-4 z-10">
              <span
                className="px-3 py-1 rounded text-xs font-medium uppercase"
                style={{
                  background: 'rgba(20, 20, 20, 0.7)',
                  backdropFilter: 'blur(10px)',
                  color: 'rgba(255, 248, 231, 0.8)',
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}
              >
                {category}
              </span>
            </div>

            {/* Favorite icon */}
            <motion.button
              className="absolute top-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 z-10 transition-opacity"
              style={{
                background: 'rgba(20, 20, 20, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 175, 55, 0.1)'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </motion.button>
          </div>

          {/* Content */}
          <CardContent
            className="p-6"
            style={{ backgroundColor: 'rgba(20, 20, 20, 0.5)' }}
          >
            <h3
              className="font-bold text-2xl mb-3 transition-colors duration-300"
              style={{ color: '#FFF8E7' }}
            >
              {name}
            </h3>
            <p
              className="text-sm line-clamp-2 mb-4 leading-relaxed"
              style={{ color: 'rgba(255, 248, 231, 0.6)' }}
            >
              {description}
            </p>
            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: '1px solid #2A2A2A' }}
            >
              <span
                className="text-sm uppercase"
                style={{
                  color: 'rgba(255, 248, 231, 0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                Serves {servings}
              </span>
              <span className="font-bold text-2xl" style={{ color: '#D4AF37' }}>
                R{price.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Link>

        {/* CTA */}
        <CardFooter
          className="p-6 pt-0"
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.5)' }}
        >
          <Link href="/custom-order" onClick={(e) => e.stopPropagation()} className="w-full block">
            <motion.button
              className="w-full px-6 py-4 rounded-lg font-medium flex items-center justify-center gap-2 group/btn transition-all duration-300"
              style={{
                border: '2px solid #D4AF37',
                color: '#D4AF37',
                backgroundColor: 'transparent'
              }}
              whileHover={{
                backgroundColor: '#D4AF37',
                color: '#0A0A0A',
                scale: 1.02
              }}
              whileTap={{ scale: 0.98 }}
            >
              Order Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
