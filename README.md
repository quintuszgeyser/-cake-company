# Cake Company Website

A next-level cake company website with custom ordering, 3D cake customization, and full e-commerce capabilities.

## Tech Stack

- **Frontend**: Next.js 14+ with React and TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: PostgreSQL via Supabase
- **Payments**: Stripe
- **Hosting**: Vercel (Frontend) + Supabase (Database)
- **Storage**: Cloudflare R2

## Features

- 🎨 Interactive 3D Cake Customizer
- 🍰 Smart Product Gallery
- 📱 Mobile-responsive design
- 🔒 Secure payment processing
- 📊 Admin dashboard
- 📧 Automated order notifications
- 🎂 Real-time order tracking

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Development Phases

### Phase 1: MVP (Current)
- ✅ Project setup
- ⏳ Homepage with hero
- ⏳ Product gallery
- ⏳ Order form
- ⏳ Basic admin panel

### Phase 2: E-Commerce
- Stripe integration
- Order tracking
- Email notifications

### Phase 3: Enhanced UX
- Animations
- Size visualizer
- Smart calendar

### Phase 4: Next-Level Features
- 3D cake customizer
- AR preview
- Personality quiz

## Project Structure

```
cake-company/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── cake/           # Cake-related components
│   ├── order/          # Order form components
│   ├── admin/          # Admin panel components
│   └── shared/         # Shared components
├── lib/                # Utilities and config
│   └── db/             # Database client and queries
├── types/              # TypeScript type definitions
├── public/             # Static assets
└── README.md

## License

Private project - All rights reserved
