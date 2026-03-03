"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CakeCard } from "@/components/cake/CakeCard";
import { CakeFilters } from "@/components/cake/CakeFilters";
import { filterCakes, cakes } from "@/lib/data/cakes";
import { Sparkles } from "lucide-react";

export default function CakesPage() {
  const [filters, setFilters] = useState<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minServings?: number;
    dietary?: string;
    search?: string;
  }>({});

  const filteredCakes = useMemo(() => {
    return filterCakes(filters);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Our Cake Collection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Discover Your Perfect Cake
            </h1>
            <p className="text-xl text-gray-600">
              Browse our collection of handcrafted cakes for every occasion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
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
                className="mb-6 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredCakes.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{cakes.length}</span> cakes
                </p>
              </motion.div>

              {/* Products Grid */}
              {filteredCakes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCakes.map((cake, index) => (
                    <motion.div
                      key={cake.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CakeCard
                        id={cake.slug}
                        name={cake.name}
                        description={cake.description}
                        price={cake.price}
                        image={cake.images[0]}
                        category={cake.category}
                        servings={cake.servings}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">🎂</div>
                  <h3 className="text-2xl font-semibold mb-2">No cakes found</h3>
                  <p className="text-muted-foreground mb-6">
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
