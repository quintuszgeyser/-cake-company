"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { CakeCard } from "@/components/cake/CakeCard";
import { CakeFilters } from "@/components/cake/CakeFilters";
import { CakeTemplate } from "@/types/cake";
import { PricingConfig, calculateOrderPrice } from "@/lib/utils/pricing";

export default function CakesPage() {
  const [cakes, setCakes] = useState<CakeTemplate[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minServings?: number;
    dietary?: string;
    search?: string;
  }>({});

  // Fetch cakes from database API
  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/pricing").then((res) => res.json()),
    ])
      .then(([productsData, pricingData]) => {
        if (productsData.success) {
          setCakes(productsData.products);
        }
        setPricingConfig(pricingData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter cakes client-side
  const filteredCakes = useMemo(() => {
    return cakes.filter((cake) => {
      // Category filter
      if (filters.category && cake.category !== filters.category) {
        return false;
      }

      // Calculate dynamic price for filtering
      const price = pricingConfig && cake.template_data
        ? calculateOrderPrice(cake.template_data, pricingConfig)
        : cake.base_price;

      // Price filters
      if (filters.minPrice && price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && price > filters.maxPrice) {
        return false;
      }

      // Servings filter
      if (filters.minServings && cake.servings < filters.minServings) {
        return false;
      }

      // Dietary filter
      if (filters.dietary && !cake.dietary.includes(filters.dietary)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          cake.name.toLowerCase().includes(searchLower) ||
          cake.description.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [cakes, filters, pricingConfig]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <section
        className="py-32"
        style={{ borderBottom: '1px solid #2A2A2A' }}
      >
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1
              className="font-black mb-6"
              style={{
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                color: '#FFF8E7'
              }}
            >
              Our Collection
            </h1>
            <div
              className="mx-auto mb-8"
              style={{
                width: '96px',
                height: '4px',
                backgroundColor: '#D4AF37'
              }}
            />
            <p
              className="leading-relaxed"
              style={{
                fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                color: 'rgba(255, 248, 231, 0.6)'
              }}
            >
              Browse our collection of handcrafted artisanal cakes for every occasion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters Sidebar */}
            <motion.aside
              className="lg:w-80 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CakeFilters onFilterChange={setFilters} />
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <motion.div
                className="mb-8 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p
                  className="text-sm uppercase"
                  style={{
                    color: 'rgba(255, 248, 231, 0.5)',
                    letterSpacing: '0.1em'
                  }}
                >
                  Showing <span className="font-bold" style={{ color: '#D4AF37' }}>{filteredCakes.length}</span> of{" "}
                  <span className="font-bold" style={{ color: '#D4AF37' }}>{cakes.length}</span> cakes
                </p>
              </motion.div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-32">
                  <p style={{ color: 'rgba(255, 248, 231, 0.5)' }}>Loading cakes...</p>
                </div>
              ) : filteredCakes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCakes.map((cake, index) => {
                    // Calculate dynamic price
                    const displayPrice = pricingConfig && cake.template_data
                      ? calculateOrderPrice(cake.template_data, pricingConfig)
                      : cake.base_price;

                    return (
                      <motion.div
                        key={cake.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
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
              ) : (
                <motion.div
                  className="text-center py-32"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-6 opacity-30">🎂</div>
                  <h3
                    className="font-bold mb-4"
                    style={{
                      fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)',
                      color: '#FFF8E7'
                    }}
                  >
                    No cakes found
                  </h3>
                  <p style={{ color: 'rgba(255, 248, 231, 0.5)' }}>
                    Try adjusting your filters to see more results
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
