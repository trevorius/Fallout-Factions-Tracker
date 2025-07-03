# Documentation Index

Welcome to the project documentation! This directory contains comprehensive guides for various aspects of the application.

## 🏗️ Architecture & Database

### [Database Schema](./schema.md)
Detailed database schema with entity-relationship diagrams and model explanations. Essential for understanding data relationships and database structure.

**Key Topics:**
- Entity-relationship diagrams  
- Model definitions and relationships
- Database design patterns
- Foreign key constraints

## 🔧 System Administration

### [Super Admin Documentation](./superadmin/README.md) 
Complete guide for managing global game assets like factions, weapons, and unit templates that are available across all organizations.

**Key Topics:**
- Global asset management
- System-wide configuration
- Multi-tenant administration
- Asset approval workflows

### [Organization Template Management](./organization-template-management.md)
Guide for organization admins to manage game assets specific to their organization.

**Key Topics:**
- Organization-specific assets
- Template creation and management
- Admin permissions and workflows
- Asset inheritance from global templates

## 🎨 Advanced Features

### [Theming System](./theming.md)
Comprehensive guide to the multi-theme system with single source of truth architecture and automatic synchronization between web interface and PDF exports.

**Key Topics:**
- Theme configuration and management
- Adding new themes step-by-step
- Updating theme variables
- Type-safe theme system
- CSS generation pipeline
- Theme persistence and detection

**Quick Start:**
```bash
# Update theme colors
npm run theme:generate

# Add new theme to enum
# Update theme configurations  
# Regenerate CSS
```

### [PDF Generation](./pdf-generation.md)
Complete guide to the PDF generation system that automatically mirrors desktop layout and stays in sync with web interface themes.

**Key Topics:**
- PDF system architecture
- Theme integration and automatic detection
- Adding new features to PDF output
- Security and authentication
- Performance optimization
- Troubleshooting common issues

**Quick Start:**
```bash
# Generate PDF (user action)
# Click "Generate PDF" button on crew edit page

# Add new feature to PDF
# 1. Add to HTML component
# 2. Add to PDF component  
# 3. Style with theme system
# 4. Test across all themes
```

## 🚀 Quick Reference

### [📁 Complete File Reference Guide](./file-reference.md)
Detailed list of all key files and directories with descriptions and workflows.

### Essential Files by Feature

**Theming System:**
- `src/lib/types/theme.ts` - Theme enumeration
- `src/lib/theme.ts` - Runtime theme configuration  
- `scripts/generate-theme-css.cjs` - Build-time CSS generation
- `src/providers/theme-provider.tsx` - React theme context

**PDF Generation:**
- `src/components/crews/crew-roster-pdf.tsx` - PDF component
- `src/lib/actions/pdf-actions.ts` - Server actions
- `src/app/api/crews/[crewId]/pdf/route.ts` - API endpoint

**Database:**
- `prisma/schema.prisma` - Database schema
- `src/lib/prisma.ts` - Prisma client

### Common Commands

```bash
# Theme Development
npm run theme:generate        # Regenerate CSS from theme config
npm run dev                   # Start development server

# Build & Deploy
npm run build                 # Production build (auto-generates CSS)
npm run build:prod            # Production build with DB migrations

# Database
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema changes
npx prisma studio            # Open database browser
```

## 📝 Contributing to Documentation

When adding new features or making changes:

1. **Update relevant documentation** - keep docs in sync with code changes
2. **Add new files** to this index with clear descriptions
3. **Use consistent formatting** - follow existing documentation patterns
4. **Include practical examples** - show real code snippets and commands
5. **Test documentation** - verify instructions work as described

### Documentation Standards

- **Use clear, descriptive headings** with emoji for visual organization
- **Include code examples** with syntax highlighting
- **Provide step-by-step instructions** for complex procedures  
- **Add troubleshooting sections** for common issues
- **Link to related documentation** for comprehensive coverage
- **Update this index** when adding new documentation files

## 🤝 Need Help?

- Check existing documentation first
- Look for similar patterns in the codebase
- Review related GitHub issues and pull requests
- Ask specific questions with context about what you're trying to achieve

Happy coding! 🚀