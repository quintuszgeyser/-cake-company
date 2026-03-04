"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Card className="overflow-hidden group cursor-pointer">
        <Link href={`/cakes/${id}`}>
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                {category}
              </span>
            </div>
            <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {description}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Serves {servings}</span>
              <span className="font-semibold text-lg text-foreground">
                R{price.toFixed(2)}
              </span>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button className="w-full group/btn" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Order Now
            </Button>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}
