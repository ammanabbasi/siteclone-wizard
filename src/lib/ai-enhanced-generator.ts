import * as fs from 'fs/promises'
import * as path from 'path'
import { BrandConfig } from './types'
import { AIWebsiteBuilder } from './ai-website-builder'
import { logger } from './logger'

export interface AIGeneratorOptions {
  outputDir: string
  brandConfig: BrandConfig
}

export class AIEnhancedGenerator {
  constructor(private options: AIGeneratorOptions) {}

  async generate() {
    logger.info('🤖 AI is generating a complete professional website')

    // Create project structure
    await this.createProjectStructure()

    // Build professional website with AI
    const aiBuilder = new AIWebsiteBuilder()
    const website = await aiBuilder.buildProfessionalWebsite(this.options.brandConfig)

    // Generate package.json
    await this.generatePackageJson()

    // Generate the main page with AI-generated layout
    await this.generateMainPage(website)

    // Generate layout with SEO metadata
    await this.generateLayout(website)

    // Generate configuration files
    await this.generateConfigs()

    // Generate brand config file
    await this.generateBrandConfig()

    // Generate placeholder images
    await this.generatePlaceholderImages()

    logger.info('✨ AI-powered website generation complete')
  }

  async createProjectStructure() {
    const dirs = ['src/app', 'src/lib', 'public/assets', 'public/images']

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

  async generateMainPage(website: any) {
    // Combine all sections into a single HTML string
    const sectionsHtml = website.sections.map((section: any) => section.content).join('\n')

    const pageCode = `'use client'

import { useEffect } from 'react'
import brandConfig from '@/lib/brand-config.json'

export default function Home() {
  useEffect(() => {
    // Handle link clicks for demo
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const targetId = link.getAttribute('href')?.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (link && !link.getAttribute('href')?.startsWith('mailto:') && 
                 !link.getAttribute('href')?.startsWith('tel:')) {
        e.preventDefault()
        alert('This is a preview. External links are disabled.')
      }
    }
    
    document.addEventListener('click', handleLinkClick)
    
    // Disable form submissions
    const handleFormSubmit = (e: Event) => {
      e.preventDefault()
      alert('This is a preview. Form submissions are disabled.')
    }
    
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', handleFormSubmit)
    })
    
    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [])

  return (
    <>
      <style jsx global>{\`
        ${website.globalStyles}
      \`}</style>
      <div
        dangerouslySetInnerHTML={{
          __html: \`${this.escapeForTemplate(sectionsHtml)}\`
        }}
      />
    </>
  )
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/page.tsx'), pageCode)
  }

  private escapeForTemplate(html: string): string {
    return html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
  }

  async generateLayout(website: any) {
    // Ensure keywords is an array
    const keywords = Array.isArray(website.metadata.keywords)
      ? website.metadata.keywords
      : typeof website.metadata.keywords === 'string'
        ? [website.metadata.keywords]
        : ['professional', 'business', 'website', this.options.brandConfig.name]

    const layoutCode = `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${website.metadata.title || this.options.brandConfig.name}',
  description: '${website.metadata.description || this.options.brandConfig.tagline || 'Welcome to ' + this.options.brandConfig.name}',
  keywords: '${keywords.join(', ')}',
  openGraph: {
    title: '${website.metadata.title || this.options.brandConfig.name}',
    description: '${website.metadata.description || this.options.brandConfig.tagline || 'Welcome to ' + this.options.brandConfig.name}',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="${this.options.brandConfig.favicon || '/favicon.ico'}" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/layout.tsx'), layoutCode)
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

This website was generated using SiteClone Wizard with AI technology.

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

- ✨ AI-generated professional layout
- 🎨 Custom brand colors and typography
- 📱 Fully responsive design
- 🚀 Optimized for performance
- 🔍 SEO-friendly structure
- 🤖 Industry-specific content

## Technology Stack

- Next.js 14
- React 18
- TypeScript
- AI-powered content generation

Generated with ❤️ by SiteClone Wizard AI
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
