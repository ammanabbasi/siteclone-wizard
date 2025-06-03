import * as fs from 'fs/promises'
import * as path from 'path'
import { ParsedComponent, ParseResult } from './parser'
import { BrandConfig } from './types'

export interface GeneratorOptions {
  outputDir: string
  brandConfig: BrandConfig
  parseResult: ParseResult
  assets?: Array<{
    url: string
    localPath: string
    type: string
  }>
}

export class CodeGenerator {
  constructor(private options: GeneratorOptions) {}

  async generate() {
    console.log('Generating Next.js project...')

    // Create project structure
    await this.createProjectStructure()

    // Generate package.json
    await this.generatePackageJson()

    // Generate components
    await this.generateComponents()

    // Generate layout
    await this.generateLayout()

    // Generate pages
    await this.generatePages()

    // Copy assets
    await this.copyAssets()

    // Generate configuration files
    await this.generateConfigs()

    // Generate i18n/text content file
    await this.generateTextContent()

    console.log('Project generation complete!')
  }

  private async createProjectStructure() {
    const dirs = [
      'src/app',
      'src/components',
      'src/lib',
      'src/styles',
      'public/assets',
      'public/fonts',
    ]

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
        autoprefixer: '^10.4.0',
        postcss: '^8.4.0',
        tailwindcss: '^3.3.0',
        typescript: '^5.0.0',
      },
    }

    await fs.writeFile(
      path.join(this.options.outputDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )
  }

  private async generateComponents() {
    const components = this.options.parseResult.components

    for (const component of components) {
      const componentName = this.getComponentName(component)
      const componentPath = path.join(
        this.options.outputDir,
        'src/components',
        `${componentName}.tsx`
      )

      const componentCode = this.generateComponentCode(component)
      await fs.writeFile(componentPath, componentCode)
    }
  }

  private generateComponentCode(component: ParsedComponent): string {
    // Convert HTML to JSX and preserve original structure
    let jsx = this.htmlToJsx(component.html)

    // Update asset URLs to use local paths
    jsx = this.updateAssetUrls(jsx)

    // Don't convert to Tailwind - preserve original classes
    const originalClasses = component.classes.join(' ')

    // Replace text nodes with content from brand config where appropriate
    let processedJsx = jsx
    component.textNodes.forEach((node) => {
      // Check if this text should be replaced with brand content
      const brandKey = this.getBrandContentKey(node.text)
      if (brandKey) {
        processedJsx = processedJsx.replace(
          node.text,
          `{brandConfig.${brandKey} || content.${node.placeholder.replace(/[{}]/g, '')}}`
        )
      } else {
        processedJsx = processedJsx.replace(
          node.text,
          `{content.${node.placeholder.replace(/[{}]/g, '')}}`
        )
      }
    })

    const componentName = this.getComponentName(component)

    return `import { FC } from 'react'
import { BrandConfig } from '@/lib/types'

interface ${componentName}Props {
  content: Record<string, string>
  brandConfig?: Partial<BrandConfig>
  className?: string
}

const ${componentName}: FC<${componentName}Props> = ({ content, brandConfig = {}, className }) => {
  return (
    <${component.type === 'header' ? 'header' : component.type === 'footer' ? 'footer' : 'section'}
      className={\`${originalClasses} \${className || ''}\`}
      dangerouslySetInnerHTML={{
        __html: \`${processedJsx}\`
      }}
    />
  )
}

export default ${componentName}
`
  }

  private getBrandContentKey(text: string): string | null {
    const lowText = text.toLowerCase()

    // Map common text patterns to brand config keys
    if (lowText.includes('auto trademark') || lowText.includes('company name')) {
      return 'name'
    }
    if (lowText.includes('tagline') || lowText.includes('slogan')) {
      return 'tagline'
    }

    return null
  }

  private htmlToJsx(html: string): string {
    // Remove HTML comments first - they break JSX
    html = html.replace(/<!--[\s\S]*?-->/g, '')

    // Fix self-closing tags before other conversions
    html = html
      .replace(/<img([^>]*)(?<!\/)>/g, '<img$1 />')
      .replace(/<br([^>]*)(?<!\/)>/g, '<br$1 />')
      .replace(/<hr([^>]*)(?<!\/)>/g, '<hr$1 />')
      .replace(/<input([^>]*)(?<!\/)>/g, '<input$1 />')
      .replace(/<link([^>]*)(?<!\/)>/g, '<link$1 />')
      .replace(/<meta([^>]*)(?<!\/)>/g, '<meta$1 />')
      .replace(/<area([^>]*)(?<!\/)>/g, '<area$1 />')
      .replace(/<base([^>]*)(?<!\/)>/g, '<base$1 />')
      .replace(/<col([^>]*)(?<!\/)>/g, '<col$1 />')
      .replace(/<embed([^>]*)(?<!\/)>/g, '<embed$1 />')
      .replace(/<source([^>]*)(?<!\/)>/g, '<source$1 />')
      .replace(/<track([^>]*)(?<!\/)>/g, '<track$1 />')
      .replace(/<wbr([^>]*)(?<!\/)>/g, '<wbr$1 />')

    // Fix Windows path backslashes in URLs
    html = html.replace(/src="([^"]*\\[^"]*)"/g, (match, path) => {
      return `src="${path.replace(/\\/g, '/')}"`
    })

    // Convert HTML attributes to JSX
    return (
      html
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        .replace(/srcset=/g, 'srcSet=')
        .replace(/tabindex=/g, 'tabIndex=')
        .replace(/colspan=/g, 'colSpan=')
        .replace(/rowspan=/g, 'rowSpan=')
        .replace(/frameborder=/g, 'frameBorder=')
        .replace(/allowfullscreen/g, 'allowFullScreen')
        .replace(/autocomplete=/g, 'autoComplete=')
        .replace(/autofocus/g, 'autoFocus')
        .replace(/readonly/g, 'readOnly')
        // Handle empty attributes
        .replace(/(\w+)=""/g, '$1')
        // Convert style strings to objects
        .replace(/style="([^"]*)"/g, (match, styles) => {
          // Handle empty styles
          if (!styles.trim()) return ''

          // Convert inline styles to JSX style object
          const styleObj = styles
            .split(';')
            .filter(Boolean)
            .map((style: string) => {
              const [prop, value] = style.split(':').map((s: string) => s.trim())
              if (!prop || !value) return ''
              const camelProp = prop.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())
              // Handle numeric values
              const isNumeric = /^\d+$/.test(value)
              return `${camelProp}: ${isNumeric ? value : `'${value}'`}`
            })
            .filter(Boolean)
            .join(', ')
          return styleObj ? `style={{${styleObj}}}` : ''
        })
        // Fix & in attributes
        .replace(/&amp;/g, '&')
        // Remove any remaining problematic attributes
        .replace(/\s(xmlns|xmlnsXlink|xmlSpace)="[^"]*"/g, '')
        // Remove event handlers for safety
        .replace(/\son\w+="[^"]*"/g, '')
        .replace(/\son\w+='[^']*'/g, '')
    )
  }

  private getComponentName(component: ParsedComponent): string {
    const typeMap: Record<ParsedComponent['type'], string> = {
      header: 'Header',
      nav: 'Navigation',
      hero: 'Hero',
      section: 'Section',
      card: 'Card',
      footer: 'Footer',
      other: 'Component',
    }

    const baseName = typeMap[component.type]
    if (component.id) {
      return `${baseName}${component.id.charAt(0).toUpperCase()}${component.id.slice(1)}`
    }
    return baseName
  }

  private async generateLayout() {
    const { layout } = this.options.parseResult
    const { brandConfig } = this.options

    // Generate font import based on brand config
    const fontImport = brandConfig.typography.fontFamily
      ? `import { ${brandConfig.typography.fontFamily.replace(/\s+/g, '_')} } from 'next/font/google'`
      : `import { Inter } from 'next/font/google'`

    const fontVariable = brandConfig.typography.fontFamily?.replace(/\s+/g, '_') || 'Inter'

    const layoutCode = `import type { Metadata } from 'next'
${fontImport}
import './globals.css'
${layout.hasHeader ? "import Header from '@/components/Header'" : ''}
${layout.hasFooter ? "import Footer from '@/components/Footer'" : ''}
import content from '@/lib/content.json'

const font = ${fontVariable}({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${brandConfig.name}',
  description: '${brandConfig.tagline || 'Built with SiteClone Wizard'}',
  icons: {
    icon: '${brandConfig.favicon || '/favicon.ico'}',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        ${layout.hasHeader ? '<Header content={content} />' : ''}
        <main className="${layout.hasSidebar ? 'flex' : ''}">
          ${layout.hasSidebar ? '<aside className="w-64"><!-- Sidebar content --></aside>' : ''}
          <div className="flex-1">
            {children}
          </div>
        </main>
        ${layout.hasFooter ? '<Footer content={content} />' : ''}
      </body>
    </html>
  )
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/layout.tsx'), layoutCode)

    // Generate globals.css with all scraped styles and brand overrides
    const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Brand Colors */
:root {
  --brand-primary: ${this.options.brandConfig.colors.primary};
  --brand-secondary: ${this.options.brandConfig.colors.secondary};
  --brand-accent: ${this.options.brandConfig.colors.accent};
  --brand-font: '${this.options.brandConfig.typography.fontFamily}', sans-serif;
}

/* Original Site Styles */
${this.options.parseResult.styles.inlineCritical}

/* Brand Overrides - Apply brand colors to key elements */
body {
  font-family: var(--brand-font) !important;
}

/* Override primary brand elements */
a {
  color: var(--brand-primary);
}

a:hover {
  color: var(--brand-secondary);
}

button, .btn, [class*="button"] {
  background-color: var(--brand-primary) !important;
  color: white !important;
}

button:hover, .btn:hover, [class*="button"]:hover {
  background-color: var(--brand-secondary) !important;
}

/* Headers and important text */
h1, h2, h3, h4, h5, h6 {
  color: var(--brand-primary);
  font-family: var(--brand-font) !important;
}

/* Navigation and header backgrounds */
header, nav, .header, .navigation {
  background-color: var(--brand-primary) !important;
}

/* Footer styling */
footer, .footer {
  background-color: var(--brand-secondary) !important;
  color: white !important;
}

footer a, .footer a {
  color: var(--brand-accent) !important;
}

/* Form elements */
input[type="submit"], input[type="button"] {
  background-color: var(--brand-primary) !important;
  color: white !important;
}

/* Accent elements */
.accent, .highlight, .featured {
  background-color: var(--brand-accent) !important;
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/globals.css'), globalsCss)
  }

  private async generatePages() {
    const homePageCode = `import Hero from '@/components/Hero'
import Section from '@/components/Section'
import content from '@/lib/content.json'

export default function Home() {
  return (
    <>
      <Hero content={content} />
      <Section content={content} />
    </>
  )
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'src/app/page.tsx'), homePageCode)
  }

  private async copyAssets() {
    if (!this.options.assets || this.options.assets.length === 0) {
      console.log('No assets to copy')
      return
    }

    console.log(`Copying ${this.options.assets.length} assets...`)

    // Ensure public/assets directory exists
    const publicAssetsDir = path.join(this.options.outputDir, 'public/assets')
    await fs.mkdir(publicAssetsDir, { recursive: true })

    // Copy each asset from the temp location to public/assets
    for (const asset of this.options.assets) {
      try {
        // The asset.localPath is relative to the scraper output directory
        // Since both the project and assets are in the same output directory, we use the same parent
        const sourcePath = path.join(this.options.outputDir, asset.localPath)
        const destPath = path.join(publicAssetsDir, path.basename(asset.localPath))

        // Check if source file exists
        try {
          await fs.access(sourcePath)
          await fs.copyFile(sourcePath, destPath)
          console.log(`Copied asset: ${path.basename(asset.localPath)}`)
        } catch (error) {
          console.warn(`Asset not found at ${sourcePath}, trying alternative path...`)
          // Try with parent directory if the first attempt fails
          const altSourcePath = path.join(
            path.dirname(this.options.outputDir),
            path.basename(this.options.outputDir),
            asset.localPath
          )
          try {
            await fs.access(altSourcePath)
            await fs.copyFile(altSourcePath, destPath)
            console.log(`Copied asset from alt path: ${path.basename(asset.localPath)}`)
          } catch (altError) {
            console.warn(`Asset not found at either path, skipping: ${asset.url}`)
          }
        }
      } catch (error) {
        console.warn(`Failed to copy asset: ${asset.url}`, error)
      }
    }

    console.log('Assets copied successfully')
  }

  private async generateConfigs() {
    // Generate tailwind.config.ts with brand colors
    const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '${this.options.brandConfig.colors.primary}',
        secondary: '${this.options.brandConfig.colors.secondary}',
        accent: '${this.options.brandConfig.colors.accent}',
      },
      fontFamily: {
        sans: ['${this.options.brandConfig.typography.fontFamily}', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
`

    await fs.writeFile(path.join(this.options.outputDir, 'tailwind.config.ts'), tailwindConfig)

    // Generate next.config.js
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'],
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

    // Generate postcss.config.js
    const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`

    await fs.writeFile(path.join(this.options.outputDir, 'postcss.config.js'), postcssConfig)
  }

  private async generateTextContent() {
    const content = {
      ...this.options.parseResult.textMap,
      ...this.options.brandConfig.customContent,
    }

    await fs.writeFile(
      path.join(this.options.outputDir, 'src/lib/content.json'),
      JSON.stringify(content, null, 2)
    )

    // Also generate YAML version for easy editing
    const yaml = Object.entries(content)
      .map(([key, value]) => `${key}: "${value}"`)
      .join('\n')

    await fs.writeFile(path.join(this.options.outputDir, 'content.yaml'), yaml)
  }

  private updateAssetUrls(html: string): string {
    if (!this.options.assets) return html

    let updatedHtml = html

    // Create a map of original URLs to local paths
    const assetMap = new Map(
      this.options.assets.map((asset) => [asset.url, `/assets/${path.basename(asset.localPath)}`])
    )

    // Update image src attributes
    updatedHtml = updatedHtml.replace(/src="([^"]*)"/g, (match, url) => {
      // Remove query strings from URL for matching
      const cleanUrl = url.split('?')[0]

      // Check if we have a local version of this asset
      for (const [originalUrl, localPath] of Array.from(assetMap.entries())) {
        const cleanOriginalUrl = originalUrl.split('?')[0]

        // Check various matching strategies
        if (
          originalUrl === url || // Exact match
          cleanOriginalUrl === cleanUrl || // Match without query strings
          originalUrl.endsWith(path.basename(cleanUrl)) || // Match by filename
          cleanUrl.endsWith(path.basename(cleanOriginalUrl)) // Match by filename reverse
        ) {
          return `src="${localPath}"`
        }
      }

      // If it's a relative URL starting with /, keep it as is (will be handled by Next.js)
      if (url.startsWith('/')) {
        return match
      }

      // For external URLs, keep them as is
      return match
    })

    // Update background-image URLs in style attributes
    updatedHtml = updatedHtml.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, url) => {
      const cleanUrl = url.split('?')[0]

      for (const [originalUrl, localPath] of Array.from(assetMap.entries())) {
        const cleanOriginalUrl = originalUrl.split('?')[0]

        // Check various matching strategies
        if (
          originalUrl === url || // Exact match
          cleanOriginalUrl === cleanUrl || // Match without query strings
          originalUrl.endsWith(path.basename(cleanUrl)) || // Match by filename
          cleanUrl.endsWith(path.basename(cleanOriginalUrl)) // Match by filename reverse
        ) {
          return `url('${localPath}')`
        }
      }

      return match
    })

    return updatedHtml
  }
}
