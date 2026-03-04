# Cake Company CMS - Setup & Deployment Guide

## 🎉 What's Been Built

A complete CMS architecture that transforms your cake site from static products to a dynamic, admin-controlled system:

### ✅ Phase 1: Dynamic Pricing System
- Centralized pricing configuration in database
- Admin can adjust all prices without code changes
- Real-time price calculations across the site
- Consistent pricing between frontend and backend

### ✅ Phase 2: Template Storage System
- Products are now saved custom order configurations
- Admin creates templates through custom order form
- Templates stored in database with JSONB template_data
- Gallery fetches from database with dynamic pricing

### ✅ Phase 3: Authentication & Image Upload
- Supabase Auth with email/password
- Middleware protecting admin routes
- Image upload to Supabase Storage
- Secure admin panel

---

## 🚀 Setup Instructions

### Step 1: Apply Database Schema

Run the updated schema in your Supabase SQL Editor:

```bash
# The schema is in: supabase/schema.sql
```

This will:
- ✅ Add `template_data` JSONB column to products table
- ✅ Create `pricing_config` table with default values
- ✅ Add triggers and indexes
- ✅ Set up Row Level Security policies

### Step 2: Enable Supabase Auth

In your **Supabase Dashboard**:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Set **Site URL**: `https://cake-company-six.vercel.app`
4. Add **Redirect URLs**:
   - `https://cake-company-six.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

### Step 3: Create Storage Bucket

In your **Supabase Dashboard**:

1. Go to **Storage**
2. Click **New bucket**
3. Name: `cake-images`
4. **Public bucket**: ✅ Enable
5. Click **Create bucket**

Then set up policies:

```sql
-- Run in Supabase SQL Editor

-- Allow public to read images
CREATE POLICY "Public can view cake images"
ON storage.objects FOR SELECT
USING (bucket_id = 'cake-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload cake images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cake-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated can update cake images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cake-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete cake images"
ON storage.objects FOR DELETE
USING (bucket_id = 'cake-images' AND auth.role() = 'authenticated');
```

### Step 4: Create Admin User

In your **Supabase SQL Editor**, run:

```sql
-- Create admin user in auth.users
-- Replace with your actual email and password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@cakeco.com',  -- YOUR ADMIN EMAIL
  crypt('YourSecurePassword123!', gen_salt('bf')),  -- YOUR PASSWORD
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Add to admin_users table
INSERT INTO admin_users (email, name, role)
VALUES ('admin@cakeco.com', 'Admin User', 'admin');
```

**Alternative: Use Supabase Auth UI**
1. Go to Authentication → Users → Add user
2. Enter email and password
3. User will receive confirmation email
4. Then add to admin_users table:
   ```sql
   INSERT INTO admin_users (email, name, role)
   VALUES ('admin@cakeco.com', 'Admin User', 'admin');
   ```

### Step 5: Deploy to Vercel

```bash
# Commit all changes
git add .
git commit -m "Add CMS with dynamic pricing and template system"
git push origin main
```

Vercel will auto-deploy. No additional env variables needed (already configured).

---

## 🎯 How to Use the CMS

### Admin Workflow

#### 1. Login
- Navigate to: `/login`
- Enter your admin credentials
- You'll be redirected to `/admin`

#### 2. Manage Pricing
- Go to: `/admin/pricing`
- Adjust any pricing values:
  - Base price (starting point for all cakes)
  - Price per serving
  - Price per tier
  - Dietary surcharges (Vegan, Gluten-Free, etc.)
  - Setup fee
- Click **Save**
- **All cake prices update instantly!**

#### 3. Create Cake Template
- Go to: `/admin/products`
- Click **Create New Template**
- Fill in template info:
  - Name (e.g., "Raspberry White Chocolate Dream")
  - Slug (auto-generated from name)
  - Description
  - Category (Birthday, Wedding, Corporate, Custom)
  - Featured checkbox (shows on homepage)
- Upload 1-5 images from your computer
- Configure cake details:
  - Occasion
  - Cake type (round, square, heart, etc.)
  - Servings
  - Tiers
  - Flavors (select multiple)
  - Filling
  - Color scheme (select multiple)
  - Design description
  - Dietary requirements
  - Setup required checkbox
- **See calculated price preview**
- Click **Create Template**
- Template appears in gallery immediately!

#### 4. Manage Templates
- Go to: `/admin/products`
- See all templates with calculated prices
- **Feature/Unfeature**: Toggle homepage display
- **View**: Open in gallery (public view)
- Templates are live as soon as they're created

### Customer Workflow

#### 1. Browse Gallery
- Navigate to: `/cakes`
- All templates display with dynamically calculated prices
- Prices update when admin changes pricing config
- Filter by category, price, servings, dietary

#### 2. Order from Template
- Click **Order Now** on any cake
- Custom order form **pre-fills** with template data
- Customer can modify anything (servings, tiers, flavors, etc.)
- Price updates in real-time as they customize
- Submit order → Payment page

#### 3. Custom Order (From Scratch)
- Navigate to: `/custom-order`
- Fill out 7-step wizard
- Price calculates dynamically based on selections
- Uses current pricing configuration

---

## 🔧 Technical Architecture

### Data Flow

```
Admin creates template
        ↓
Saves to products table (template_data JSONB)
        ↓
Gallery fetches via /api/products
        ↓
Calculates price: calculateOrderPrice(template_data, pricing_config)
        ↓
Displays in gallery
        ↓
Customer clicks "Order Now"
        ↓
Form pre-fills from template_data
        ↓
Customer customizes → price updates in real-time
        ↓
Submit → Backend recalculates price (prevent tampering)
        ↓
Order saved to database
```

### Key Files Created

**Pricing System:**
- `lib/utils/pricing.ts` - Centralized pricing logic
- `app/api/pricing/route.ts` - Pricing config API
- `app/admin/pricing/page.tsx` - Admin pricing editor

**Template System:**
- `app/api/admin/templates/route.ts` - Template CRUD API
- `app/admin/templates/new/page.tsx` - Template creator
- `types/cake.ts` - Updated with CakeTemplate interface

**Authentication:**
- `lib/auth/supabase-server.ts` - Server-side auth helpers
- `lib/auth/supabase-client.ts` - Client-side auth helpers
- `middleware.ts` - Route protection
- `app/login/page.tsx` - Admin login
- `app/auth/callback/route.ts` - OAuth callback

**Image Upload:**
- `app/api/admin/upload/route.ts` - Image upload API
- `components/admin/ImageUpload.tsx` - Upload UI component

### Key Files Modified

- `supabase/schema.sql` - Added pricing_config table and template_data column
- `app/custom-order/page.tsx` - Uses dynamic pricing
- `app/api/orders/route.ts` - Server-side dynamic pricing
- `app/cakes/page.tsx` - Fetches from API with dynamic prices
- `components/cake/FeaturedCakes.tsx` - Fetches from API
- `app/admin/layout.tsx` - Real authentication
- `app/admin/products/page.tsx` - Template management UI

---

## 🧪 Testing Checklist

### Phase 1: Dynamic Pricing
- [ ] Login to admin panel
- [ ] Navigate to `/admin/pricing`
- [ ] Change **base_price** from R50 to R75
- [ ] Click **Save**
- [ ] Open `/custom-order` in new tab
- [ ] Verify form shows new base price (R75+)
- [ ] Change pricing back if needed

### Phase 2: Template System
- [ ] Navigate to `/admin/products`
- [ ] Click **Create New Template**
- [ ] Fill in all fields:
  - Name: "Test Chocolate Cake"
  - Category: Birthday
  - Upload at least 1 image
  - Servings: 14
  - Tiers: 2
  - Flavors: Chocolate, Vanilla
  - Filling: Chocolate Ganache
  - Design description: "Rich chocolate layers with ganache"
- [ ] Verify calculated price appears
- [ ] Click **Create Template**
- [ ] Navigate to `/cakes`
- [ ] Verify "Test Chocolate Cake" appears in gallery
- [ ] Click **Order Now** on the template
- [ ] Verify form pre-fills with template data
- [ ] Verify price matches template

### Phase 3: Authentication & Images
- [ ] Logout from admin panel
- [ ] Try to access `/admin` → Should redirect to `/login`
- [ ] Try to access `/api/admin/templates` directly → Should get 401
- [ ] Login with admin credentials
- [ ] Navigate to `/admin/templates/new`
- [ ] Click **Upload Images**
- [ ] Select image from computer
- [ ] Verify image uploads and displays
- [ ] Create template with uploaded image
- [ ] Verify image appears in gallery

---

## 💡 Common Admin Tasks

### Change All Cake Prices by 20%
1. Go to `/admin/pricing`
2. Multiply each value by 1.2:
   - Base: R50 → R60
   - Per serving: R1.50 → R1.80
   - Per tier: R30 → R36
3. Click **Save**
4. **All cakes instantly show new prices!**

### Feature a Cake on Homepage
1. Go to `/admin/products`
2. Find the template
3. Click **Feature** button
4. Template appears on homepage in Featured Cakes section

### Create Premium Pricing for Red Velvet
This requires updating the JSON premiums:
1. Go to `/admin/pricing`
2. Note the **Flavor Premiums** JSON
3. Update in Supabase SQL Editor:
   ```sql
   UPDATE pricing_config
   SET flavor_premiums = '{"Red Velvet": 5, "Caramel": 3, "Coffee": 2}'
   WHERE active = true;
   ```
4. Now Red Velvet cakes automatically cost R5 more

---

## 🔒 Security Notes

### What's Protected
- ✅ All `/admin/*` routes require authentication
- ✅ All `/api/admin/*` routes require authentication
- ✅ PATCH `/api/pricing` requires authentication
- ✅ Middleware validates admin status from admin_users table
- ✅ Image uploads are authenticated

### What's Public
- ✅ GET `/api/products` (needed for gallery)
- ✅ GET `/api/pricing` (needed for frontend pricing)
- ✅ POST `/api/orders` (needed for customer orders)
- ✅ Supabase Storage images (public read)

### Admin Verification Flow
```
Request to /admin or /api/admin/*
        ↓
Middleware checks auth cookie
        ↓
Supabase verifies user session
        ↓
Query admin_users table by email
        ↓
If found → Allow
If not found → Redirect/401
```

---

## 📊 Database Schema Summary

### pricing_config
```sql
base_price              DECIMAL   -- Starting price (R50)
price_per_serving       DECIMAL   -- Cost per person (R1.50)
price_per_tier          DECIMAL   -- Cost per tier (R30)
vegan_surcharge         DECIMAL   -- Vegan extra (R15)
gluten_free_surcharge   DECIMAL   -- GF extra (R15)
dairy_free_surcharge    DECIMAL   -- DF extra (R10)
setup_fee               DECIMAL   -- Setup cost (R25)
flavor_premiums         JSONB     -- {"Red Velvet": 5}
filling_premiums        JSONB     -- {"Ganache": 8}
```

### products (templates)
```sql
id                  UUID
slug                TEXT          -- URL-friendly name
name                TEXT          -- Display name
description         TEXT          -- Description
base_price          DECIMAL       -- Calculated price
images              TEXT[]        -- Image URLs
category            TEXT          -- birthday/wedding/corporate/custom
servings            INTEGER       -- Number of servings
flavors             TEXT[]        -- Flavor list
dietary             TEXT[]        -- Dietary restrictions
featured            BOOLEAN       -- Show on homepage
available           BOOLEAN       -- Available for order
template_data       JSONB         -- Full OrderFormValues
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### admin_users
```sql
id          UUID
email       TEXT          -- Must match auth.users.email
name        TEXT          -- Display name
role        TEXT          -- admin/baker/delivery
created_at  TIMESTAMP
```

---

## 🎨 Pricing Calculation Formula

```typescript
price = base_price
      + (servings × price_per_serving)
      + ((tiers - 1) × price_per_tier)
      + dietary_surcharges  // Sum of selected options
      + flavor_premiums     // Sum for selected flavors
      + filling_premiums    // Premium for selected filling
      + setup_fee           // If setup required
```

**Example:**
- Base: R50
- Servings: 12 × R1.50 = R18
- Tiers: 2 (1 extra) × R30 = R30
- Vegan: +R15
- Setup: +R25
- **Total: R138**

**After admin changes base to R60:**
- Base: R60
- Servings: 12 × R1.50 = R18
- Tiers: 2 × R30 = R30
- Vegan: +R15
- Setup: +R25
- **Total: R148** ✨ (auto-updated!)

---

## 🛠 Troubleshooting

### "No active pricing configuration found"
**Problem**: pricing_config table is empty
**Solution**:
```sql
INSERT INTO pricing_config (base_price, price_per_serving, price_per_tier)
VALUES (50, 1.5, 30);
```

### "Unauthorized" when accessing /admin
**Problem**: User not in admin_users table
**Solution**:
```sql
INSERT INTO admin_users (email, name, role)
VALUES ('your-email@example.com', 'Your Name', 'admin');
```

### Images not uploading
**Problem**: Storage bucket doesn't exist or policies not set
**Solution**:
1. Create `cake-images` bucket in Supabase Dashboard
2. Set to **Public**
3. Run the storage policy SQL commands above

### Templates not appearing in gallery
**Problem**: Database not updated or API failing
**Solution**:
1. Check browser console for errors
2. Verify Supabase URL and keys in `.env.local`
3. Check products exist: `SELECT * FROM products;`
4. Check RLS policies allow public read: `SELECT * FROM products;` (as anon user)

### Prices showing as R0
**Problem**: Frontend can't fetch pricing config
**Solution**:
1. Verify pricing_config has `active = true` row
2. Check RLS policy allows public SELECT on pricing_config
3. Check browser Network tab for `/api/pricing` errors

---

## 📈 Next Steps & Enhancements

### Immediate Improvements
1. **Template Editing**: Edit existing templates (not just create)
2. **Template Duplication**: Clone template as starting point
3. **Bulk Operations**: Delete multiple templates at once
4. **Search/Filter**: Filter templates in admin panel

### Advanced Features
1. **Template Analytics**: Track which templates are most ordered
2. **Pricing History**: Audit log of pricing changes
3. **Image Optimization**: Automatic resize/compress on upload
4. **Draft Templates**: Save work-in-progress before publishing
5. **Multi-Admin**: Role-based permissions (admin, baker, delivery)

### Customer Features
1. **Favorites**: Let customers save favorite templates
2. **Share Templates**: Share custom configurations via URL
3. **Template Reviews**: Rate and review cake templates
4. **Template Suggestions**: AI-powered cake recommendations

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs in Dashboard
3. Verify environment variables are set
4. Check middleware.ts is protecting routes correctly

---

## 🎊 Success Criteria

Your CMS is working when:

✅ Admin can login via `/login`
✅ Admin can change base price → all cakes update
✅ Admin can create new cake template with images
✅ Template appears in gallery immediately
✅ Template shows calculated price
✅ Click "Order Now" → form pre-fills with template
✅ Customer can customize → price updates live
✅ Order submission works end-to-end
✅ Non-admin cannot access `/admin` routes

---

**Congratulations!** Your cake company site is now a full-featured CMS where you control products and pricing entirely through the admin panel - no code deployments needed! 🎂✨
