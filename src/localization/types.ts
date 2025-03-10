/**
 * Type definitions for the localization module
 */

/**
 * Language codes supported by the localization module
 */
export type LanguageCode =
  // Americas
  | 'en' // English
  | 'es' // Spanish
  | 'pt-br' // Portuguese (Brazil)
  | 'fr-ca' // French Canadian

  // Asia
  | 'th' // Thai
  | 'ko' // Korean
  | 'ja' // Japanese
  | 'tl' // Filipino/Tagalog
  | 'zh-cn' // Mandarin Chinese
  | 'hi' // Hindi
  | 'vi' // Vietnamese
  | 'id' // Indonesian

  // European Union
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'nl' // Dutch
  | 'pl' // Polish
  | 'pt' // Portuguese

  // Middle East & North Africa
  | 'ar' // Arabic
  | 'he' // Hebrew
  | 'tr' // Turkish
  | 'fa' // Persian/Farsi
  | 'ku' // Kurdish

  // Southern Africa (SADC)
  | 'sw' // Swahili
  | 'zu'; // Zulu

/**
 * Regions supported by the localization module
 */
export enum Region {
  AMERICAS = 'Americas',
  ASIA = 'Asia',
  EUROPEAN_UNION = 'European Union',
  MIDDLE_EAST_NORTH_AFRICA = 'Middle East & North Africa',
  SOUTHERN_AFRICA = 'Southern Africa (SADC)'
}

/**
 * Language information
 */
export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  region: Region;
  rtl: boolean;
}

/**
 * Translation options
 */
export interface TranslationOptions {
  sourceLanguage?: LanguageCode;
  targetLanguage: LanguageCode;
  service?: 'azure' | 'deepl' | 'openai';
  apiKey?: string;
  preserveCodeBlocks?: boolean;
  preserveFrontMatter?: boolean;
}

/**
 * Translation result
 */
export interface TranslationResult {
  original: string;
  translated: string;
  language: LanguageCode;
  success: boolean;
  error?: string;
}

/**
 * Markdown translation options
 */
export interface MarkdownTranslationOptions extends TranslationOptions {
  inputFile: string;
  outputFile: string;
}

/**
 * Batch translation options
 */
export interface BatchTranslationOptions extends TranslationOptions {
  inputDir: string;
  outputDir: string;
  filePattern?: string;
  batchSize?: number;
  concurrency?: number;
}

/**
 * Quality issue severity
 */
export type QualityIssueSeverity = 'error' | 'warning' | 'info';

/**
 * Quality issue type
 */
export type QualityIssueType =
  | 'missing_translation'
  | 'inconsistent_terminology'
  | 'formatting_error'
  | 'incomplete_sentence'
  | 'other';

/**
 * Quality issue
 */
export interface QualityIssue {
  type: QualityIssueType;
  severity: QualityIssueSeverity;
  message: string;
  line?: number;
  suggestion?: string;
}

/**
 * Quality check result
 */
export interface QualityCheckResult {
  file: string;
  language: LanguageCode;
  issues: QualityIssue[];
  score: number;
  passed: boolean;
}
