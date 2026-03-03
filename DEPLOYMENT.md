# Deploy to Vercel - Complete Guide

This guide will walk you through deploying your cake company website to Vercel (for free!).

## Prerequisites

- ✅ Supabase database set up (with `.env.local` configured)
- ✅ Website working locally
- ✅ GitHub account (create one at https://github.com if needed)
- ✅ Vercel account (we'll create this)

## Step 1: Initialize Git Repository

Open your terminal in the project folder and run:

```bash
cd "C:/Users/CP368103/OneDrive - Capitec Bank Ltd/Documents/Pers/Quintusz/Projects/claude/cake-company"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Cake Company Website"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if you don't have it
# Download from: https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository and push
gh repo create cake-company --private --source=. --remote=origin --push
```

### Option B: Using GitHub Website
1. Go to https://github.com/new
2. Repository name: `cake-company`
3. Description: "Next-level cake company website with custom ordering"
4. Choose **Private** (recommended) or Public
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

7. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/cake-company.git
git branch -M main
git push -u origin main
```

## Step 3: Create Vercel Account

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Complete the signup

## Step 4: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find your `cake-company` repository
4. Click **"Import"**

**Configure Project:**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

**Environment Variables** (IMPORTANT):
Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Copy these from your `.env.local` file!

5. Click **"Deploy"**
6. Wait 2-3 minutes for deployment to complete
7. You'll get a URL like: `https://cake-company-xyz.vercel.app`

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (choose your account)
# - Link to existing project? N
# - Project name? cake-company
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Deploy to production
vercel --prod
```

## Step 5: Verify Deployment

1. Visit your Vercel URL (e.g., `https://cake-company-xyz.vercel.app`)
2. Check the homepage loads
3. Test the gallery: `/cakes`
4. Test the order form: `/custom-order`
5. Try submitting an order
6. Login to admin: `/admin` (password: `admin123`)
7. Verify order appears in admin dashboard

## Step 6: Configure Custom Domain (Optional)

### Free Subdomain (Included)
Your Vercel URL is already live: `https://cake-company-xyz.vercel.app`

### Custom Domain ($10-15/year)

1. Buy a domain from:
   - Namecheap: https://namecheap.com
   - Porkbun: https://porkbun.com
   - Google Domains: https://domains.google
   - Cloudflare: https://cloudflare.com

2. In Vercel Dashboard:
   - Go to your project
   - Click **"Settings"** → **"Domains"**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `cakecompany.com`)
   - Click **"Add"**

3. Configure DNS:
   - Copy the nameservers or DNS records Vercel provides
   - Add them to your domain registrar
   - Wait 24-48 hours for DNS propagation

4. Vercel will automatically:
   - Provision SSL certificate (HTTPS)
   - Handle www redirects
   - Enable automatic deployments

## Step 7: Environment Variables Checklist

Make sure these are set in Vercel:

### Required (From Supabase):
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Optional (For future features):
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (when you add Stripe)
- `STRIPE_SECRET_KEY` (when you add Stripe)

**How to add environment variables in Vercel:**
1. Go to your project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable for **Production**, **Preview**, and **Development**
4. Click **"Save"**
5. Redeploy: **"Deployments"** → Three dots → **"Redeploy"**

## Step 8: Automatic Deployments

Once connected, Vercel will automatically deploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update homepage design"
git push origin main

# Vercel automatically deploys in ~2 minutes!
```

**Preview Deployments:**
- Every branch gets its own preview URL
- Test before merging to main
- Share with team for feedback

## Troubleshooting

### Build Failed
**Error**: "Module not found"
- Solution: Check all dependencies are in `package.json`
- Run: `npm install` and `git push`

**Error**: "Environment variable not defined"
- Solution: Add missing env variables in Vercel settings
- Redeploy after adding

### Site Not Loading
**Check**:
1. Deployment status is "Ready" (green)
2. Environment variables are set
3. Supabase project is active (not paused)
4. Clear browser cache (Ctrl+Shift+R)

### Database Connection Failed
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project status
- Check Row Level Security policies

### 404 on Routes
- Check `next.config.ts` is committed
- Check all pages are in the `app` directory
- Redeploy

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN (fast worldwide)
- ✅ Image optimization
- ✅ Automatic caching
- ✅ Edge functions
- ✅ Zero-config SSL

**Additional Tips:**
1. Use Next.js `<Image>` component (already doing this)
2. Enable ISR for product pages
3. Use `loading.tsx` for better UX
4. Monitor with Vercel Analytics (free)

## Monitoring & Analytics

### Vercel Analytics (Free)
1. Go to project dashboard
2. Click **"Analytics"**
3. Enable **"Vercel Analytics"**
4. Get real-time visitor stats

### Vercel Speed Insights (Free)
1. Install: `npm install @vercel/speed-insights`
2. Add to `app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

// In your component:
<SpeedInsights />
```

## Cost Breakdown

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics
- ✅ Custom domains (1 per project)

### When You Might Need Pro ($20/month):
- More than 100GB bandwidth
- More than 100 deployments/day
- Advanced analytics
- Team collaboration

**For most small businesses, free tier is more than enough!**

## Security Best Practices

1. ✅ **Never commit `.env.local`** (already in .gitignore)
2. ✅ **Use environment variables** in Vercel for secrets
3. ✅ **Enable Vercel Authentication** for admin routes (future)
4. ✅ **Keep dependencies updated**: `npm update`
5. ✅ **Monitor deployment logs** for errors

## Post-Deployment Checklist

- [ ] Website loads successfully
- [ ] All pages accessible (home, gallery, order form, admin)
- [ ] Order form submits successfully
- [ ] Orders appear in Supabase database
- [ ] Orders appear in admin dashboard
- [ ] Images load correctly
- [ ] Mobile responsive on real devices
- [ ] Admin login works
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Check browser console for errors (F12)
- [ ] Test on mobile (scan QR code from Vercel dashboard)

## Updating Your Live Site

Whenever you make changes:

```bash
# Make your changes
# Test locally: npm run dev

# Commit and push
git add .
git commit -m "Describe your changes"
git push origin main

# Vercel automatically deploys! ✨
```

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Discord**: https://vercel.com/discord
- **Vercel Support**: https://vercel.com/support

## What's Next?

Your website is live! Now you can:
1. 📣 Share your URL with customers
2. 💳 Add Stripe for real payments (Phase 2)
3. 📧 Set up email notifications (Phase 2)
4. 📱 Add WhatsApp/SMS notifications (Phase 2)
5. 🎨 Build the 3D cake designer (Phase 4)
6. 📊 Monitor analytics and improve

---

**Congratulations! Your next-level cake company website is now live on the internet! 🎉🎂**

Your site is:
- ⚡ Fast (global CDN)
- 🔒 Secure (automatic HTTPS)
- 📱 Responsive (works on all devices)
- 🆓 Free (no hosting costs!)
