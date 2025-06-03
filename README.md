# SiteClone Wizard

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)](https://nextjs.org/)

AI-Powered Website Generator for Independent Used Car Dealerships

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Generated Website Features](#generated-website-features)
- [Configuration Options](#configuration-options)
- [API Endpoints](#api-endpoints)
- [Running Generated Sites](#running-generated-sites)
- [Development](#development)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

SiteClone Wizard (formerly Auto Dealer Website Builder) is a specialized AI-powered tool that helps independent used car dealerships create professional, feature-rich websites in minutes. Instead of directly cloning websites, it uses AI to generate unique, customized dealership sites with all the features modern car buyers expect.

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

- Node.js 18.0 or higher
- pnpm (recommended) or npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ammanabbasi/siteclone-wizard.git
cd siteclone-wizard

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Visit `http://localhost:3000` to start building your dealership website.

## Project Structure

```
siteclone-wizard/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   │   ├── ai-build/ # Pure AI generation
│   │   │   ├── ai-enhance/ # Content enhancement
│   │   │   ├── ai-inspire/ # Inspiration-based generation
│   │   │   ├── clone/    # Website cloning functionality
│   │   │   ├── download/ # File download handling
│   │   │   ├── launch/   # Site deployment
│   │   │   ├── preview/  # Site preview
│   │   │   └── test-scrape/ # Scraping utilities
│   │   ├── debug/        # Debug interface
│   │   ├── preview/      # Preview pages
│   │   ├── quick-preview/ # Quick preview
│   │   ├── test/         # Test interface
│   │   └── page.tsx      # Main UI
│   ├── cli/              # Command-line interface
│   ├── components/       # React components
│   └── lib/              # Core logic
│       ├── dealership/   # Dealership-specific builders
│       ├── scraper/      # Web scraping utilities
│       ├── parser/       # HTML parsing
│       ├── generator/    # Code generation
│       └── types.ts      # TypeScript types
├── output/               # Generated websites
├── tests/                # Test files
└── docs/                 # Documentation
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

## Development

### Prerequisites

- Node.js 18.0 or higher
- pnpm (recommended) or npm
- Git

### Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Optional: Configure AI services
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Configure deployment
VERCEL_TOKEN=your_vercel_token_here
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests with Playwright
pnpm test:e2e
```

## Security Notes

- Generated sites have all external links disabled by default
- No actual inventory data is included (placeholder only)
- All scraped content is sanitized and replaced with generic placeholders
- API keys and sensitive data are never included

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/ammanabbasi/siteclone-wizard/issues)
- 💬 [Discussions](https://github.com/ammanabbasi/siteclone-wizard/discussions)
- 📧 [Contact](mailto:support@example.com)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/) and [Anthropic](https://anthropic.com/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ for independent used car dealerships
