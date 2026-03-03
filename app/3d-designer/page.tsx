"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Heart,
  Star,
  Flower2,
  Download,
  ShoppingCart,
} from "lucide-react";

interface CakeConfig {
  tiers: number;
  colors: string[];
  decorations: string[];
  text: string;
  topper: string;
  flavor: string;
  rotation: number;
  zoom: number;
}

const PRESETS = [
  {
    name: "Classic Wedding",
    config: {
      tiers: 3,
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      decorations: ["flowers", "ribbon"],
      topper: "heart",
      text: "",
    },
  },
  {
    name: "Birthday Blast",
    config: {
      tiers: 2,
      colors: ["#FF69B4", "#FFB6C1"],
      decorations: ["sprinkles", "stars"],
      topper: "star",
      text: "Happy Birthday!",
    },
  },
  {
    name: "Elegant Rose",
    config: {
      tiers: 4,
      colors: ["#FFF5F7", "#FFE4E9", "#FFDBE3", "#FFFFFF"],
      decorations: ["flowers", "pearls"],
      topper: "flower",
      text: "",
    },
  },
];

const COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Pink", value: "#FFB6C1" },
  { name: "Rose", value: "#FF69B4" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Mint", value: "#98FF98" },
  { name: "Blue", value: "#87CEEB" },
  { name: "Yellow", value: "#FFD700" },
  { name: "Peach", value: "#FFDAB9" },
  { name: "Chocolate", value: "#8B4513" },
];

const DECORATIONS = [
  { name: "Flowers", icon: Flower2, value: "flowers" },
  { name: "Hearts", icon: Heart, value: "hearts" },
  { name: "Stars", icon: Star, value: "stars" },
  { name: "Sparkles", icon: Sparkles, value: "sprinkles" },
];

export default function ThreeDDesignerPage() {
  const [config, setConfig] = useState<CakeConfig>({
    tiers: 3,
    colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
    decorations: ["flowers"],
    text: "",
    topper: "heart",
    flavor: "vanilla",
    rotation: 20,
    zoom: 1,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const updateConfig = (updates: Partial<CakeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateTiers = (newTiers: number) => {
    const newColors = Array(newTiers)
      .fill("#FFFFFF")
      .map((_, i) => config.colors[i] || "#FFFFFF");
    updateConfig({ tiers: newTiers, colors: newColors });
  };

  const updateTierColor = (tierIndex: number, color: string) => {
    const newColors = [...config.colors];
    newColors[tierIndex] = color;
    updateConfig({ colors: newColors });
  };

  const toggleDecoration = (decoration: string) => {
    const newDecorations = config.decorations.includes(decoration)
      ? config.decorations.filter((d) => d !== decoration)
      : [...config.decorations, decoration];
    updateConfig({ decorations: newDecorations });
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    updateConfig({
      ...preset.config,
      rotation: config.rotation,
      zoom: config.zoom,
      flavor: config.flavor,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const delta = e.clientX - startX;
      updateConfig({ rotation: config.rotation + delta * 0.5 });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTierHeight = (tierIndex: number) => {
    return 80 + tierIndex * 20;
  };

  const getTierWidth = (tierIndex: number) => {
    return 240 - tierIndex * 40;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">3D Cake Designer</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Cake Viewer */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Viewer Controls */}
                <div className="bg-gray-50 border-b p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateConfig({ zoom: config.zoom + 0.1 })}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateConfig({ zoom: Math.max(0.5, config.zoom - 0.1) })
                      }
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateConfig({ rotation: 20, zoom: 1 })}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Drag to rotate
                  </p>
                </div>

                {/* 3D Canvas */}
                <div
                  className="relative h-[500px] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Cake Container */}
                  <div
                    className="relative transition-transform duration-100"
                    style={{
                      transform: `perspective(1200px) rotateX(-10deg) rotateY(${config.rotation}deg) scale(${config.zoom})`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Cake Base/Plate */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 shadow-2xl"
                      style={{
                        width: getTierWidth(0) + 60,
                        height: 20,
                        transform: "translateZ(-10px)",
                      }}
                    />

                    {/* Cake Tiers */}
                    {Array.from({ length: config.tiers })
                      .reverse()
                      .map((_, index) => {
                        const tierIndex = config.tiers - 1 - index;
                        const height = getTierHeight(tierIndex);
                        const width = getTierWidth(tierIndex);
                        const color = config.colors[tierIndex] || "#FFFFFF";
                        const bottom = Array.from({ length: tierIndex })
                          .reduce((sum, _, i) => sum + getTierHeight(i), 0);

                        return (
                          <div
                            key={tierIndex}
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{
                              bottom,
                              width,
                              height,
                              transformStyle: "preserve-3d",
                            }}
                          >
                            {/* Front Face */}
                            <div
                              className="absolute inset-0 rounded-lg shadow-lg border-2 border-white/50"
                              style={{
                                backgroundColor: color,
                                transform: `translateZ(${width / 2}px)`,
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(0,0,0,0.1))",
                              }}
                            >
                              {/* Decorations */}
                              {config.decorations.includes("flowers") && (
                                <div className="absolute inset-x-0 top-2 flex justify-around">
                                  {[...Array(3)].map((_, i) => (
                                    <Flower2
                                      key={i}
                                      className="h-4 w-4 text-pink-400"
                                    />
                                  ))}
                                </div>
                              )}
                              {config.decorations.includes("hearts") && (
                                <div className="absolute inset-x-0 bottom-2 flex justify-around">
                                  {[...Array(3)].map((_, i) => (
                                    <Heart
                                      key={i}
                                      className="h-3 w-3 text-red-400 fill-red-400"
                                    />
                                  ))}
                                </div>
                              )}
                              {config.decorations.includes("stars") &&
                                tierIndex === 0 && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                                  </div>
                                )}
                              {config.decorations.includes("sprinkles") && (
                                <div className="absolute inset-0">
                                  {[...Array(20)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="absolute w-1 h-2 rounded-full"
                                      style={{
                                        backgroundColor: [
                                          "#FF69B4",
                                          "#87CEEB",
                                          "#FFD700",
                                          "#98FF98",
                                        ][i % 4],
                                        left: `${(i * 17) % 90}%`,
                                        top: `${(i * 23) % 90}%`,
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Back Face */}
                            <div
                              className="absolute inset-0 rounded-lg shadow-lg border-2 border-white/50"
                              style={{
                                backgroundColor: color,
                                transform: `translateZ(-${width / 2}px) rotateY(180deg)`,
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(0,0,0,0.15))",
                              }}
                            />

                            {/* Left Face */}
                            <div
                              className="absolute inset-y-0 left-0 shadow-lg border-2 border-white/50"
                              style={{
                                width: width,
                                backgroundColor: color,
                                transform: `rotateY(-90deg) translateZ(${width / 2}px)`,
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.2))",
                              }}
                            />

                            {/* Right Face */}
                            <div
                              className="absolute inset-y-0 right-0 shadow-lg border-2 border-white/50"
                              style={{
                                width: width,
                                backgroundColor: color,
                                transform: `rotateY(90deg) translateZ(${width / 2}px)`,
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.2))",
                              }}
                            />

                            {/* Top Face */}
                            <div
                              className="absolute inset-x-0 top-0 rounded-lg shadow-inner border-2 border-white/30"
                              style={{
                                height: width,
                                backgroundColor: color,
                                transform: `rotateX(90deg) translateZ(0px)`,
                                backgroundImage:
                                  "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(0,0,0,0.1))",
                              }}
                            />

                            {/* Ribbon */}
                            {config.decorations.includes("ribbon") && (
                              <div
                                className="absolute left-0 right-0 h-6 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 shadow-lg"
                                style={{
                                  top: "50%",
                                  transform: `translateZ(${width / 2 + 1}px)`,
                                }}
                              />
                            )}
                          </div>
                        );
                      })}

                    {/* Cake Text */}
                    {config.text && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 font-bold text-primary text-center px-4 py-2 bg-white/80 rounded-lg shadow-lg"
                        style={{
                          bottom: getTierHeight(0) / 2,
                          transform: `translateZ(${getTierWidth(0) / 2 + 10}px) translateX(-50%)`,
                          fontSize: "clamp(12px, 1.5vw, 18px)",
                        }}
                      >
                        {config.text}
                      </div>
                    )}

                    {/* Cake Topper */}
                    {config.topper && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
                        style={{
                          bottom:
                            Array.from({ length: config.tiers }).reduce(
                              (sum, _, i) => sum + getTierHeight(i),
                              0
                            ) + 10,
                          transform: "translateZ(0px) translateX(-50%)",
                        }}
                      >
                        {config.topper === "heart" && (
                          <Heart className="h-8 w-8 text-red-500 fill-red-500 drop-shadow-lg" />
                        )}
                        {config.topper === "star" && (
                          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                        )}
                        {config.topper === "flower" && (
                          <Flower2 className="h-8 w-8 text-pink-500 drop-shadow-lg" />
                        )}
                        {config.topper === "sparkle" && (
                          <Sparkles className="h-8 w-8 text-purple-500 drop-shadow-lg" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Presets */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Quick Presets</Label>
                <div className="grid grid-cols-1 gap-2">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                      className="w-full"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tiers */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Cake Tiers</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={config.tiers === num ? "default" : "outline"}
                      onClick={() => updateTiers(num)}
                      className="flex-1"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Tier Colors</Label>
                {Array.from({ length: config.tiers }).map((_, tierIndex) => (
                  <div key={tierIndex} className="space-y-2">
                    <Label className="text-sm">Tier {tierIndex + 1}</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLORS.map((colorOption) => (
                        <button
                          key={colorOption.value}
                          onClick={() =>
                            updateTierColor(tierIndex, colorOption.value)
                          }
                          className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                          style={{
                            backgroundColor: colorOption.value,
                            borderColor:
                              config.colors[tierIndex] === colorOption.value
                                ? "#e11d48"
                                : "#d1d5db",
                            borderWidth:
                              config.colors[tierIndex] === colorOption.value
                                ? "3px"
                                : "2px",
                          }}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Decorations */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Decorations</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DECORATIONS.map((deco) => (
                    <Button
                      key={deco.value}
                      variant={
                        config.decorations.includes(deco.value)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleDecoration(deco.value)}
                      className="w-full"
                    >
                      <deco.icon className="h-4 w-4 mr-2" />
                      {deco.name}
                    </Button>
                  ))}
                  <Button
                    variant={
                      config.decorations.includes("ribbon")
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleDecoration("ribbon")}
                    className="w-full"
                  >
                    Ribbon
                  </Button>
                  <Button
                    variant={
                      config.decorations.includes("pearls")
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleDecoration("pearls")}
                    className="w-full"
                  >
                    Pearls
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cake Topper */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Cake Topper</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Heart, value: "heart" },
                    { icon: Star, value: "star" },
                    { icon: Flower2, value: "flower" },
                    { icon: Sparkles, value: "sparkle" },
                  ].map((topper) => (
                    <Button
                      key={topper.value}
                      variant={
                        config.topper === topper.value ? "default" : "outline"
                      }
                      onClick={() => updateConfig({ topper: topper.value })}
                      className="aspect-square p-0"
                    >
                      <topper.icon className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Text */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Custom Text</Label>
                <Input
                  placeholder="Happy Birthday!"
                  value={config.text}
                  onChange={(e) => updateConfig({ text: e.target.value })}
                  maxLength={30}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/custom-order">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order This Design
                </Link>
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Download className="h-5 w-5 mr-2" />
                Save Design
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
