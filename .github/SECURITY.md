# Security Policy

## Supported Versions

We currently provide security updates for the following versions of SiteClone Wizard:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The SiteClone Wizard team takes security seriously. We appreciate your efforts to disclose security vulnerabilities responsibly.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing us at:
**security@example.com**

Include as much information as possible:

- Type of vulnerability
- Full paths of source files related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
- **Assessment**: We'll assess the vulnerability and determine its severity
- **Updates**: We'll provide regular updates on our progress
- **Resolution**: We'll work to resolve the issue as quickly as possible
- **Credit**: We'll credit you in our security advisory (unless you prefer to remain anonymous)

### Response Timeline

- **Critical vulnerabilities**: Patch within 24-48 hours
- **High severity vulnerabilities**: Patch within 7 days
- **Medium/Low severity vulnerabilities**: Patch within 30 days

## Security Considerations for Generated Sites

### Important Warnings

SiteClone Wizard generates websites by scraping and processing external content. Users should be aware of the following security considerations:

1. **Content Sanitization**: All scraped content is sanitized, but users should review generated code before deployment
2. **External Links**: Generated sites have external links disabled by default for security
3. **No Sensitive Data**: Never include API keys, passwords, or sensitive data in generated sites
4. **Code Review**: Always review generated code before deploying to production

### Best Practices

1. **Environment Isolation**: Run SiteClone Wizard in isolated environments
2. **Input Validation**: Validate all user inputs before processing
3. **Regular Updates**: Keep dependencies and the application updated
4. **Secure Deployment**: Use HTTPS and secure hosting for generated sites
5. **Content Review**: Review all generated content before public deployment

## Security Features

- Input sanitization for all user-provided data
- Content Security Policy (CSP) headers in generated sites
- XSS protection through content sanitization
- Safe HTML parsing and generation
- Disabled external resource loading in generated sites

## Dependencies

We regularly audit our dependencies for security vulnerabilities:

- Run `pnpm audit` to check for known vulnerabilities
- Keep all dependencies updated to their latest secure versions
- Monitor security advisories for our tech stack (Next.js, Node.js, etc.)

## Responsible Disclosure

We follow responsible disclosure practices:

- We'll work with you to understand and resolve the issue
- We'll keep you informed of our progress
- We'll publicly disclose the vulnerability after it's been fixed
- We'll credit security researchers who help us improve SiteClone Wizard

## Bug Bounty

Currently, we do not have a formal bug bounty program, but we greatly appreciate security reports and will recognize contributors in our security advisories.

---

Thank you for helping keep SiteClone Wizard and our users safe! 