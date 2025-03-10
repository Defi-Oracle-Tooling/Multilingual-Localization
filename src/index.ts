/**
 * Multilingual Localization Module
 *
 * A comprehensive multilingual support system for Markdown documentation,
 * designed to be used as a submodule for SolaceNet projects.
 */

// Export types
export * from './localization/types';

// Export language utilities
export {
  isLanguageSupported,
  getLanguageInfo,
  getLanguagesByRegion,
  getDefaultSourceLanguage,
  isRightToLeftLanguage,
  Region
} from './localization/language-utils';

// Export translation services
export { createTranslationService, translateText } from './localization/translation-service';

// Export markdown processor
export { translateMarkdownContent, translateMarkdownFile } from './localization/markdown-processor';

// Export quality checker
export {
  checkFileQuality,
  checkDirectoryQuality,
  generateQualityReport
} from './localization/quality-checker';
