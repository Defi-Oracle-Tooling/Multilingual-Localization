/**
 * Quality checker for the localization module
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { glob } from 'glob';
import { LanguageCode, QualityCheckResult, QualityIssue } from './types';
import { isLanguageSupported, getLanguageInfo } from './language-utils';

// Promisify fs functions
const readFile = promisify(fs.readFile);

/**
 * Check for missing translations in content
 */
function checkMissingTranslations(content: string): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Check for untranslated placeholders
  const placeholderRegex = /\{\{.*?\}\}/g;
  let match;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Reset regex state for each line
    placeholderRegex.lastIndex = 0;

    while ((match = placeholderRegex.exec(line)) !== null) {
      issues.push({
        type: 'missing_translation',
        severity: 'error',
        message: `Untranslated placeholder found: ${match[0]}`,
        line: i + 1,
        suggestion: 'Translate the placeholder content'
      });
    }
  }

  return issues;
}

/**
 * Check for inconsistent terminology in content
 */
function checkInconsistentTerminology(content: string, language: LanguageCode): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Define common terminology for each language
  // This would be expanded with a more comprehensive terminology database
  const terminology: Record<string, Record<string, string[]>> = {
    en: {
      blockchain: ['blockchain', 'block chain'],
      cryptocurrency: ['cryptocurrency', 'crypto currency', 'crypto-currency'],
      'smart contract': ['smart contract', 'smart-contract']
    },
    es: {
      blockchain: ['cadena de bloques', 'blockchain', 'cadena de bloque'],
      cryptocurrency: ['criptomoneda', 'cripto moneda', 'moneda digital'],
      'smart contract': ['contrato inteligente', 'smart contract']
    },
    fr: {
      blockchain: ['chaîne de blocs', 'blockchain', 'chaîne de bloc'],
      cryptocurrency: ['cryptomonnaie', 'crypto-monnaie', 'monnaie numérique'],
      'smart contract': ['contrat intelligent', 'smart contract']
    }
    // Add more languages as needed
  };

  // Skip if terminology is not defined for this language
  if (!terminology[language]) {
    return issues;
  }

  const lines = content.split('\n');

  // Check each term
  for (const [standardTerm, variations] of Object.entries(terminology[language])) {
    // Track which variations are used
    const usedVariations = new Set<string>();

    // Check each line for variations
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      for (const variation of variations) {
        if (line.includes(variation.toLowerCase())) {
          usedVariations.add(variation);
        }
      }
    }

    // If multiple variations are used, report an issue
    if (usedVariations.size > 1) {
      issues.push({
        type: 'inconsistent_terminology',
        severity: 'warning',
        message: `Inconsistent terminology for "${standardTerm}": ${Array.from(usedVariations).join(', ')}`,
        suggestion: `Use "${variations[0]}" consistently`
      });
    }
  }

  return issues;
}

/**
 * Check for formatting errors in content
 */
function checkFormattingErrors(content: string): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Check for unbalanced markdown formatting
  const formattingPairs = [
    { open: '**', close: '**', name: 'bold' },
    { open: '*', close: '*', name: 'italic' },
    { open: '`', close: '`', name: 'inline code' },
    { open: '[', close: ']', name: 'link text' }
  ];

  const lines = content.split('\n');

  for (const pair of formattingPairs) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Count occurrences
      const openCount = (line.match(new RegExp(`\\${pair.open}`, 'g')) || []).length;
      const closeCount = (line.match(new RegExp(`\\${pair.close}`, 'g')) || []).length;

      if (openCount !== closeCount) {
        issues.push({
          type: 'formatting_error',
          severity: 'error',
          message: `Unbalanced ${pair.name} formatting (${openCount} opens, ${closeCount} closes)`,
          line: i + 1,
          suggestion: `Ensure ${pair.name} formatting is properly closed`
        });
      }
    }
  }

  // Check for broken links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Reset regex state for each line
    linkRegex.lastIndex = 0;

    while ((match = linkRegex.exec(line)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];

      if (linkUrl.trim() === '') {
        issues.push({
          type: 'formatting_error',
          severity: 'error',
          message: `Empty link URL for text "${linkText}"`,
          line: i + 1,
          suggestion: 'Add a valid URL to the link'
        });
      }
    }
  }

  return issues;
}

/**
 * Check for incomplete sentences in content
 */
function checkIncompleteSentences(content: string, language: LanguageCode): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Skip code blocks
  const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');

  // Split into paragraphs
  const paragraphs = contentWithoutCodeBlocks.split(/\n\s*\n/);

  for (const paragraph of paragraphs) {
    // Skip headings, lists, etc.
    if (
      paragraph.trim().startsWith('#') ||
      paragraph.trim().match(/^[*-]/) ||
      paragraph.trim().match(/^\d+\./)
    ) {
      continue;
    }

    // Split into sentences
    const sentences = paragraph.split(/[.!?]\s+/);

    for (const sentence of sentences) {
      // Skip very short sentences or non-sentences
      if (sentence.trim().length < 5) {
        continue;
      }

      // Check for sentences that don't end with punctuation
      if (!sentence.trim().match(/[.!?]$/)) {
        issues.push({
          type: 'incomplete_sentence',
          severity: 'warning',
          message: `Possible incomplete sentence: "${sentence.trim()}"`,
          suggestion: 'Add appropriate punctuation or complete the sentence'
        });
      }
    }
  }

  return issues;
}

/**
 * Calculate quality score based on issues
 */
function calculateQualityScore(issues: QualityIssue[]): number {
  if (issues.length === 0) {
    return 100;
  }

  // Count issues by severity
  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
  const infoCount = issues.filter((issue) => issue.severity === 'info').length;

  // Calculate score
  // Each error reduces score by 10 points
  // Each warning reduces score by 3 points
  // Each info reduces score by 1 point
  const deduction = errorCount * 10 + warningCount * 3 + infoCount * 1;

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, 100 - deduction));
}

/**
 * Check quality of a translated file
 */
export async function checkFileQuality(
  filePath: string,
  language: LanguageCode,
  minScore: number = 70
): Promise<QualityCheckResult> {
  try {
    if (!isLanguageSupported(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // Read the file
    const content = await readFile(filePath, 'utf-8');

    // Perform quality checks
    const missingTranslations = checkMissingTranslations(content);
    const inconsistentTerminology = checkInconsistentTerminology(content, language);
    const formattingErrors = checkFormattingErrors(content);
    const incompleteSentences = checkIncompleteSentences(content, language);

    // Combine all issues
    const issues = [
      ...missingTranslations,
      ...inconsistentTerminology,
      ...formattingErrors,
      ...incompleteSentences
    ];

    // Calculate quality score
    const score = calculateQualityScore(issues);

    // Determine if the file passes quality checks
    const passed = score >= minScore;

    return {
      file: filePath,
      language,
      issues,
      score,
      passed
    };
  } catch (error) {
    console.error('Error checking file quality:', error);

    return {
      file: filePath,
      language,
      issues: [
        {
          type: 'other',
          severity: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      ],
      score: 0,
      passed: false
    };
  }
}

/**
 * Check quality of multiple files
 */
export async function checkDirectoryQuality(
  directory: string,
  language: LanguageCode,
  filePattern: string = '**/*.md',
  minScore: number = 70
): Promise<QualityCheckResult[]> {
  try {
    if (!isLanguageSupported(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // Find all files matching the pattern
    const files = await glob(path.join(directory, filePattern));

    if (files.length === 0) {
      console.warn(`No files found matching pattern: ${filePattern} in directory: ${directory}`);
      return [];
    }

    // Check each file
    const results: QualityCheckResult[] = [];

    for (const file of files) {
      const result = await checkFileQuality(file, language, minScore);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error('Error checking directory quality:', error);

    return [
      {
        file: directory,
        language,
        issues: [
          {
            type: 'other',
            severity: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
          }
        ],
        score: 0,
        passed: false
      }
    ];
  }
}

/**
 * Generate a quality report for a directory
 */
export async function generateQualityReport(
  directory: string,
  language: LanguageCode,
  filePattern: string = '**/*.md',
  minScore: number = 70
): Promise<string> {
  try {
    const results = await checkDirectoryQuality(directory, language, filePattern, minScore);

    if (results.length === 0) {
      return `No files found for quality check in ${directory}`;
    }

    // Calculate overall statistics
    const totalFiles = results.length;
    const passedFiles = results.filter((result) => result.passed).length;
    const failedFiles = totalFiles - passedFiles;
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalFiles;

    // Generate report
    let report = `# Quality Report for ${language}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Directory:** ${directory}\n`;
    report += `- **Language:** ${language} (${getLanguageInfo(language)?.name || 'Unknown'})\n`;
    report += `- **Files Checked:** ${totalFiles}\n`;
    report += `- **Files Passed:** ${passedFiles} (${Math.round((passedFiles / totalFiles) * 100)}%)\n`;
    report += `- **Files Failed:** ${failedFiles} (${Math.round((failedFiles / totalFiles) * 100)}%)\n`;
    report += `- **Average Score:** ${averageScore.toFixed(2)}/100\n\n`;

    report += `## File Details\n\n`;

    // Sort results by score (ascending)
    const sortedResults = [...results].sort((a, b) => a.score - b.score);

    for (const result of sortedResults) {
      const relativePath = path.relative(directory, result.file);

      report += `### ${relativePath}\n\n`;
      report += `- **Score:** ${result.score}/100 (${result.passed ? 'PASSED' : 'FAILED'})\n`;
      report += `- **Issues:** ${result.issues.length}\n\n`;

      if (result.issues.length > 0) {
        report += `| Type | Severity | Message | Line | Suggestion |\n`;
        report += `| ---- | -------- | ------- | ---- | ---------- |\n`;

        for (const issue of result.issues) {
          report += `| ${issue.type} | ${issue.severity} | ${issue.message} | ${issue.line || '-'} | ${issue.suggestion || '-'} |\n`;
        }

        report += `\n`;
      }
    }

    return report;
  } catch (error) {
    console.error('Error generating quality report:', error);
    return `Error generating quality report: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
