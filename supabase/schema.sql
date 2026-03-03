-- Cake Company Database Schema
-- PostgreSQL via Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table (cakes)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('birthday', 'wedding', 'corporate', 'custom')),
  servings INTEGER NOT NULL,
  flavors TEXT[] DEFAULT '{}',
  dietary TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,

  -- Order details
  occasion TEXT NOT NULL,
  cake_type TEXT NOT NULL,
  servings INTEGER NOT NULL,
  tiers INTEGER NOT NULL DEFAULT 1,

  -- Flavors and design
  flavors TEXT[] DEFAULT '{}',
  filling TEXT,
  design_description TEXT,
  color_scheme TEXT[] DEFAULT '{}',
  special_requests TEXT,

  -- Dietary
  dietary TEXT[] DEFAULT '{}',
  allergens TEXT,

  -- Delivery
  delivery_date DATE NOT NULL,
  delivery_time TIME NOT NULL,
  delivery_address TEXT NOT NULL,
  setup_required BOOLEAN DEFAULT false,

  -- Pricing
  estimated_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),

  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_id TEXT,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order status history
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order photos (progress updates)
CREATE TABLE IF NOT EXISTS order_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom designs table (for 3D designer)
CREATE TABLE IF NOT EXISTS custom_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  design_data JSONB NOT NULL,
  estimated_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'baker', 'delivery')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);

-- Functions

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM orders;
  new_number := 'ORD-' || LPAD(counter::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products (matching our current mock data)
INSERT INTO products (slug, name, description, base_price, images, category, servings, flavors, dietary, featured) VALUES
  ('chocolate-dream', 'Chocolate Dream Cake', 'Rich, decadent chocolate layers with smooth ganache frosting. Perfect for chocolate lovers. Made with premium Belgian chocolate and finished with chocolate curls.', 45.00,
   ARRAY['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop'],
   'birthday', 12, ARRAY['Chocolate', 'Dark Chocolate Ganache'], ARRAY['Vegetarian'], true),

  ('vanilla-elegance', 'Vanilla Elegance', 'Classic vanilla sponge with buttercream and fresh berries. Timeless and delicious. Light, fluffy, and perfect for any celebration.', 42.00,
   ARRAY['https://images.unsplash.com/photo-1588195538326-c5acd4ae8e44?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=600&fit=crop'],
   'wedding', 16, ARRAY['Vanilla', 'Buttercream'], ARRAY['Vegetarian'], true),

  ('red-velvet-romance', 'Red Velvet Romance', 'Luxurious red velvet with cream cheese frosting. A crowd favorite with its stunning appearance and rich taste.', 48.00,
   ARRAY['https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&h=600&fit=crop'],
   'birthday', 14, ARRAY['Red Velvet', 'Cream Cheese'], ARRAY['Vegetarian'], true),

  ('lemon-delight', 'Lemon Delight', 'Light and refreshing lemon cake with zesty frosting. Perfect for summer celebrations and tea parties.', 40.00,
   ARRAY['https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&h=600&fit=crop'],
   'custom', 12, ARRAY['Lemon', 'Lemon Buttercream'], ARRAY['Vegetarian'], true),

  ('strawberry-bliss', 'Strawberry Bliss', 'Fresh strawberries layered with vanilla cream. A fruity paradise that''s as beautiful as it is delicious.', 46.00,
   ARRAY['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=800&h=600&fit=crop'],
   'birthday', 10, ARRAY['Vanilla', 'Strawberry Cream'], ARRAY['Vegetarian'], true),

  ('caramel-sensation', 'Caramel Sensation', 'Moist caramel cake with salted caramel drizzle. Pure indulgence in every bite. Perfect for caramel enthusiasts.', 50.00,
   ARRAY['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop'],
   'corporate', 20, ARRAY['Caramel', 'Salted Caramel'], ARRAY['Vegetarian'], true),

  ('triple-tier-wedding', 'Triple Tier Wedding Cake', 'Elegant three-tier wedding cake with pristine white frosting and delicate decorations. Customizable to your wedding theme.', 250.00,
   ARRAY['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&h=600&fit=crop'],
   'wedding', 100, ARRAY['Vanilla', 'Lemon', 'Chocolate'], ARRAY['Vegetarian'], false),

  ('unicorn-dream', 'Unicorn Dream Cake', 'Magical unicorn-themed cake with rainbow layers and colorful decorations. Every child''s dream come true!', 55.00,
   ARRAY['https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1602351447937-745cb720612f?w=800&h=600&fit=crop'],
   'birthday', 16, ARRAY['Vanilla Rainbow Layers'], ARRAY['Vegetarian'], false),

  ('corporate-logo-cake', 'Corporate Logo Cake', 'Professional corporate cake with custom logo and branding. Perfect for company events and celebrations.', 120.00,
   ARRAY['https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&h=600&fit=crop'],
   'corporate', 30, ARRAY['Chocolate', 'Vanilla'], ARRAY['Vegetarian'], false),

  ('vegan-chocolate-delight', 'Vegan Chocolate Delight', '100% vegan chocolate cake that doesn''t compromise on taste. Rich, moist, and absolutely delicious.', 52.00,
   ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop'],
   'custom', 12, ARRAY['Vegan Chocolate'], ARRAY['Vegan', 'Dairy-Free'], false),

  ('gluten-free-carrot', 'Gluten-Free Carrot Cake', 'Delicious gluten-free carrot cake with cream cheese frosting. Perfect for those with dietary restrictions.', 48.00,
   ARRAY['https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1608532341909-c77e08cd8385?w=800&h=600&fit=crop'],
   'custom', 10, ARRAY['Carrot', 'Cream Cheese'], ARRAY['Gluten-Free', 'Vegetarian'], false),

  ('birthday-celebration', 'Birthday Celebration Cake', 'Classic birthday cake with colorful sprinkles and your custom message. Available in multiple flavors.', 38.00,
   ARRAY['https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop'],
   'birthday', 12, ARRAY['Vanilla', 'Chocolate', 'Strawberry'], ARRAY['Vegetarian'], false)
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Customers can only see their own data
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);

-- Orders policies
CREATE POLICY "Orders are viewable by owner" ON orders
  FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Reviews are public
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);
