import Link from "next/link";
import { Cake, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Cake className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CakeCompany</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Creating memorable moments, one cake at a time.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/cakes" className="hover:text-primary transition-colors">All Cakes</Link></li>
              <li><Link href="/cakes?category=wedding" className="hover:text-primary transition-colors">Wedding Cakes</Link></li>
              <li><Link href="/cakes?category=birthday" className="hover:text-primary transition-colors">Birthday Cakes</Link></li>
              <li><Link href="/cakes?category=corporate" className="hover:text-primary transition-colors">Corporate Cakes</Link></li>
            </ul>
          </div>

          {/* Create */}
          <div>
            <h3 className="font-semibold mb-4">Create</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/custom-order" className="hover:text-primary transition-colors">Custom Order</Link></li>
              <li><Link href="/3d-designer" className="hover:text-primary transition-colors">3D Designer</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Flavor Quiz</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CakeCompany. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
