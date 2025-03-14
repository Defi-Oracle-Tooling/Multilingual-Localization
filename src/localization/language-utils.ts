/**
 * Language utilities for the localization module
 */

import { LanguageCode, LanguageInfo, Region } from './types';

/**
 * Language metadata
 */
const LANGUAGE_METADATA: Record<LanguageCode, LanguageInfo> = {
  // Americas
  en: { code: 'en', name: 'English', region: Region.AMERICAS, rtl: false },
  es: { code: 'es', name: 'Spanish', region: Region.AMERICAS, rtl: false },
  'pt-br': { code: 'pt-br', name: 'Portuguese (Brazil)', region: Region.AMERICAS, rtl: false },
  'fr-ca': { code: 'fr-ca', name: 'French Canadian', region: Region.AMERICAS, rtl: false },

  // Asia
  th: { code: 'th', name: 'Thai', region: Region.ASIA, rtl: false },
  ko: { code: 'ko', name: 'Korean', region: Region.ASIA, rtl: false },
  ja: { code: 'ja', name: 'Japanese', region: Region.ASIA, rtl: false },
  tl: { code: 'tl', name: 'Filipino/Tagalog', region: Region.ASIA, rtl: false },
  'zh-cn': { code: 'zh-cn', name: 'Mandarin Chinese', region: Region.ASIA, rtl: false },
  hi: { code: 'hi', name: 'Hindi', region: Region.ASIA, rtl: false },
  vi: { code: 'vi', name: 'Vietnamese', region: Region.ASIA, rtl: false },
  id: { code: 'id', name: 'Indonesian', region: Region.ASIA, rtl: false },

  // European Union
  fr: { code: 'fr', name: 'French', region: Region.EUROPEAN_UNION, rtl: false },
  de: { code: 'de', name: 'German', region: Region.EUROPEAN_UNION, rtl: false },
  it: { code: 'it', name: 'Italian', region: Region.EUROPEAN_UNION, rtl: false },
  nl: { code: 'nl', name: 'Dutch', region: Region.EUROPEAN_UNION, rtl: false },
  pl: { code: 'pl', name: 'Polish', region: Region.EUROPEAN_UNION, rtl: false },
  pt: { code: 'pt', name: 'Portuguese', region: Region.EUROPEAN_UNION, rtl: false },

  // Middle East & North Africa
  ar: { code: 'ar', name: 'Arabic', region: Region.MIDDLE_EAST_NORTH_AFRICA, rtl: true },
  he: { code: 'he', name: 'Hebrew', region: Region.MIDDLE_EAST_NORTH_AFRICA, rtl: true },
  tr: { code: 'tr', name: 'Turkish', region: Region.MIDDLE_EAST_NORTH_AFRICA, rtl: false },
  fa: { code: 'fa', name: 'Persian/Farsi', region: Region.MIDDLE_EAST_NORTH_AFRICA, rtl: true },
  ku: { code: 'ku', name: 'Kurdish', region: Region.MIDDLE_EAST_NORTH_AFRICA, rtl: true },

  // Southern Africa (SADC)
  sw: { code: 'sw', name: 'Swahili', region: Region.SOUTHERN_AFRICA, rtl: false },
  zu: { code: 'zu', name: 'Zulu', region: Region.SOUTHERN_AFRICA, rtl: false }
};

/**
 * Check if a language code is supported
 */
export function isLanguageSupported(code: LanguageCode): boolean {
  return code in LANGUAGE_METADATA;
}

/**
 * Get information about a language
 */
export function getLanguageInfo(code: LanguageCode): LanguageInfo | undefined {
  return LANGUAGE_METADATA[code];
}

/**
 * Get all languages in a region
 */
export function getLanguagesByRegion(region: Region): LanguageCode[] {
  return Object.values(LANGUAGE_METADATA)
    .filter((info) => info.region === region)
    .map((info) => info.code);
}

/**
 * Get the default source language
 */
export function getDefaultSourceLanguage(): LanguageCode {
  return 'en';
}

/**
 * Check if a language is right-to-left
 */
export function isRightToLeftLanguage(code: LanguageCode): boolean {
  const info = getLanguageInfo(code);
  return info ? info.rtl : false;
}

// Re-export Region enum for use in other modules
export { Region };
