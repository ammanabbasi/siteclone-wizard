import * as fs from 'fs/promises'
import * as path from 'path'
import { EnhancedParseResult } from './enhanced-parser'
import { BrandConfig } from './types'
import { ContentSanitizer } from './content-sanitizer'
import { logger } from './logger'

export interface EnhancedGeneratorOptions {
  outputDir: string
  brandConfig: BrandConfig
  parseResult: EnhancedParseResult
}

export class EnhancedCodeGenerator {
  constructor(private options: EnhancedGeneratorOptions) {}

  async generate() {
    logger.info('Generating enhanced Next.js project')

    // Check if AI is enabled
    const useAI =
      process.env.ENABLE_AI_CONTENT_GENERATION === 'true' &&
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'

    if (useAI) {
      logger.info('🤖 AI content generation enabled')

      // Use AI-powered sanitizer
      const { AIContentSanitizer } = await import('./ai-content-sanitizer')
      const aiSanitizer = new AIContentSanitizer(
        this.options.parseResult.fullHtml,
        this.options.brandConfig,
        this.options.brandConfig.industry
      )
      this.options.parseResult.fullHtml = await aiSanitizer.sanitizeWithAI()
    } else {
      // Regular sanitization
      const sanitizer = new ContentSanitizer(
        this.options.parseResult.fullHtml,
        this.options.brandConfig
      )
      this.options.parseResult.fullHtml = sanitizer.sanitize()
    }

    // Create project structure
    await this.createProjectStructure()

    // Generate package.json
    await this.generatePackageJson()

    // Generate the main page with full HTML
    await this.generateMainPage()

    // Generate layout
    await this.generateLayout()

    // Copy assets
    await this.copyAssets()

    // Generate configuration files
    await this.generateConfigs()

    // Generate brand config file
    await this.generateBrandConfig()

    // Generate placeholder images
    await this.generatePlaceholderImages()

    logger.info('Enhanced project generation complete')
  }

  private async createProjectStructure() {
    const dirs = ['src/app', 'src/lib', 'public/assets', 'public/fonts']

    for (const dir of dirs) {
      await fs.mkdir(path.join(this.options.outputDir, dir), { recursive: true })
    }
  }

  private async generatePackageJson() {
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

  private async generateMainPage() {
    // Fix asset paths in the HTML content first
    let processedHtml = this.options.parseResult.fullHtml

    // Update asset paths to point to public directory
    processedHtml = processedHtml
      .replace(/\/assets\/assets\//g, '/assets/')
      .replace(/\/Content\/images\//g, '/assets/')
      .replace(/\/content\/images\//g, '/assets/')
      .replace(/href="\/Content\/css\//g, 'href="/assets/')
      .replace(/href="\/content\/css\//g, 'href="/assets/')
      .replace(/src="\/Content\//g, 'src="/assets/')
      .replace(/src="\/content\//g, 'src="/assets/')
      .replace(/url\(['"]?\/Content\//g, "url('/assets/")
      .replace(/url\(['"]?\/content\//g, "url('/assets/")

    // Extract body content from the full HTML
    const bodyMatch = processedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    const bodyContent = bodyMatch ? bodyMatch[1] : processedHtml

    // Properly escape the content for use in a template literal
    const escapedBodyContent = this.escapeForTemplate(bodyContent)

    // Create a Next.js page that renders the body content
    const pageCode = `'use client'

import { useEffect } from 'react'
import brandConfig from '@/lib/brand-config.json'
import './page-styles.css'

export default function Home() {
  useEffect(() => {
    // Apply any dynamic brand replacements if needed
    const updateBrandElements = () => {
      // Update any remaining brand text dynamically
      document.querySelectorAll('*').forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
          const text = el.textContent || ''
          if (text.includes('Auto Trademark')) {
            el.textContent = text.replace(/Auto Trademark/gi, brandConfig.name)
          }
        }
      })
    }
    
    // Wait for content to be rendered
    setTimeout(() => {
      updateBrandElements()
      
      // Make all links work as preview-only (no navigation)
      const handleLinkClick = (e: Event) => {
        const target = e.target as HTMLElement
        const link = target.closest('a')
        
        if (link && link.getAttribute('href') && 
            !link.getAttribute('href')?.startsWith('mailto:') && 
            !link.getAttribute('href')?.startsWith('tel:')) {
          e.preventDefault()
          alert('This is a preview. Links are disabled.')
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
    }, 100)
  }, [])

  return (
    <div
      id="main-content"
      dangerouslySetInnerHTML={{
        __html: \`${escapedBodyContent}\`
      }}
    />
  )
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/page.tsx'), pageCode)

    // Generate page-specific styles
    const pageStyles = `/* Page-specific styles to ensure content displays properly */
#main-content {
  min-height: 100vh;
}

/* Ensure all interactive elements show pointer cursor */
#main-content a,
#main-content button,
#main-content input[type="submit"],
#main-content input[type="button"],
#main-content [onclick] {
  cursor: pointer;
}

/* Style disabled state for preview */
#main-content a:not([href^="mailto:"]):not([href^="tel:"]) {
  position: relative;
}

/* Brand color overrides */
#main-content .btn-primary,
#main-content .button-primary,
#main-content [class*="btn-primary"] {
  background-color: var(--primary-color) !important;
}

#main-content .text-primary,
#main-content [class*="text-primary"] {
  color: var(--primary-color) !important;
}

/* Placeholder image styles */
#main-content img[src*="placeholder"] {
  background: #f0f0f0;
  border: 1px solid #ddd;
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/page-styles.css'), pageStyles)
  }

  private escapeForTemplate(html: string): string {
    // First, remove all HTML comments as they break JSX
    html = html.replace(/<!--[\s\S]*?-->/g, '')

    // Fix self-closing tags before escaping
    html = html
      .replace(/<img([^>]*)>/g, '<img$1 />')
      .replace(/<br([^>]*)>/g, '<br$1 />')
      .replace(/<hr([^>]*)>/g, '<hr$1 />')
      .replace(/<input([^>]*)>/g, '<input$1 />')
      .replace(/<link([^>]*)>/g, '<link$1 />')
      .replace(/<meta([^>]*)>/g, '<meta$1 />')
      .replace(/<area([^>]*)>/g, '<area$1 />')
      .replace(/<base([^>]*)>/g, '<base$1 />')
      .replace(/<col([^>]*)>/g, '<col$1 />')
      .replace(/<embed([^>]*)>/g, '<embed$1 />')
      .replace(/<source([^>]*)>/g, '<source$1 />')
      .replace(/<track([^>]*)>/g, '<track$1 />')
      .replace(/<wbr([^>]*)>/g, '<wbr$1 />')

    // Fix Windows path backslashes in URLs (common issue)
    html = html.replace(/src="([^"]*\\[^"]*)"/g, (match, path) => {
      return `src="${path.replace(/\\/g, '/')}"`
    })

    // Escape backticks and dollar signs for template literal
    return html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
  }

  private escapeForJsx(html: string): string {
    // Remove all HTML comments first
    html = html.replace(/<!--[\s\S]*?-->/g, '')

    // Fix self-closing tags
    html = html
      .replace(/<img([^>]*)>/g, '<img$1 />')
      .replace(/<br([^>]*)>/g, '<br$1 />')
      .replace(/<hr([^>]*)>/g, '<hr$1 />')
      .replace(/<input([^>]*)>/g, '<input$1 />')
      .replace(/<link([^>]*)>/g, '<link$1 />')
      .replace(/<meta([^>]*)>/g, '<meta$1 />')
      .replace(/<area([^>]*)>/g, '<area$1 />')
      .replace(/<base([^>]*)>/g, '<base$1 />')
      .replace(/<col([^>]*)>/g, '<col$1 />')
      .replace(/<embed([^>]*)>/g, '<embed$1 />')
      .replace(/<source([^>]*)>/g, '<source$1 />')
      .replace(/<track([^>]*)>/g, '<track$1 />')
      .replace(/<wbr([^>]*)>/g, '<wbr$1 />')

    // Fix Windows path backslashes
    html = html.replace(/src="([^"]*\\[^"]*)"/g, (match, path) => {
      return `src="${path.replace(/\\/g, '/')}"`
    })

    // Escape backticks and dollar signs for template literal
    return (
      html
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')
        // Convert to JSX syntax
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        // Remove problematic script tags that might break React
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove any remaining event handlers
        .replace(/\son\w+="[^"]*"/g, '')
        .replace(/\son\w+='[^']*'/g, '')
    )
  }

  private convertHtmlToJsx(html: string): string {
    // Remove HTML comments first
    html = html.replace(/<!--[\s\S]*?-->/g, '')

    return (
      html
        // Convert HTML attributes to JSX
        .replace(/class="/g, 'className="')
        .replace(/for="/g, 'htmlFor="')
        .replace(/charset="/g, 'charSet="')
        .replace(/tabindex="/g, 'tabIndex="')
        .replace(/colspan="/g, 'colSpan="')
        .replace(/rowspan="/g, 'rowSpan="')
        .replace(/frameborder="/g, 'frameBorder="')
        .replace(/allowfullscreen/g, 'allowFullScreen')
        .replace(/autocomplete="/g, 'autoComplete="')
        .replace(/autofocus/g, 'autoFocus')
        .replace(/contenteditable="/g, 'contentEditable="')
        .replace(/crossorigin="/g, 'crossOrigin="')
        .replace(/datetime="/g, 'dateTime="')
        .replace(/enctype="/g, 'encType="')
        .replace(/formaction="/g, 'formAction="')
        .replace(/formenctype="/g, 'formEncType="')
        .replace(/formmethod="/g, 'formMethod="')
        .replace(/formnovalidate/g, 'formNoValidate')
        .replace(/formtarget="/g, 'formTarget="')
        .replace(/hreflang="/g, 'hrefLang="')
        .replace(/inputmode="/g, 'inputMode="')
        .replace(/maxlength="/g, 'maxLength="')
        .replace(/minlength="/g, 'minLength="')
        .replace(/novalidate/g, 'noValidate')
        .replace(/readonly/g, 'readOnly')
        .replace(/spellcheck="/g, 'spellCheck="')
        .replace(/srcset="/g, 'srcSet="')
        .replace(/usemap="/g, 'useMap="')
        // Self-closing tags
        .replace(
          /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*)>/g,
          '<$1$2 />'
        )
        // Remove XML declarations and comments that might break JSX
        .replace(/<\?xml[^>]*>/g, '')
        .replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/g, '')
    )
  }

  private async generateLayout() {
    // Extract head content from the full HTML
    this.options.parseResult.fullHtml.match(/<head[^>]*>([\s\S]*)<\/head>/i)

    const layoutCode = `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${this.options.brandConfig.name}',
  description: '${this.options.brandConfig.tagline || 'Built with SiteClone Wizard'}',
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
        ${this.options.parseResult.stylesheets
          .map(
            (css) =>
              `<style dangerouslySetInnerHTML={{ __html: \`${this.escapeForTemplate(css)}\` }} />`
          )
          .join('\n        ')}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/layout.tsx'), layoutCode)

    // Generate minimal globals.css since styles are embedded in HTML
    const globalsCss = `/* Brand overrides are injected directly into the HTML */
body {
  margin: 0;
  padding: 0;
  font-family: ${this.options.brandConfig.typography.fontFamily || 'sans-serif'};
}

/* Apply brand colors as CSS variables */
:root {
  --primary-color: ${this.options.brandConfig.colors.primary};
  --secondary-color: ${this.options.brandConfig.colors.secondary};
  --accent-color: ${this.options.brandConfig.colors.accent};
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/globals.css'), globalsCss)
  }

  private async copyAssets() {
    if (!this.options.parseResult.assets || this.options.parseResult.assets.length === 0) {
      logger.info('No assets to copy')
      return
    }

    logger.info('Copying assets', { count: this.options.parseResult.assets.length })

    const publicAssetsDir = path.join(this.options.outputDir, 'public/assets')
    await fs.mkdir(publicAssetsDir, { recursive: true })

    for (const asset of this.options.parseResult.assets) {
      try {
        const sourcePath = path.join(this.options.outputDir, asset.localPath)
        const destPath = path.join(publicAssetsDir, path.basename(asset.localPath))

        try {
          await fs.access(sourcePath)
          await fs.copyFile(sourcePath, destPath)
          logger.debug('Copied asset', { filename: path.basename(asset.localPath) })
        } catch (error) {
          // Try alternative path
          const altSourcePath = path.join(
            path.dirname(this.options.outputDir),
            path.basename(this.options.outputDir),
            asset.localPath
          )
          try {
            await fs.access(altSourcePath)
            await fs.copyFile(altSourcePath, destPath)
            logger.debug('Copied asset from alt path', { filename: path.basename(asset.localPath) })
          } catch (altError) {
            logger.warn('Asset not found, skipping', { url: asset.url })
          }
        }
      } catch (error) {
        logger.warn('Failed to copy asset', { url: asset.url, error: error instanceof Error ? error : new Error(String(error)) })
      }
    }

    logger.info('Assets copied successfully')
  }

  private async generateConfigs() {
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
  }

  private async generateBrandConfig() {
    await fs.writeFile(
      path.join(this.options.outputDir, 'src/lib/brand-config.json'),
      JSON.stringify(this.options.brandConfig, null, 2)
    )

    // Also create types file
    const typesContent = `export interface BrandConfig {
  name: string
  tagline?: string
  logo?: string
  favicon?: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  typography: {
    fontFamily: string
  }
  customContent?: Record<string, string>
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/lib/types.ts'), typesContent)
  }

  private async generatePlaceholderImages() {
    // Create simple SVG placeholder images
    const placeholders = {
      'placeholder-logo.png': this.createSvgPlaceholder('Your Logo', 200, 60, '#e0e0e0'),
      'placeholder-banner.jpg': this.createSvgPlaceholder('Banner Image', 1200, 400, '#f0f0f0'),
      'placeholder-team.jpg': this.createSvgPlaceholder('Team Photo', 300, 300, '#f5f5f5'),
      'placeholder-testimonial.jpg': this.createSvgPlaceholder(
        'Customer Photo',
        100,
        100,
        '#f8f8f8'
      ),
      'placeholder-product.jpg': this.createSvgPlaceholder('Product Image', 400, 300, '#fafafa'),
      'placeholder-service.jpg': this.createSvgPlaceholder('Service Image', 400, 300, '#fcfcfc'),
    }

    const publicDir = path.join(this.options.outputDir, 'public')
    await fs.mkdir(publicDir, { recursive: true })

    for (const [filename, svgContent] of Object.entries(placeholders)) {
      await fs.writeFile(path.join(publicDir, filename), svgContent)
    }
  }

  private createSvgPlaceholder(
    text: string,
    width: number,
    height: number,
    bgColor: string
  ): string {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-family="Arial, sans-serif" font-size="16" fill="#666">
        ${text}
      </text>
    </svg>`
  }
}
