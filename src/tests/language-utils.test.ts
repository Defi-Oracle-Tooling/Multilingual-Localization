import { 
  isLanguageSupported, 
  getLanguageInfo, 
  getLanguagesByRegion, 
  isRightToLeftLanguage,
  Region
} from '../localization/language-utils';

describe('Language Utilities', () => {
  describe('isLanguageSupported', () => {
    it('should return true for supported languages', () => {
      expect(isLanguageSupported('en')).toBe(true);
      expect(isLanguageSupported('es')).toBe(true);
      expect(isLanguageSupported('ja')).toBe(true);
    });
    
    it('should return false for unsupported languages', () => {
      // @ts-expect-error - Testing with invalid language code
      expect(isLanguageSupported('xx')).toBe(false);
    });
  });
  
  describe('getLanguageInfo', () => {
    it('should return correct information for English', () => {
      const info = getLanguageInfo('en');
      expect(info).toBeDefined();
      expect(info?.name).toBe('English');
      expect(info?.region).toBe(Region.AMERICAS);
      expect(info?.rtl).toBe(false);
    });
    
    it('should return correct information for Arabic', () => {
      const info = getLanguageInfo('ar');
      expect(info).toBeDefined();
      expect(info?.name).toBe('Arabic');
      expect(info?.region).toBe(Region.MIDDLE_EAST_NORTH_AFRICA);
      expect(info?.rtl).toBe(true);
    });
    
    it('should return undefined for unsupported languages', () => {
      // @ts-expect-error - Testing with invalid language code
      expect(getLanguageInfo('xx')).toBeUndefined();
    });
  });
  
  describe('getLanguagesByRegion', () => {
    it('should return all languages in the Americas region', () => {
      const languages = getLanguagesByRegion(Region.AMERICAS);
      expect(languages).toContain('en');
      expect(languages).toContain('es');
      expect(languages).toContain('pt-br');
      expect(languages).toContain('fr-ca');
    });
    
    it('should return all languages in the Middle East & North Africa region', () => {
      const languages = getLanguagesByRegion(Region.MIDDLE_EAST_NORTH_AFRICA);
      expect(languages).toContain('ar');
      expect(languages).toContain('he');
      expect(languages).toContain('tr');
      expect(languages).toContain('fa');
      expect(languages).toContain('ku');
    });
  });
  
  describe('isRightToLeftLanguage', () => {
    it('should return true for RTL languages', () => {
      expect(isRightToLeftLanguage('ar')).toBe(true);
      expect(isRightToLeftLanguage('he')).toBe(true);
      expect(isRightToLeftLanguage('fa')).toBe(true);
    });
    
    it('should return false for LTR languages', () => {
      expect(isRightToLeftLanguage('en')).toBe(false);
      expect(isRightToLeftLanguage('es')).toBe(false);
      expect(isRightToLeftLanguage('ja')).toBe(false);
    });
    
    it('should return false for unsupported languages', () => {
      // @ts-expect-error - Testing with invalid language code
      expect(isRightToLeftLanguage('xx')).toBe(false);
    });
  });
});
