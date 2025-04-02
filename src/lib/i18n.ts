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
    footer: {
      description: 'Create beautiful black outline coloring pages using AI. Perfect for kids, art therapy, and creative activities.',
      resources: 'Resources',
      support: 'Support',
      legal: 'Legal',
      faq: 'FAQ',
      contact: 'Contact Us',
      help: 'Help Center',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      rights: 'All Rights Reserved.',
      tagline: 'Designed with ♥ for creative minds',
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
    footer: {
      description: '使用AI创建精美的黑色轮廓涂色页。适合儿童、艺术治疗和创意活动。',
      resources: '资源',
      support: '支持',
      legal: '法律',
      faq: '常见问题',
      contact: '联系我们',
      help: '帮助中心',
      privacy: '隐私政策',
      terms: '服务条款',
      cookies: 'Cookie政策',
      rights: '版权所有。',
      tagline: '为创意人士精心设计 ♥',
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
    footer: {
      description: 'Crea hermosas páginas para colorear con contornos negros usando IA. Perfecto para niños, terapia de arte y actividades creativas.',
      resources: 'Recursos',
      support: 'Soporte',
      legal: 'Legal',
      faq: 'Preguntas frecuentes',
      contact: 'Contáctanos',
      help: 'Centro de ayuda',
      privacy: 'Política de privacidad',
      terms: 'Términos de servicio',
      cookies: 'Política de cookies',
      rights: 'Todos los derechos reservados.',
      tagline: 'Diseñado con ♥ para mentes creativas',
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
    footer: {
      description: 'Créez de belles pages à colorier avec contours noirs grâce à l\'IA. Parfait pour les enfants, l\'art-thérapie et les activités créatives.',
      resources: 'Ressources',
      support: 'Support',
      legal: 'Mentions légales',
      faq: 'FAQ',
      contact: 'Nous contacter',
      help: 'Centre d\'aide',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      cookies: 'Politique des cookies',
      rights: 'Tous droits réservés.',
      tagline: 'Conçu avec ♥ pour les esprits créatifs',
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
    footer: {
      description: 'Erstelle schöne Malvorlagen mit schwarzen Umrissen mithilfe von KI. Perfekt für Kinder, Kunsttherapie und kreative Aktivitäten.',
      resources: 'Ressourcen',
      support: 'Support',
      legal: 'Rechtliches',
      faq: 'FAQ',
      contact: 'Kontakt',
      help: 'Hilfe-Center',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      cookies: 'Cookie-Richtlinie',
      rights: 'Alle Rechte vorbehalten.',
      tagline: 'Mit ♥ gestaltet für kreative Köpfe',
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
      title: 'AIで美しい塗り絵ページを作成',
      subtitle: 'あなたのアイデアを数秒で素晴らしい塗り絵に変換。子供、教師、塗り絵愛好家に最適。',
      cta: '今すぐ作成',
      pageCount: '5,000以上の塗り絵ページが作成されています',
    },
    footer: {
      description: 'AIを使用して美しい黒い輪郭の塗り絵ページを作成。子供、アートセラピー、創造的な活動に最適。',
      resources: 'リソース',
      support: 'サポート',
      legal: '法的情報',
      faq: 'よくある質問',
      contact: 'お問い合わせ',
      help: 'ヘルプセンター',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      cookies: 'Cookieポリシー',
      rights: '無断複写・転載を禁じます。',
      tagline: 'クリエイティブな心のために♥でデザイン',
    },
  },
  ko: {
    common: {
      create: '만들기',
      gallery: '갤러리',
      blog: '블로그',
      about: '소개',
      home: '홈',
      createNow: '지금 만들기',
      learnMore: '더 알아보기',
    },
    home: {
      title: 'AI로 아름다운 색칠 페이지 만들기',
      subtitle: '몇 초 만에 아이디어를 멋진 색칠 페이지로 바꿔보세요. 어린이, 교사 및 색칠 애호가에게 완벽합니다.',
      cta: '지금 만들기',
      pageCount: '5,000개 이상의 색칠 페이지 생성됨',
    },
    footer: {
      description: 'AI를 사용하여 아름다운 검은색 윤곽선 색칠 페이지를 만드세요. 어린이, 아트 테라피 및 창의적인 활동에 적합합니다.',
      resources: '리소스',
      support: '지원',
      legal: '법적 고지',
      faq: '자주 묻는 질문',
      contact: '문의하기',
      help: '도움말 센터',
      privacy: '개인정보 보호정책',
      terms: '서비스 약관',
      cookies: '쿠키 정책',
      rights: '모든 권리 보유.',
      tagline: '창의적인 마음을 위해 ♥으로 디자인',
    },
  },
  ru: {
    common: {
      create: 'Создать',
      gallery: 'Галерея',
      blog: 'Блог',
      about: 'О нас',
      home: 'Главная',
      createNow: 'Создать сейчас',
      learnMore: 'Узнать больше',
    },
    home: {
      title: 'Создавайте красивые раскраски с помощью ИИ',
      subtitle: 'Превратите свои идеи в потрясающие раскраски за считанные секунды. Идеально для детей, учителей и любителей раскрасок.',
      cta: 'Создать сейчас',
      pageCount: 'Создано более 5 000 раскрасок',
    },
    footer: {
      description: 'Создавайте красивые раскраски с черными контурами с помощью ИИ. Идеально подходит для детей, арт-терапии и творческих занятий.',
      resources: 'Ресурсы',
      support: 'Поддержка',
      legal: 'Юридическая информация',
      faq: 'Часто задаваемые вопросы',
      contact: 'Связаться с нами',
      help: 'Центр помощи',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      cookies: 'Политика в отношении файлов cookie',
      rights: 'Все права защищены.',
      tagline: 'Создано с ♥ для творческих умов',
    },
  },
  pt: {
    common: {
      create: 'Criar',
      gallery: 'Galeria',
      blog: 'Blog',
      about: 'Sobre',
      home: 'Início',
      createNow: 'Criar agora',
      learnMore: 'Saiba mais',
    },
    home: {
      title: 'Crie lindas páginas para colorir com IA',
      subtitle: 'Transforme suas ideias em incríveis páginas para colorir em segundos. Perfeito para crianças, professores e entusiastas de colorir.',
      cta: 'Criar agora',
      pageCount: 'Mais de 5.000 páginas para colorir criadas',
    },
    footer: {
      description: 'Crie lindas páginas para colorir com contornos pretos usando IA. Perfeito para crianças, arteterapia e atividades criativas.',
      resources: 'Recursos',
      support: 'Suporte',
      legal: 'Legal',
      faq: 'Perguntas frequentes',
      contact: 'Contate-nos',
      help: 'Central de ajuda',
      privacy: 'Política de privacidade',
      terms: 'Termos de serviço',
      cookies: 'Política de cookies',
      rights: 'Todos os direitos reservados.',
      tagline: 'Projetado com ♥ para mentes criativas',
    },
  },
  ar: {
    common: {
      create: 'إنشاء',
      gallery: 'معرض',
      blog: 'مدونة',
      about: 'حول',
      home: 'الرئيسية',
      createNow: 'إنشاء الآن',
      learnMore: 'معرفة المزيد',
    },
    home: {
      title: 'إنشاء صفحات تلوين جميلة باستخدام الذكاء الاصطناعي',
      subtitle: 'حوّل أفكارك إلى صفحات تلوين رائعة في ثوانٍ. مثالي للأطفال والمعلمين وهواة التلوين.',
      cta: 'إنشاء الآن',
      pageCount: 'تم إنشاء أكثر من 5000 صفحة تلوين',
    },
    footer: {
      description: 'إنشاء صفحات تلوين جميلة بخطوط سوداء باستخدام الذكاء الاصطناعي. مثالي للأطفال والعلاج بالفن والأنشطة الإبداعية.',
      resources: 'الموارد',
      support: 'الدعم',
      legal: 'قانوني',
      faq: 'الأسئلة الشائعة',
      contact: 'اتصل بنا',
      help: 'مركز المساعدة',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      cookies: 'سياسة ملفات تعريف الارتباط',
      rights: 'جميع الحقوق محفوظة.',
      tagline: 'صُمم بـ ♥ للعقول المبدعة',
    },
  },
  hi: {
    common: {
      create: 'बनाएं',
      gallery: 'गैलरी',
      blog: 'ब्लॉग',
      about: 'हमारे बारे में',
      home: 'होम',
      createNow: 'अभी बनाएं',
      learnMore: 'और जानें',
    },
    home: {
      title: 'AI के साथ सुंदर रंग भरने वाले पेज बनाएं',
      subtitle: 'अपने विचारों को सेकंडों में शानदार रंग भरने वाले पेज में बदलें। बच्चों, शिक्षकों और रंग भरने के शौकीनों के लिए एकदम सही।',
      cta: 'अभी बनाएं',
      pageCount: '5,000 से अधिक रंग भरने वाले पेज बनाए गए',
    },
    footer: {
      description: 'AI का उपयोग करके काले आउटलाइन वाले सुंदर रंग भरने वाले पेज बनाएं। बच्चों, कला थेरेपी और रचनात्मक गतिविधियों के लिए एकदम सही।',
      resources: 'संसाधन',
      support: 'सहायता',
      legal: 'कानूनी',
      faq: 'अक्सर पूछे जाने वाले प्रश्न',
      contact: 'संपर्क करें',
      help: 'सहायता केंद्र',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा शर्तें',
      cookies: 'कुकी नीति',
      rights: 'सर्वाधिकार सुरक्षित।',
      tagline: 'रचनात्मक दिमागों के लिए ♥ के साथ डिज़ाइन किया गया',
    },
  },
  it: {
    common: {
      create: 'Crea',
      gallery: 'Galleria',
      blog: 'Blog',
      about: 'Chi siamo',
      home: 'Home',
      createNow: 'Crea ora',
      learnMore: 'Scopri di più',
    },
    home: {
      title: 'Crea splendide pagine da colorare con l\'AI',
      subtitle: 'Trasforma le tue idee in stupende pagine da colorare in pochi secondi. Perfetto per bambini, insegnanti e appassionati di colorazione.',
      cta: 'Crea ora',
      pageCount: 'Oltre 5.000 pagine da colorare create',
    },
    footer: {
      description: 'Crea splendide pagine da colorare con contorni neri utilizzando l\'AI. Perfetto per bambini, arteterapia e attività creative.',
      resources: 'Risorse',
      support: 'Supporto',
      legal: 'Legale',
      faq: 'FAQ',
      contact: 'Contattaci',
      help: 'Centro assistenza',
      privacy: 'Informativa sulla privacy',
      terms: 'Termini di servizio',
      cookies: 'Politica dei cookie',
      rights: 'Tutti i diritti riservati.',
      tagline: 'Progettato con ♥ per menti creative',
    },
  },
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