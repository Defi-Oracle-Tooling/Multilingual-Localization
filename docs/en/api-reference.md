# API Reference

This document provides a comprehensive reference for the Multilingual Localization module API.

## Language Utilities

### isLanguageSupported(code)

Checks if a language code is supported by the localization module.

```typescript
function isLanguageSupported(code: LanguageCode): boolean;
```

### getLanguageInfo(code)

Gets information about a language.

```typescript
function getLanguageInfo(code: LanguageCode): LanguageInfo | undefined;
```

### getLanguagesByRegion(region)

Gets all languages in a region.

```typescript
function getLanguagesByRegion(region: Region): LanguageCode[];
```

### isRightToLeftLanguage(code)

Checks if a language is right-to-left.

```typescript
function isRightToLeftLanguage(code: LanguageCode): boolean;
```

## Translation Services

### translateText(text, options)

Translates text from one language to another.

```typescript
function translateText(
  text: string,
  options: TranslationOptions
): Promise<TranslationResult>;
```

### createTranslationService(service, apiKey)

Creates a translation service based on the specified service type.

```typescript
function createTranslationService(
  service: 'azure' | 'deepl' | 'openai',
  apiKey?: string
): TranslationService;
```

## Markdown Processing

### translateMarkdownContent(content, options)

Translates markdown content.

```typescript
function translateMarkdownContent(
  content: string,
  options: TranslationOptions
): Promise<string>;
```

### translateMarkdownFile(options)

Translates a markdown file.

```typescript
function translateMarkdownFile(
  options: MarkdownTranslationOptions
): Promise<TranslationResult>;
```

## Quality Checking

### checkFileQuality(filePath, language, minScore)

Checks quality of a translated file.

```typescript
function checkFileQuality(
  filePath: string,
  language: LanguageCode,
  minScore?: number
): Promise<QualityCheckResult>;
```

### generateQualityReport(directory, language, filePattern, minScore)

Generates a quality report for a directory.

```typescript
function generateQualityReport(
  directory: string,
  language: LanguageCode,
  filePattern?: string,
  minScore?: number
): Promise<string>;
```
