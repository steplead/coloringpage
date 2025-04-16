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
  
  // Keys needed for this page
  const translationKeys = [
    'home.hero.title', 'home.hero.subtitle', 'home.hero.createButton', 'home.hero.learnButton', 'home.hero.stats',
    'home.examples.elephant.title', 'home.examples.elephant.alt',
    'home.examples.rocket.title', 'home.examples.rocket.alt',
    'home.examples.dragon.title', 'home.examples.dragon.alt',
    'home.howItWorks.titleOptimized', // Use optimized key
    'home.methods.describe.title', 'home.methods.describe.description',
    'home.methods.style.title', 'home.methods.style.description',
    'home.methods.advanced.title', 'home.methods.advanced.description',
    'home.categories.title', // New section title
    'home.categories.animals.title', 'home.categories.animals.alt',
    'home.categories.fantasy.title', 'home.categories.fantasy.alt',
    'home.categories.vehicles.title', 'home.categories.vehicles.alt',
    'home.testimonials.title', 'home.testimonials.1.text', 'home.testimonials.1.author',
    'home.testimonials.2.text', 'home.testimonials.2.author',
    'home.testimonials.3.text', 'home.testimonials.3.author',
    'home.testimonials.cta',
    'home.cta.title', 'home.cta.subtitle', 'home.cta.button',
    'common.tryIt', 'common.viewAll' // Added common keys
  ];

  // --- Fetch all translations for the current language ---
  const translations = await getTranslations(lang);
  // ----------------------------------------------------

  // Example coloring pages data
  const examplePages = [
    { id: 'example-dragon', titleKey: 'home.examples.dragon.title', altTextKey: 'home.examples.dragon.alt', image: '/examples/dragon.png' },
    { id: 'example-cat-books', titleKey: 'home.examples.cat.title', altTextKey: 'home.examples.cat.alt', image: '/examples/cat-simple.png' },
    { id: 'example-mandala', titleKey: 'home.examples.mandala.title', altTextKey: 'home.examples.mandala.alt', image: '/examples/mandala-complex.png' }
  ];

  // Popular Categories Data
  const popularCategories = [
    { id: 'animals', titleKey: 'home.categories.animals.title', altTextKey: 'home.categories.animals.alt', image: '/images/categories/animals.jpg' },
    { id: 'fantasy', titleKey: 'home.categories.fantasy.title', altTextKey: 'home.categories.fantasy.alt', image: '/images/categories/fantasy.jpg' },
    { id: 'nature', titleKey: 'home.categories.nature.title', altTextKey: 'home.categories.nature.alt', image: '/images/categories/nature.jpg' }
  ];

  // Creation methods data
  const creationMethods = [
    {
      title: 'home.methods.describe.title',
      description: 'home.methods.describe.description',
      icon: '✏️',
      link: '/create',
    },
    {
      title: 'home.methods.style.title',
      description: 'home.methods.style.description',
      icon: '🎨',
      link: '/create',
    },
    {
      title: 'home.methods.advanced.title',
      description: 'home.methods.advanced.description',
      icon: '⚙️',
      link: '/create',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      text: "home.testimonials.1.text",
      author: "home.testimonials.1.author",
    },
    {
      text: "home.testimonials.2.text",
      author: "home.testimonials.2.author",
    },
    {
      text: "home.testimonials.3.text",
      author: "home.testimonials.3.author",
    },
  ];

  // Helper function to get localized href
  const getLocalizedHref = (path: string): string => {
    return `/${lang}${path}`;
  };

  // Helper to get translation safely
  const t = (key: string, fallback?: string): string => {
    if (!translations) {
      console.warn(`[Homepage] Translations not loaded when trying to access key: ${key}`);
      return fallback || key.split('.').pop() || key;
    }
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      {/* --- New Hero Section --- */}
      <section className="w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Subtle background pattern or elements */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/5 to-transparent"></div>
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-white blur-3xl opacity-10"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-6 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-semibold shadow-sm">
            ✨ {t('home.hero.tagline', 'Powered by Cutting-Edge AI')}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight shadow-text">
            {t('home.hero.title', "Create Beautiful Coloring Pages with AI")}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            {t('home.hero.subtitle', "Turn your ideas into stunning printable coloring pages in seconds. Perfect for kids, adults, teachers, and all coloring enthusiasts.")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href={getLocalizedHref('/create')}
              className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('home.hero.createButton', "Create Now")}
            </Link>
            <Link 
              href={getLocalizedHref('/gallery')}
              className="px-8 py-3 bg-transparent text-white rounded-xl font-medium border-2 border-white/50 hover:bg-white/10 hover:border-white transition-colors duration-300"
            >
              {t('home.hero.exploreButton', "Explore Gallery")}
            </Link>
          </div>
          <p className="mt-8 text-sm text-blue-200">
            {t('home.hero.stats', "Over 10,000+ pages generated daily!")}
          </p>
        </div>
      </section>

      {/* --- Examples Section - Refined Styling --- */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            {t('home.examples.title', 'Endless Creative Possibilities')}
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            {t('home.examples.subtitle', 'From simple cartoons to intricate designs, see what our AI can create.')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examplePages.map((example) => (
              <div key={example.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="aspect-square relative group bg-gray-50">
                  <Image
                    src={example.image}
                    alt={t(example.altTextKey, 'Example AI Coloring Page')}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    priority={example.id === 'example-dragon'}
                  />
                </div>
                <div className="p-5 text-center bg-gray-50 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800">
                    {t(example.titleKey, 'AI Generated Example')}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works/Methods Section - Refined Styling --- */}
      <section className="w-full py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            {t('home.howItWorks.titleOptimized', 'Simple Steps to Your Custom Page')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {creationMethods.map((method) => (
              <div key={method.title} className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-5 inline-block">{method.icon}</div> 
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t(method.title)}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t(method.description)}
                </p>
                <Link href={getLocalizedHref(method.link)} className="inline-block px-6 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 hover:text-blue-800 transition-colors text-sm">
                  {t('common.tryIt', "Try It")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Popular Categories Section - Refined Styling --- */}
      <section id="categories" className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            {t('home.categories.title', 'Explore Popular Categories')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCategories.map((category) => (
              <Link key={category.id} href={getLocalizedHref(`/gallery?category=${category.id}`)} className="block group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={category.image}
                    alt={t(category.altTextKey, `Coloring pages category: ${category.id}`)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-semibold text-white mb-1 shadow-text">
                      {t(category.titleKey, category.id.charAt(0).toUpperCase() + category.id.slice(1))}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-white/20 text-white/90 rounded-full text-xs font-medium backdrop-blur-sm">
                      {t('common.viewAll', "View All")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section - Refined Styling --- */}
      <section className="w-full py-20 px-4 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            {t('home.testimonials.title', 'Loved by Creatives Worldwide')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <svg className="w-10 h-10 text-blue-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 32 32">
                   <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                 </svg>
                <p className="text-gray-600 italic mb-6">
                  "{t(testimonial.text, 'A glowing review from a happy user.')}"
                </p>
                <p className="font-semibold text-gray-800">
                  - {t(testimonial.author, 'Happy User')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section - Refined Styling --- */}
      <section className="w-full py-24 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 shadow-text">
            {t('home.cta.title', 'Ready to Create Your Own Masterpiece?')}
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            {t('home.cta.subtitle', 'Unleash your creativity and generate unlimited unique coloring pages for free. Get started in seconds!')}
          </p>
          <Link 
            href={getLocalizedHref('/create')}
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {t('home.cta.button', "Start Generating Now")}
          </Link>
        </div>
      </section>
    </main>
  );
} 