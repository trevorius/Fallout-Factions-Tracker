# PDF Generation Documentation

This project includes a sophisticated PDF generation system for crew roster pages that automatically mirrors the desktop layout and stays in sync with theme changes.

## 📁 Architecture Overview

The PDF generation system consists of several interconnected components:

### Core Files
- **[`src/components/crews/crew-roster-pdf.tsx`](../src/components/crews/crew-roster-pdf.tsx)** - React PDF component for rendering
- **[`src/lib/actions/pdf-actions.ts`](../src/lib/actions/pdf-actions.ts)** - Server actions for PDF generation
- **[`src/app/api/crews/[crewId]/pdf/route.ts`](../src/app/api/crews/[crewId]/pdf/route.ts)** - API endpoint for PDF downloads
- **[`src/components/crews/edit-crew-form.tsx`](../src/components/crews/edit-crew-form.tsx)** - UI integration (PDF button)

### Dependencies
- **`@react-pdf/renderer`** - React-based PDF generation library
- **[`src/lib/theme.ts`](../src/lib/theme.ts)** - Theme system integration for consistent styling

## 🎯 Features

### Layout Mirroring
- ✅ **Landscape A4 orientation** for optimal table layout
- ✅ **Three-column layout**: Crew Details (25%) + Power section (25%) + Chems (50%)
- ✅ **Weapon row splitting** - units with multiple weapons split across rows (same as HTML)
- ✅ **Automatic feature detection** - new HTML features automatically appear in PDF
- ✅ **Clean output** - no sidebars, UI buttons, or navigation elements

### Theme Integration
- ✅ **Automatic theme detection** from current web interface
- ✅ **Dynamic theme application** - PDF matches current web theme
- ✅ **All themes supported** - Light, Dark, Blue & Gold, and any future themes
- ✅ **Consistent colors** - HSL to Hex conversion for PDF compatibility

### User Experience
- ✅ **One-click generation** via "Generate PDF" button
- ✅ **Automatic downloads** with sanitized filenames
- ✅ **Toast notifications** for success/error feedback
- ✅ **Authentication required** - users can only generate PDFs for their own crews

## 🚀 How to Use PDF Generation

### End User Workflow

1. **Navigate to crew edit page**: `/crews/[crewId]/edit`
2. **Click "Generate PDF" button** (top-right corner with FileDown icon)
3. **PDF automatically downloads** with filename: `{crew-name}-roster.pdf`
4. **PDF opens** with current theme styling applied

### Developer Integration

The PDF generation is automatically available for any crew edit page. No additional setup required.

```typescript
// PDF generation is triggered via server action
import { generateCrewRosterPDF } from '@/lib/actions/pdf-actions'

// Usage (already integrated in edit-crew-form.tsx)
const handleGeneratePDF = async () => {
  const currentTheme = detectThemeFromDOM();
  await generateCrewRosterPDF(crew.id, currentTheme);
}
```

## 🔧 Technical Implementation

### PDF Component Structure

The PDF component ([`crew-roster-pdf.tsx`](../src/components/crews/crew-roster-pdf.tsx)) uses React PDF syntax:

```typescript
<Document>
  <Page size="A4" orientation="landscape" style={pageStyles}>
    {/* Three-column layout */}
    <View style={containerStyles}>
      {/* Left: Crew Details (25%) */}
      <View style={leftColumnStyles}>
        <CrewDetailsSection />
        <PerksInjuriesSection />
      </View>
      
      {/* Center: Power Section (25%) */}
      <View style={centerColumnStyles}>
        <PowerCardSection />
      </View>
      
      {/* Right: Chems (50%) */}
      <View style={rightColumnStyles}>
        <ChemsSection />
      </View>
    </View>
  </Page>
</Document>
```

### Theme Integration Process

1. **Theme Detection**: Client-side JavaScript detects current theme from DOM
2. **Server Action Call**: Theme passed to `generateCrewRosterPDF()` server action
3. **PDF Generation**: Server renders PDF with theme-specific colors
4. **Download**: PDF returned as downloadable blob to client

```typescript
// Theme detection (client-side)
function detectThemeFromDOM(): Theme {
  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains('dark')) return Theme.DARK;
  if (htmlElement.classList.contains('blue')) return Theme.BLUE;
  return Theme.LIGHT;
}

// PDF rendering (server-side)
const pdfTheme = getPdfTheme(theme);
const pdfBuffer = await pdf(<CrewRosterPDF crew={crew} theme={pdfTheme} />).toBuffer();
```

### Weapon Row Splitting Logic

The PDF automatically handles weapon row splitting to match HTML behavior:

```typescript
// Generate weapon rows for PDF table
const weaponRows = units.flatMap(unit => {
  if (!unit.weapons || unit.weapons.length === 0) {
    return [{ unit, weapon: null, isFirstWeapon: true }];
  }
  
  return unit.weapons.map((weapon, index) => ({
    unit,
    weapon,
    isFirstWeapon: index === 0, // Only show unit data on first weapon row
  }));
});
```

## 📝 Adding New Features to PDF

The PDF system is designed to automatically pick up new features added to the HTML crew roster. Follow this process:

### Step 1: Add Feature to HTML Component

Add your new feature to the main crew roster HTML component (typically in edit-crew-form or related components).

### Step 2: Add Feature to PDF Component

Update [`src/components/crews/crew-roster-pdf.tsx`](../src/components/crews/crew-roster-pdf.tsx) to include the new feature:

```typescript
// Example: Adding a new "Equipment" section
const EquipmentSection = ({ equipment }: { equipment: Equipment[] }) => (
  <View style={sectionStyles}>
    <Text style={sectionHeaderStyles}>Equipment</Text>
    {equipment.map((item, index) => (
      <View key={index} style={itemRowStyles}>
        <Text style={itemNameStyles}>{item.name}</Text>
        <Text style={itemValueStyles}>{item.value}</Text>
      </View>
    ))}
  </View>
);

// Add to main PDF layout
<View style={rightColumnStyles}>
  <ChemsSection crew={crew} theme={theme} />
  <EquipmentSection equipment={crew.equipment} /> {/* ← New feature */}
</View>
```

### Step 3: Style the New Feature

Add appropriate styling using the theme system:

```typescript
const equipmentStyles = StyleSheet.create({
  section: {
    marginTop: 10,
    padding: 8,
    border: `1 solid ${theme.border}`,
    backgroundColor: theme.muted,
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
});
```

### Step 4: Test the Feature

```bash
# Test PDF generation with new feature
npm run dev
# Navigate to crew edit page
# Click "Generate PDF" button
# Verify new feature appears in PDF output
```

## 🎨 Theme-Specific Styling

### Color Conversion

The system automatically converts HSL colors to hex for PDF compatibility:

```typescript
// Theme system provides HSL values
const theme = {
  background: '0 0% 100%',      // HSL format
  foreground: '0 0% 3.9%',      // HSL format
}

// PDF system converts to hex
const pdfTheme = {
  background: '#ffffff',         // Converted hex
  foreground: '#0a0a0a',        // Converted hex
}
```

### Responsive Typography

PDF typography scales appropriately for print:

```typescript
const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,              // Larger for headers
    fontWeight: 'bold',
    color: theme.foreground,
  },
  body: {
    fontSize: 10,              // Standard body text
    color: theme.foreground,
  },
  caption: {
    fontSize: 8,               // Smaller for details
    color: theme.mutedForeground,
  },
});
```

## 🔒 Security Considerations

### Authentication & Authorization

- ✅ **User authentication required** - only logged-in users can generate PDFs
- ✅ **Crew ownership validation** - users can only generate PDFs for their own crews
- ✅ **Server-side validation** - all checks performed on secure server environment

```typescript
// Security implementation in API route
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const crew = await prisma.crew.findFirst({
    where: {
      id: crewId,
      userId: session.user.id, // ✅ Ownership check
    },
  });

  if (!crew) {
    return new Response('Crew not found', { status: 404 });
  }

  // ... generate PDF
}
```

### Filename Sanitization

PDF filenames are automatically sanitized to prevent security issues:

```typescript
// Safe filename generation
const sanitizedName = crew.name
  .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
  .replace(/\s+/g, '-')            // Replace spaces with hyphens
  .toLowerCase()                   // Lowercase for consistency
  .slice(0, 50);                   // Limit length

const filename = `${sanitizedName}-roster.pdf`;
```

## 🚀 Performance Optimization

### Server-Side Rendering

- ✅ **Server-side PDF generation** - reduces client load
- ✅ **Streaming responses** - PDFs stream directly to download
- ✅ **Memory efficient** - PDF buffers are cleaned up automatically
- ✅ **Caching headers** - appropriate cache-control for PDF responses

### Bundle Size Management

- ✅ **Conditional imports** - PDF components only loaded when needed
- ✅ **Tree shaking** - unused PDF features are eliminated
- ✅ **Dynamic imports** - PDF generation code split from main bundle

## 🐛 Troubleshooting

### Common Issues

**PDF not downloading:**
```bash
# Check browser console for errors
# Verify user is logged in
# Confirm crew ownership
# Test with different browsers
```

**Theme not applied to PDF:**
```bash
# Check theme detection: console.log(detectThemeFromDOM())
# Verify theme parameter in network request
# Test with explicit theme parameter: ?theme=dark
```

**Layout issues in PDF:**
```bash
# Compare with HTML layout
# Check StyleSheet definitions
# Verify flex properties (limited in PDF)
# Test with different content lengths
```

**Memory issues with large crews:**
```bash
# Monitor server memory usage
# Consider pagination for very large crews
# Optimize image handling if images are added
```

### Debug Commands

```bash
# Test PDF generation directly
curl -H "Cookie: session=..." \
  "http://localhost:3000/api/crews/123/pdf?theme=dark"

# Check PDF file size
ls -lah downloaded-roster.pdf

# Verify PDF content (if pdfinfo available)
pdfinfo downloaded-roster.pdf
```

### Development Tips

```typescript
// Add debug logging to PDF component
console.log('Rendering PDF with theme:', theme);
console.log('Crew data:', crew);

// Test PDF without download (development only)
const pdfBlob = await pdf(<CrewRosterPDF crew={crew} theme={theme} />).toBlob();
console.log('PDF blob size:', pdfBlob.size);
```

## 🔮 Future Enhancements

### Planned Features
- **Multi-page support** for very large crews
- **Print-optimized layouts** with page breaks
- **Custom PDF templates** per user preferences
- **Batch PDF generation** for multiple crews
- **PDF metadata** (author, creation date, etc.)

### Extension Points
- **Custom page sizes** (Letter, Legal, etc.)
- **Portrait orientation** option
- **Watermarking** for official documents
- **Digital signatures** for verified rosters
- **Export to other formats** (PNG, SVG)

## 📚 Related Documentation

- [Theming System Guide](./theming.md)
- [Component Development](./components.md)
- [API Routes](./api-routes.md)
- [Authentication](./authentication.md)

## 🤝 Contributing

When contributing to PDF generation:

1. **Test all themes** - ensure new features work across all themes
2. **Verify layout** - compare PDF output with HTML version
3. **Check performance** - monitor PDF generation time and memory usage
4. **Update documentation** - document new features and options
5. **Add tests** - include PDF generation in test suites