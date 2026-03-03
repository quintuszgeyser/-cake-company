"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getCakeBySlug, cakes } from "@/lib/data/cakes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ShoppingCart,
  Users,
  Cake as CakeIcon,
  Heart,
  Share2,
  Check,
} from "lucide-react";
import { CakeCard } from "@/components/cake/CakeCard";

export default function CakeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const cake = getCakeBySlug(resolvedParams.slug);

  if (!cake) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎂</div>
          <h1 className="text-3xl font-bold mb-4">Cake Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The cake you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/cakes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get related cakes (same category, excluding current)
  const relatedCakes = cakes
    .filter((c) => c.category === cake.category && c.id !== cake.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Back Button */}
      <div className="container pt-8">
        <Button variant="ghost" asChild>
          <Link href="/cakes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>
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
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={cake.images[0]}
                  alt={cake.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {cake.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {cake.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={image}
                        alt={`${cake.name} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Category Badge */}
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                  {cake.category}
                </span>
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {cake.name}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    ${cake.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    / {cake.servings} servings
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {cake.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Servings</div>
                      <div className="font-semibold">{cake.servings} people</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CakeIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="font-semibold capitalize">{cake.category}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Flavors */}
              <div>
                <h3 className="font-semibold mb-3">Flavors</h3>
                <div className="flex flex-wrap gap-2">
                  {cake.flavors.map((flavor, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dietary Info */}
              <div>
                <h3 className="font-semibold mb-3">Dietary Information</h3>
                <div className="space-y-2">
                  {cake.dietary.map((diet, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{diet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="flex-1 text-lg group" asChild>
                  <Link href="/custom-order">
                    <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Order Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Additional Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-900">
                    ✨ <strong>Need customization?</strong> This cake can be fully
                    customized to match your event theme, colors, and dietary
                    requirements. Contact us or use our custom order form.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Cakes */}
      {relatedCakes.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                You Might Also Like
              </h2>
              <p className="text-muted-foreground">
                Similar cakes from our collection
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCakes.map((relatedCake, index) => (
                <motion.div
                  key={relatedCake.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
