# Theming System Documentation

This project uses a sophisticated theming system that provides consistent styling across the web application and PDF exports. The system supports multiple themes with a single source of truth architecture.

## 📁 Architecture Overview

The theming system is built with the following key components:

### Core Files
- **`src/lib/types/theme.ts`** - Theme enumeration and type definitions
- **`src/lib/theme.ts`** - Main theme configuration (runtime)
- **`src/lib/generate-theme-css.ts`** - CSS generation utilities
- **`scripts/generate-theme-css.cjs`** - Build-time CSS generation
- **`src/styles/generated-theme.css`** - Auto-generated CSS (do not edit manually)

### Components
- **`src/providers/theme-provider.tsx`** - React context for theme management
- **`src/components/ui/theme-toggle.tsx`** - Theme selection UI component

## 🎨 Available Themes

The system currently supports three themes:

1. **Light Theme** (`Theme.LIGHT`) - Clean white background with dark text
2. **Dark Theme** (`Theme.DARK`) - Dark background with light text  
3. **Blue & Gold Theme** (`Theme.BLUE`) - Game-like blue backgrounds with gold accents

## 🔧 How to Update Theme Variables

### Method 1: Update Existing Theme Colors

To modify existing theme colors, update **both** configuration files:

#### 1. Update Runtime Configuration
Edit `src/lib/theme.ts`:

```typescript
export const themeConfig = {
  [Theme.LIGHT]: {
    background: '0 0% 95%',        // ✏️ Changed from 100% to 95%
    primary: '220 100% 45%',       // ✏️ Changed to blue primary
    // ... other values
  },
  [Theme.DARK]: {
    background: '0 0% 5%',         // ✏️ Changed from 3.9% to 5%
    // ... other values  
  },
  [Theme.BLUE]: {
    // ... game theme values
  }
}
```

#### 2. Update Build Configuration
Edit `scripts/generate-theme-css.cjs`:

```javascript
const themeConfig = {
  light: {
    background: '0 0% 95%',        // ✏️ Same change as above
    primary: '220 100% 45%',       // ✏️ Same change as above
    // ... other values
  },
  dark: {
    background: '0 0% 5%',         // ✏️ Same change as above
    // ... other values
  }
  // ... other themes
};
```

#### 3. Regenerate CSS
```bash
npm run theme:generate
```

### Method 2: Using HSL Color Format

All colors use HSL format without the `hsl()` wrapper:

```typescript
// ✅ Correct format
background: '220 85% 12%'

// ❌ Incorrect format  
background: 'hsl(220, 85%, 12%)'
background: '#1a365d'
```

### Color Properties Reference

| Property | Purpose | Example |
|----------|---------|---------|
| `background` | Page background | `'0 0% 100%'` |
| `foreground` | Text color | `'0 0% 3.9%'` |
| `primary` | Primary buttons/links | `'0 0% 9%'` |
| `secondary` | Secondary elements | `'0 0% 96.1%'` |
| `border` | Border colors | `'0 0% 89.8%'` |
| `muted` | Subtle backgrounds | `'0 0% 96.1%'` |
| `destructive` | Error/danger colors | `'0 84.2% 60.2%'` |

## ➕ How to Add a New Theme

### Step 1: Update Theme Enumeration

Edit `src/lib/types/theme.ts`:

```typescript
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark', 
  BLUE = 'blue',
  PURPLE = 'purple', // ← Add new theme
}

export const THEME_OPTIONS = [
  { value: Theme.LIGHT, label: 'Light', icon: 'Sun' },
  { value: Theme.DARK, label: 'Dark', icon: 'Moon' },
  { value: Theme.BLUE, label: 'Game Mode', icon: 'Gamepad2' },
  { value: Theme.PURPLE, label: 'Purple Mode', icon: 'Star' }, // ← Add option
];
```

### Step 2: Add Theme Configuration (Runtime)

Edit `src/lib/theme.ts`:

```typescript
export const themeConfig = {
  [Theme.LIGHT]: { /* existing */ },
  [Theme.DARK]: { /* existing */ },
  [Theme.BLUE]: { /* existing */ },
  [Theme.PURPLE]: {
    // Purple theme colors
    background: '270 50% 10%',     // Dark purple background
    foreground: '300 20% 90%',     // Light purple text
    primary: '280 100% 60%',       // Bright purple primary
    primaryForeground: '270 50% 10%',
    secondary: '270 30% 20%',      // Darker purple secondary
    secondaryForeground: '300 20% 90%',
    muted: '270 40% 15%',          // Muted purple
    mutedForeground: '300 10% 70%',
    accent: '290 100% 70%',        // Bright purple accent
    accentForeground: '270 50% 10%',
    destructive: '0 84.2% 60.2%',  // Keep red for errors
    destructiveForeground: '0 0% 98%',
    border: '270 30% 25%',         // Purple borders
    input: '270 40% 20%',          // Purple inputs
    ring: '280 100% 70%',          // Purple focus ring
    
    // Sidebar colors
    sidebarBackground: '270 60% 8%',
    sidebarForeground: '300 20% 85%',
    sidebarPrimary: '280 100% 65%',
    sidebarPrimaryForeground: '270 50% 10%',
    sidebarAccent: '270 40% 18%',
    sidebarAccentForeground: '300 20% 85%',
    sidebarBorder: '270 30% 20%',
    sidebarRing: '280 100% 70%',
    
    // Charts
    'chart-1': '280 100% 65%',     // Purple
    'chart-2': '320 80% 60%',      // Pink-purple  
    'chart-3': '260 70% 55%',      // Blue-purple
    'chart-4': '300 90% 70%',      // Magenta
    'chart-5': '340 85% 65%',      // Rose
  },
}
```

### Step 3: Add Theme Configuration (Build)

Edit `scripts/generate-theme-css.cjs`:

```javascript
const themeConfig = {
  light: { /* existing */ },
  dark: { /* existing */ },
  blue: { /* existing */ },
  purple: {
    // Same color values as above, but with string keys
    background: '270 50% 10%',
    foreground: '300 20% 90%',
    // ... copy all values from step 2
  }
};
```

### Step 4: Regenerate CSS

```bash
npm run theme:generate
```

### Step 5: Test the New Theme

The new theme will automatically appear in:
- ✅ Theme toggle dropdown
- ✅ PDF generation (automatic theme detection)
- ✅ All UI components
- ✅ Type safety throughout the app

## 🔄 Development Workflow

### Daily Development
```bash
# Make theme changes in theme.ts and generate-theme-css.cjs
npm run theme:generate    # Regenerate CSS after changes
npm run dev              # Continue development
```

### Production Build
```bash
npm run build            # CSS auto-generates via prebuild script
```

### Theme Testing Checklist

When adding or modifying themes:

- [ ] Update both `theme.ts` and `generate-theme-css.cjs` 
- [ ] Run `npm run theme:generate`
- [ ] Test theme toggle functionality
- [ ] Verify PDF generation works with new theme
- [ ] Check all UI components render correctly
- [ ] Test accessibility (contrast ratios)
- [ ] Verify theme persistence across page reloads

## 🛠️ Technical Details

### Theme Persistence
- Themes are stored in `localStorage` with key `'theme'`
- Default theme is `Theme.LIGHT` if no preference is saved
- Theme is applied via CSS classes on `document.documentElement`

### CSS Generation Process
1. **Development**: Run `npm run theme:generate` manually
2. **Build**: Automatic via `prebuild` script in `package.json`
3. **Output**: `src/styles/generated-theme.css`
4. **Import**: Automatically imported in `src/app/globals.css`

### Type Safety
- All theme values are type-checked via TypeScript
- Invalid theme names are caught at compile time
- Theme validation functions prevent runtime errors

### PDF Integration
- PDF generation automatically detects current web theme
- Theme is passed to PDF renderer for consistent styling
- No additional configuration needed for new themes

## 🎯 Best Practices

### Color Selection
- Use HSL values for easier manipulation
- Maintain sufficient contrast ratios (WCAG guidelines)
- Test colors in both light and dark environments
- Consider colorblind accessibility

### Performance
- CSS is generated at build time (no runtime overhead)
- Minimal CSS output (only color variables)
- Efficient theme switching via CSS class changes

### Maintenance
- Keep theme configurations in sync between runtime and build
- Document color choices and reasoning
- Test theme changes across all components
- Consider semantic color names over specific hues

## 🐛 Troubleshooting

### Common Issues

**Theme not updating after changes:**
```bash
# Clear cache and regenerate
rm -rf .next/
npm run theme:generate
npm run dev
```

**Build fails with theme errors:**
```bash
# Check both config files are in sync
# Verify all theme properties are strings
# Ensure no TypeScript syntax in .cjs file
```

**PDF theme mismatch:**
```bash
# Verify theme detection in browser
# Check network requests include theme parameter
# Test with explicit theme parameter
```

### Debug Commands

```bash
# Generate CSS manually
npm run theme:generate

# Check generated CSS
cat src/styles/generated-theme.css

# Test PDF with specific theme
curl "localhost:3000/api/crews/[id]/pdf?theme=purple"
```

## 📚 Related Documentation

- [PDF Generation Guide](./pdf-generation.md)
- [Component Development](./components.md)
- [Contributing Guidelines](../CONTRIBUTING.md)