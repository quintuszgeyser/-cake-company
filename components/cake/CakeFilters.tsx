"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface CakeFiltersProps {
  onFilterChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minServings?: number;
    dietary?: string;
    search?: string;
  }) => void;
}

export function CakeFilters({ onFilterChange }: CakeFiltersProps) {
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [servings, setServings] = useState<number>(0);
  const [dietary, setDietary] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Cakes" },
    { value: "birthday", label: "Birthday" },
    { value: "wedding", label: "Wedding" },
    { value: "corporate", label: "Corporate" },
    { value: "custom", label: "Custom" },
  ];

  const dietaryOptions = [
    { value: "all", label: "All Dietary" },
    { value: "Vegetarian", label: "Vegetarian" },
    { value: "Vegan", label: "Vegan" },
    { value: "Gluten-Free", label: "Gluten-Free" },
    { value: "Dairy-Free", label: "Dairy-Free" },
  ];

  const applyFilters = () => {
    onFilterChange({
      category: category === "all" ? undefined : category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minServings: servings || undefined,
      dietary: dietary === "all" ? undefined : dietary,
      search: search || undefined,
    });
  };

  const resetFilters = () => {
    setCategory("all");
    setPriceRange([0, 300]);
    setServings(0);
    setDietary("all");
    setSearch("");
    onFilterChange({});
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block space-y-6`}
      >
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search cakes..."
                className="pl-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  onFilterChange({
                    category: category === "all" ? undefined : category,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    minServings: servings || undefined,
                    dietary: dietary === "all" ? undefined : dietary,
                    search: e.target.value || undefined,
                  });
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  onFilterChange({
                    category: cat.value === "all" ? undefined : cat.value,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    minServings: servings || undefined,
                    dietary: dietary === "all" ? undefined : dietary,
                    search: search || undefined,
                  });
                }}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Price Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="minPrice" className="text-xs">Min</Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  max="300"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = Number(e.target.value);
                    setPriceRange([newMin, priceRange[1]]);
                  }}
                  onBlur={applyFilters}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="maxPrice" className="text-xs">Max</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  max="300"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = Number(e.target.value);
                    setPriceRange([priceRange[0], newMax]);
                  }}
                  onBlur={applyFilters}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </CardContent>
        </Card>

        {/* Servings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minimum Servings</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              min="0"
              max="200"
              value={servings}
              onChange={(e) => {
                setServings(Number(e.target.value));
              }}
              onBlur={applyFilters}
              placeholder="Any"
            />
          </CardContent>
        </Card>

        {/* Dietary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dietary Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dietaryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setDietary(option.value);
                  onFilterChange({
                    category: category === "all" ? undefined : category,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    minServings: servings || undefined,
                    dietary: option.value === "all" ? undefined : option.value,
                    search: search || undefined,
                  });
                }}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  dietary === option.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {option.label}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={resetFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </>
  );
}
