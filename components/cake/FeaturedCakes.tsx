"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CakeCard } from "./CakeCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CakeTemplate } from "@/types/cake";
import { PricingConfig, calculateOrderPrice } from "@/lib/utils/pricing";

export function FeaturedCakes() {
  const [featuredCakes, setFeaturedCakes] = useState<CakeTemplate[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?featured=true").then((res) => res.json()),
      fetch("/api/pricing").then((res) => res.json()),
    ])
      .then(([productsData, pricingData]) => {
        if (productsData.success) {
          setFeaturedCakes(productsData.products);
        }
        setPricingConfig(pricingData);
      })
      .catch((error) => {
        console.error("Failed to fetch featured cakes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section
        className="py-32"
        style={{
          backgroundColor: '#0A0A0A',
          borderTop: '1px solid #2A2A2A'
        }}
      >
        <div className="container text-center">
          <p style={{ color: 'rgba(255, 248, 231, 0.5)' }}>Loading featured cakes...</p>
        </div>
      </section>
    );
  }

  if (featuredCakes.length === 0) {
    return null;
  }
  return (
    <section
      className="py-32"
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid #2A2A2A'
      }}
    >
      <div className="container">
        {/* Section header - Left aligned, bold */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2
            className="font-black mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 4.5rem)',
              color: '#FFF8E7'
            }}
          >
            Featured Creations
          </h2>
          <div
            className="mb-6"
            style={{
              width: '96px',
              height: '4px',
              backgroundColor: '#D4AF37'
            }}
          />
          <p
            className="max-w-2xl leading-relaxed"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: 'rgba(255, 248, 231, 0.6)'
            }}
          >
            Discover our most sought-after cakes, each meticulously handcrafted with premium ingredients and unparalleled attention to detail
          </p>
        </motion.div>

        {/* Asymmetric grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {/* First cake - Hero (spans 2 columns) */}
          {featuredCakes[0] && (
            <motion.div
              className="lg:col-span-2 lg:row-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <CakeCard
                id={featuredCakes[0].slug}
                name={featuredCakes[0].name}
                description={featuredCakes[0].description}
                price={
                  pricingConfig && featuredCakes[0].template_data
                    ? calculateOrderPrice(featuredCakes[0].template_data, pricingConfig)
                    : featuredCakes[0].base_price
                }
                image={featuredCakes[0].images[0]}
                category={featuredCakes[0].category}
                servings={featuredCakes[0].servings}
              />
            </motion.div>
          )}

          {/* Remaining cakes */}
          {featuredCakes.slice(1).map((cake, index) => {
            const displayPrice = pricingConfig && cake.template_data
              ? calculateOrderPrice(cake.template_data, pricingConfig)
              : cake.base_price;

            return (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <CakeCard
                  id={cake.slug}
                  name={cake.name}
                  description={cake.description}
                  price={displayPrice}
                  image={cake.images[0]}
                  category={cake.category}
                  servings={cake.servings}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA - Minimal and elegant */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/cakes">
            <motion.button
              className="text-lg px-10 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto transition-all duration-300"
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
              View Full Collection
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
