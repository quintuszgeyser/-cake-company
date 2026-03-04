# Admin Panel Quick Start 🚀

## Login Credentials

**URL**: https://cake-company-six.vercel.app/login

**Setup Required First**:
```sql
-- Run in Supabase SQL Editor to create your admin account
-- Replace with YOUR email and password

INSERT INTO admin_users (email, name, role)
VALUES ('your-email@example.com', 'Your Name', 'admin');
```

Then create the auth user in Supabase Dashboard → Authentication → Users → Add User

---

## Admin Routes

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard overview |
| `/admin/pricing` | **Manage all pricing** |
| `/admin/products` | **List all templates** |
| `/admin/templates/new` | **Create new cake template** |
| `/admin/orders` | View customer orders |
| `/admin/customers` | View customer list |
| `/admin/settings` | Site settings |

---

## Common Tasks

### 1. Create a New Cake Template (5 minutes)

1. Login → Click **Products** → Click **Create New Template**
2. Fill in:
   - **Name**: "Raspberry Dream Cake"
   - **Slug**: Auto-fills to "raspberry-dream-cake"
   - **Description**: "Delicate raspberry layers with white chocolate"
   - **Category**: Birthday
   - **Featured**: ✓ (to show on homepage)
3. **Upload Images**: Click Upload → Select 2-3 cake photos
4. Configure Cake:
   - **Occasion**: Birthday
   - **Type**: Round
   - **Servings**: 14
   - **Tiers**: 2
   - **Flavors**: Vanilla, Raspberry
   - **Filling**: Raspberry Jam
   - **Colors**: Pink, White
   - **Design**: "Two tier cake with fresh raspberry filling and white chocolate shavings"
   - **Dietary**: Vegetarian
5. See **Calculated Price**: R127 (auto-calculated)
6. Click **Create Template**
7. ✅ Template appears in gallery instantly at `/cakes`

### 2. Adjust Pricing (2 minutes)

1. Login → Click **Pricing**
2. Current settings:
   - Base Price: R50
   - Per Serving: R1.50
   - Per Tier: R30
   - Vegan Surcharge: R15
3. Make changes (example: increase base to R60)
4. Click **Save Pricing Configuration**
5. ✅ All cake prices update immediately!

### 3. Feature/Unfeature a Cake (10 seconds)

1. Login → Click **Products**
2. Find the template in the list
3. Click **Feature** or **Unfeature** button
4. ✅ Homepage updates instantly

---

## Understanding Pricing

### Base Configuration
```
Base Price:         R50    (every cake starts here)
Per Serving:        R1.50  (linear per person)
Per Tier:           R30    (each tier beyond first)
Setup Fee:          R25    (venue setup)
```

### Example Calculations

**Simple Cake**:
- 12 servings, 1 tier, Vanilla, Vegetarian
- R50 + (12 × R1.50) = **R68**

**Premium Cake**:
- 20 servings, 2 tiers, Red Velvet, Gluten-Free, Setup
- R50 + (20 × R1.50) + (1 × R30) + R15 + R25 = **R150**

**Wedding Cake**:
- 100 servings, 3 tiers, Multiple flavors, Setup
- R50 + (100 × R1.50) + (2 × R30) + R25 = **R265**

---

## Template Data Structure

When you create a template, it saves:

```json
{
  "name": "Raspberry Dream",
  "slug": "raspberry-dream",
  "description": "...",
  "category": "birthday",
  "featured": true,
  "images": ["https://..."],
  "base_price": 127,  // Calculated
  "template_data": {
    "occasion": "birthday",
    "cakeType": "round",
    "servings": 14,
    "tiers": 2,
    "flavors": ["Vanilla", "Raspberry"],
    "filling": "Raspberry Jam",
    "colorScheme": ["pink", "white"],
    "designDescription": "Two tier cake...",
    "dietary": ["Vegetarian"],
    "setupRequired": false
  }
}
```

When customer clicks "Order Now":
- Form pre-fills with ALL this data
- Customer can modify anything
- Price recalculates in real-time
- Customers get exactly what they want

---

## Tips for Best Results

### Creating Great Templates
- ✅ Use high-quality, well-lit photos
- ✅ Upload multiple angles (2-5 images)
- ✅ Write detailed design descriptions
- ✅ Set realistic serving sizes
- ✅ Feature your best sellers
- ✅ Create variety (different occasions, dietary options)

### Pricing Strategy
- **Base Price**: Cover fixed costs (labor, utilities)
- **Per Serving**: Cover ingredient costs per person
- **Per Tier**: Extra complexity and ingredients
- **Dietary Surcharges**: Special ingredients cost more
- **Setup Fee**: Delivery and setup labor

### Image Guidelines
- **Format**: JPEG, PNG, or WebP
- **Size**: Under 5MB per image
- **Resolution**: At least 800×800px
- **Aspect Ratio**: Square (1:1) or landscape (4:3)
- **Lighting**: Bright, natural light
- **Background**: Clean, minimal distractions

---

## Keyboard Shortcuts (Future)

| Shortcut | Action |
|----------|--------|
| `/` + `p` | Open pricing |
| `/` + `n` | New template |
| `/` + `o` | View orders |
| `Ctrl` + `S` | Save (in forms) |

---

## API Endpoints (For Developers)

### Public
- `GET /api/products` - List all available products
- `GET /api/products?featured=true` - Featured only
- `GET /api/pricing` - Get pricing config
- `POST /api/orders` - Create customer order

### Admin Only
- `GET /api/admin/templates` - List all templates
- `POST /api/admin/templates` - Create template
- `PATCH /api/admin/templates` - Update template
- `DELETE /api/admin/templates?id=xxx` - Delete template
- `PATCH /api/pricing` - Update pricing config
- `POST /api/admin/upload` - Upload image

---

## Support Workflow

### Customer Orders Template
1. Customer browses `/cakes`
2. Clicks "Order Now" on "Raspberry Dream"
3. Form pre-fills with template configuration
4. Customer changes servings: 14 → 20
5. Price updates: R127 → R136
6. Customer submits order
7. You receive order with all details

### Admin Fulfills Order
1. Login → Orders
2. See order for "Raspberry Dream" (customized)
3. Review: 20 servings, 2 tiers, Vanilla + Raspberry
4. Update status: Pending → Confirmed
5. Upload progress photos
6. Mark as Completed

---

## ROI: Why This CMS Matters

### Before (Static Site)
- ❌ Want to add new cake? → Code change + deploy (30 min)
- ❌ Want to adjust prices? → Code change + deploy (30 min)
- ❌ Customer customization? → Starts from scratch
- ❌ Seasonal special? → Manual code update

### After (CMS)
- ✅ Add new cake → Admin panel (5 min) ⚡️ **6x faster**
- ✅ Adjust prices → One form, all cakes update (2 min) ⚡️ **15x faster**
- ✅ Customer orders → Pre-filled from template ⚡️ **Better UX**
- ✅ Seasonal special → Create template, feature it ⚡️ **Instant**

### Business Impact
- **Time Saved**: ~90% reduction in product management time
- **Flexibility**: Launch new products instantly
- **Pricing Control**: A/B test pricing without developers
- **Customer Experience**: Pre-filled forms = higher conversion
- **Scalability**: Add 100 cakes as easily as 1

---

**You now have a production-ready cake company CMS!** 🎂✨

No more code deployments for products or pricing. Just login and manage everything through the beautiful admin panel.
