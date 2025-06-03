# SiteClone Wizard - Project Handoff Guide

## Quick Start for New Developers

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Git (for version control)
- Basic knowledge of Next.js, React, and TypeScript

### Setup Instructions
```bash
# Clone the repository
git clone <repository-url>
cd siteclone-wizard

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

## Project Overview

### What SiteClone Wizard Does
SiteClone Wizard is a web application that:
1. **Scrapes** any website using Puppeteer
2. **Parses** the HTML content and extracts assets
3. **Sanitizes** content by removing proprietary information
4. **Generates** a new Next.js project with the cloned content
5. **Customizes** specifically for car dealership sites

### Key Business Value
- Enables quick website prototyping
- Specializes in car dealership customization
- AI-powered content enhancement
- Production-ready Next.js output

## Core Architecture

### Data Flow
```
URL Input → Scraper → Parser → Sanitizer → Generator → Next.js Project
                                    ↓
                              AI Enhancement
```

### Key Components

#### 1. Scraper (`src/lib/scraper.ts`)
**Purpose:** Fetches web pages  
**Technology:** Puppeteer  
**Input:** URL  
**Output:** Raw HTML content

```typescript
// Usage example
const scraper = new Scraper();
const content = await scraper.scrape('https://example.com');
```

#### 2. Parser (`src/lib/parser.ts`)
**Purpose:** Extracts structured data from HTML  
**Technology:** Cheerio  
**Input:** Raw HTML  
**Output:** Parsed website structure

```typescript
// Usage example
const parser = new Parser();
const parsed = await parser.parse(htmlContent);
```

#### 3. Generator (`src/lib/generator.ts`)
**Purpose:** Creates Next.js projects  
**Technology:** File system operations  
**Input:** Parsed data  
**Output:** Complete Next.js project

```typescript
// Usage example
const generator = new Generator();
await generator.generate(parsedData, outputPath);
```

## API Endpoints

### Core Endpoints

#### POST `/api/clone`
Main cloning endpoint
```typescript
// Request
{
  "url": "https://example.com",
  "options": {
    "enableAI": true,
    "dealershipMode": false
  }
}

// Response
{
  "success": true,
  "id": "generated-id",
  "downloadUrl": "/api/download/generated-id"
}
```

#### POST `/api/ai-enhance`
AI content enhancement
```typescript
// Request
{
  "content": "HTML content to enhance",
  "type": "dealership" | "general"
}

// Response
{
  "enhancedContent": "AI-enhanced HTML",
  "improvements": ["list of improvements made"]
}
```

#### GET `/api/download/[id]`
Download generated project as ZIP

#### GET `/api/preview/[id]`
Preview generated website

## Development Workflow

### Daily Development Tasks

#### Adding New Features
1. Create feature branch
2. Add functionality in `src/lib/`
3. Create/update API endpoint in `src/app/api/`
4. Update UI components if needed
5. Test thoroughly
6. Submit pull request

#### Testing Changes
```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Test specific functionality
pnpm test

# Test full flow
node test-full-flow.js
```

#### Debugging Issues
1. Check browser console for frontend errors
2. Check server logs for API errors
3. Use debug page at `/debug`
4. Test with test files in project root

### Common Development Patterns

#### Error Handling Pattern
```typescript
try {
  const result = await someAsyncOperation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Operation failed:', error);
  return NextResponse.json(
    { success: false, error: 'Operation failed' },
    { status: 500 }
  );
}
```

#### File Generation Pattern
```typescript
const files = {
  'package.json': JSON.stringify(packageConfig, null, 2),
  'src/app/page.tsx': generatePageComponent(content),
  'tailwind.config.js': generateTailwindConfig()
};

await writeFiles(outputPath, files);
```

## Troubleshooting Guide

### Common Issues

#### 1. Puppeteer Timeout
**Symptoms:** Scraping fails with timeout error  
**Causes:** 
- Slow website loading
- JavaScript-heavy sites
- Network issues

**Solutions:**
```typescript
// Increase timeout
await page.goto(url, { 
  waitUntil: 'networkidle0', 
  timeout: 60000 
});

// Add retry logic
for (let i = 0; i < 3; i++) {
  try {
    return await scrape(url);
  } catch (error) {
    if (i === 2) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

#### 2. Memory Issues
**Symptoms:** Process crashes, slow performance  
**Causes:** Large HTML processing, multiple browser instances

**Solutions:**
```typescript
// Close browser instances
await browser.close();

// Use streaming for large files
const stream = fs.createWriteStream(outputPath);

// Limit concurrent operations
const limit = 3;
```

#### 3. CSS/JS Asset Issues
**Symptoms:** Cloned site missing styles or functionality  
**Causes:** Relative paths, external dependencies

**Solutions:**
```typescript
// Convert relative to absolute URLs
const absoluteUrl = new URL(relativeUrl, baseUrl).href;

// Download and inline assets
const cssContent = await fetch(cssUrl).then(r => r.text());
```

### Debugging Tools

#### Debug Page (`/debug`)
- Test individual components
- View parsed data structure
- Check asset extraction

#### Test Files
- `test-scraper.js` - Test scraping functionality
- `test-full-flow.js` - End-to-end testing
- `test-ui.html` - UI component testing

#### Console Logging
Currently uses console.log throughout codebase (needs replacement with proper logger)

## Deployment Guide

### Environment Setup

#### Required Environment Variables
```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# Production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

#### Production Build
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or deploy to Vercel
vercel deploy
```

### Production Considerations

#### Security
- Add rate limiting
- Implement authentication
- Validate all inputs
- Use HTTPS only

#### Performance
- Enable browser instance pooling
- Add caching layer
- Optimize bundle size
- Use CDN for assets

#### Monitoring
- Add error tracking (Sentry)
- Implement logging (Winston)
- Monitor resource usage
- Set up alerts

## Feature Specifications

### Dealership Customization Features

#### Inventory Management
- Placeholder car listings
- Customizable inventory sources (manual/API/CSV/XML)
- Price and specification fields

#### Business Information
- Dealer license integration
- Sales and service hours
- Financing partner options
- Contact information customization

#### Safety Features
- All external links disabled
- Phone numbers and addresses replaced with placeholders
- Proprietary content stripped

### AI Integration Features

#### Content Enhancement
- Improves text quality
- Adds relevant placeholders
- Optimizes for car dealership context
- Maintains original layout

#### Generation Options
- Standard website cloning
- AI-enhanced content
- Dealership-specific customization
- Multi-page site support

## Code Quality Standards

### TypeScript Guidelines
```typescript
// ✅ Good - Proper typing
interface ScrapingOptions {
  url: string;
  enableAI: boolean;
  dealershipMode: boolean;
}

// ❌ Avoid - Using 'any'
function processData(data: any) {
  // Avoid this pattern
}
```

### Error Handling Guidelines
```typescript
// ✅ Good - Comprehensive error handling
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context });
  return { success: false, error: 'Operation failed' };
}
```

### Component Guidelines
```typescript
// ✅ Good - Typed component props
interface ComponentProps {
  data: ParsedData;
  onComplete: (result: GenerationResult) => void;
}

export default function Component({ data, onComplete }: ComponentProps) {
  // Implementation
}
```

## Future Development Roadmap

### Immediate Improvements
1. Replace console.log with proper logging
2. Fix TypeScript 'any' types
3. Add comprehensive testing
4. Standardize error responses

### Short-term Features
1. User authentication system
2. Project management dashboard
3. Advanced AI customization options
4. Performance optimizations

### Long-term Vision
1. Plugin system for custom generators
2. Advanced dealership features
3. Multi-tenant support
4. API marketplace integration

## Support and Resources

### Documentation
- `README.md` - Basic setup and usage
- `HOW_TO_RUN_CLONED_SITE.md` - Running generated sites
- `SECURITY_WARNING.md` - Security considerations
- `COMPREHENSIVE_CODE_REVIEW.md` - Detailed code analysis

### Key Contacts
- **Project Owner:** Senior Full-Stack Architect
- **Primary Developer:** [To be assigned]
- **DevOps Lead:** [To be assigned]

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Puppeteer API](https://pptr.dev)
- [Cheerio Documentation](https://cheerio.js.org)
- [Tailwind CSS](https://tailwindcss.com)

---

**Handoff Date:** June 3, 2025  
**Document Version:** 1.0  
**Next Update:** 30 days after handoff
