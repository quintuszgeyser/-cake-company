"use client";

import Link from "next/link";
import { Cake, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Cake className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">CakeCompany</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/cakes" className="transition-colors hover:text-primary">
            Gallery
          </Link>
          <Link href="/custom-order" className="transition-colors hover:text-primary">
            Custom Order
          </Link>
          <Link href="/3d-designer" className="transition-colors hover:text-primary">
            3D Designer
          </Link>
          <Link href="/admin" className="transition-colors hover:text-primary">
            Admin
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button asChild className="hidden md:inline-flex">
            <Link href="/custom-order">Order Now</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/cakes" className="transition-colors hover:text-primary">
              Gallery
            </Link>
            <Link href="/custom-order" className="transition-colors hover:text-primary">
              Custom Order
            </Link>
            <Link href="/3d-designer" className="transition-colors hover:text-primary">
              3D Designer
            </Link>
            <Link href="/admin" className="transition-colors hover:text-primary">
              Admin
            </Link>
            <Button asChild className="w-full">
              <Link href="/custom-order">Order Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
