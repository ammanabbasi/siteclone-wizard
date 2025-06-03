# SiteClone Wizard - Code Review & Improvements

## Overview

This document contains a comprehensive review of the SiteClone Wizard codebase with identified issues and recommended improvements.

## 1. **Scraper Module (`src/lib/scraper.ts`)**

### Issues Found:

1. **Memory Management**: The scraper stores all visited URLs in memory without limit
2. **Error Recovery**: Browser cleanup might not happen if errors occur during scraping
3. **Asset Download**: No retry mechanism for failed asset downloads
4. **CSS Extraction**: Cross-origin stylesheets are silently ignored

### Recommended Improvements:

```typescript
// 1. Add resource limits
export interface ScraperOptions {
  targetUrl: string
  scrapeDepth?: number
  outputDir?: string
  timeout?: number
  maxPages?: number // Add limit
  maxAssetSize?: number // Add size limit
}

// 2. Improve error handling with finally blocks
async scrape(): Promise<ScrapeResult> {
  const page = await this.browser.newPage()
  try {
    return await this.scrapePage(page, this.options.targetUrl, 0)
  } finally {
    await page.close() // Always cleanup
  }
}

// 3. Add retry mechanism for assets
private async downloadAssetWithRetry(
  url: string,
  maxRetries: number = 3
): Promise<Buffer> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries reached')
}
```

## 2. **Parser Module (`src/lib/parser.ts`)**

### Issues Found:

1. **Component Detection**: Limited component detection patterns
2. **Text Extraction**: No handling of special characters in text nodes
3. **Performance**: Cheerio loads entire DOM into memory
4. **Duplicate Detection**: Components might be extracted multiple times

### Recommended Improvements:

```typescript
// 1. Add more component patterns
private readonly COMPONENT_SELECTORS = {
  header: 'header, [role="banner"], .header, #header',
  nav: 'nav, [role="navigation"], .nav, .navbar',
  hero: '.hero, [class*="hero"], .banner, .jumbotron',
  footer: 'footer, [role="contentinfo"], .footer, #footer',
  sidebar: 'aside, [role="complementary"], .sidebar',
  card: '.card, .tile, .box, [class*="card"]',
  form: 'form, .form, [role="form"]'
}

// 2. Sanitize text nodes
private sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 1000) // Limit length
}

// 3. Add component deduplication
private deduplicateComponents(components: ParsedComponent[]): ParsedComponent[] {
  const seen = new Set<string>()
  return components.filter(comp => {
    const key = `${comp.type}:${comp.selector}:${comp.html.length}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
```

## 3. **Generator Module (`src/lib/generator.ts`)**

### Issues Found:

1. **JSX Conversion**: Incomplete HTML to JSX conversion
2. **Asset URLs**: Hardcoded asset paths might break
3. **Component Naming**: Potential naming conflicts
4. **Error Handling**: No validation of generated code

### Recommended Improvements:

```typescript
// 1. Improve HTML to JSX conversion
private htmlToJsx(html: string): string {
  // Add more conversions
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/srcset=/g, 'srcSet=')
    .replace(/onclick=/gi, 'onClick=')
    .replace(/onchange=/gi, 'onChange=')
    .replace(/checked="checked"/g, 'defaultChecked')
    .replace(/value="([^"]*)"/g, 'defaultValue="$1"')
    // Handle boolean attributes
    .replace(/disabled=""/g, 'disabled')
    .replace(/readonly=""/g, 'readOnly')
    // Fix style attributes
    .replace(/style="([^"]*)"/g, (match, styles) => {
      const styleObj = this.cssStringToObject(styles)
      return `style={${JSON.stringify(styleObj)}}`
    })
}

// 2. Generate unique component names
private getUniqueComponentName(
  component: ParsedComponent,
  index: number
): string {
  const baseName = this.getComponentName(component)
  return `${baseName}_${index}`
}

// 3. Validate generated JSX
private validateJSX(jsx: string): boolean {
  try {
    // Basic validation - check for balanced tags
    const openTags = jsx.match(/<[^/][^>]*>/g) || []
    const closeTags = jsx.match(/<\/[^>]+>/g) || []
    return openTags.length === closeTags.length
  } catch {
    return false
  }
}
```

## 4. **API Routes**

### Issues Found:

1. **Resource Cleanup**: Output directories are never cleaned up
2. **Process Management**: No limit on concurrent preview servers
3. **Security**: No validation of output IDs
4. **Error Messages**: Generic error messages don't help debugging

### Recommended Improvements:

```typescript
// 1. Add cleanup mechanism
async function cleanupOldOutputs(maxAge: number = 24 * 60 * 60 * 1000) {
  const outputDir = path.join(process.cwd(), 'output')
  const entries = await fs.readdir(outputDir)

  for (const entry of entries) {
    const stats = await fs.stat(path.join(outputDir, entry))
    if (Date.now() - stats.mtime.getTime() > maxAge) {
      await fs.rm(path.join(outputDir, entry), { recursive: true })
    }
  }
}

// 2. Limit concurrent processes
const MAX_CONCURRENT_PREVIEWS = 5
if (runningProcesses.size >= MAX_CONCURRENT_PREVIEWS) {
  // Kill oldest process
  const oldest = Array.from(runningProcesses.entries())[0]
  oldest[1].process.kill()
  runningProcesses.delete(oldest[0])
}

// 3. Validate output ID
if (!/^[a-f0-9-]{36}$/.test(outputId)) {
  return NextResponse.json({ error: 'Invalid output ID format' }, { status: 400 })
}
```

## 5. **Frontend Components**

### Issues Found:

1. **State Management**: Complex state in single component
2. **Error Handling**: Errors not properly displayed to users
3. **Form Validation**: Minimal input validation
4. **Accessibility**: Missing ARIA labels

### Recommended Improvements:

```typescript
// 1. Extract state to custom hook
function useCloneWizard() {
  const [state, dispatch] = useReducer(cloneWizardReducer, initialState)

  const submitClone = useCallback(async (data: CloneData) => {
    dispatch({ type: 'START_CLONE' })
    try {
      const result = await cloneWebsite(data)
      dispatch({ type: 'CLONE_SUCCESS', payload: result })
    } catch (error) {
      dispatch({ type: 'CLONE_ERROR', payload: error })
    }
  }, [])

  return { state, submitClone }
}

// 2. Better error display
{error && (
  <Alert variant="error" onClose={() => setError(null)}>
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
    <details className="mt-2">
      <summary>Technical Details</summary>
      <pre className="text-xs">{JSON.stringify(error, null, 2)}</pre>
    </details>
  </Alert>
)}

// 3. Add input validation
const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}
```

## 6. **General Improvements**

### 1. **Add Logging System**

```typescript
// src/lib/logger.ts
export class Logger {
  constructor(private context: string) {}

  info(message: string, data?: any) {
    console.log(`[${this.context}] ${message}`, data || '')
  }

  error(message: string, error?: any) {
    console.error(`[${this.context}] ${message}`, error || '')
  }
}
```

### 2. **Add Configuration**

```typescript
// src/config/index.ts
export const config = {
  scraper: {
    timeout: parseInt(process.env.SCRAPER_TIMEOUT || '30000'),
    maxDepth: parseInt(process.env.MAX_SCRAPE_DEPTH || '2'),
    maxAssets: parseInt(process.env.MAX_ASSETS || '100'),
  },
  generator: {
    outputDir: process.env.OUTPUT_DIR || './output',
    cleanupAge: parseInt(process.env.CLEANUP_AGE || '86400000'),
  },
  preview: {
    maxConcurrent: parseInt(process.env.MAX_PREVIEWS || '5'),
    startPort: parseInt(process.env.PREVIEW_START_PORT || '3100'),
  },
}
```

### 3. **Add Tests**

```typescript
// src/lib/__tests__/parser.test.ts
describe('HTMLParser', () => {
  it('should extract header components', () => {
    const html = '<header class="nav">Test</header>'
    const parser = new HTMLParser({ html, css: [], assets: [], links: [], metadata: { title: '' } })
    const result = parser.parse()
    expect(result.components).toHaveLength(1)
    expect(result.components[0].type).toBe('header')
  })
})
```

### 4. **Add Type Guards**

```typescript
// src/lib/guards.ts
export function isBrandConfig(obj: any): obj is BrandConfig {
  return (
    obj &&
    typeof obj.name === 'string' &&
    obj.colors &&
    typeof obj.colors.primary === 'string' &&
    typeof obj.colors.secondary === 'string' &&
    typeof obj.colors.accent === 'string'
  )
}
```

## Priority Fixes

1. **High Priority**

   - Fix browser cleanup in scraper (memory leak)
   - Add process limits for preview servers
   - Improve error handling throughout

2. **Medium Priority**

   - Add retry mechanism for asset downloads
   - Improve HTML to JSX conversion
   - Add input validation

3. **Low Priority**
   - Add comprehensive logging
   - Improve CSS to Tailwind conversion
   - Add unit tests

## Next Steps

1. Implement the high-priority fixes first
2. Add proper error boundaries in React components
3. Create a cleanup job for old output directories
4. Add monitoring and observability
5. Improve the CSS extraction to handle more edge cases
