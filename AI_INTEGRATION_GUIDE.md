# AI Integration Guide for SiteClone Wizard

## Overview

SiteClone Wizard now includes powerful AI capabilities powered by OpenAI to make website cloning smarter and more effective. The AI integration enhances content generation, color scheme suggestions, SEO optimization, and even generates compelling car descriptions for dealerships.

## Setting Up AI Features

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# AI Features (optional)
ENABLE_AI_CONTENT_GENERATION=true
ENABLE_AI_COLOR_SUGGESTIONS=true
ENABLE_AI_SEO_OPTIMIZATION=true
```

⚠️ **Security Note**: Never commit your API key to version control. Always use environment variables.

### 2. Install Dependencies

```bash
pnpm add openai
```

## AI Features

### 1. 🎨 Intelligent Color Scheme Generation

AI analyzes your brand name and industry to suggest professional, accessible color palettes.

**How it works:**

- Input: Brand name + Industry
- Output: Primary, secondary, and accent colors optimized for your industry
- Uses industry best practices and color psychology

**Example:**

```javascript
// Automotive industry gets professional blues and reds
{
  primary: "#1E40AF",   // Trust and reliability
  secondary: "#DC2626", // Energy and action
  accent: "#059669"     // Growth and freshness
}
```

### 2. 📝 Smart Content Generation

AI generates contextually appropriate content for different sections:

**Content Types:**

- **Hero Sections**: Compelling headlines and taglines
- **About Us**: Trust-building company descriptions
- **Services**: Relevant service offerings based on industry
- **Testimonials**: Authentic-sounding customer reviews

**Example Hero Content:**

```
"Welcome to SmartAuto Dealership"
"Your trusted partner for finding the perfect vehicle with AI-powered assistance"
```

### 3. 🚗 AI Car Inventory Descriptions

For automotive dealerships, AI generates unique, sales-focused descriptions for each vehicle.

**Features:**

- Compelling 2-sentence descriptions
- Highlights key selling points
- Varies language to avoid repetition
- Professional automotive terminology

**Example:**

```
"This 2022 Toyota Camry combines legendary reliability with modern comfort features.
With its fuel-efficient engine and spacious interior, it's perfect for both daily
commutes and weekend adventures."
```

### 4. 🔍 SEO Optimization

AI generates optimized meta tags and keywords for better search visibility.

**Generates:**

- SEO-friendly page titles
- Meta descriptions
- Relevant keywords
- Structured data suggestions

## Using AI Features

### Via the Enhanced UI

Use the `test-ui-ai-enhanced.html` interface:

1. Enter your brand information
2. Select your industry
3. Click "Generate Color Scheme" for AI color suggestions
4. Enable AI content options:
   - ✅ Generate intelligent content replacements
   - ✅ Optimize SEO with AI
   - ✅ Generate AI car descriptions

### Via API Endpoints

#### AI Enhancement Endpoint

`POST /api/ai-enhance`

**Actions:**

1. **enhance-content**

```json
{
  "action": "enhance-content",
  "brandConfig": { "name": "Your Brand" },
  "contentType": "hero",
  "industry": "automotive",
  "text": "Original text (optional)"
}
```

2. **suggest-colors**

```json
{
  "action": "suggest-colors",
  "brandConfig": { "name": "Your Brand" },
  "industry": "technology"
}
```

3. **generate-seo**

```json
{
  "action": "generate-seo",
  "brandConfig": {
    "name": "Your Brand",
    "tagline": "Your tagline"
  },
  "contentType": "home"
}
```

4. **generate-inventory-description**

```json
{
  "action": "generate-inventory-description",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023
}
```

### In the Clone Process

The enhanced generator automatically uses AI when available:

```typescript
// In enhanced-generator.ts
const sanitizer = new AIContentSanitizer(html, brandConfig, industry)
const enhancedHtml = await sanitizer.sanitizeWithAI()
```

## Implementation Details

### AI Content Enhancer (`ai-enhancer.ts`)

Core class that interfaces with OpenAI:

- Handles API communication
- Implements fallback content
- Manages error handling
- Provides industry-specific defaults

### AI Content Sanitizer (`ai-content-sanitizer.ts`)

Extends the base sanitizer with AI capabilities:

- Identifies content sections automatically
- Applies AI enhancements selectively
- Maintains original design integrity
- Replaces content intelligently

## Best Practices

### 1. **API Key Management**

- Use environment variables
- Implement rate limiting
- Monitor usage
- Have fallback content ready

### 2. **Content Quality**

- Review AI-generated content
- Customize prompts for your needs
- Maintain brand voice consistency
- Test with different industries

### 3. **Performance**

- Cache AI responses when possible
- Use async/await properly
- Implement timeouts
- Handle API failures gracefully

### 4. **Cost Management**

- Monitor token usage
- Use GPT-3.5-turbo for efficiency
- Implement caching strategies
- Set reasonable limits

## Customization

### Adding New Industries

Edit `ai-enhancer.ts`:

```typescript
const industryColors = {
  'your-industry': {
    primary: '#HEX',
    secondary: '#HEX',
    accent: '#HEX',
  },
}
```

### Custom Content Types

Add new content types in `buildPrompt()`:

```typescript
case 'your-type':
  return `Your custom prompt for ${brandConfig.name}`
```

### Adjusting AI Behavior

Modify AI parameters:

```typescript
temperature: 0.7,  // 0-1, higher = more creative
max_tokens: 200,   // Limit response length
model: 'gpt-3.5-turbo' // Or 'gpt-4' for better quality
```

## Troubleshooting

### Common Issues

1. **"OpenAI not configured"**

   - Check your API key in `.env.local`
   - Ensure environment variables are loaded

2. **"AI enhancement failed"**

   - Check API key validity
   - Monitor rate limits
   - Check network connectivity

3. **Poor content quality**

   - Adjust temperature settings
   - Improve prompts
   - Try GPT-4 for better results

4. **Slow performance**
   - Implement caching
   - Use parallel processing
   - Optimize prompt length

## Future Enhancements

### Planned Features

- 🖼️ AI image generation for placeholders
- 🌍 Multi-language content generation
- 📊 Analytics integration suggestions
- 🎯 Conversion optimization tips
- 🔧 Custom model fine-tuning

### Integration Ideas

- Connect to inventory management systems
- Real-time content updates
- A/B testing suggestions
- Competitive analysis

## Conclusion

The AI integration transforms SiteClone Wizard from a simple cloning tool into an intelligent website generation platform. By leveraging OpenAI's capabilities, we can create more engaging, industry-specific, and SEO-optimized websites automatically.

Remember to always review AI-generated content and ensure it aligns with your brand voice and legal requirements.
