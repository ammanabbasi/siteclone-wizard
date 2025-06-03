import * as fs from 'fs/promises'
import * as path from 'path'
import { BrandConfig } from './types'
import {
  MultiPageDealershipBuilder,
  DealershipConfig,
} from './multi-page-dealership-builder'

export interface AIGeneratorOptions {
  outputDir: string
  brandConfig: BrandConfig
}

export interface MultiPageGeneratorOptions {
  // ... existing code ...
}

export class MultiPageEnhancedGenerator {
  constructor(private options: AIGeneratorOptions) {}

  async generate() {
    console.log('🤖 Generating multi-page dealership website...')

    // Build multi-page website
    const builder = new MultiPageDealershipBuilder()
    const website = await builder.buildMultiPageDealership(
      this.options.brandConfig as DealershipConfig
    )

    // Create project structure
    await this.createProjectStructure()

    // Generate package.json
    await this.generatePackageJson()

    // Generate all pages
    for (const page of website.pages) {
      await this.generatePage(page)
    }

    // Generate layout
    await this.generateLayout(website.layout)

    // Generate configuration files
    await this.generateConfigs()

    // Generate brand config file
    await this.generateBrandConfig()

    // Generate global CSS
    await this.generateGlobalStyles(website.globalStyles)

    // Generate placeholder images
    await this.generatePlaceholderImages()

    console.log('✨ Multi-page dealership website generation complete!')
  }

  async createProjectStructure() {
    const dirs = [
      'src/app',
      'src/app/inventory',
      'src/app/financing',
      'src/app/about',
      'src/app/services',
      'src/app/trade-in',
      'src/app/contact',
      'src/lib',
      'src/styles',
      'public/assets',
      'public/images',
    ]

    for (const dir of dirs) {
      await fs.mkdir(path.join(this.options.outputDir, dir), { recursive: true })
    }
  }

  async generatePackageJson() {
    const packageJson = {
      name: this.options.brandConfig.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        typescript: '^5.0.0',
      },
    }

    await fs.writeFile(
      path.join(this.options.outputDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )
  }

  async generatePage(page: { path: string; content: string }) {
    const pagePath = path.join(this.options.outputDir, page.path)
    await fs.writeFile(pagePath, page.content)
  }

  async generateLayout(layoutContent: string) {
    await fs.writeFile(path.join(this.options.outputDir, 'src/app/layout.tsx'), layoutContent)
  }

  async generateGlobalStyles(styles: string) {
    await fs.writeFile(path.join(this.options.outputDir, 'src/styles/globals.css'), styles)
  }

  async generateConfigs() {
    // Generate next.config.js
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
`

    await fs.writeFile(path.join(this.options.outputDir, 'next.config.js'), nextConfig)

    // Generate tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next',
          },
        ],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }

    await fs.writeFile(
      path.join(this.options.outputDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    )

    // Generate README
    const readme = `# ${this.options.brandConfig.name}

This is a professional multi-page dealership website generated using Auto Dealer Website Builder.

## Getting Started

First, install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- ✨ Multi-page layout with proper navigation
- 🚗 Dedicated pages for inventory, financing, trade-in, and more
- 🎨 Custom brand colors and typography
- 📱 Fully responsive design
- 🚀 Optimized for performance
- 🔍 SEO-friendly structure
- 💳 Financing calculator
- 📋 Trade-in forms
- 📞 Contact forms

## Pages

- **Home** - Main landing page with featured vehicles
- **Inventory** - Browse all available vehicles with filters
- **Financing** - Payment calculator and financing information
- **Trade-In** - Get a quote for your current vehicle
- **About** - Learn about the dealership
- **Services** - View available services
- **Contact** - Get in touch and find location

## Technology Stack

- Next.js 14
- React 18
- TypeScript
- AI-powered content generation

Generated with ❤️ by Auto Dealer Website Builder
`

    await fs.writeFile(path.join(this.options.outputDir, 'README.md'), readme)
  }

  async generateBrandConfig() {
    await fs.writeFile(
      path.join(this.options.outputDir, 'src/lib/brand-config.json'),
      JSON.stringify(this.options.brandConfig, null, 2)
    )
  }

  async generatePlaceholderImages() {
    // Create simple SVG placeholder images
    const placeholders = {
      'placeholder-logo.svg': this.createSvgPlaceholder(
        'Logo',
        200,
        60,
        this.options.brandConfig.colors.primary
      ),
      'placeholder-about.jpg': this.createSvgPlaceholder(
        'About Us',
        600,
        400,
        this.options.brandConfig.colors.secondary
      ),
      'placeholder-car.jpg': this.createSvgPlaceholder(
        'Vehicle',
        400,
        300,
        this.options.brandConfig.colors.accent
      ),
      'placeholder-car-lot.jpg': this.createSvgPlaceholder(
        'Car Lot',
        1200,
        600,
        this.options.brandConfig.colors.primary
      ),
      'favicon.ico': this.createSvgPlaceholder('', 32, 32, this.options.brandConfig.colors.primary),
    }

    const publicDir = path.join(this.options.outputDir, 'public')
    await fs.mkdir(publicDir, { recursive: true })

    for (const [filename, svgContent] of Object.entries(placeholders)) {
      await fs.writeFile(path.join(publicDir, filename), svgContent)
    }
  }

  private createSvgPlaceholder(text: string, width: number, height: number, color: string): string {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}20"/>
      <rect x="0" y="0" width="${width}" height="${height}" fill="${color}" opacity="0.1"/>
      ${
        text
          ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}" fill="${color}">
        ${text}
      </text>`
          : ''
      }
    </svg>`
  }
}
