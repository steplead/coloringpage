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
    { id: 1, titleKey: 'home.examples.elephant.title', altTextKey: 'home.examples.elephant.alt', image: '/examples/elephant.png' },
    { id: 2, titleKey: 'home.examples.rocket.title', altTextKey: 'home.examples.rocket.alt', image: '/examples/rocket.png' },
    { id: 3, titleKey: 'home.examples.dragon.title', altTextKey: 'home.examples.dragon.alt', image: '/examples/dragon.png' }
  ];

  // Popular Categories Data
  const popularCategories = [
    { id: 'animals', titleKey: 'home.categories.animals.title', altTextKey: 'home.categories.animals.alt', image: '/examples/category-animal.png' }, // Placeholder image
    { id: 'fantasy', titleKey: 'home.categories.fantasy.title', altTextKey: 'home.categories.fantasy.alt', image: '/examples/category-fantasy.png' }, // Placeholder image
    { id: 'vehicles', titleKey: 'home.categories.vehicles.title', altTextKey: 'home.categories.vehicles.alt', image: '/examples/category-vehicle.png' } // Placeholder image
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
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('home.hero.title', "Create Beautiful Coloring Pages with AI")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('home.hero.subtitle', "Turn your ideas into stunning printable coloring pages in seconds. Perfect for kids, adults, teachers, and all coloring enthusiasts.")}
            </p>
            <div className="flex justify-center space-x-4">
              <Link href={getLocalizedHref('/create')} className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md">
                {t('home.hero.createButton', "Create Now")}
              </Link>
              <a href="#categories" className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium border border-blue-200 hover:bg-blue-50 transition-colors">
                {t('home.hero.learnButton', "Explore Categories")}
              </a>
            </div>
            <div className="mt-4 text-gray-500">
              {t('home.hero.stats', "Over 5,000 coloring pages created")}
            </div>
          </div>

          {/* Example Coloring Pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {examplePages.map((example) => {
              const altText = t(example.altTextKey);
              
              return (
                <div key={example.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-2 bg-gray-50">
                    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden aspect-square relative">
                      <Image
                        src={example.image}
                        alt={altText}
                        width={400}
                        height={400}
                        className="object-contain"
                        priority={example.id === 1}
                      />
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium text-gray-800">
                      {t(example.titleKey)}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section id="categories" className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('home.categories.title', 'Popular Coloring Page Categories')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCategories.map((category) => {
              const categoryAltText = t(category.altTextKey);
              return (
                <div key={category.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="p-2 bg-gray-50">
                    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden aspect-square relative">
                      <Image
                        src={category.image}
                        alt={categoryAltText}
                        width={400}
                        height={400}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      {t(category.titleKey)}
                    </h3>
                    <Link href={getLocalizedHref(`/gallery?category=${category.id}`)} className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition-colors text-sm">
                      {t('common.viewAll', "View All")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('home.howItWorks.titleOptimized', "AI Coloring Page Creation Methods")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creationMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 break-words">
                  {t(method.title)}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {t(method.description)}
                </p>
                <Link href={getLocalizedHref(method.link)} className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition-colors">
                  {t('common.tryIt', "Try It")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('home.testimonials.title', "What Our Users Say")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md p-6 border border-gray-100">
                <p className="text-sm sm:text-base text-gray-600 mb-4 italic">
                  " {t(testimonial.text)} "
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-800 text-right">
                  - {t(testimonial.author)}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={getLocalizedHref('/create')} className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md inline-block">
              {t('home.testimonials.cta', "Start Creating Now")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.cta.title', "Ready to Create Your First Coloring Page?")}
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            {t('home.cta.subtitle', "Start creating beautiful coloring pages for free. No sign-up required.")}
          </p>
          <Link href={getLocalizedHref('/create')} className="px-10 py-4 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors shadow-lg inline-block">
            {t('home.cta.button', "Start Creating for Free")}
          </Link>
        </div>
      </section>
    </main>
  );
} 