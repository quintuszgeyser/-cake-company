"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Heart,
  Star,
  Flower2,
  Download,
  ShoppingCart,
  Circle,
  Check,
} from "lucide-react";

interface CakeConfig {
  tiers: number;
  shapes: string[];
  colors: string[];
  decorations: string[];
  text: string;
  topper: string;
  rotation: number;
  frostingType: string;
  texture: string;
  pipingPattern: string;
  dripEffect: boolean;
  dripColor: string;
  style: string;
  selectedTier: number | null;
}

const PRESETS = [
  {
    name: "Classic Wedding",
    config: {
      tiers: 3,
      shapes: ["round", "round", "round"],
      colors: ["#FFFEF9", "#FFFEF9", "#FFFEF9"],
      decorations: ["roses", "pearls"],
      topper: "heart",
      text: "",
      frostingType: "fondant",
      texture: "smooth",
      pipingPattern: "pearls",
      style: "traditional",
      dripEffect: false,
      dripColor: "#FFD700",
    },
  },
  {
    name: "Birthday Fun",
    config: {
      tiers: 2,
      shapes: ["round", "round"],
      colors: ["#FFB5D8", "#FDE4ED"],
      decorations: ["sprinkles", "buttercream-flowers"],
      topper: "star",
      text: "Happy Birthday!",
      frostingType: "buttercream",
      texture: "smooth",
      pipingPattern: "rosettes",
      style: "fun",
      dripEffect: true,
      dripColor: "#FF69B4",
    },
  },
  {
    name: "Elegant Blush",
    config: {
      tiers: 4,
      shapes: ["round", "round", "round", "round"],
      colors: ["#FFF5F7", "#FFE8ED", "#FFD6E0", "#FFFEF9"],
      decorations: ["roses", "gold-leaf"],
      topper: "flower",
      text: "",
      frostingType: "buttercream",
      texture: "smooth",
      pipingPattern: "none",
      style: "elegant",
      dripEffect: false,
      dripColor: "#8B4513",
    },
  },
];

const COLORS = [
  { name: "Ivory White", value: "#FFFEF9" },
  { name: "Soft Pink", value: "#FFE8ED" },
  { name: "Rose", value: "#FFB5D8" },
  { name: "Lavender", value: "#E8DEFF" },
  { name: "Mint", value: "#D4F4DD" },
  { name: "Baby Blue", value: "#D6E9FF" },
  { name: "Peach", value: "#FFE5D0" },
  { name: "Champagne", value: "#F5EFE0" },
  { name: "Sage", value: "#D8E5D0" },
  { name: "Lilac", value: "#EDE5FF" },
  { name: "Chocolate", value: "#8B6F4E" },
  { name: "Red Velvet", value: "#8B3A3A" },
];

const SHAPES = [
  { name: "Round", value: "round" },
  { name: "Square", value: "square" },
];

const DECORATIONS = [
  { name: "Roses", value: "roses" },
  { name: "Buttercream Flowers", value: "buttercream-flowers" },
  { name: "Fresh Berries", value: "berries" },
  { name: "Macarons", value: "macarons" },
  { name: "Sprinkles", value: "sprinkles" },
  { name: "Pearl Border", value: "pearls" },
  { name: "Gold Leaf", value: "gold-leaf" },
  { name: "Fresh Flowers", value: "fresh-flowers" },
];

const FROSTING_TYPES = [
  { name: "Buttercream", value: "buttercream" },
  { name: "Fondant", value: "fondant" },
  { name: "Naked", value: "naked" },
];

const PIPING_PATTERNS = [
  { name: "None", value: "none" },
  { name: "Rosettes", value: "rosettes" },
  { name: "Shell Border", value: "shells" },
  { name: "Pearl Dots", value: "pearls" },
  { name: "Ruffles", value: "ruffles" },
];

export default function ThreeDDesignerPage() {
  const [config, setConfig] = useState<CakeConfig>({
    tiers: 3,
    shapes: ["round", "round", "round"],
    colors: ["#FFFEF9", "#FFFEF9", "#FFFEF9"],
    decorations: ["roses"],
    text: "",
    topper: "flower",
    rotation: 15,
    frostingType: "buttercream",
    texture: "smooth",
    pipingPattern: "shells",
    dripEffect: false,
    dripColor: "#8B4513",
    style: "traditional",
    selectedTier: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const updateConfig = (updates: Partial<CakeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateTiers = (newTiers: number) => {
    const newColors = Array(newTiers)
      .fill("#FFFEF9")
      .map((_, i) => config.colors[i] || "#FFFEF9");
    const newShapes = Array(newTiers)
      .fill("round")
      .map((_, i) => config.shapes[i] || "round");
    updateConfig({ tiers: newTiers, colors: newColors, shapes: newShapes, selectedTier: null });
  };

  const updateTierColor = (tierIndex: number, color: string) => {
    const newColors = [...config.colors];
    newColors[tierIndex] = color;
    updateConfig({ colors: newColors });
  };

  const updateTierShape = (tierIndex: number, shape: string) => {
    const newShapes = [...config.shapes];
    newShapes[tierIndex] = shape;
    updateConfig({ shapes: newShapes });
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
      selectedTier: null,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const delta = e.clientX - startX;
      updateConfig({ rotation: config.rotation + delta * 0.3 });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTierSize = (tierIndex: number, shape: string) => {
    const sizes = [
      { round: 240, square: 220 },
      { round: 190, square: 175 },
      { round: 150, square: 140 },
      { round: 120, square: 110 },
      { round: 95, square: 88 },
    ];
    return shape === "square" ? sizes[tierIndex].square : sizes[tierIndex].round;
  };

  const getTierHeight = (tierIndex: number) => {
    const heights = [90, 85, 80, 75, 70];
    return heights[tierIndex] || 70;
  };

  const handleTierClick = (tierIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    updateConfig({ selectedTier: tierIndex });
  };

  const renderCakeTier = (tierIndex: number) => {
    const shape = config.shapes[tierIndex] || "round";
    const color = config.colors[tierIndex] || "#FFFEF9";
    const size = getTierSize(tierIndex, shape);
    const height = getTierHeight(tierIndex);
    const isSelected = config.selectedTier === tierIndex;
    const isRound = shape === "round";

    const bottomPosition = Array.from({ length: tierIndex }).reduce(
      (sum: number, _, i) => sum + getTierHeight(i),
      0
    );

    return (
      <div
        key={tierIndex}
        className={`absolute left-1/2 -translate-x-1/2 cursor-pointer transition-all ${
          isSelected ? "ring-4 ring-primary ring-offset-2" : ""
        }`}
        style={{
          bottom: bottomPosition,
          width: size,
          height: height,
          transformStyle: "preserve-3d",
        }}
        onClick={(e) => handleTierClick(tierIndex, e)}
      >
        {/* Main Cake Body - Front */}
        <div
          className={`absolute inset-0 ${isRound ? "rounded-full" : "rounded-lg"}`}
          style={{
            transform: `translateZ(${size / 2}px)`,
            background: config.frostingType === "naked"
              ? `linear-gradient(to bottom, ${color}dd, ${color}bb, #8B6F4E33)`
              : `linear-gradient(to bottom, ${color}, ${color}f0, ${color}e8)`,
            boxShadow: `
              0 4px 20px rgba(0,0,0,0.15),
              inset 0 2px 4px rgba(255,255,255,0.4),
              inset 0 -3px 8px rgba(0,0,0,0.08)
            `,
            border: config.frostingType === "fondant" ? "none" : "1px solid rgba(0,0,0,0.03)",
          }}
        >
          {/* Realistic Frosting Texture */}
          {config.frostingType === "buttercream" && (
            <div className="absolute inset-0 opacity-30" style={{
              background: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)",
            }} />
          )}

          {/* Decorations */}
          {config.decorations.includes("roses") && tierIndex <= 1 && (
            <div className="absolute inset-0 flex items-center justify-around px-6">
              {Array.from({ length: tierIndex === 0 ? 5 : 4 }).map((_, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 30% 30%, #FFB5D8, #FF69B4, #E91E63)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  <div
                    className="absolute inset-1 rounded-full opacity-40"
                    style={{ background: "radial-gradient(circle at 60% 60%, transparent 40%, #fff)" }}
                  />
                </div>
              ))}
            </div>
          )}

          {config.decorations.includes("buttercream-flowers") && tierIndex === 0 && (
            <div className="absolute inset-0 flex items-center justify-around px-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{
                    width: 16,
                    height: 16,
                  }}
                >
                  {/* Petals */}
                  {Array.from({ length: 5 }).map((_, p) => (
                    <div
                      key={p}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50% 50% 0 0",
                        background: `linear-gradient(to bottom, ${color === "#FFFEF9" ? "#FFB5D8" : "#FFFEF9"}, ${color === "#FFFEF9" ? "#FF69B4" : "#FFE8ED"})`,
                        transform: `translate(-50%, -50%) rotate(${p * 72}deg) translateY(-3px)`,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    />
                  ))}
                  {/* Center */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#FFD700",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {config.decorations.includes("berries") && tierIndex === 0 && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: i % 3 === 0
                      ? "radial-gradient(circle at 30% 30%, #FF6B6B, #DC143C, #8B0000)"
                      : i % 3 === 1
                      ? "radial-gradient(circle at 30% 30%, #6B88FF, #4169E1, #00008B)"
                      : "radial-gradient(circle at 30% 30%, #FF1493, #C71585, #8B008B)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          )}

          {config.decorations.includes("macarons") && tierIndex === 0 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: ["linear-gradient(to bottom, #FFB5D8, #FF69B4)", "linear-gradient(to bottom, #D6E9FF, #87CEEB)", "linear-gradient(to bottom, #E8DEFF, #DA70D6)"][i],
                    boxShadow: "0 3px 6px rgba(0,0,0,0.2), inset 0 -2px 3px rgba(0,0,0,0.15), inset 0 2px 2px rgba(255,255,255,0.4)",
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          )}

          {config.decorations.includes("sprinkles") && (
            <div className="absolute inset-0">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: 2,
                    height: 6,
                    borderRadius: 2,
                    background: ["#FF69B4", "#FFD700", "#87CEEB", "#98FF98", "#E6E6FA"][i % 5],
                    left: `${(i * 13) % 95}%`,
                    top: `${(i * 17) % 90}%`,
                    transform: `rotate(${(i * 37) % 360}deg)`,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          )}

          {config.decorations.includes("fresh-flowers") && tierIndex === 0 && (
            <div className="absolute top-2 right-4 flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Flower2
                  key={i}
                  className="drop-shadow-md"
                  style={{
                    width: 22,
                    height: 22,
                    color: ["#FF69B4", "#FFFEF9", "#E8DEFF"][i],
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                />
              ))}
            </div>
          )}

          {config.decorations.includes("gold-leaf") && (
            <div className="absolute inset-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: 15 + Math.random() * 8,
                    height: 15 + Math.random() * 8,
                    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
                    left: `${20 + (i * 25)}%`,
                    top: `${30 + (i % 2) * 30}%`,
                    transform: `rotate(${(i * 47) % 360}deg)`,
                    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                    opacity: 0.8,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Piping Patterns */}
          {config.pipingPattern === "rosettes" && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {Array.from({ length: Math.floor(size / 25) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${color === "#FFFEF9" ? "#FFB5D8" : "#FFFEF9"}, ${color === "#FFFEF9" ? "#FF69B4" : "#FFE8ED"})`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          )}

          {config.pipingPattern === "shells" && (
            <div className="absolute bottom-1 inset-x-0 flex justify-around px-2">
              {Array.from({ length: Math.floor(size / 15) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 10,
                    background: `linear-gradient(to top, ${color === "#FFFEF9" ? "#FFB5D8" : "#FFFEF9"}, transparent)`,
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          )}

          {config.decorations.includes("pearls") && (
            <div className="absolute bottom-2 inset-x-0 flex justify-around px-3">
              {Array.from({ length: Math.floor(size / 20) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 30% 30%, #FFFFFF, #F0F0F0, #D3D3D3)",
                    boxShadow: "0 2px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.6)",
                  }}
                />
              ))}
            </div>
          )}

          {config.pipingPattern === "ruffles" && (
            <div className="absolute bottom-0 inset-x-0 h-8 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-full"
                  style={{
                    width: "6%",
                    left: `${i * 5}%`,
                    background: `linear-gradient(to right, transparent, ${color === "#FFFEF9" ? "#FFB5D8" : "#FFFEF9"}88, transparent)`,
                    transform: `skewX(${15 - (i % 2) * 30}deg)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Top Surface */}
        <div
          className={`absolute inset-0 ${isRound ? "rounded-full" : "rounded-lg"}`}
          style={{
            transform: `rotateX(90deg) translateZ(0px)`,
            background: `radial-gradient(circle at 40% 40%, ${color}ff, ${color}f5, ${color}e8)`,
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
          }}
        />

        {/* Back */}
        <div
          className={`absolute inset-0 ${isRound ? "rounded-full" : "rounded-lg"}`}
          style={{
            transform: `translateZ(-${size / 2}px) rotateY(180deg)`,
            background: `linear-gradient(to bottom, ${color}f5, ${color}e8, ${color}dd)`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        />

        {/* Sides */}
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: size,
            transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
            background: `linear-gradient(to bottom, ${color}f0, ${color}e5, ${color}d8)`,
            boxShadow: "inset 2px 0 8px rgba(0,0,0,0.1)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0"
          style={{
            width: size,
            transform: `rotateY(90deg) translateZ(${size / 2}px)`,
            background: `linear-gradient(to bottom, ${color}f0, ${color}e5, ${color}d8)`,
            boxShadow: "inset -2px 0 8px rgba(0,0,0,0.1)",
          }}
        />

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap z-50 shadow-lg">
            Tier {tierIndex + 1} Selected
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">3D Cake Designer</h1>
          <div className="w-16" />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sticky Cake Viewer */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-6">
              <Card className="overflow-hidden shadow-2xl border-2">
                <CardContent className="p-0">
                  {/* Controls Bar */}
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-b p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateConfig({ rotation: 15 })}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Drag to rotate • Click tier to edit
                      </span>
                    </div>
                  </div>

                  {/* 3D Scene */}
                  <div
                    className="relative h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
                    style={{
                      background: "linear-gradient(to bottom, #f9f9f9 0%, #ffffff 50%, #f5f5f5 100%)",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={() => updateConfig({ selectedTier: null })}
                  >
                    {/* Wooden Table */}
                    <div
                      className="absolute bottom-0 inset-x-0 h-32"
                      style={{
                        background: `
                          linear-gradient(90deg,
                            #8B4513 0%, #A0522D 10%, #8B4513 20%,
                            #A0522D 30%, #8B4513 40%, #A0522D 50%,
                            #8B4513 60%, #A0522D 70%, #8B4513 80%,
                            #A0522D 90%, #8B4513 100%
                          )
                        `,
                        boxShadow: "inset 0 -10px 30px rgba(0,0,0,0.3), inset 0 10px 20px rgba(255,255,255,0.1)",
                      }}
                    >
                      {/* Wood grain texture */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                        }}
                      />
                    </div>

                    {/* Cake Stand Shadow */}
                    <div
                      className="absolute bottom-32 left-1/2 -translate-x-1/2"
                      style={{
                        width: "45%",
                        height: "15%",
                        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.25), transparent 65%)",
                        filter: "blur(15px)",
                      }}
                    />

                    {/* Cake Container */}
                    <div className="absolute inset-0 flex items-end justify-center pb-32">
                      <div
                        className="relative"
                        style={{
                          transform: `perspective(2000px) rotateX(-8deg) rotateY(${config.rotation}deg) scale(${Math.max(0.5, 1 - config.tiers * 0.08)})`,
                          transformStyle: "preserve-3d",
                          transition: "transform 0.1s ease-out",
                        }}
                      >
                        {/* Cake Stand */}
                        <div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                          style={{
                            width: getTierSize(0, config.shapes[0]) + 60,
                            height: 20,
                            background: "linear-gradient(to bottom, #E8E8E8, #D0D0D0, #A8A8A8)",
                            transform: "translateZ(-5px)",
                            boxShadow: "0 15px 40px rgba(0,0,0,0.4), inset 0 -3px 10px rgba(0,0,0,0.3)",
                            border: "4px solid #C0C0C0",
                          }}
                        />

                        {/* Drip Effect */}
                        {config.dripEffect && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                            {Array.from({ length: 18 }).map((_, i) => {
                              const angle = (i / 18) * 360;
                              const radius = getTierSize(0, config.shapes[0]) / 2 - 8;
                              const x = Math.cos((angle * Math.PI) / 180) * radius;
                              const z = Math.sin((angle * Math.PI) / 180) * radius;
                              const dripLength = 20 + Math.random() * 20;

                              return (
                                <div
                                  key={i}
                                  style={{
                                    position: "absolute",
                                    width: 8,
                                    height: dripLength,
                                    borderRadius: "50% 50% 50% 50% / 20% 20% 80% 80%",
                                    background: `linear-gradient(to bottom, ${config.dripColor}, ${config.dripColor}dd, ${config.dripColor}aa)`,
                                    left: x,
                                    transform: `translateZ(${z}px) translateY(-${dripLength}px)`,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                  }}
                                />
                              );
                            })}
                          </div>
                        )}

                        {/* Cake Tiers */}
                        {Array.from({ length: config.tiers }).map((_, i) => renderCakeTier(i))}

                        {/* Custom Text */}
                        {config.text && (
                          <div
                            className="absolute left-1/2 -translate-x-1/2 font-bold text-center px-6 py-3 bg-white/95 rounded-xl shadow-xl backdrop-blur-sm border-2 border-primary/20"
                            style={{
                              bottom: getTierHeight(0) / 2 - 20,
                              transform: `translateZ(${getTierSize(0, config.shapes[0]) / 2 + 20}px) translateX(-50%)`,
                              fontSize: "clamp(16px, 2.5vw, 26px)",
                              color: "#E91E63",
                              maxWidth: "85%",
                            }}
                          >
                            {config.text}
                          </div>
                        )}

                        {/* Cake Topper */}
                        {config.topper && (
                          <div
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{
                              bottom: Array.from({ length: config.tiers }).reduce(
                                (sum: number, _, i) => sum + getTierHeight(i),
                                0
                              ) + 15,
                              transform: "translateZ(0px) translateX(-50%)",
                            }}
                          >
                            {config.topper === "heart" && (
                              <Heart className="h-14 w-14 text-red-500 fill-red-500" style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" }} />
                            )}
                            {config.topper === "star" && (
                              <Star className="h-14 w-14 text-yellow-400 fill-yellow-400" style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" }} />
                            )}
                            {config.topper === "flower" && (
                              <Flower2 className="h-14 w-14 text-pink-400" style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" }} />
                            )}
                            {config.topper === "sparkle" && (
                              <Sparkles className="h-14 w-14 text-purple-400" style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" }} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t p-4 flex gap-3">
                    <Button className="flex-1" size="lg" asChild>
                      <Link href="/custom-order">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Order This Cake
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

          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* Presets */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Start Presets
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                      className="w-full justify-start text-left h-auto py-3 hover:bg-primary hover:text-primary-foreground"
                    >
                      <div>
                        <div className="font-semibold">{preset.name}</div>
                        <div className="text-xs opacity-70">
                          {preset.config.tiers} tiers • {preset.config.frostingType}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Structure */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-4">
                <Label className="text-lg font-semibold">Cake Structure</Label>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Number of Tiers</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Button
                        key={num}
                        variant={config.tiers === num ? "default" : "outline"}
                        onClick={() => updateTiers(num)}
                        className="flex-1 h-12 text-lg font-bold"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Tier Editor */}
            {config.selectedTier !== null && (
              <Card className="border-2 border-primary shadow-lg">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      Editing Tier {config.selectedTier + 1}
                    </Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateConfig({ selectedTier: null })}
                    >
                      Done
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Shape</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {SHAPES.map((shape) => (
                        <Button
                          key={shape.value}
                          variant={config.shapes[config.selectedTier] === shape.value ? "default" : "outline"}
                          onClick={() => updateTierShape(config.selectedTier!, shape.value)}
                        >
                          {shape.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateTierColor(config.selectedTier!, color.value)}
                          className="aspect-square rounded-lg border-4 transition-all hover:scale-110"
                          style={{
                            backgroundColor: color.value,
                            borderColor: config.colors[config.selectedTier] === color.value ? "#E91E63" : "#e5e7eb",
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Frosting */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Frosting Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  {FROSTING_TYPES.map((type) => (
                    <Button
                      key={type.value}
                      variant={config.frostingType === type.value ? "default" : "outline"}
                      onClick={() => updateConfig({ frostingType: type.value })}
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Piping */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Piping Pattern</Label>
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
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Decorations</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DECORATIONS.map((deco) => (
                    <Button
                      key={deco.value}
                      variant={config.decorations.includes(deco.value) ? "default" : "outline"}
                      onClick={() => toggleDecoration(deco.value)}
                      size="sm"
                      className="text-xs h-auto py-2"
                    >
                      {deco.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Drip */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Ganache Drip</Label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.dripEffect}
                      onChange={(e) => updateConfig({ dripEffect: e.target.checked })}
                      className="rounded w-5 h-5"
                    />
                  </label>
                </div>
                {config.dripEffect && (
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { name: "Chocolate", value: "#8B4513" },
                      { name: "Caramel", value: "#D2691E" },
                      { name: "White", value: "#FFFEF9" },
                      { name: "Pink", value: "#FFB5D8" },
                      { name: "Gold", value: "#FFD700" },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateConfig({ dripColor: color.value })}
                        className="aspect-square rounded-lg border-4"
                        style={{
                          backgroundColor: color.value,
                          borderColor: config.dripColor === color.value ? "#E91E63" : "#e5e7eb",
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Topper */}
            <Card className="border-2 border-primary/20">
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
                      variant={config.topper === topper.value ? "default" : "outline"}
                      onClick={() => updateConfig({ topper: topper.value })}
                      className="aspect-square p-0"
                    >
                      <topper.icon className="h-6 w-6" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Text */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Custom Message</Label>
                <Input
                  placeholder="Happy Birthday!"
                  value={config.text}
                  onChange={(e) => updateConfig({ text: e.target.value })}
                  maxLength={40}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">{config.text.length}/40</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
