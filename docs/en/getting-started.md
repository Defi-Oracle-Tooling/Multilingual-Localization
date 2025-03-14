# Getting Started with Multilingual Localization

This guide will help you get started with the Multilingual Localization module for your SolaceNet projects.

## Installation

To add the localization module to your project, use Git submodules:

```bash
# Add as a submodule in your project
git submodule add https://github.com/Defi-Oracle-Tooling/Multilingual-Localization.git localization
git submodule update --init --recursive

# Install dependencies
cd localization
npm install
```

## Basic Usage

### Translating a Single File

```javascript
const { translateMarkdownFile } = require('./localization');

// Translate a markdown file from English to Spanish
await translateMarkdownFile({
  inputFile: './docs/en/getting-started.md',
  outputFile: './docs/es/getting-started.md',
  targetLanguage: 'es',
  service: 'azure' // or 'deepl', 'openai'
});
```

### Batch Translation

```javascript
const { translateMarkdownBatch } = require('./localization');

// Translate all markdown files in a directory
await translateMarkdownBatch({
  inputDir: './docs/en',
  outputDir: './docs/fr',
  targetLanguage: 'fr',
  service: 'deepl'
});
```

### Synchronizing Translations

```javascript
const { synchronizeTranslations } = require('./localization');

// Synchronize translations based on changes to English source files
await synchronizeTranslations('./docs/en', ['./docs/es', './docs/fr', './docs/de'], {
  service: 'openai',
  preserveCodeBlocks: true,
  preserveFrontMatter: true
});
```

## Using the CLI Scripts

The module includes several command-line scripts for easy integration into your workflow:

### Translate Markdown Files

```bash
./scripts/translate-md.sh --input ./docs/en/ --output ./docs/es/ --lang es
```

### Synchronize Translations

```bash
./scripts/localization-sync.sh --source ./docs/en --targets ./docs/es,./docs/fr,./docs/de
```

### Check Translation Quality

```bash
./scripts/quality-check.sh --dir ./docs/es --lang es --report quality-report.md
```

## GitHub Actions Integration

The module includes a GitHub Actions workflow that automatically translates and synchronizes your documentation when changes are made to the English source files.

To use this workflow, make sure you have the following secrets set in your GitHub repository:

- `AZURE_TRANSLATOR_KEY`: API key for Azure Translator
- `DEEPL_API_KEY`: API key for DeepL
- `OPENAI_API_KEY`: API key for OpenAI

The workflow will:

1. Detect changes to files in the `docs/en` directory
2. Translate the changed files to all supported languages
3. Run quality checks on the translations
4. Commit and push the updated translations

## Next Steps

- Check out the [API Reference](./api-reference.md) for detailed information on all available functions
- Learn about [Quality Checking](./quality-checking.md) to ensure high-quality translations
- Explore [Advanced Configuration](./advanced-configuration.md) for customizing the localization process
