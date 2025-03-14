# Advanced Configuration

This document provides information on advanced configuration options for the Multilingual Localization module.

## Environment Variables

You can configure the module by setting environment variables:

```bash
# Translation API keys
export AZURE_TRANSLATOR_KEY="your-azure-key"
export DEEPL_API_KEY="your-deepl-key"
export OPENAI_API_KEY="your-openai-key"
```

## Custom Translation Services

You can implement custom translation services by extending the `TranslationService` class:

```typescript
import { TranslationService, TranslationOptions, TranslationResult } from 'localization';

class CustomTranslationService extends TranslationService {
  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    // Implement your custom translation logic here
    
    // Example implementation
    const translatedText = await someTranslationAPI.translate(text, {
      from: options.sourceLanguage || 'en',
      to: options.targetLanguage
    });
    
    return {
      original: text,
      translated: translatedText,
      language: options.targetLanguage,
      success: true
    };
  }
}

// Register your custom service
const customService = new CustomTranslationService();
```

## Batch Translation Options

When translating multiple files, you can configure batch processing options:

```typescript
import { translateMarkdownBatch } from 'localization';

const results = await translateMarkdownBatch({
  inputDir: './docs/en/',
  outputDir: './docs/es/',
  targetLanguage: 'es',
  service: 'azure',
  filePattern: '**/*.md',  // Only translate markdown files
  batchSize: 10,           // Process 10 files at a time
  concurrency: 5           // Run 5 translations concurrently
});
```

## Quality Checking Configuration

You can configure quality checking thresholds and rules:

```typescript
import { checkDirectoryQuality } from 'localization';

const results = await checkDirectoryQuality(
  './docs/es/',
  'es',
  '**/*.md',  // File pattern
  80          // Minimum score to pass
);
```

## GitHub Actions Integration

You can integrate the localization module with GitHub Actions for continuous localization:

```yaml
name: Localization Automation

on:
  push:
    branches:
      - main
    paths:
      - 'docs/en/**'
  workflow_dispatch:

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
      
      - name: Execute Translation Sync
        run: ./scripts/localization-sync.sh
        env:
          AZURE_TRANSLATOR_KEY: ${{ secrets.AZURE_TRANSLATOR_KEY }}
      
      - name: Run Quality Checks
        run: ./scripts/quality-check.sh
      
      - name: Commit and Push Translations
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "Automated Localization Updates"
          file_pattern: "docs/ quality-reports/"
```

## Integration with Static Site Generators

### Docusaurus

```javascript
// docusaurus.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'ja', 'zh-cn'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      es: {
        label: 'Español',
      },
      // Add more locales as needed
    },
  },
  // Other configuration options
};
```

### Next.js

```javascript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'es', 'fr', 'de', 'ja', 'zh-cn'],
    defaultLocale: 'en',
  },
};
```

### Gatsby

```javascript
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-i18n',
      options: {
        langKeyDefault: 'en',
        langKeyForNull: 'en',
        prefixDefault: false,
        useLangKeyLayout: false,
      },
    },
  ],
};
```
