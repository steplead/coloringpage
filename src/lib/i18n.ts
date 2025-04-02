/**
 * Internationalization (i18n) utilities for AI Coloring Page Generator
 * Provides language detection and translation functionality
 */

// Supported languages with their native names
export const supportedLanguages = {
  en: { name: 'English', nativeName: 'English' },
  zh: { name: 'Chinese', nativeName: '中文' },
  es: { name: 'Spanish', nativeName: 'Español' },
  fr: { name: 'French', nativeName: 'Français' },
  de: { name: 'German', nativeName: 'Deutsch' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  ko: { name: 'Korean', nativeName: '한국어' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  ar: { name: 'Arabic', nativeName: 'العربية' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  it: { name: 'Italian', nativeName: 'Italiano' },
};

export type LanguageCode = keyof typeof supportedLanguages;

/**
 * Detects the user's preferred language from browser settings
 * Falls back to 'en' (English) if no match is found
 */
export function detectUserLanguage(): LanguageCode {
  if (typeof window === 'undefined') {
    // Default to English for server-side rendering
    return 'en';
  }

  // Get browser language preferences
  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  
  // Extract the language code (ignore region)
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Check if it's in our supported languages
  if (langCode in supportedLanguages) {
    return langCode as LanguageCode;
  }
  
  // Fall back to English
  return 'en';
}

/**
 * Retrieves the saved language preference from localStorage if available
 * Otherwise detects the user's language and saves it
 */
export function getUserLanguagePreference(): LanguageCode {
  if (typeof window === 'undefined') {
    // Default to English for server-side rendering
    return 'en';
  }
  
  try {
    // Try to get saved preference
    const savedLang = localStorage.getItem('userLanguage') as LanguageCode;
    
    if (savedLang && savedLang in supportedLanguages) {
      return savedLang;
    }
    
    // No valid saved preference, detect and save
    const detectedLang = detectUserLanguage();
    localStorage.setItem('userLanguage', detectedLang);
    return detectedLang;
  } catch (error) {
    // In case of localStorage errors
    console.error('Error accessing localStorage for language preference:', error);
    return detectUserLanguage();
  }
}

/**
 * Sets the user's language preference
 */
export function setUserLanguagePreference(langCode: LanguageCode): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('userLanguage', langCode);
    // Optional: reload the page or update the UI after language change
    // window.location.reload();
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
}

/**
 * Base translations object type
 */
export interface Translations {
  [key: string]: string | Translations;
}

/**
 * Translation maps for each language
 * Organized by language code
 */
export const translations: Record<LanguageCode, Translations> = {
  en: {
    common: {
      create: 'Create',
      gallery: 'Gallery',
      blog: 'Blog',
      about: 'About',
      home: 'Home',
      createNow: 'Create Now',
      learnMore: 'Learn More',
    },
    home: {
      title: 'Create Beautiful Coloring Pages with AI',
      subtitle: 'Turn your ideas into stunning coloring pages in seconds. Perfect for kids, teachers, and coloring enthusiasts.',
      cta: 'Create Now',
      pageCount: 'Over 5,000 coloring pages created',
    },
    create: {
      title: 'Create Your Coloring Page',
      promptLabel: 'Describe what you want to create',
      promptPlaceholder: 'E.g. A friendly dragon, space rocket, underwater scene...',
      styleLabel: 'Choose a style',
      generateButton: 'Generate Coloring Page',
      saving: 'Saving to gallery...',
      tryAgain: 'Try a different description',
      saveToGallery: 'Save to Gallery',
    },
    gallery: {
      title: 'Coloring Page Gallery',
      description: 'Browse through our collection of AI-generated coloring pages created by our community.',
      recentCreations: 'Recent Creations',
      createYourOwn: 'Create Your Own',
      printThisPage: 'Print This Page',
      noImages: 'No images yet',
      beFirst: 'Be the first to add a coloring page to our gallery!',
    },
  },
  zh: {
    common: {
      create: '创建',
      gallery: '画廊',
      blog: '博客',
      about: '关于',
      home: '首页',
      createNow: '立即创建',
      learnMore: '了解更多',
    },
    home: {
      title: '使用AI创建精美的涂色页',
      subtitle: '瞬间将您的创意转化为精美的涂色页。适合儿童、教师和涂色爱好者。',
      cta: '立即创建',
      pageCount: '已创建超过5,000张涂色页',
    },
    create: {
      title: '创建您的涂色页',
      promptLabel: '描述您想要创建的内容',
      promptPlaceholder: '例如：友好的龙、太空火箭、海底场景...',
      styleLabel: '选择风格',
      generateButton: '生成涂色页',
      saving: '正在保存到画廊...',
      tryAgain: '尝试不同的描述',
      saveToGallery: '保存到画廊',
    },
    gallery: {
      title: '涂色页画廊',
      description: '浏览由我们社区创建的AI生成涂色页集合。',
      recentCreations: '最新创作',
      createYourOwn: '创建您自己的',
      printThisPage: '打印此页',
      noImages: '还没有图片',
      beFirst: '成为第一个添加涂色页到我们画廊的人！',
    },
  },
  es: {
    common: {
      create: 'Crear',
      gallery: 'Galería',
      blog: 'Blog',
      about: 'Acerca de',
      home: 'Inicio',
      createNow: 'Crear ahora',
      learnMore: 'Más información',
    },
    home: {
      title: 'Crea hermosas páginas para colorear con IA',
      subtitle: 'Convierte tus ideas en impresionantes páginas para colorear en segundos. Perfecto para niños, maestros y entusiastas del coloreado.',
      cta: 'Crear ahora',
      pageCount: 'Más de 5,000 páginas para colorear creadas',
    },
    create: {
      title: 'Crea tu página para colorear',
      promptLabel: 'Describe lo que quieres crear',
      promptPlaceholder: 'Ej. Un dragón amigable, cohete espacial, escena submarina...',
      styleLabel: 'Elige un estilo',
      generateButton: 'Generar página para colorear',
      saving: 'Guardando en la galería...',
      tryAgain: 'Probar una descripción diferente',
      saveToGallery: 'Guardar en la galería',
    },
    gallery: {
      title: 'Galería de páginas para colorear',
      description: 'Explora nuestra colección de páginas para colorear generadas por IA creadas por nuestra comunidad.',
      recentCreations: 'Creaciones recientes',
      createYourOwn: 'Crea la tuya propia',
      printThisPage: 'Imprimir esta página',
      noImages: 'Aún no hay imágenes',
      beFirst: '¡Sé el primero en añadir una página para colorear a nuestra galería!',
    },
  },
  fr: {
    common: {
      create: 'Créer',
      gallery: 'Galerie',
      blog: 'Blog',
      about: 'À propos',
      home: 'Accueil',
      createNow: 'Créer maintenant',
      learnMore: 'En savoir plus',
    },
    home: {
      title: 'Créez de belles pages à colorier avec l\'IA',
      subtitle: 'Transformez vos idées en superbes pages à colorier en quelques secondes. Parfait pour les enfants, les enseignants et les amateurs de coloriage.',
      cta: 'Créer maintenant',
      pageCount: 'Plus de 5 000 pages à colorier créées',
    },
    create: {
      title: 'Créez votre page à colorier',
      promptLabel: 'Décrivez ce que vous voulez créer',
      promptPlaceholder: 'Ex. Un dragon amical, une fusée spatiale, une scène sous-marine...',
      styleLabel: 'Choisissez un style',
      generateButton: 'Générer une page à colorier',
      saving: 'Enregistrement dans la galerie...',
      tryAgain: 'Essayer une description différente',
      saveToGallery: 'Enregistrer dans la galerie',
    },
    gallery: {
      title: 'Galerie de pages à colorier',
      description: 'Parcourez notre collection de pages à colorier générées par IA créées par notre communauté.',
      recentCreations: 'Créations récentes',
      createYourOwn: 'Créez la vôtre',
      printThisPage: 'Imprimer cette page',
      noImages: 'Pas encore d\'images',
      beFirst: 'Soyez le premier à ajouter une page à colorier à notre galerie !',
    },
  },
  // Minimal translations for other languages - extend as needed
  de: {
    common: {
      create: 'Erstellen',
      gallery: 'Galerie',
      blog: 'Blog',
      about: 'Über uns',
      home: 'Startseite',
      createNow: 'Jetzt erstellen',
      learnMore: 'Mehr erfahren',
    },
    home: {
      title: 'Erstelle schöne Malvorlagen mit KI',
      subtitle: 'Verwandle deine Ideen in Sekundenschnelle in beeindruckende Malvorlagen.',
      cta: 'Jetzt erstellen',
      pageCount: 'Über 5.000 Malvorlagen erstellt',
    },
  },
  ja: {
    common: {
      create: '作成',
      gallery: 'ギャラリー',
      blog: 'ブログ',
      about: '私たちについて',
      home: 'ホーム',
      createNow: '今すぐ作成',
      learnMore: '詳細を見る',
    },
    home: {
      title: 'AIで美しい塗り絵を作成',
      subtitle: 'アイデアを数秒で素晴らしい塗り絵に変換します。',
      cta: '今すぐ作成',
      pageCount: '5,000枚以上の塗り絵が作成されました',
    },
  },
  ko: { common: { create: '만들기', gallery: '갤러리' } },
  ru: { common: { create: 'Создать', gallery: 'Галерея' } },
  pt: { common: { create: 'Criar', gallery: 'Galeria' } },
  ar: { common: { create: 'إنشاء', gallery: 'معرض' } },
  hi: { common: { create: 'बनाएं', gallery: 'गैलरी' } },
  it: { common: { create: 'Creare', gallery: 'Galleria' } },
};

/**
 * Gets a translation for a specific key in the current language
 * @param key Dot notation key path (e.g. 'common.create')
 * @param lang Language code
 * @param fallback Fallback text if translation is missing
 */
export function t(key: string, lang: LanguageCode = 'en', fallback?: string): string {
  const keys = key.split('.');
  let result: any = translations[lang];
  
  // Navigate through the nested keys
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // Key not found in the current language
      if (lang !== 'en') {
        // Try English as fallback
        return t(key, 'en', fallback);
      }
      // If we're already in English or fallback is specified, return the fallback
      return fallback || key;
    }
  }
  
  return typeof result === 'string' ? result : fallback || key;
}

/**
 * React hook for using translations (to be used with React components)
 * @param initialLang Initial language code to use
 */
export function useTranslation(initialLang?: LanguageCode) {
  if (typeof window === 'undefined') {
    // For server-side rendering
    return {
      lang: initialLang || 'en' as LanguageCode,
      t: (key: string, fallback?: string) => t(key, initialLang || 'en', fallback),
      setLang: () => {}, // No-op for SSR
      getSupportedLanguages: () => supportedLanguages,
    };
  }

  // Client-side code
  const [lang, setLang] = React.useState<LanguageCode>(
    initialLang || getUserLanguagePreference()
  );
  
  // Function to change the language
  const changeLang = React.useCallback((newLang: LanguageCode) => {
    setLang(newLang);
    setUserLanguagePreference(newLang);
    // Update the HTML lang attribute
    document.documentElement.lang = newLang;
  }, []);
  
  // Translation function
  const translate = React.useCallback(
    (key: string, fallback?: string) => t(key, lang, fallback),
    [lang]
  );
  
  return {
    lang,
    t: translate,
    setLang: changeLang,
    getSupportedLanguages: () => supportedLanguages,
  };
}

// Add React import
import React from 'react'; 