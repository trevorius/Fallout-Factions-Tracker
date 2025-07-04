// Test script to validate i18n setup
import { locales, defaultLocale } from '../i18n';

console.log('Testing i18n configuration...\n');

// Test 1: Check locale configuration
console.log('✓ Locales configured:', locales);
console.log('✓ Default locale:', defaultLocale);

// Test 2: Check translation files
async function testTranslationFiles() {
  for (const locale of locales) {
    try {
      const messages = await import(`../messages/${locale}.json`);
      console.log(`✓ Translation file for '${locale}' loaded successfully`);
      console.log(`  - Keys found: ${Object.keys(messages.default).length}`);
    } catch (error) {
      console.error(`✗ Failed to load translation file for '${locale}':`, error);
    }
  }
}

// Test 3: Check for translation completeness
async function checkTranslationCompleteness() {
  try {
    const enMessages = await import('../messages/en.json');
    const frMessages = await import('../messages/fr.json');
    
    const enKeys = getKeys(enMessages.default);
    const frKeys = getKeys(frMessages.default);
    
    console.log('\n✓ Translation completeness check:');
    console.log(`  - English keys: ${enKeys.size}`);
    console.log(`  - French keys: ${frKeys.size}`);
    
    // Check for missing keys
    const missingInFr = [...enKeys].filter(key => !frKeys.has(key));
    const missingInEn = [...frKeys].filter(key => !enKeys.has(key));
    
    if (missingInFr.length > 0) {
      console.log(`  ⚠ Keys missing in French: ${missingInFr.join(', ')}`);
    }
    if (missingInEn.length > 0) {
      console.log(`  ⚠ Keys missing in English: ${missingInEn.join(', ')}`);
    }
    if (missingInFr.length === 0 && missingInEn.length === 0) {
      console.log('  ✓ All translations are complete!');
    }
  } catch (error) {
    console.error('✗ Failed to check translation completeness:', error);
  }
}

function getKeys(obj: any, prefix = ''): Set<string> {
  const keys = new Set<string>();
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nestedKeys = getKeys(obj[key], fullKey);
      nestedKeys.forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  
  return keys;
}

// Run tests
(async () => {
  await testTranslationFiles();
  await checkTranslationCompleteness();
  console.log('\n✓ i18n validation complete!');
})();