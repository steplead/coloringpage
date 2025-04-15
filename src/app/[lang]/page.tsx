import Link from 'next/link';
import Image from 'next/image';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default async function LanguageHomePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  
  // Fetch all translations for the current language
  const translations = await getTranslations(lang);

  // Helper to get translation safely
  const t = (key: string, fallback?: string): string => {
    if (!translations) {
      console.warn(`[Homepage] Translations not loaded when trying to access key: ${key}`);
      return fallback || key.split('.').pop() || key;
    }
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  };

  // Helper function to get localized href
  const getLocalizedHref = (path: string): string => {
    return `/${lang}${path}`;
  };

  // Data (keep this separate for clarity)
  const examplePages = [
    { id: 1, titleKey: 'home.examples.elephant.title', altTextKey: 'home.examples.elephant.alt', image: '/examples/elephant.png' },
    { id: 2, titleKey: 'home.examples.rocket.title', altTextKey: 'home.examples.rocket.alt', image: '/examples/rocket.png' },
    { id: 3, titleKey: 'home.examples.dragon.title', altTextKey: 'home.examples.dragon.alt', image: '/examples/dragon.png' },
  ];

  const popularCategories = [
    { id: 'animals', titleKey: 'home.categories.animals.title', altTextKey: 'home.categories.animals.alt', image: '/examples/category-animal.png' }, 
    { id: 'fantasy', titleKey: 'home.categories.fantasy.title', altTextKey: 'home.categories.fantasy.alt', image: '/examples/category-fantasy.png' },
    { id: 'vehicles', titleKey: 'home.categories.vehicles.title', altTextKey: 'home.categories.vehicles.alt', image: '/examples/category-vehicle.png' }, 
  ];

  const creationMethods = [
    { titleKey: 'home.methods.describe.title', descriptionKey: 'home.methods.describe.description', icon: '✏️' },
    { titleKey: 'home.methods.style.title', descriptionKey: 'home.methods.style.description', icon: '🎨' },
    { titleKey: 'home.methods.advanced.title', descriptionKey: 'home.methods.advanced.description', icon: '⚙️' },
  ];

  const testimonials = [
    { textKey: "home.testimonials.1.text", authorKey: "home.testimonials.1.author" },
    { textKey: "home.testimonials.2.text", authorKey: "home.testimonials.2.author" },
    { textKey: "home.testimonials.3.text", authorKey: "home.testimonials.3.author" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">

      {/* --- Hero Section --- */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 px-4 relative overflow-hidden">
        {/* Subtle background shapes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-200 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-200 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold tracking-wide">
              {t('home.hero.badge', 'AI-Powered Creativity')}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t('home.hero.title', "Create Beautiful Coloring Pages with AI")}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              {t('home.hero.subtitle', "Turn your ideas into stunning printable coloring pages in seconds. Perfect for kids, adults, teachers, and all coloring enthusiasts.")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href={getLocalizedHref('/create')} 
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-300/50 transform hover:-translate-y-1"
              >
                {t('home.hero.createButton', "Start Creating Now")}
              </Link>
              <a 
                href="#features" 
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
              >
                {t('home.hero.learnButton', "Learn How It Works")}
              </a>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              {t('home.hero.stats', "Trusted by 10,000+ creators weekly")}
            </div>
          </div>

          {/* Example Images - More prominent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {examplePages.map((example, index) => (
              <div key={example.id} 
                   className={`bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${index === 1 ? 'sm:scale-105 sm:hover:scale-110' : ''}`}>
                <div className="aspect-square relative">
                  <Image
                    src={example.image}
                    alt={t(example.altTextKey)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                    priority={index < 3} // Prioritize loading first few images
                  />
                </div>
                 <div className="p-4 text-center bg-white">
                    <h3 className="font-medium text-sm text-gray-700 truncate">
                      {t(example.titleKey)}
                    </h3>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works / Features Section --- */}
      <section id="features" className="w-full py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('home.howItWorks.titleOptimized', 'Simple Steps to Your Perfect Coloring Page')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle', 'Our intuitive process makes creating unique coloring pages effortless.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {creationMethods.map((method, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-5">{method.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t(method.titleKey)}
                </h3>
                <p className="text-gray-600">
                  {t(method.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href={getLocalizedHref('/create')} 
              className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors text-base"
            >
              {t('common.tryIt', "Try the Generator Now")}
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Popular Categories Section --- */}
      <section id="categories" className="w-full py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-16">
            {t('home.categories.title', 'Explore Popular Categories')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCategories.map((category) => (
              <Link key={category.id} href={getLocalizedHref(`/gallery?category=${category.id}`)} className="block group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={category.image}
                    alt={t(category.altTextKey)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t(category.titleKey)}
                    </h3>
                     <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                       {t('common.viewAll', "View All")}
                     </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="w-full py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            {t('home.testimonials.title', 'Loved by Creatives Everywhere')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <svg className="w-8 h-8 text-blue-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
                <p className="text-gray-700 italic mb-6">
                  {t(testimonial.textKey)}
                </p>
                <p className="font-semibold text-gray-800">
                  - {t(testimonial.authorKey)}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
             <a href="#" className="text-blue-600 hover:underline">
                {t('home.testimonials.cta', 'Read more user stories')}
             </a>
          </div>
        </div>
      </section>

      {/* --- Call to Action Section --- */}
      <section className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('home.cta.title', "Ready to Create Your Masterpiece?")}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t('home.cta.subtitle', "Unleash your creativity today. Generate unique coloring pages in just a few clicks.")}
          </p>
          <Link 
            href={getLocalizedHref('/create')} 
            className="px-10 py-4 bg-white text-blue-700 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {t('home.cta.button', "Start Generating for Free")}
          </Link>
        </div>
      </section>

    </main>
  );
} 