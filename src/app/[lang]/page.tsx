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
    // Ensure fallback is provided if key is missing, otherwise use the key itself
    const defaultFallback = fallback || key.split('.').pop() || key;
    return getTranslationSync(key, undefined, translations, defaultFallback);
  };
  
  // Helper function to get localized href
  const getLocalizedHref = (path: string): string => {
    return `/${lang}${path}`;
  };

  // Data arrays (keep as is, styling applied via JSX)
  const examplePages = [
    { id: 1, titleKey: 'home.examples.elephant.title', altTextKey: 'home.examples.elephant.alt', image: '/examples/elephant.png' },
    { id: 2, titleKey: 'home.examples.rocket.title', altTextKey: 'home.examples.rocket.alt', image: '/examples/rocket.png' },
    { id: 3, titleKey: 'home.examples.dragon.title', altTextKey: 'home.examples.dragon.alt', image: '/examples/dragon.png' }
  ];

  const popularCategories = [
    { id: 'animals', titleKey: 'home.categories.animals.title', altTextKey: 'home.categories.animals.alt', image: '/examples/category-animal.png' },
    { id: 'fantasy', titleKey: 'home.categories.fantasy.title', altTextKey: 'home.categories.fantasy.alt', image: '/examples/category-fantasy.png' },
    { id: 'vehicles', titleKey: 'home.categories.vehicles.title', altTextKey: 'home.categories.vehicles.alt', image: '/examples/category-vehicle.png' }
  ];

  const creationMethods = [
    { title: 'home.methods.describe.title', description: 'home.methods.describe.description', icon: '✏️', link: '/create' },
    { title: 'home.methods.style.title', description: 'home.methods.style.description', icon: '🎨', link: '/create' },
    { title: 'home.methods.advanced.title', description: 'home.methods.advanced.description', icon: '⚙️', link: '/create' },
  ];

  const testimonials = [
    { text: "home.testimonials.1.text", author: "home.testimonials.1.author" },
    { text: "home.testimonials.2.text", author: "home.testimonials.2.author" },
    { text: "home.testimonials.3.text", author: "home.testimonials.3.author" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center text-gray-200">
      {/* Hero Section - Dark Theme & Gradient */}
      <section className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-24 px-4 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-l from-cyan-500 to-blue-500 blur-3xl animate-pulse animation-delay-2000"></div>
         </div>
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-indigo-300 text-sm font-medium border border-white/10">
               {t('home.hero.tag', 'Powered by Advanced AI')}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
               {t('home.hero.title', "Create Beautiful Coloring Pages with AI")}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
               {t('home.hero.subtitle', "Turn your ideas into stunning printable coloring pages in seconds. Perfect for kids, adults, teachers, and all coloring enthusiasts.")}
            </p>
            <div className="flex justify-center space-x-4">
               <Link href={getLocalizedHref('/create')} className="button-primary text-lg">
                  {t('home.hero.createButton', "Create Now")}
               </Link>
               <a href="#categories" className="button-secondary text-lg">
                  {t('home.hero.learnButton', "Explore Categories")}
               </a>
            </div>
            <div className="mt-8 text-sm text-gray-400">
               {t('home.hero.stats', "Over 5,000 coloring pages created")}
            </div>
         </div>
      </section>

      {/* Example Coloring Pages - Dark Theme Cards */}
      <section className="w-full py-16 px-4 bg-gray-900/50">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
               {t('home.examples.title', 'See What You Can Create')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {examplePages.map((example) => (
                  <div key={example.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
                     <div className="p-3">
                        <div className="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden aspect-square relative">
                           <Image
                              src={example.image}
                              alt={t(example.altTextKey)}
                              layout="fill"
                              objectFit="contain"
                              className="opacity-90 group-hover:opacity-100 transition-opacity"
                              priority={example.id === 1}
                           />
                        </div>
                     </div>
                     <div className="p-5 pt-2 text-center">
                        <h3 className="font-medium text-gray-200">
                           {t(example.titleKey)}
                        </h3>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Popular Categories Section - Dark Theme Cards */}
      <section id="categories" className="w-full py-16 px-4 bg-gray-800">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
               {t('home.categories.title', 'Popular Coloring Page Categories')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {popularCategories.map((category) => (
                  <div key={category.id} className="card text-center transform hover:scale-105 transition-transform duration-300">
                     <div className="p-2 bg-gray-700 rounded-lg mb-4">
                        <div className="bg-gray-600 border border-gray-500 rounded-md overflow-hidden aspect-square relative">
                           <Image
                              src={category.image}
                              alt={t(category.altTextKey)}
                              layout="fill"
                              objectFit="contain"
                              className="opacity-90"
                              loading="lazy"
                           />
                        </div>
                     </div>
                     <h3 className="text-xl font-semibold mb-4 text-gray-100">
                        {t(category.titleKey)}
                     </h3>
                     <Link href={getLocalizedHref(`/gallery?category=${category.id}`)} className="button-secondary">
                        {t('common.viewAll', "View All")}
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* How It Works Section - Dark Theme */}
      <section className="w-full py-20 px-4 bg-gray-900">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
               {t('home.howItWorks.titleOptimized', 'Simple Steps to Your Custom Page')}
            </h2>
            <p className="text-lg text-gray-400 mb-12">
               {t('home.howItWorks.subtitle', 'Generate unique coloring pages in just a few clicks.')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {creationMethods.map((method, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl border border-gray-600 text-center shadow-lg animate-fadeIn" style={{animationDelay: `${index * 150}ms`}}>
                     <div className="text-4xl mb-4">{method.icon}</div>
                     <h3 className="text-xl font-semibold mb-2 text-white">{t(method.title)}</h3>
                     <p className="text-gray-400 text-sm">{t(method.description)}</p>
                  </div>
               ))}
            </div>
             <div className="mt-12">
               <Link href={getLocalizedHref('/create')} className="button-primary text-lg">
                  {t('home.howItWorks.cta', "Start Creating Now")}
               </Link>
            </div>
         </div>
      </section>
      
      {/* Testimonials Section - Dark Theme */}
      <section className="w-full py-16 px-4 bg-gray-800">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
               {t('home.testimonials.title', 'Loved by Creatives Everywhere')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {testimonials.map((testimonial, index) => (
                  <div key={index} className="card text-center italic relative">
                     <svg className="absolute top-4 left-4 w-8 h-8 text-indigo-600 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                     </svg>
                     <p className="text-gray-300 mb-4 pt-8">"{t(testimonial.text)}"</p>
                     <p className="font-semibold text-indigo-400">- {t(testimonial.author)}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section - Dark Theme & Gradient */}
      <section className="w-full py-20 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
               {t('home.cta.title', 'Ready to Create Your Own Masterpiece?')}
            </h2>
            <p className="text-lg text-indigo-100 mb-8">
               {t('home.cta.subtitle', 'Start generating unique coloring pages with our free AI tool today.')}
            </p>
            <Link href={getLocalizedHref('/create')} className="button-primary bg-white text-indigo-600 hover:bg-gray-100 text-lg">
               {t('home.cta.button', "Start Generating Now")}
            </Link>
         </div>
      </section>
    </main>
  );
} 