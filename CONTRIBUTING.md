# Contributing to SiteClone Wizard

Thank you for your interest in contributing to SiteClone Wizard! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/siteclone-wizard.git
   cd siteclone-wizard
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18.0 or higher
- pnpm (recommended) or npm
- Git

### Environment Setup

1. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```
2. Add your API keys (optional for basic development):
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

### Running the Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your changes.

## Contributing Guidelines

### Types of Contributions

We welcome these types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance improvements**
- 🧪 **Test coverage**
- 🛠️ **Developer experience improvements**

### Areas for Contribution

- **AI Integration**: Improve AI model integration and prompts
- **Web Scraping**: Enhance scraping accuracy and robustness
- **UI Components**: Create new components or improve existing ones
- **Dealership Features**: Add industry-specific functionality
- **Testing**: Add unit, integration, or E2E tests
- **Documentation**: Improve README, add tutorials, code comments

## Pull Request Process

### Before Submitting a PR

1. **Check existing issues**: Look for related issues or discussions
2. **Run tests**: Ensure all tests pass
   ```bash
   pnpm test
   pnpm test:e2e
   ```
3. **Lint your code**: Fix any linting issues
   ```bash
   pnpm lint
   pnpm lint:fix
   ```
4. **Type check**: Ensure TypeScript compiles without errors
   ```bash
   pnpm type-check
   ```
5. **Update documentation**: Add or update relevant documentation

### PR Guidelines

1. **Clear title**: Use a descriptive title that explains the change
2. **Detailed description**: Explain what changes you made and why
3. **Link issues**: Reference any related issues using `Fixes #123`
4. **Screenshots**: Include screenshots for UI changes
5. **Breaking changes**: Clearly mark any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use strict mode settings

### Code Style

- **Formatting**: We use Prettier for code formatting
- **Linting**: ESLint enforces code quality rules
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Imports**: Use absolute imports with path mapping when possible

### File Organization

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/              # Core business logic
│   ├── types.ts      # Shared TypeScript types
│   ├── utils.ts      # Utility functions
│   └── constants.ts  # Application constants
└── styles/           # Global styles
```

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces for props
- Add JSDoc comments for complex components
- Use meaningful component and prop names

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

/**
 * Reusable button component with multiple variants
 */
export function Button({ variant, children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

## Testing

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Test Guidelines

- Write tests for new features and bug fixes
- Aim for high test coverage
- Use descriptive test names
- Test both happy paths and edge cases

### Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should handle expected behavior', () => {
    // Test implementation
  })

  it('should handle edge cases', () => {
    // Edge case testing
  })
})
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Explain complex algorithms or business logic
- Update README.md for significant changes
- Document API endpoints and their parameters

### API Documentation

```typescript
/**
 * Generates a dealership website using AI
 * @param dealershipInfo - Information about the dealership
 * @param options - Generation options
 * @returns Promise resolving to generated website data
 */
export async function generateDealershipSite(
  dealershipInfo: DealershipInfo,
  options: GenerationOptions
): Promise<GeneratedSite> {
  // Implementation
}
```

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Environment**: OS, Node.js version, browser
2. **Steps to reproduce**: Detailed steps to reproduce the issue
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Screenshots**: If applicable
6. **Error messages**: Full error messages and stack traces

### Feature Requests

For feature requests, please include:

1. **Problem description**: What problem does this solve?
2. **Proposed solution**: How should this feature work?
3. **Alternatives considered**: Other solutions you've considered
4. **Use case**: How would you use this feature?

## Getting Help

- 💬 [GitHub Discussions](https://github.com/ammanabbasi/siteclone-wizard/discussions)
- 🐛 [GitHub Issues](https://github.com/ammanabbasi/siteclone-wizard/issues)
- 📧 [Email Support](mailto:support@example.com)

## Recognition

Contributors will be recognized in our README and release notes. Thank you for helping make SiteClone Wizard better!

---

By contributing to SiteClone Wizard, you agree that your contributions will be licensed under the MIT License. 