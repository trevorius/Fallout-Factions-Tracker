# I18n Deployment Guide

This guide provides instructions for deploying the internationalization (i18n) features to production without losing existing user data.

## Overview

The i18n implementation adds support for English and French languages across the application, including:
- UI text translations
- Database content translations via a new I18n table
- URL-based locale routing

## Pre-deployment Checklist

- [ ] Backup the production database
- [ ] Test the migration on a staging environment
- [ ] Ensure all environment variables are set
- [ ] Review translation files for completeness

## Deployment Steps

### 1. Database Migration

The i18n implementation adds a new `I18n` table to store translations for database content.

```bash
# Generate migration (if not already done)
npx prisma migrate dev --name add_i18n_support

# Apply migration to production
npx prisma migrate deploy
```

### 2. Seed Initial Translations

After the migration, you need to seed translations for existing data:

```bash
# Run the i18n seed script
npx prisma db seed
```

Note: The seed script will only add translations, it won't modify existing data.

### 3. Deploy Application Code

Deploy the updated application code with the new i18n features:

```bash
# Build the application
npm run build

# Deploy (adjust based on your deployment method)
# Example for PM2:
pm2 restart your-app-name
```

### 4. Update Environment Variables

No new environment variables are required for the base i18n setup.

## Data Migration Strategy

### Preserving Existing Data

The i18n implementation is designed to be non-destructive:

1. **Existing data remains unchanged**: The original tables (Organization, Faction, UnitClass, etc.) keep their current structure
2. **Translations are stored separately**: All translations are stored in the new I18n table
3. **Backward compatibility**: The application falls back to the original field values if no translation is found

### Translation Workflow

For existing data that needs translation:

1. The seed script provides initial translations for common terms
2. For custom content (e.g., user-created organizations), translations can be added through:
   - Admin UI (when implemented)
   - Direct database updates using the provided utility functions
   - API endpoints (when implemented)

## Database Schema Changes

### New Table: I18n

```sql
CREATE TABLE "I18n" (
    "id" TEXT NOT NULL,
    "entityType" "TranslatableEntity" NOT NULL,
    "entityId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "I18n_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "I18n_entityType_entityId_locale_fieldName_key" 
ON "I18n"("entityType", "entityId", "locale", "fieldName");

CREATE INDEX "I18n_entityType_entityId_idx" 
ON "I18n"("entityType", "entityId");

CREATE INDEX "I18n_locale_idx" 
ON "I18n"("locale");
```

### New Enum: TranslatableEntity

```sql
CREATE TYPE "TranslatableEntity" AS ENUM (
    'ORGANIZATION',
    'FACTION',
    'UNIT_CLASS',
    'INJURY',
    'PERK',
    'CHEM',
    'QUEST',
    'STANDARD_WEAPON',
    'WEAPON_TYPE',
    'TRAIT',
    'CRITICAL_EFFECT',
    'WEAPON_UPGRADE'
);
```

## URL Structure Changes

The application now uses locale-prefixed URLs:

- Before: `/organizations/123`
- After: `/en/organizations/123` or `/fr/organizations/123`

Existing bookmarks and links will be automatically redirected to include the default locale (English).

## Rollback Strategy

If you need to rollback the i18n changes:

1. **Keep the database changes**: The I18n table doesn't affect existing functionality
2. **Deploy previous code version**: 
   ```bash
   git checkout <previous-version-tag>
   npm run build
   pm2 restart your-app-name
   ```
3. **Optional - Remove I18n table** (only if absolutely necessary):
   ```bash
   npx prisma migrate down
   ```

## Post-deployment Verification

1. **Check UI translations**: Navigate through the app in both English and French
2. **Verify database translations**: Query the I18n table to ensure translations were seeded
3. **Test locale switching**: Ensure users can switch between languages
4. **Monitor for errors**: Check application logs for any i18n-related errors

## Utility Functions

The following utility functions are available for managing translations:

```typescript
// Get a single translation
getTranslation(entityType, entityId, fieldName, locale, defaultValue?)

// Get all translations for an entity
getTranslations(entityType, entityId, locale)

// Set a translation
setTranslation(entityType, entityId, fieldName, locale, translation)

// Delete all translations for an entity
deleteTranslations(entityType, entityId)
```

## Adding New Translations

To add translations for new content:

1. **For UI text**: Update the translation files in `src/messages/`
2. **For database content**: Use the utility functions or create seed scripts

## Troubleshooting

### Common Issues

1. **Missing translations**: Check that the seed script ran successfully
2. **Locale not detected**: Ensure the middleware is properly configured
3. **404 errors**: Verify that routes are properly prefixed with locale

### Debug Mode

Enable debug logging for i18n:

```typescript
// In your logging configuration
if (process.env.NODE_ENV === 'development') {
  console.log('Locale:', locale);
  console.log('Translations loaded:', Object.keys(messages));
}
```

## Support

For issues or questions about the i18n deployment, please consult:
- The Next.js i18n documentation
- The next-intl documentation
- Your team's internal documentation