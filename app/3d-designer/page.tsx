"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cake, Palette, Sparkles } from "lucide-react";

export default function ThreeDDesignerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Cake className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            3D Cake Designer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design your dream cake in stunning 3D. Customize every detail and bring your vision to life.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Coming Soon! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              Our revolutionary 3D cake designer is currently under development.
              Soon you'll be able to:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-3">
                  <Cake className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="font-semibold">Design in 3D</h3>
                <p className="text-sm text-muted-foreground">
                  Rotate, zoom, and view your cake from every angle in real-time
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">Customize Colors</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from unlimited color combinations and patterns
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Add Decorations</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop decorations, flowers, and custom text
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg text-center space-y-4">
              <p className="font-semibold">Want to design a custom cake right now?</p>
              <Button asChild size="lg">
                <Link href="/custom-order">
                  Use Our Custom Order Form
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Stay tuned for the launch of our 3D designer!</p>
              <p className="mt-2">
                In the meantime, you can still order fully custom cakes through our{" "}
                <Link href="/custom-order" className="text-primary hover:underline">
                  custom order form
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/cakes">
              Browse Our Cake Gallery
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
