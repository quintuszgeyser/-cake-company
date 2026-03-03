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
  Square,
  Hexagon,
} from "lucide-react";

interface CakeConfig {
  tiers: number;
  shapes: string[];
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
      shapes: ["round", "round", "round"],
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
      shapes: ["round", "round"],
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
    name: "Elegant Square",
    config: {
      tiers: 4,
      shapes: ["square", "square", "square", "square"],
      colors: ["#FFF5F7", "#FFE4E9", "#FFDBE3", "#FFFFFF"],
      decorations: ["flowers", "pearls", "goldleaf"],
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
    name: "Rustic Heart",
    config: {
      tiers: 2,
      shapes: ["heart", "heart"],
      colors: ["#F5DEB3", "#DEB887"],
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

const SHAPES = [
  { name: "Round", value: "round", icon: Circle },
  { name: "Square", value: "square", icon: Square },
  { name: "Rectangle", value: "rectangle", icon: Square },
  { name: "Heart", value: "heart", icon: Heart },
  { name: "Hexagon", value: "hexagon", icon: Hexagon },
  { name: "Petal", value: "petal", icon: Flower2 },
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
    shapes: ["round", "round", "round"],
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
    const newShapes = Array(newTiers)
      .fill("round")
      .map((_, i) => config.shapes[i] || "round");
    updateConfig({ tiers: newTiers, colors: newColors, shapes: newShapes });
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

  // Dynamic scaling based on number of tiers
  const getBaseScale = () => {
    if (config.tiers <= 2) return 1;
    if (config.tiers === 3) return 0.85;
    if (config.tiers === 4) return 0.7;
    return 0.6;
  };

  const getTierHeight = (tierIndex: number) => {
    return 70 + tierIndex * 15;
  };

  const getTierWidth = (tierIndex: number, shape: string) => {
    const baseWidth = 200 - tierIndex * 35;
    if (shape === "rectangle") return baseWidth * 1.3;
    if (shape === "petal") return baseWidth * 0.9;
    return baseWidth;
  };

  const getShapeClipPath = (shape: string) => {
    switch (shape) {
      case "round":
        return "none";
      case "square":
        return "none";
      case "rectangle":
        return "none";
      case "heart":
        return "polygon(50% 15%, 61% 6%, 75% 0%, 85% 5%, 93% 15%, 98% 30%, 95% 45%, 85% 60%, 50% 100%, 15% 60%, 5% 45%, 2% 30%, 7% 15%, 15% 5%, 25% 0%, 39% 6%)";
      case "hexagon":
        return "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
      case "petal":
        return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
      default:
        return "none";
    }
  };

  const getTextureStyle = (texture: string, color: string) => {
    const baseGradient = `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 25%, rgba(0,0,0,0.05) 50%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.3) 100%)`;

    switch (texture) {
      case "smooth":
        return baseGradient;
      case "rustic":
        return `${baseGradient}, repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 6px)`;
      case "textured":
        return `${baseGradient}, repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)`;
      case "basketweave":
        return `${baseGradient}, repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 8px, transparent 8px, transparent 16px)`;
      case "quilted":
        return `${baseGradient}, repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(0,0,0,0.05) 15px, rgba(0,0,0,0.05) 16px), repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(0,0,0,0.05) 15px, rgba(0,0,0,0.05) 16px)`;
      case "ruffled":
        return `${baseGradient}, repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)`;
      case "combed":
        return `${baseGradient}, repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px)`;
      case "petal":
        return `${baseGradient}, radial-gradient(ellipse at top, rgba(255,255,255,0.5), transparent 60%)`;
      default:
        return baseGradient;
    }
  };

  const renderDecorations = (tierIndex: number, side: string, width: number, height: number) => {
    const decorationElements = [];

    // Flowers
    if (config.decorations.includes("flowers")) {
      const flowerCount = side === "top" ? 4 : 3;
      decorationElements.push(
        <div key={`flowers-${side}`} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: flowerCount }).map((_, i) => (
            <Flower2
              key={i}
              className="absolute h-5 w-5 text-pink-400 drop-shadow-lg"
              style={{
                left: `${15 + (i * 70) / flowerCount}%`,
                top: side === "top" ? `${20 + (i % 2) * 30}%` : "15%",
                transform: side === "top" ? "rotate(-20deg)" : "none",
              }}
            />
          ))}
        </div>
      );
    }

    // Berries
    if (config.decorations.includes("berries")) {
      decorationElements.push(
        <div key={`berries-${side}`} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg"
              style={{
                left: `${10 + (i * 80) / 5}%`,
                top: side === "top" ? `${30 + (i % 3) * 20}%` : "20%",
              }}
            />
          ))}
        </div>
      );
    }

    // Macarons
    if (config.decorations.includes("macarons") && tierIndex === 0) {
      decorationElements.push(
        <div key={`macarons-${side}`} className="absolute inset-x-0 top-2 flex justify-around px-3 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full shadow-xl"
              style={{
                backgroundColor: ["#FFB6C1", "#87CEEB", "#E6E6FA"][i],
                border: "2px solid rgba(255,255,255,0.6)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)",
              }}
            />
          ))}
        </div>
      );
    }

    // Stars
    if (config.decorations.includes("stars")) {
      decorationElements.push(
        <div key={`stars-${side}`} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <Star
              key={i}
              className="absolute h-4 w-4 text-yellow-400 fill-yellow-400 drop-shadow-lg"
              style={{
                left: `${20 + (i * 60) / 4}%`,
                top: `${25 + (i % 2) * 40}%`,
              }}
            />
          ))}
        </div>
      );
    }

    // Hearts
    if (config.decorations.includes("hearts")) {
      decorationElements.push(
        <div key={`hearts-${side}`} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className="absolute h-4 w-4 text-red-400 fill-red-400 drop-shadow-md"
              style={{
                left: `${25 + (i * 50) / 3}%`,
                bottom: "15%",
              }}
            />
          ))}
        </div>
      );
    }

    // Sprinkles
    if (config.decorations.includes("sprinkles")) {
      decorationElements.push(
        <div key={`sprinkles-${side}`} className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-2 rounded-full"
              style={{
                backgroundColor: ["#FF69B4", "#87CEEB", "#FFD700", "#98FF98", "#E6E6FA"][i % 5],
                left: `${(i * 17) % 95}%`,
                top: `${(i * 23) % 95}%`,
                transform: `rotate(${(i * 37) % 360}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            />
          ))}
        </div>
      );
    }

    // Pearls
    if (config.decorations.includes("pearls")) {
      decorationElements.push(
        <div key={`pearls-${side}`} className="absolute inset-x-0 bottom-2 flex justify-around px-2 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white shadow-md"
              style={{
                boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.8)",
              }}
            />
          ))}
        </div>
      );
    }

    // Gold Leaf
    if (config.decorations.includes("goldleaf")) {
      decorationElements.push(
        <div key={`goldleaf-${side}`} className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute opacity-80"
              style={{
                width: 12 + Math.random() * 10,
                height: 12 + Math.random() * 10,
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
                left: `${(i * 19) % 85 + 5}%`,
                top: `${(i * 29) % 75 + 10}%`,
                clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
                transform: `rotate(${(i * 47) % 360}deg)`,
              }}
            />
          ))}
        </div>
      );
    }

    return decorationElements;
  };

  const renderPipingPattern = (pattern: string, color: string, side: string) => {
    if (pattern === "none") return null;

    const pipingColor = color === "#FFFFFF" || color === "#F7E7CE" ? "#FFB6C1" : "#FFFFFF";

    switch (pattern) {
      case "rosettes":
        return (
          <div className="absolute inset-x-0 top-2 flex justify-around px-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border-2 relative"
                style={{
                  borderColor: pipingColor,
                  background: `radial-gradient(circle at 30% 30%, ${pipingColor}, transparent)`,
                  boxShadow: `inset 0 0 3px ${pipingColor}`,
                }}
              >
                <div
                  className="absolute inset-1 rounded-full border"
                  style={{ borderColor: pipingColor, opacity: 0.5 }}
                />
              </div>
            ))}
          </div>
        );

      case "shells":
        return (
          <div className="absolute inset-x-0 bottom-1 flex">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-3"
                style={{
                  background: `linear-gradient(to top, ${pipingColor}, transparent)`,
                  clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        );

      case "pearls":
        return (
          <div className="absolute inset-x-0 bottom-2 flex justify-around px-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: pipingColor,
                  boxShadow: `0 2px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.5)`,
                }}
              />
            ))}
          </div>
        );

      case "dots":
        return (
          <div className="absolute inset-0 p-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: pipingColor,
                  left: `${(i * 17) % 90 + 5}%`,
                  top: `${(i * 23) % 90 + 5}%`,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        );

      case "rope":
        return (
          <div className="absolute inset-x-0 bottom-1 flex items-center">
            <div
              className="w-full h-3"
              style={{
                background: `repeating-linear-gradient(90deg, ${pipingColor} 0px, ${pipingColor} 8px, transparent 8px, transparent 12px)`,
                opacity: 0.8,
              }}
            />
          </div>
        );

      case "ruffles":
        return (
          <div className="absolute inset-x-0 bottom-0 h-8 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-full"
                style={{
                  width: "6%",
                  left: `${i * 5}%`,
                  background: `linear-gradient(to right, transparent, ${pipingColor}, transparent)`,
                  opacity: 0.6,
                  transform: `skewX(${10 - (i % 2) * 20}deg)`,
                }}
              />
            ))}
          </div>
        );

      case "lace":
        return (
          <div className="absolute inset-0 opacity-50">
            <svg className="w-full h-full" style={{ fill: "none", stroke: pipingColor, strokeWidth: 1 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <path
                  key={i}
                  d={`M ${i * 10} 10 Q ${i * 10 + 5} 5, ${i * 10 + 10} 10 T ${i * 10 + 20} 10`}
                />
              ))}
            </svg>
          </div>
        );

      default:
        return null;
    }
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
              <Card className="overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  {/* Viewer Controls */}
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-b p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateConfig({ zoom: Math.min(1.5, config.zoom + 0.1) })}
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
                        Drag to rotate
                      </p>
                      <div className="flex gap-1">
                        {config.metallic && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Gold
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
                    {/* Soft shadows on ground */}
                    <div
                      className="absolute bottom-0"
                      style={{
                        width: "60%",
                        height: "20%",
                        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.15), transparent 70%)",
                        filter: "blur(20px)",
                      }}
                    />

                    {/* Cake Container */}
                    <div
                      className="relative transition-transform duration-100"
                      style={{
                        transform: `perspective(1500px) rotateX(-12deg) rotateY(${config.rotation}deg) scale(${config.zoom * getBaseScale()})`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Cake Base/Plate */}
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                        style={{
                          width: getTierWidth(0, config.shapes[0]) + 80,
                          height: 25,
                          background: "linear-gradient(to bottom, #e5e7eb 0%, #d1d5db 50%, #9ca3af 100%)",
                          transform: "translateZ(-12px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3), inset 0 -2px 10px rgba(0,0,0,0.2)",
                          border: "3px solid #b0b5ba",
                        }}
                      />

                      {/* Drip Effects */}
                      {config.dripEffect && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                          {Array.from({ length: 16 }).map((_, i) => {
                            const angle = (i / 16) * 360;
                            const radius = getTierWidth(0, config.shapes[0]) / 2 - 5;
                            const x = Math.cos((angle * Math.PI) / 180) * radius;
                            const z = Math.sin((angle * Math.PI) / 180) * radius;
                            const dripLength = 25 + Math.random() * 25;
                            const dripWidth = 6 + Math.random() * 4;

                            return (
                              <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                  width: dripWidth,
                                  height: dripLength,
                                  background: `linear-gradient(to bottom, ${config.dripColor}, ${config.dripColor}dd)`,
                                  left: x,
                                  transform: `translateZ(${z}px) translateY(-${dripLength}px)`,
                                  transformOrigin: "top center",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                  borderRadius: "50% 50% 50% 50% / 20% 20% 80% 80%",
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
                          const shape = config.shapes[tierIndex] || "round";
                          const width = getTierWidth(tierIndex, shape);
                          const color = config.colors[tierIndex] || "#FFFFFF";
                          const bottom = Array.from({ length: tierIndex }).reduce(
                            (sum: number, _, i) => sum + getTierHeight(i),
                            0
                          );

                          const isNaked = config.style === "naked" || config.style === "seminaked";
                          const opacity = config.style === "seminaked" ? 0.75 : 1;
                          const isRound = shape === "round" || shape === "petal";

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
                                className={`absolute inset-0 shadow-2xl border-2 ${isRound ? "rounded-full" : "rounded-lg"}`}
                                style={{
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `translateZ(${width / 2}px)`,
                                  backgroundImage: getTextureStyle(config.texture, color),
                                  borderColor: "rgba(255,255,255,0.3)",
                                  clipPath: isRound ? "none" : getShapeClipPath(shape),
                                  boxShadow: "0 8px 20px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)",
                                }}
                              >
                                {config.metallic && (
                                  <div
                                    className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, transparent 0%, rgba(255,215,0,0.6) 30%, transparent 50%, rgba(255,215,0,0.4) 70%, transparent 100%)",
                                    }}
                                  />
                                )}

                                {config.glitter && (
                                  <div className="absolute inset-0 pointer-events-none">
                                    {Array.from({ length: 50 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full"
                                        style={{
                                          left: `${(i * 13) % 98}%`,
                                          top: `${(i * 17) % 98}%`,
                                          opacity: 0.6 + (Math.random() * 0.4),
                                          boxShadow: "0 0 3px rgba(255,255,255,0.9)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}

                                {renderPipingPattern(config.pipingPattern, color, "front")}
                                {renderDecorations(tierIndex, "front", width, height)}
                              </div>

                              {/* Back Face */}
                              <div
                                className={`absolute inset-0 shadow-2xl border-2 ${isRound ? "rounded-full" : "rounded-lg"}`}
                                style={{
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `translateZ(-${width / 2}px) rotateY(180deg)`,
                                  backgroundImage: getTextureStyle(config.texture, color),
                                  borderColor: "rgba(255,255,255,0.2)",
                                  clipPath: isRound ? "none" : getShapeClipPath(shape),
                                  boxShadow: "0 8px 20px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
                                }}
                              >
                                {renderPipingPattern(config.pipingPattern, color, "back")}
                                {renderDecorations(tierIndex, "back", width, height)}
                              </div>

                              {/* Left Face */}
                              <div
                                className="absolute inset-y-0 left-0 shadow-2xl border-2"
                                style={{
                                  width: width,
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `rotateY(-90deg) translateZ(${width / 2}px)`,
                                  backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)`,
                                  borderColor: "rgba(255,255,255,0.2)",
                                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                                }}
                              >
                                {renderPipingPattern(config.pipingPattern, color, "left")}
                                {renderDecorations(tierIndex, "left", width, height)}
                              </div>

                              {/* Right Face */}
                              <div
                                className="absolute inset-y-0 right-0 shadow-2xl border-2"
                                style={{
                                  width: width,
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `rotateY(90deg) translateZ(${width / 2}px)`,
                                  backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)`,
                                  borderColor: "rgba(255,255,255,0.2)",
                                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                                }}
                              >
                                {renderPipingPattern(config.pipingPattern, color, "right")}
                                {renderDecorations(tierIndex, "right", width, height)}
                              </div>

                              {/* Top Face */}
                              <div
                                className={`absolute inset-x-0 top-0 shadow-inner border-2 ${isRound ? "rounded-full" : "rounded-lg"}`}
                                style={{
                                  height: width,
                                  backgroundColor: color,
                                  opacity: isNaked ? opacity : 1,
                                  transform: `rotateX(90deg) translateZ(0px)`,
                                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 30%, rgba(0,0,0,0.05) 60%, rgba(255,255,255,0.2) 100%)`,
                                  borderColor: "rgba(255,255,255,0.3)",
                                  clipPath: isRound ? "none" : getShapeClipPath(shape),
                                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
                                }}
                              >
                                {renderDecorations(tierIndex, "top", width, height)}
                              </div>

                              {/* Ribbon */}
                              {config.decorations.includes("ribbon") && (
                                <div
                                  className="absolute left-0 right-0 h-7 shadow-lg"
                                  style={{
                                    top: "45%",
                                    transform: `translateZ(${width / 2 + 1}px)`,
                                    background: "linear-gradient(to right, #ec4899 0%, #f43f5e 50%, #ec4899 100%)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
                                  }}
                                />
                              )}

                              {/* Fault Line Effect */}
                              {config.style === "faultline" && tierIndex === 1 && (
                                <div
                                  className="absolute left-0 right-0 h-10 z-10 overflow-hidden shadow-lg"
                                  style={{
                                    top: "40%",
                                    transform: `translateZ(${width / 2 + 2}px)`,
                                  }}
                                >
                                  <div className="h-full bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 flex items-center justify-center gap-1 px-2">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-1 h-1 rounded-full"
                                        style={{
                                          backgroundColor: ["#FF69B4", "#FFD700", "#87CEEB", "#98FF98"][i % 4],
                                          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                      {/* Cake Text */}
                      {config.text && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 font-bold text-primary text-center px-6 py-3 bg-white/95 rounded-xl shadow-2xl backdrop-blur-sm border-2 border-white"
                          style={{
                            bottom: getTierHeight(0) / 2 - 15,
                            transform: `translateZ(${getTierWidth(0, config.shapes[0]) / 2 + 15}px) translateX(-50%)`,
                            fontSize: "clamp(14px, 2vw, 22px)",
                            maxWidth: "80%",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
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
                              ) + 15,
                            transform: "translateZ(0px) translateX(-50%)",
                          }}
                        >
                          {config.topper === "heart" && (
                            <Heart className="h-12 w-12 text-red-500 fill-red-500 drop-shadow-2xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} />
                          )}
                          {config.topper === "star" && (
                            <Star className="h-12 w-12 text-yellow-500 fill-yellow-500 drop-shadow-2xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} />
                          )}
                          {config.topper === "flower" && (
                            <Flower2 className="h-12 w-12 text-pink-500 drop-shadow-2xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} />
                          )}
                          {config.topper === "sparkle" && (
                            <Sparkles className="h-12 w-12 text-purple-500 drop-shadow-2xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-white">
                      <p className="text-sm font-semibold text-gray-800">
                        {config.tiers} Tier • {FROSTING_TYPES.find(f => f.value === config.frostingType)?.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {TEXTURES.find(t => t.value === config.texture)?.name} • {STYLES.find(s => s.value === config.style)?.name}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t p-4 flex gap-3">
                    <Button className="flex-1" size="lg" asChild>
                      <Link href="/custom-order">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Order This Design
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1">
                      <Download className="h-5 w-5 mr-2" />
                      Save Design
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Scrollable Controls Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Presets */}
            <Card className="border-2">
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
                      className="w-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cake Structure */}
            <Card className="border-2">
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
                        className="flex-1"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tier Shapes */}
                {Array.from({ length: config.tiers }).map((_, tierIndex) => (
                  <div key={tierIndex}>
                    <Label className="text-sm mb-2 block">Tier {tierIndex + 1} Shape</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {SHAPES.map((shape) => (
                        <Button
                          key={shape.value}
                          variant={config.shapes[tierIndex] === shape.value ? "default" : "outline"}
                          onClick={() => updateTierShape(tierIndex, shape.value)}
                          size="sm"
                          className="text-xs flex items-center justify-center gap-1"
                        >
                          <shape.icon className="h-3 w-3" />
                          {shape.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Frosting & Texture */}
            <Card className="border-2">
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
            <Card className="border-2">
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
                    <Label className="text-sm mb-2 block">Tier {tierIndex + 1} Color</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLORS.map((colorOption) => (
                        <button
                          key={colorOption.value}
                          onClick={() => updateTierColor(tierIndex, colorOption.value)}
                          className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 shadow-md"
                          style={{
                            backgroundColor: colorOption.value,
                            borderColor:
                              config.colors[tierIndex] === colorOption.value
                                ? "#e11d48"
                                : "#d1d5db",
                            borderWidth:
                              config.colors[tierIndex] === colorOption.value ? "3px" : "2px",
                            boxShadow: config.colors[tierIndex] === colorOption.value
                              ? "0 4px 6px rgba(0,0,0,0.2), 0 0 0 3px rgba(225,29,72,0.2)"
                              : "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2 border-t">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={config.metallic}
                      onChange={(e) => updateConfig({ metallic: e.target.checked })}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-sm font-medium">Gold Accents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={config.glitter}
                      onChange={(e) => updateConfig({ glitter: e.target.checked })}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-sm font-medium">Glitter</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Piping & Borders */}
            <Card className="border-2">
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
            <Card className="border-2">
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
            <Card className="border-2">
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Drip Effect</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.dripEffect}
                    onChange={(e) => updateConfig({ dripEffect: e.target.checked })}
                    className="rounded w-4 h-4"
                  />
                  <span className="text-sm font-medium">Add Ganache Drip</span>
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
                          className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 shadow-md"
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
            <Card className="border-2">
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
            <Card className="border-2">
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
            <Card className="border-2">
              <CardContent className="p-4 space-y-3">
                <Label className="text-lg font-semibold">Custom Message</Label>
                <Input
                  placeholder="Happy Birthday! or Congratulations!"
                  value={config.text}
                  onChange={(e) => updateConfig({ text: e.target.value })}
                  maxLength={40}
                  className="text-base"
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
