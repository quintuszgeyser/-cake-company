"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getCakeBySlug, cakes } from "@/lib/data/cakes";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ShoppingCart,
  Users,
  Cake as CakeIcon,
  Heart,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import { CakeCard } from "@/components/cake/CakeCard";

export default function CakeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const cake = getCakeBySlug(resolvedParams.slug);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!cake) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-30">🎂</div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#FFF8E7' }}>
            Cake Not Found
          </h1>
          <p className="mb-8" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
            The cake you're looking for doesn't exist.
          </p>
          <Link href="/cakes">
            <motion.button
              className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
              style={{
                border: '2px solid #D4AF37',
                color: '#D4AF37'
              }}
              whileHover={{ backgroundColor: '#D4AF37', color: '#0A0A0A' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedCakes = cakes
    .filter((c) => c.category === cake.category && c.id !== cake.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Back Button */}
      <div className="container pt-8">
        <Link href="/cakes">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#FFF8E7' }}
            whileHover={{ color: '#D4AF37' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </motion.button>
        </Link>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                className="relative aspect-square rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: '#141414',
                  border: '4px solid #2A2A2A'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={cake.images[selectedImage]}
                  alt={cake.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              {cake.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {cake.images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all"
                      style={{
                        backgroundColor: '#141414',
                        border: selectedImage === index ? '2px solid #D4AF37' : '2px solid transparent'
                      }}
                      onClick={() => setSelectedImage(index)}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image}
                        alt={`${cake.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Category Badge */}
              <div>
                <span
                  className="inline-block px-4 py-2 rounded-full text-xs font-medium uppercase"
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    color: '#D4AF37',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    letterSpacing: '0.1em'
                  }}
                >
                  {cake.category}
                </span>
              </div>

              {/* Title & Price */}
              <div>
                <h1
                  className="font-bold mb-4"
                  style={{
                    fontSize: 'clamp(2.25rem, 4.5vw, 4.5rem)',
                    color: '#FFF8E7'
                  }}
                >
                  {cake.name}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold" style={{ color: '#D4AF37' }}>
                    R{cake.price.toFixed(2)}
                  </span>
                  <span style={{ color: 'rgba(255, 248, 231, 0.5)' }}>
                    / {cake.servings} servings
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 248, 231, 0.7)' }}>
                {cake.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.03, y: -2 }}>
                  <Card style={{ backgroundColor: 'rgba(20, 20, 20, 0.6)', border: '1px solid #2A2A2A' }}>
                    <CardContent className="flex items-center gap-3 p-5">
                      <motion.div
                        className="p-3 rounded-xl"
                        style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))' }}
                        whileHover={{ rotate: 5 }}
                      >
                        <Users className="w-6 h-6" style={{ color: '#D4AF37' }} />
                      </motion.div>
                      <div>
                        <div className="text-xs font-semibold uppercase" style={{ color: 'rgba(255, 248, 231, 0.5)', letterSpacing: '0.05em' }}>
                          Servings
                        </div>
                        <div className="font-bold text-lg" style={{ color: '#FFF8E7' }}>
                          {cake.servings} people
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03, y: -2 }}>
                  <Card style={{ backgroundColor: 'rgba(20, 20, 20, 0.6)', border: '1px solid #2A2A2A' }}>
                    <CardContent className="flex items-center gap-3 p-5">
                      <motion.div
                        className="p-3 rounded-xl"
                        style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))' }}
                        whileHover={{ rotate: -5 }}
                      >
                        <CakeIcon className="w-6 h-6" style={{ color: '#D4AF37' }} />
                      </motion.div>
                      <div>
                        <div className="text-xs font-semibold uppercase" style={{ color: 'rgba(255, 248, 231, 0.5)', letterSpacing: '0.05em' }}>
                          Category
                        </div>
                        <div className="font-bold text-lg capitalize" style={{ color: '#FFF8E7' }}>
                          {cake.category}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Flavors */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: '#FFF8E7' }}>
                  Flavors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cake.flavors.map((flavor, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: 'rgba(20, 20, 20, 0.6)',
                        border: '1px solid #2A2A2A',
                        color: '#FFF8E7'
                      }}
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dietary Info */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: '#FFF8E7' }}>
                  Dietary Information
                </h3>
                <div className="space-y-2">
                  {cake.dietary.map((diet, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      <span className="text-sm" style={{ color: 'rgba(255, 248, 231, 0.7)' }}>
                        {diet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Link href={`/custom-order?cakeId=${cake.id}`} className="flex-1">
                  <motion.button
                    className="w-full text-lg px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                    style={{
                      backgroundColor: '#D4AF37',
                      color: '#0A0A0A',
                      boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)'
                    }}
                    whileHover={{
                      boxShadow: '0 15px 50px rgba(212, 175, 55, 0.4)',
                      scale: 1.02
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Order Now
                  </motion.button>
                </Link>
                <motion.button
                  className="px-6 py-4 rounded-lg"
                  style={{ border: '2px solid #D4AF37', color: '#D4AF37' }}
                  whileHover={{ scale: 1.1, backgroundColor: '#D4AF37', color: '#0A0A0A' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="h-5 w-5" />
                </motion.button>
                <motion.button
                  className="px-6 py-4 rounded-lg"
                  style={{ border: '2px solid #D4AF37', color: '#D4AF37' }}
                  whileHover={{ scale: 1.1, backgroundColor: '#D4AF37', color: '#0A0A0A' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Additional Info */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.05)',
                    border: '2px solid rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <CardContent className="p-5">
                    <p className="text-sm font-medium flex items-start gap-2" style={{ color: 'rgba(255, 248, 231, 0.8)' }}>
                      <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                      <span>
                        <strong style={{ color: '#D4AF37' }}>Need customization?</strong> This cake can be fully
                        customized to match your event theme, colors, and dietary
                        requirements. Contact us or use our custom order form.
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Cakes */}
      {relatedCakes.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid #2A2A2A' }}>
          <div className="container">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="font-bold mb-4"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)',
                  color: '#FFF8E7'
                }}
              >
                You Might Also Like
              </h2>
              <p style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
                Similar cakes from our collection
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCakes.map((relatedCake, index) => (
                <motion.div
                  key={relatedCake.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <CakeCard
                    id={relatedCake.slug}
                    name={relatedCake.name}
                    description={relatedCake.description}
                    price={relatedCake.price}
                    image={relatedCake.images[0]}
                    category={relatedCake.category}
                    servings={relatedCake.servings}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
