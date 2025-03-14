# Quality Checking

The Multilingual Localization module includes built-in quality checking for translations. This document explains how to use the quality checking features.

## Quality Issues

The quality checker can detect the following types of issues:

- **Missing Translations**: Untranslated placeholders or content
- **Inconsistent Terminology**: Inconsistent use of terminology across a document
- **Formatting Errors**: Unbalanced markdown formatting or broken links
- **Incomplete Sentences**: Sentences that don't end with proper punctuation

## Quality Score

Each file is assigned a quality score from 0 to 100 based on the number and severity of issues:

- **Error**: -10 points per issue
- **Warning**: -3 points per issue
- **Info**: -1 point per issue

A file passes quality checks if its score is above the minimum threshold (default: 70).

## Using the Quality Checker

### Checking a Single File

```javascript
const { checkFileQuality } = require('localization');

const result = await checkFileQuality('./docs/es/getting-started.md', 'es');

console.log(`Quality Score: ${result.score}/100`);
console.log(`Passed: ${result.passed ? 'Yes' : 'No'}`);
console.log(`Issues: ${result.issues.length}`);

// Print issues
result.issues.forEach(issue => {
  console.log(`- ${issue.severity.toUpperCase()}: ${issue.message}`);
});
```

### Checking a Directory

```javascript
const { checkDirectoryQuality } = require('localization');

const results = await checkDirectoryQuality('./docs/es/', 'es');

// Calculate overall statistics
const totalFiles = results.length;
const passedFiles = results.filter(result => result.passed).length;
const failedFiles = totalFiles - passedFiles;
const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalFiles;

console.log(`Files Checked: ${totalFiles}`);
console.log(`Files Passed: ${passedFiles} (${Math.round(passedFiles / totalFiles * 100)}%)`);
console.log(`Files Failed: ${failedFiles} (${Math.round(failedFiles / totalFiles * 100)}%)`);
console.log(`Average Score: ${averageScore.toFixed(2)}/100`);
```

### Generating a Quality Report

```javascript
const { generateQualityReport } = require('localization');

const report = await generateQualityReport('./docs/es/', 'es');

// Write the report to a file
const fs = require('fs');
fs.writeFileSync('./quality-report.md', report);
```

## Using the CLI

```bash
# Check quality of translations
./scripts/quality-check.sh --dir ./docs/ --languages "es,fr,de" --min-score 70
```

This will generate quality reports for each language in the `quality-reports` directory.

## Customizing Quality Checks

You can customize the quality checks by modifying the following parameters:

- **Minimum Score**: The minimum score required to pass quality checks (default: 70)
- **File Pattern**: The pattern used to match files for quality checking (default: `**/*.md`)

```javascript
const { checkDirectoryQuality } = require('localization');

const results = await checkDirectoryQuality(
  './docs/es/',
  'es',
  '**/*.md',  // File pattern
  80          // Minimum score
);
```
