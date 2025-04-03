import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

interface LibreTranslateResponse {
  translatedText: string;
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
}

/**
 * Translate text to multiple languages using LibreTranslate (free & open-source)
 * 
 * @param text Text to translate
 * @param sourceLanguage Source language code (default: 'en')
 * @param targetLanguages List of language codes to translate to (defaults to all supported languages except source)
 * @returns Object with translations keyed by language code
 */
export async function translateToMultipleLanguages(
  text: string, 
  sourceLanguage = 'en',
  targetLanguages = SUPPORTED_LANGUAGES.map(l => l.code).filter(l => l !== sourceLanguage)
): Promise<Record<string, string>> {
  // Return early if text is empty
  if (!text.trim()) {
    return { [sourceLanguage]: text };
  }

  // LibreTranslate endpoint - change this to your self-hosted instance
  // For testing, you can use a public instance like 'https://libretranslate.com/translate'
  // For production, self-host LibreTranslate on your own server
  const LIBRETRANSLATE_ENDPOINT = process.env.LIBRETRANSLATE_ENDPOINT || 'https://libretranslate.com/translate';
  
  // API key is optional for self-hosted instances
  const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

  try {
    const results: Record<string, string> = { [sourceLanguage]: text };

    // Process languages in batches to avoid API limits
    for (const targetLang of targetLanguages) {
      // Skip unsupported language pairs
      if (!isLanguagePairSupported(sourceLanguage, targetLang)) {
        console.warn(`Translation from ${sourceLanguage} to ${targetLang} is not supported by LibreTranslate`);
        continue;
      }

      try {
        const response = await fetch(LIBRETRANSLATE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: sourceLanguage,
            target: targetLang,
            format: 'html', // Try to preserve HTML
            api_key: LIBRETRANSLATE_API_KEY
          }),
        });

        if (!response.ok) {
          throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as LibreTranslateResponse;
        results[targetLang] = data.translatedText;
      } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        // Fall back to mock translation for this language
        results[targetLang] = getMockTranslation(text, targetLang);
      }
    }

    return results;
  } catch (error) {
    console.error('Translation error:', error);
    // Fall back to mock translations if API fails
    return mockTranslate(text, sourceLanguage, targetLanguages);
  }
}

/**
 * Check if a language pair is supported by LibreTranslate
 * This is a simplified version - actual supported pairs depend on your LibreTranslate installation
 */
function isLanguagePairSupported(source: string, target: string): boolean {
  // LibreTranslate commonly supports these languages
  const commonlySupported = ['en', 'es', 'fr', 'de', 'zh', 'ru', 'pt', 'it', 'ja', 'ar'];
  
  // Most installations support translation between common languages
  return commonlySupported.includes(source) && commonlySupported.includes(target);
}

/**
 * Get a mock translation for a specific language
 */
function getMockTranslation(text: string, lang: string): string {
  const maxPreviewLength = 50;
  const textPreview = text.length > maxPreviewLength 
    ? text.substring(0, maxPreviewLength) + '...' 
    : text;
  
  // Return language-specific mock translations
  switch (lang) {
    case 'zh':
      return `[${lang}] 模拟翻译: ${textPreview}`;
    case 'ja':
      return `[${lang}] 翻訳テスト: ${textPreview}`;
    case 'ko':
      return `[${lang}] 번역 테스트: ${textPreview}`;
    case 'ru':
      return `[${lang}] тестовый перевод: ${textPreview}`;
    case 'es':
      return `[${lang}] traducción de prueba: ${textPreview}`;
    case 'fr':
      return `[${lang}] traduction de test: ${textPreview}`;
    case 'de':
      return `[${lang}] Testübersetzung: ${textPreview}`;
    default:
      return `[${lang}] TEST TRANSLATION: ${textPreview}`;
  }
}

/**
 * Mock translation function for testing
 * Simply adds language code indicators to the text
 */
function mockTranslate(
  text: string,
  sourceLanguage: string,
  targetLanguages: string[]
): Record<string, string> {
  const results: Record<string, string> = { 
    [sourceLanguage]: text 
  };
  
  for (const lang of targetLanguages) {
    results[lang] = getMockTranslation(text, lang);
  }
  
  return results;
} 