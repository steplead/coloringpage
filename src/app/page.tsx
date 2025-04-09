import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

export default function RootPage() {
  // Get the preferred language from headers
  const headersList = headers();
  const headerLang = headersList.get('x-locale') || 'en';
  
  // Get the accept-language header
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Try to match the browser's preferred language
  let detectedLang = 'en';
  try {
    const browserLangs = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
    const matchedLang = SUPPORTED_LANGUAGES.find(lang => 
      browserLangs.some(browserLang => browserLang.startsWith(lang.code))
    );
    if (matchedLang) {
      detectedLang = matchedLang.code;
    }
  } catch (e) {
    console.error('Error parsing accept-language:', e);
  }
  
  // Use header lang if available, otherwise use detected lang
  const finalLang = headerLang || detectedLang;
  
  // Redirect to the appropriate language version
  redirect(`/${finalLang}`);
} 