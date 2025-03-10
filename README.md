# Multilingual Markdown Localization

A comprehensive multilingual support system for Markdown documentation, designed to be used as a submodule for SolaceNet projects.

## Features

- Support for 25+ languages across multiple regions
- Automated translation workflows using AI-powered translation services
- Human expert review and verification process
- Quality assurance and regulatory compliance measures
- GitHub Actions integration for continuous localization

## Supported Languages and Regional Focus

### Americas

- English (`en`)
- Spanish (`es`)
- Portuguese (`pt-br`)
- French Canadian (`fr-ca`)

### Asia

- Thai (`th`)
- Korean (`ko`)
- Japanese (`ja`)
- Filipino/Tagalog (`tl`)
- Mandarin Chinese (`zh-cn`)
- Hindi (`hi`)
- Vietnamese (`vi`)
- Indonesian (`id`)

### European Union

- English (`en`)
- French (`fr`)
- German (`de`)
- Spanish (`es`)
- Italian (`it`)
- Dutch (`nl`)
- Polish (`pl`)
- Portuguese (`pt`)

### Middle East & North Africa

- Arabic (`ar`)
- Hebrew (`he`)
- Turkish (`tr`)
- Persian/Farsi (`fa`)
- Kurdish (`ku`)

### Southern Africa (SADC)

- English (`en`)
- Portuguese (`pt`)
- French (`fr`)
- Swahili (`sw`)
- Zulu (`zu`)

## Installation

```bash
# As a submodule in your project
git submodule add https://github.com/Defi-Oracle-Tooling/Multilingual-Localization.git localization
git submodule update --init --recursive

# Install dependencies
cd localization
npm install
```

## Usage

### Basic Translation

```javascript
const { translateMarkdown } = require('./localization');

// Translate a markdown file
translateMarkdown({
  inputFile: './docs/en/getting-started.md',
  outputFile: './docs/es/getting-started.md',
  targetLanguage: 'es'
});
```

### Automated Workflow

```bash
# Translate all English markdown files to Spanish
./scripts/translate-md.sh --input ./docs/en/ --output ./docs/es/ --lang es

# Synchronize all translations based on changes to English source files
./scripts/localization-sync.sh

# Run quality checks on translations
./scripts/quality-check.sh
```

## Integration with Static Site Generators

This module works seamlessly with:

- Docusaurus
- Next.js
- Gatsby

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## License

MIT
