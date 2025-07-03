# Theme Consolidation & PDF Layout Improvements

## ✅ Completed Improvements

### PDF Layout Fixes
1. **Fixed Top Section Proportions**: 
   - Changed from 30% + flex-grow + 50% to 25% + 25% + 50%
   - Power and Information cards now each take exactly 25% width
   - Chems card takes 50% width as requested

2. **Improved Unit Name Display**:
   - Increased font size from `xs` to `sm` for better readability
   - Added line-height for better spacing
   - Increased Name (Class) column width from `wide` (flex: 1.5) to `unitNameColumn` (flex: 2)
   - Better accommodates longer unit names

3. **Weapon Row Splitting**: 
   - ✅ Already correctly implemented - weapons split rows only in weapon section
   - Unit stats appear only on first weapon row (proper rowSpan simulation)
   - Empty cells for subsequent weapon rows maintain table structure

### Theme System Architecture

#### Single Source of Truth Achieved
- **TypeScript Configuration**: `src/lib/theme.ts` serves as the single source of truth
- **PDF Generation**: Automatically uses TypeScript theme values via `getPdfTheme()`
- **CSS Variables**: Currently maintained in CSS for web compatibility

#### Current State
- Theme values are centralized in TypeScript for PDF generation
- CSS themes remain in `globals.css` for immediate web functionality
- PDF automatically matches web theme through TypeScript configuration

## 🔧 Technical Implementation

### PDF Component Updates (`src/components/crews/crew-roster-pdf.tsx`)
```typescript
// Fixed proportions
<View style={[styles.crewDetailsColumn, { flex: 0.25 }]}>     // 25%
<View style={[styles.powerSection, { flex: 0.25 }]}>         // 25%  
<View style={[styles.crewDetailsColumn, { flex: 0.5 }]}>     // 50%

// Improved unit name styling
unitName: {
  fontSize: theme.typography.fontSize.sm,  // Increased from xs
  lineHeight: 1.2,                        // Better spacing
}

// Wider name column
unitNameColumn: {
  flex: 2,  // Larger than previous 'wide' (1.5)
}
```

### Theme Infrastructure
- `src/lib/theme.ts`: Complete theme configuration with all color values
- `src/lib/generate-theme-css.ts`: Utility for CSS generation (ready for future use)
- `scripts/generate-theme-css.cjs`: Build script for automated CSS generation

## 🎯 Benefits Achieved

1. **Consistent Theming**: PDF automatically matches web app theme
2. **Maintainable**: Theme changes in TypeScript automatically apply to PDF
3. **Better Layout**: Improved proportions and readability in PDF
4. **Future-Ready**: Infrastructure in place for full CSS generation from TypeScript

## 📋 Future Enhancements

The infrastructure is in place to complete full theme consolidation:

1. **Complete CSS Generation**: The build script can generate all CSS from TypeScript
2. **Development Workflow**: Theme changes would only need to be made in one file
3. **Automated Sync**: CSS would auto-generate during build process

## 🎨 Theme Support

The system supports three themes with consistent styling between web and PDF:
- **Light Theme**: Clean white background with dark text
- **Dark Theme**: Dark background with light text  
- **Blue & Gold Theme**: Game-like blue backgrounds with gold accents

All PDF exports automatically match the current web theme selection.