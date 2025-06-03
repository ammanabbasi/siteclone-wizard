# SiteClone Wizard - Quick Setup Guide

## 🚀 5-Minute Setup

### Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Git configured
- [ ] Code editor (VS Code recommended)

### Setup Steps

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd siteclone-wizard

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Start development server
pnpm dev

# 5. Open browser
# Navigate to http://localhost:3000
```

### ✅ Verify Installation

1. **Frontend loads**: Visit http://localhost:3000
2. **API works**: Try the clone functionality with a simple website
3. **No errors**: Check browser console and terminal for errors

### 🔧 Common Setup Issues

#### Node.js Version
```bash
# Check version
node --version  # Should be 18+

# If wrong version, use nvm:
nvm install 18
nvm use 18
```

#### pnpm Issues
```bash
# If pnpm not found:
npm install -g pnpm

# Clear cache if needed:
pnpm store prune
```

#### Port Already in Use
```bash
# Run on different port:
pnpm dev -- -p 3001
```

## 📚 Next Steps

After setup is complete:

1. **Read Documentation**: Start with `HANDOFF_PACKAGE_README.md`
2. **Code Review**: Review `COMPREHENSIVE_CODE_REVIEW.md`
3. **Development Guide**: Study `HANDOFF_GUIDE.md`
4. **Test the Application**: Try cloning a simple website

## 🆘 Need Help?

- Check existing documentation first
- Review troubleshooting section in `HANDOFF_GUIDE.md`
- Contact project handoff team

---
**Setup Time**: ~5 minutes  
**Last Updated**: June 3, 2025 