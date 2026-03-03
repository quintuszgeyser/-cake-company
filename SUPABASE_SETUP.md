# Supabase PostgreSQL Database Setup Guide

This guide will walk you through setting up your PostgreSQL database using Supabase (free tier).

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in the project details:
   - **Name**: `cake-company` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Select **Free** tier
3. Click **"Create new project"**
4. Wait 2-3 minutes for the database to be provisioned

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **API** in the left sidebar
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1...` (long string)
   - **service_role key**: `eyJhbGciOiJIUzI1...` (another long string)

## Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.local.example`
3. Replace the placeholder values with your Supabase credentials:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

## Step 5: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` in your project
4. Copy the entire contents
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for it to complete (you should see "Success. No rows returned")

This will create:
- ✅ All tables (products, customers, orders, reviews, etc.)
- ✅ Indexes for performance
- ✅ Row-level security policies
- ✅ Sample product data (12 cakes)

## Step 6: Verify the Setup

1. In Supabase, go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `products` (with 12 sample cakes)
   - `customers`
   - `orders`
   - `order_status_history`
   - `order_photos`
   - `reviews`
   - `custom_designs`
   - `admin_users`

3. Click on `products` table - you should see 12 rows with cake data

## Step 7: Test the Connection

1. Stop your development server if it's running (Ctrl+C)
2. Restart it:
```bash
npm run dev
```

3. Visit http://localhost:3001/custom-order
4. Fill out the order form
5. Submit the order
6. You should see a success message with an order number!

## Step 8: View Your Orders in Supabase

1. Go to **Table Editor** > **orders** in Supabase
2. You should see your test order!
3. Click on it to view all the details

## Database Schema Overview

### Core Tables

**products** - Store all cake products
- slug, name, description, base_price
- images (array), category, servings
- flavors (array), dietary (array)
- featured, available flags

**customers** - Customer information
- name, email, phone
- Auto-deduplicates by email

**orders** - Customer orders
- Links to customer
- All order details (occasion, cake type, servings, etc.)
- Design specifications (flavors, colors, description)
- Delivery information
- Status tracking
- Payment tracking
- Auto-generates order number

**order_status_history** - Audit trail
- Tracks all status changes
- Timestamps and notes

**reviews** - Customer reviews
- Rating (1-5 stars)
- Comments
- Links to product and customer

## Troubleshooting

### Error: "Invalid API key"
- Double-check your `.env.local` file
- Make sure there are no extra spaces
- Restart your dev server after changing env variables

### Error: "relation does not exist"
- The schema hasn't been run
- Go back to Step 5 and run the SQL script

### Orders not appearing
- Check **Table Editor** > **orders** in Supabase
- Check the browser console for errors (F12)
- Verify your API keys are correct

### Connection refused
- Make sure your Supabase project is active (not paused)
- Free tier projects pause after 1 week of inactivity
- Click "Resume project" if needed

## Free Tier Limits

✅ **Included Free:**
- 500MB database storage
- 2GB bandwidth per month
- Unlimited API requests
- Up to 50,000 monthly active users
- 7 days of daily backups

Perfect for development and small-scale production!

## Next Steps

Once your database is set up:

1. ✅ **Test the order form** - Submit a few test orders
2. ✅ **Build admin panel** - View and manage orders
3. ✅ **Add authentication** - Secure the admin area
4. ✅ **Deploy to Vercel** - Make it live!

## Security Notes

- ✅ Row-level security (RLS) is enabled
- ✅ Public can only read products
- ✅ Customers can only see their own orders
- ✅ Admin routes need authentication (Phase 2)

## Support

- Supabase Docs: https://supabase.com/docs
- Community: https://supabase.com/community
- Discord: https://discord.supabase.com

---

**You're all set!** Your PostgreSQL database is ready to store real orders. 🎉
