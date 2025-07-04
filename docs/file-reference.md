# File Reference Guide

Quick reference to key files and directories in the theming and PDF generation systems.

## 🎨 Theming System Files

### Core Configuration
- **[`src/lib/types/theme.ts`](../src/lib/types/theme.ts)** - Theme enumeration and types
- **[`src/lib/theme.ts`](../src/lib/theme.ts)** - Runtime theme configuration (MASTER)
- **[`scripts/generate-theme-css.cjs`](../scripts/generate-theme-css.cjs)** - Build-time theme configuration
- **[`src/styles/generated-theme.css`](../src/styles/generated-theme.css)** - Auto-generated CSS (DO NOT EDIT)

### React Components
- **[`src/providers/theme-provider.tsx`](../src/providers/theme-provider.tsx)** - Theme context provider
- **[`src/components/ui/theme-toggle.tsx`](../src/components/ui/theme-toggle.tsx)** - Theme selection dropdown

### CSS & Styling
- **[`src/app/globals.css`](../src/app/globals.css)** - Main CSS file (imports generated themes)
- **[`src/lib/generate-theme-css.ts`](../src/lib/generate-theme-css.ts)** - CSS generation utilities

## 📄 PDF Generation Files

### PDF Components
- **[`src/components/crews/crew-roster-pdf.tsx`](../src/components/crews/crew-roster-pdf.tsx)** - Main PDF component (React PDF)

### Server Integration
- **[`src/lib/actions/pdf-actions.ts`](../src/lib/actions/pdf-actions.ts)** - Server actions for PDF generation
- **[`src/app/api/crews/[crewId]/pdf/route.ts`](../src/app/api/crews/[crewId]/pdf/route.ts)** - API endpoint for PDF downloads

### UI Integration
- **[`src/components/crews/edit-crew-form.tsx`](../src/components/crews/edit-crew-form.tsx)** - Contains PDF generation button

## 🗄️ Database & Core
- **[`prisma/schema.prisma`](../prisma/schema.prisma)** - Database schema
- **[`src/lib/prisma.ts`](../src/lib/prisma.ts)** - Prisma client configuration

## 📋 Build & Configuration
- **[`package.json`](../package.json)** - NPM scripts (theme:generate, prebuild)
- **[`next.config.js`](../next.config.js)** - Next.js configuration
- **[`tailwind.config.js`](../tailwind.config.js)** - Tailwind CSS configuration

## 📖 Documentation
- **[`docs/README.md`](./README.md)** - Documentation index
- **[`docs/theming.md`](./theming.md)** - Theming system guide
- **[`docs/pdf-generation.md`](./pdf-generation.md)** - PDF generation guide
- **[`docs/file-reference.md`](./file-reference.md)** - This file
- **[`README.md`](../README.md)** - Main project README

## 🔄 Key Workflows

### Theme Development
1. Edit [`src/lib/theme.ts`](../src/lib/theme.ts) and [`scripts/generate-theme-css.cjs`](../scripts/generate-theme-css.cjs)
2. Run `npm run theme:generate`
3. Test in browser and PDF generation

### PDF Feature Addition
1. Add feature to HTML in [`edit-crew-form.tsx`](../src/components/crews/edit-crew-form.tsx)
2. Add feature to PDF in [`crew-roster-pdf.tsx`](../src/components/crews/crew-roster-pdf.tsx)
3. Style with theme system
4. Test across all themes

### Build Process
1. `npm run build` automatically runs `theme:generate` first
2. Generated CSS is included in build
3. Both web and PDF use same theme configuration

## 🎯 Single Source of Truth

**Theme Colors**: [`src/lib/theme.ts`](../src/lib/theme.ts) (TypeScript configuration)
- Used by: Web interface, PDF generation, CSS generation
- Format: HSL values without `hsl()` wrapper
- Changes here propagate everywhere automatically

**Database Schema**: [`prisma/schema.prisma`](../prisma/schema.prisma)
- Used by: All database operations, type generation
- Changes here require `npx prisma generate`

**Component Structure**: React components in `src/components/`
- PDF components mirror HTML components
- Shared props and data structures ensure consistency