/**
 * Translation service for the localization module
 */

import axios from 'axios';
import { LanguageCode, TranslationOptions, TranslationResult } from './types';
import { isLanguageSupported, getDefaultSourceLanguage } from './language-utils';

/**
 * Abstract base class for translation services
 */
abstract class TranslationService {
  /**
   * Translate text from one language to another
   */
  abstract translate(text: string, options: TranslationOptions): Promise<TranslationResult>;

  /**
   * Map language code to service-specific language code
   */
  protected mapLanguageCode(code: LanguageCode): string {
    // Default implementation returns the code as is
    return code;
  }
}

/**
 * Azure Translator API service
 */
class AzureTranslationService extends TranslationService {
  private apiKey: string;
  private endpoint = 'https://api.cognitive.microsofttranslator.com/translate';
  private apiVersion = '3.0';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  /**
   * Translate text using Azure Translator API
   */
  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    try {
      const sourceLanguage = options.sourceLanguage || getDefaultSourceLanguage();
      const targetLanguage = options.targetLanguage;

      if (!isLanguageSupported(targetLanguage)) {
        throw new Error(`Unsupported target language: ${targetLanguage}`);
      }

      const response = await axios({
        baseURL: this.endpoint,
        url: '',
        method: 'post',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Ocp-Apim-Subscription-Region': 'global',
          'Content-type': 'application/json'
        },
        params: {
          'api-version': this.apiVersion,
          from: this.mapLanguageCode(sourceLanguage),
          to: this.mapLanguageCode(targetLanguage)
        },
        data: [
          {
            text
          }
        ],
        responseType: 'json'
      });

      const translatedText = response.data[0]?.translations[0]?.text;

      if (!translatedText) {
        throw new Error('No translation returned from Azure');
      }

      return {
        original: text,
        translated: translatedText,
        language: targetLanguage,
        success: true
      };
    } catch (error) {
      console.error('Azure translation error:', error);

      return {
        original: text,
        translated: text,
        language: options.targetLanguage,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Map language code to Azure-specific language code
   */
  protected mapLanguageCode(code: LanguageCode): string {
    // Azure uses different codes for some languages
    const mapping: Partial<Record<LanguageCode, string>> = {
      'zh-cn': 'zh-Hans',
      'pt-br': 'pt'
    };

    return mapping[code] || code;
  }
}

/**
 * Create a translation service based on the specified service type
 */
export function createTranslationService(
  service: 'azure' | 'deepl' | 'openai',
  apiKey?: string
): TranslationService {
  // Use environment variables if API key is not provided
  const getApiKey = (envVar: string): string => {
    const key = apiKey || process.env[envVar];
    if (!key) {
      throw new Error(
        `API key not provided for ${service} and ${envVar} environment variable not set`
      );
    }
    return key;
  };

  switch (service) {
    case 'azure':
      return new AzureTranslationService(getApiKey('AZURE_TRANSLATOR_KEY'));
    case 'deepl':
    case 'openai':
      throw new Error(`${service} translation service not implemented yet`);
    default:
      throw new Error(`Unsupported translation service: ${service}`);
  }
}

/**
 * Translate text from one language to another
 */
export async function translateText(
  text: string,
  options: TranslationOptions
): Promise<TranslationResult> {
  try {
    const service = options.service || 'azure';
    const translationService = createTranslationService(service, options.apiKey);

    return await translationService.translate(text, options);
  } catch (error) {
    console.error('Translation error:', error);

    return {
      original: text,
      translated: text,
      language: options.targetLanguage,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
