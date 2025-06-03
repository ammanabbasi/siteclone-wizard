# Auto Dealer Website Builder

AI-Powered Website Generator for Independent Used Car Dealerships

## Overview

Auto Dealer Website Builder (formerly SiteClone Wizard) is a specialized AI-powered tool that helps independent used car dealerships create professional, feature-rich websites in minutes. Instead of directly cloning websites, it uses AI to generate unique, customized dealership sites with all the features modern car buyers expect.

## Key Features

### 🚗 Dealership-Specific Features

- **Inventory Management**: Customizable vehicle inventory with search filters
- **Financing Calculator**: Interactive payment calculator with partner integration
- **Trade-In Forms**: Capture and evaluate trade-in opportunities
- **Service Scheduling**: Allow customers to book service appointments
- **Customer Reviews**: Testimonial sections with ratings
- **Dealer Information**: Hours, location, license, and certifications display

### 🤖 AI-Powered Generation

- **Unique Content**: AI generates original content tailored to your dealership
- **Smart Layouts**: Professional designs optimized for car dealerships
- **SEO Optimization**: Built-in SEO best practices for local search
- **Mobile Responsive**: Automatically responsive on all devices

### 🎨 Full Customization

- **Brand Colors**: Complete control over color scheme
- **Typography**: Choose from professional font families
- **Contact Info**: Add all your dealership details
- **Social Media**: Integrate your social profiles
- **Business Hours**: Display sales and service hours

## How It Works

1. **Choose Build Mode**:

   - **AI Build**: Let AI create a completely unique dealership website
   - **Use Inspiration**: Provide a URL for design inspiration (optional)

2. **Customize Your Brand**:

   - Enter your dealership name and details
   - Choose your colors and styling
   - Add contact information and hours

3. **Generate & Preview**:
   - AI builds your complete website
   - Preview it instantly in your browser
   - Download the full source code

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Git (optional, for cloning)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/auto-dealer-website-builder.git
cd auto-dealer-website-builder

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Visit `http://localhost:3000` to start building your dealership website.

## Project Structure

```
auto-dealer-website-builder/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   │   ├── ai-build/ # Pure AI generation
│   │   │   └── ai-inspire/ # Inspiration-based generation
│   │   └── page.tsx      # Main UI
│   ├── components/       # React components
│   └── lib/              # Core logic
│       ├── used-car-dealership-builder.ts  # Dealership-specific builder
│       ├── ai-enhancer.ts                  # AI content generation
│       └── types.ts                        # TypeScript types
├── output/               # Generated websites
└── package.json
```

## Generated Website Features

Each generated dealership website includes:

### Homepage Sections

- Hero section with call-to-action buttons
- Inventory search bar with filters
- Featured vehicles gallery
- Financing information and calculator
- Trade-in value estimator
- About the dealership
- Services offered
- Customer testimonials
- Dealership information (hours, license, etc.)
- Contact form and location

### Technical Features

- Next.js 14 with React 18
- TypeScript for type safety
- Responsive design
- SEO metadata
- Placeholder vehicle inventory
- Disabled external links (for safety)
- Production-ready code

## Configuration Options

### Dealership Configuration

```typescript
{
  dealership: {
    dealerLicense: "DL-12345",
    salesHours: {
      weekday: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM"
    },
    inventory: {
      source: "manual" | "api" | "csv" | "xml",
      placeholderCount: 50
    },
    financing: {
      partners: ["Capital One", "Chase Auto"],
      creditRange: "All credit types welcome"
    },
    services: ["Oil Change", "Tire Rotation", "Brake Service"],
    certifications: ["BBB Accredited", "CarFax Dealer"]
  }
}
```

## API Endpoints

### POST /api/ai-build

Generate a dealership website using pure AI.

### POST /api/ai-inspire

Generate a dealership website with optional URL inspiration.

### GET /api/preview/:id

Preview the generated website.

### GET /api/download/:id

Download the generated website as a ZIP file.

## Running Generated Sites

After downloading your generated dealership website:

```bash
# Extract the ZIP file
unzip your-dealership-site.zip
cd your-dealership-site

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Security Notes

- Generated sites have all external links disabled by default
- No actual inventory data is included (placeholder only)
- All scraped content is sanitized and replaced with generic placeholders
- API keys and sensitive data are never included

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ for independent used car dealerships
