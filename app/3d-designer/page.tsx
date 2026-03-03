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
  Circle,
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
  frostingType: string;
  texture: string;
  pipingPattern: string;
  dripEffect: boolean;
  dripColor: string;
  colorTechnique: string;
  style: string;
  metallic: boolean;
  glitter: boolean;
}

const PRESETS = [
  {
    name: "Classic Wedding",
    config: {
      tiers: 3,
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      decorations: ["flowers", "pearls"],
      topper: "heart",
      text: "",
      frostingType: "fondant",
      texture: "smooth",
      pipingPattern: "pearls",
      colorTechnique: "solid",
      style: "traditional",
      metallic: true,
      glitter: false,
      dripEffect: false,
      dripColor: "#FFD700",
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
      frostingType: "buttercream",
      texture: "textured",
      pipingPattern: "rosettes",
      colorTechnique: "ombre",
      style: "fun",
      metallic: false,
      glitter: true,
      dripEffect: true,
      dripColor: "#FFD700",
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
      frostingType: "buttercream",
      texture: "smooth",
      pipingPattern: "shells",
      colorTechnique: "ombre",
      style: "elegant",
      metallic: true,
      glitter: false,
      dripEffect: false,
      dripColor: "#FFD700",
    },
  },
  {
    name: "Naked Rustic",
    config: {
      tiers: 3,
      colors: ["#F5DEB3", "#DEB887", "#D2B48C"],
      decorations: ["flowers", "berries"],
      topper: "flower",
      text: "",
      frostingType: "buttercream",
      texture: "rustic",
      pipingPattern: "none",
      colorTechnique: "solid",
      style: "naked",
      metallic: false,
      glitter: false,
      dripEffect: true,
      dripColor: "#8B4513",
    },
  },
];

const COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Blush", value: "#FFB6C1" },
  { name: "Rose", value: "#FF69B4" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Mint", value: "#98FF98" },
  { name: "Sky Blue", value: "#87CEEB" },
  { name: "Peach", value: "#FFDAB9" },
  { name: "Champagne", value: "#F7E7CE" },
  { name: "Sage", value: "#9CAF88" },
  { name: "Dusty Rose", value: "#DCAE96" },
  { name: "Navy", value: "#191970" },
  { name: "Burgundy", value: "#800020" },
  { name: "Gold", value: "#FFD700" },
  { name: "Silver", value: "#C0C0C0" },
  { name: "Chocolate", value: "#8B4513" },
];

const DECORATIONS = [
  { name: "Sugar Flowers", icon: Flower2, value: "flowers" },
  { name: "Fresh Berries", icon: Circle, value: "berries" },
  { name: "Macarons", icon: Circle, value: "macarons" },
  { name: "Hearts", icon: Heart, value: "hearts" },
  { name: "Stars", icon: Star, value: "stars" },
  { name: "Sprinkles", icon: Sparkles, value: "sprinkles" },
  { name: "Edible Pearls", icon: Circle, value: "pearls" },
  { name: "Gold Leaf", icon: Sparkles, value: "goldleaf" },
];

const FROSTING_TYPES = [
  { name: "Buttercream", value: "buttercream" },
  { name: "Fondant", value: "fondant" },
  { name: "Ganache", value: "ganache" },
  { name: "Whipped Cream", value: "whipped" },
];

const TEXTURES = [
  { name: "Mirror Smooth", value: "smooth" },
  { name: "Rustic", value: "rustic" },
  { name: "Textured", value: "textured" },
  { name: "Basketweave", value: "basketweave" },
  { name: "Quilted", value: "quilted" },
  { name: "Ruffled", value: "ruffled" },
  { name: "Combed", value: "combed" },
  { name: "Petal", value: "petal" },
];

const PIPING_PATTERNS = [
  { name: "None", value: "none" },
  { name: "Rosettes", value: "rosettes" },
  { name: "Shells", value: "shells" },
  { name: "Pearls", value: "pearls" },
  { name: "Dots", value: "dots" },
  { name: "Lace", value: "lace" },
  { name: "Rope Border", value: "rope" },
  { name: "Ruffles", value: "ruffles" },
];

const COLOR_TECHNIQUES = [
  { name: "Solid Color", value: "solid" },
  { name: "Ombré Fade", value: "ombre" },
  { name: "Watercolor", value: "watercolor" },
  { name: "Marble", value: "marble" },
  { name: "Two-Tone", value: "twotone" },
  { name: "Gradient", value: "gradient" },
];

const STYLES = [
  { name: "Traditional", value: "traditional" },
  { name: "Naked", value: "naked" },
  { name: "Semi-Naked", value: "seminaked" },
  { name: "Fault Line", value: "faultline" },
  { name: "Modern Minimal", value: "minimal" },
  { name: "Elegant", value: "elegant" },
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
    frostingType: "buttercream",
    texture: "smooth",
    pipingPattern: "shells",
    dripEffect: false,
    dripColor: "#8B4513",
    colorTechnique: "solid",
    style: "traditional",
    metallic: false,
    glitter: false,
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

  const getTextureStyle = (texture: string, color: string) => {
    const baseGradient = `linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(0,0,0,0.1))`;

    switch (texture) {
      case "smooth":
        return baseGradient;
      case "rustic":
        return `${baseGradient}, repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)`;
      case "textured":
        return `${baseGradient}, repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)`;
      case "basketweave":
        return `${baseGradient}, repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 10px, transparent 10px, transparent 20px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 10px, transparent 10px, transparent 20px)`;
      case "quilted":
        return `${baseGradient}, repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 21px)`;
      case "ruffled":
        return `${baseGradient}, repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)`;
      case "combed":
        return `${baseGradient}, repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)`;
      case "petal":
        return `${baseGradient}, radial-gradient(ellipse at top, rgba(255,255,255,0.4), transparent)`;
      default:
        return baseGradient;
    }
  };

  const getColorEffect = (baseColor: string, technique: string, tierIndex: number, totalTiers: number) => {
    if (technique === "ombre") {
      // Lighten color based on tier position
      const lightness = 100 - (tierIndex / totalTiers) * 30;
      return baseColor;
    }
    return baseColor;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">3D Cake Designer</h1>
          <div className="w-16" />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sticky 3D Cake Viewer */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-6">
              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  {/* Viewer Controls */}
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-b p-3 flex items-center justify-between">
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground hidden md:block">
                        Drag to rotate • Zoom to scale
                      </p>
                      <div className="flex gap-1">
                        {config.metallic && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Gold Accents
                          </span>
                        )}
                        {config.glitter && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Glitter
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3D Canvas */}
                  <div
                    className="relative h-[600px] bg-gradient-to-b from-gray-50 via-white to-gray-100 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
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

                      {/* Drip Effect Base */}
                      {config.dripEffect && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                          {Array.from({ length: 8 }).map((_, i) => {
                            const angle = (i / 8) * 360;
                            const radius = getTierWidth(0) / 2;
                            const x = Math.cos((angle * Math.PI) / 180) * radius;
                            const z = Math.sin((angle * Math.PI) / 180) * radius;
                            const dripLength = 30 + Math.random() * 20;

                            return (
                              <div
                                key={i}
                                className="absolute rounded-full shadow-lg"
                                style={{
                                  width: 8 + Math.random() * 6,
                                  height: dripLength,
                                  backgroundColor: config.dripColor,
                                  left: x,
                                  transform: `translateZ(${z}px) translateY(-${dripLength}px)`,
                                  transformOrigin: "top center",
                                }}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Cake Tiers */}
                      {Array.from({ length: config.tiers })
                        .reverse()
                        .map((_, index) => {
                          const tierIndex = config.tiers - 1 - index;
                          const height = getTierHeight(tierIndex);
                          const width = getTierWidth(tierIndex);
                          const color = getColorEffect(
                            config.colors[tierIndex] || "#FFFFFF",
                            config.colorTechnique,
                            tierIndex,
                            config.tiers
                          );
                          const bottom = Array.from({ length: tierIndex }).reduce(
                            (sum: number, _, i) => sum + getTierHeight(i),
                            0
                          );

                          const isNaked = config.style === "naked" || config.style === "seminaked";
                          const opacity = config.style === "seminaked" ? 0.7 : 1;

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
                              {/* Fault Line Effect */}
                              {config.style === "faultline" && tierIndex === 1 && (
                                <div
                                  className="absolute left-0 right-0 h-8 z-10"
                                  style={{
                                    top: "40%",
                                    transform: `translateZ(${width / 2 + 1}px)`,
                                  }}
                                >
                                  <div className="h-full bg-gradient-to-r from-pink-400 via-yellow-400 to-pink-400 flex items-center justify-center gap-1">
                                    {config.decorations.includes("sprinkles") &&
                                      Array.from({ length: 15 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className="w-1 h-1 rounded-full"
                                          style={{
                                            backgroundColor: ["#FF69B4", "#FFD700", "#87CEEB"][i % 3],
                                          }}
                                        />
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Front Face */}
                              <div
                                className="absolute inset-0 rounded-lg shadow-lg border-2 border-white/50"
                                style={{
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `translateZ(${width / 2}px)`,
                                  backgroundImage: getTextureStyle(config.texture, color),
                                }}
                              >
                                {/* Metallic Accents */}
                                {config.metallic && (
                                  <div
                                    className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, transparent 0%, rgba(255,215,0,0.6) 50%, transparent 100%)",
                                    }}
                                  />
                                )}

                                {/* Glitter Effect */}
                                {config.glitter && (
                                  <div className="absolute inset-0">
                                    {Array.from({ length: 30 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                                        style={{
                                          left: `${(i * 17) % 95}%`,
                                          top: `${(i * 23) % 95}%`,
                                          boxShadow: "0 0 3px rgba(255,255,255,0.8)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}

                                {/* Piping Patterns */}
                                {config.pipingPattern === "rosettes" && (
                                  <div className="absolute inset-x-0 top-2 flex justify-around px-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-4 h-4 rounded-full border-2"
                                        style={{
                                          borderColor: color === "#FFFFFF" ? "#FFB6C1" : "#FFFFFF",
                                          background: `radial-gradient(circle, ${color === "#FFFFFF" ? "#FFB6C1" : "#FFFFFF"}, transparent)`,
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.pipingPattern === "shells" && (
                                  <div className="absolute inset-x-0 bottom-1 flex">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="flex-1 h-2 border-t-2 rounded-t-full"
                                        style={{
                                          borderColor: color === "#FFFFFF" ? "#FFB6C1" : "#FFFFFF",
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.pipingPattern === "pearls" && (
                                  <div className="absolute inset-x-0 bottom-2 flex justify-around px-2">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-white shadow-sm"
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.pipingPattern === "dots" && (
                                  <div className="absolute inset-0 p-2">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="absolute w-1.5 h-1.5 rounded-full"
                                        style={{
                                          backgroundColor: color === "#FFFFFF" ? "#FFB6C1" : "#FFFFFF",
                                          left: `${(i * 19) % 85 + 5}%`,
                                          top: `${(i * 31) % 85 + 5}%`,
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.pipingPattern === "lace" && (
                                  <div className="absolute inset-0 opacity-60">
                                    <svg className="w-full h-full" style={{ fill: "none", stroke: color === "#FFFFFF" ? "#FFB6C1" : "#FFFFFF", strokeWidth: 0.5 }}>
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <path
                                          key={i}
                                          d={`M ${i * 20} 10 Q ${i * 20 + 10} 5, ${i * 20 + 20} 10 Q ${i * 20 + 30} 15, ${i * 20 + 40} 10`}
                                        />
                                      ))}
                                    </svg>
                                  </div>
                                )}

                                {/* Decorations */}
                                {config.decorations.includes("flowers") && (
                                  <div className="absolute inset-x-0 top-2 flex justify-around px-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <Flower2
                                        key={i}
                                        className="h-5 w-5 text-pink-400 drop-shadow-md"
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.decorations.includes("berries") && (
                                  <div className="absolute inset-x-0 top-3 flex justify-around px-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-3 h-3 rounded-full bg-red-500 shadow-md"
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.decorations.includes("macarons") && tierIndex === 0 && (
                                  <div className="absolute inset-x-0 top-2 flex justify-around px-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-4 h-4 rounded-full shadow-lg"
                                        style={{
                                          backgroundColor: ["#FFB6C1", "#87CEEB", "#E6E6FA"][i],
                                          border: "2px solid rgba(255,255,255,0.5)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.decorations.includes("hearts") && (
                                  <div className="absolute inset-x-0 bottom-3 flex justify-around px-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <Heart
                                        key={i}
                                        className="h-3 w-3 text-red-400 fill-red-400"
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.decorations.includes("stars") && tierIndex === 0 && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                                  </div>
                                )}

                                {config.decorations.includes("sprinkles") && (
                                  <div className="absolute inset-0">
                                    {Array.from({ length: 30 }).map((_, i) => (
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

                                {config.decorations.includes("pearls") && (
                                  <div className="absolute inset-x-0 bottom-2 flex justify-around px-2">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-white shadow-md"
                                      />
                                    ))}
                                  </div>
                                )}

                                {config.decorations.includes("goldleaf") && (
                                  <div className="absolute inset-0 pointer-events-none">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="absolute opacity-70"
                                        style={{
                                          width: 15 + Math.random() * 10,
                                          height: 15 + Math.random() * 10,
                                          backgroundColor: "#FFD700",
                                          left: `${(i * 23) % 80 + 10}%`,
                                          top: `${(i * 37) % 70 + 15}%`,
                                          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                                          filter: "blur(0.5px)",
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
                                  opacity: isNaked ? opacity : 1,
                                  transform: `translateZ(-${width / 2}px) rotateY(180deg)`,
                                  backgroundImage: getTextureStyle(config.texture, color),
                                }}
                              />

                              {/* Left Face */}
                              <div
                                className="absolute inset-y-0 left-0 shadow-lg border-2 border-white/50"
                                style={{
                                  width: width,
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `rotateY(-90deg) translateZ(${width / 2}px)`,
                                  backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.2))`,
                                }}
                              />

                              {/* Right Face */}
                              <div
                                className="absolute inset-y-0 right-0 shadow-lg border-2 border-white/50"
                                style={{
                                  width: width,
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `rotateY(90deg) translateZ(${width / 2}px)`,
                                  backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.2))`,
                                }}
                              />

                              {/* Top Face */}
                              <div
                                className="absolute inset-x-0 top-0 rounded-lg shadow-inner border-2 border-white/30"
                                style={{
                                  height: width,
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `rotateX(90deg) translateZ(0px)`,
                                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.4), rgba(0,0,0,0.1))`,
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
                          className="absolute left-1/2 -translate-x-1/2 font-bold text-primary text-center px-4 py-2 bg-white/90 rounded-lg shadow-lg backdrop-blur-sm"
                          style={{
                            bottom: getTierHeight(0) / 2,
                            transform: `translateZ(${getTierWidth(0) / 2 + 10}px) translateX(-50%)`,
                            fontSize: "clamp(14px, 1.8vw, 20px)",
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
                                (sum: number, _, i) => sum + getTierHeight(i),
                                0
                              ) + 10,
                            transform: "translateZ(0px) translateX(-50%)",
                          }}
                        >
                          {config.topper === "heart" && (
                            <Heart className="h-10 w-10 text-red-500 fill-red-500 drop-shadow-lg" />
                          )}
                          {config.topper === "star" && (
                            <Star className="h-10 w-10 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                          )}
                          {config.topper === "flower" && (
                            <Flower2 className="h-10 w-10 text-pink-500 drop-shadow-lg" />
                          )}
                          {config.topper === "sparkle" && (
                            <Sparkles className="h-10 w-10 text-purple-500 drop-shadow-lg" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                      <p className="text-sm font-medium text-gray-700">
                        {config.tiers} Tier • {FROSTING_TYPES.find(f => f.value === config.frostingType)?.name} • {TEXTURES.find(t => t.value === config.texture)?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {COLOR_TECHNIQUES.find(c => c.value === config.colorTechnique)?.name} • {STYLES.find(s => s.value === config.style)?.name}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - Below Viewer */}
                  <div className="bg-gray-50 border-t p-4 flex gap-2">
                    <Button className="flex-1" size="lg" asChild>
                      <Link href="/custom-order">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Order This Design
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg">
                      <Download className="h-5 w-5 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Scrollable Controls Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Presets */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Presets
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                      className="w-full text-sm"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cake Structure */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Cake Structure</Label>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Number of Tiers</Label>
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
                </div>
              </CardContent>
            </Card>

            {/* Frosting & Texture */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <Label className="text-lg font-semibold">Frosting & Texture</Label>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Frosting Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FROSTING_TYPES.map((type) => (
                      <Button
                        key={type.value}
                        variant={config.frostingType === type.value ? "default" : "outline"}
                        onClick={() => updateConfig({ frostingType: type.value })}
                        size="sm"
                      >
                        {type.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Texture Finish</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEXTURES.map((texture) => (
                      <Button
                        key={texture.value}
                        variant={config.texture === texture.value ? "default" : "outline"}
                        onClick={() => updateConfig({ texture: texture.value })}
                        size="sm"
                        className="text-xs"
                      >
                        {texture.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Colors & Effects</Label>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Color Technique</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_TECHNIQUES.map((technique) => (
                      <Button
                        key={technique.value}
                        variant={config.colorTechnique === technique.value ? "default" : "outline"}
                        onClick={() => updateConfig({ colorTechnique: technique.value })}
                        size="sm"
                        className="text-xs"
                      >
                        {technique.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {Array.from({ length: config.tiers }).map((_, tierIndex) => (
                  <div key={tierIndex}>
                    <Label className="text-sm mb-2 block">Tier {tierIndex + 1}</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLORS.map((colorOption) => (
                        <button
                          key={colorOption.value}
                          onClick={() => updateTierColor(tierIndex, colorOption.value)}
                          className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                          style={{
                            backgroundColor: colorOption.value,
                            borderColor:
                              config.colors[tierIndex] === colorOption.value
                                ? "#e11d48"
                                : "#d1d5db",
                            borderWidth:
                              config.colors[tierIndex] === colorOption.value ? "3px" : "2px",
                          }}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.metallic}
                      onChange={(e) => updateConfig({ metallic: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Gold Accents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.glitter}
                      onChange={(e) => updateConfig({ glitter: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Edible Glitter</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Piping & Borders */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Piping & Borders</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PIPING_PATTERNS.map((pattern) => (
                    <Button
                      key={pattern.value}
                      variant={config.pipingPattern === pattern.value ? "default" : "outline"}
                      onClick={() => updateConfig({ pipingPattern: pattern.value })}
                      size="sm"
                      className="text-xs"
                    >
                      {pattern.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Decorations */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Decorative Elements</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DECORATIONS.map((deco) => (
                    <Button
                      key={deco.value}
                      variant={
                        config.decorations.includes(deco.value) ? "default" : "outline"
                      }
                      onClick={() => toggleDecoration(deco.value)}
                      size="sm"
                      className="text-xs"
                    >
                      <deco.icon className="h-3 w-3 mr-1" />
                      {deco.name}
                    </Button>
                  ))}
                  <Button
                    variant={
                      config.decorations.includes("ribbon") ? "default" : "outline"
                    }
                    onClick={() => toggleDecoration("ribbon")}
                    size="sm"
                    className="text-xs"
                  >
                    Ribbon
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Drip Effect */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Drip Effect</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.dripEffect}
                    onChange={(e) => updateConfig({ dripEffect: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Add Ganache Drip</span>
                </label>
                {config.dripEffect && (
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Drip Color</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { name: "Chocolate", value: "#8B4513" },
                        { name: "Caramel", value: "#D2691E" },
                        { name: "White", value: "#FFFFFF" },
                        { name: "Pink", value: "#FFB6C1" },
                        { name: "Gold", value: "#FFD700" },
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateConfig({ dripColor: color.value })}
                          className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                          style={{
                            backgroundColor: color.value,
                            borderColor: config.dripColor === color.value ? "#e11d48" : "#d1d5db",
                            borderWidth: config.dripColor === color.value ? "3px" : "2px",
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cake Style */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Cake Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((style) => (
                    <Button
                      key={style.value}
                      variant={config.style === style.value ? "default" : "outline"}
                      onClick={() => updateConfig({ style: style.value })}
                      size="sm"
                      className="text-xs"
                    >
                      {style.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cake Topper */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Cake Topper</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Heart, value: "heart", name: "Heart" },
                    { icon: Star, value: "star", name: "Star" },
                    { icon: Flower2, value: "flower", name: "Flower" },
                    { icon: Sparkles, value: "sparkle", name: "Sparkle" },
                  ].map((topper) => (
                    <Button
                      key={topper.value}
                      variant={config.topper === topper.value ? "default" : "outline"}
                      onClick={() => updateConfig({ topper: topper.value })}
                      className="aspect-square p-0 flex flex-col items-center justify-center gap-1"
                      title={topper.name}
                    >
                      <topper.icon className="h-5 w-5" />
                      <span className="text-xs">{topper.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Text */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Custom Message</Label>
                <Input
                  placeholder="Happy Birthday! or Congratulations!"
                  value={config.text}
                  onChange={(e) => updateConfig({ text: e.target.value })}
                  maxLength={40}
                />
                <p className="text-xs text-muted-foreground">
                  {config.text.length}/40 characters
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
