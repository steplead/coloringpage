import Link from 'next/link';
import Image from 'next/image';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import TranslatedText from '@/components/TranslatedText';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export default function LanguageHomePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  
  // Example coloring pages to showcase in hero section
  const examplePages = [
    {
      id: 1,
      title: 'home.examples.elephant',
      image: '/examples/elephant.png',
    },
    {
      id: 2,
      title: 'home.examples.rocket',
      image: '/examples/rocket.png',
    },
    {
      id: 3,
      title: 'home.examples.dragon',
      image: '/examples/dragon.png',
    }
  ];

  // Creation methods to display
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

  // Testimonials
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

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <TranslatedText translationKey="home.hero.title" fallback="Create Beautiful Coloring Pages with AI" />
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <TranslatedText translationKey="home.hero.subtitle" fallback="Turn your ideas into stunning coloring pages in seconds. Perfect for kids, teachers, and coloring enthusiasts." />
            </p>
            <div className="flex justify-center space-x-4">
              <Link href={getLocalizedHref('/create')} className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md">
                <TranslatedText translationKey="home.hero.createButton" fallback="Create Now" />
              </Link>
              <a href="#how-it-works" className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium border border-blue-200 hover:bg-blue-50 transition-colors">
                <TranslatedText translationKey="home.hero.learnButton" fallback="Learn More" />
              </a>
            </div>
            <div className="mt-4 text-gray-500">
              <TranslatedText translationKey="home.hero.stats" fallback="Over 5,000 coloring pages created" />
            </div>
          </div>

          {/* Example Coloring Pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {examplePages.map((example) => (
              <div key={example.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-2 bg-gray-50">
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden aspect-square relative">
                    <Image
                      src={example.image}
                      alt={example.title}
                      width={400}
                      height={400}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-800">
                    <TranslatedText translationKey={example.title} fallback={example.title.split('.').pop()} />
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 break-words hyphens-auto">
            <TranslatedText translationKey="home.howItWorks.title" fallback="Create Coloring Pages Your Way" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creationMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 break-words">
                  <TranslatedText translationKey={method.title} fallback={method.title.split('.').pop()} />
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  <TranslatedText translationKey={method.description} fallback={method.description.split('.').pop()} />
                </p>
                <Link href={getLocalizedHref(method.link)} className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition-colors">
                  <TranslatedText translationKey="common.tryIt" fallback="Try It" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 break-words hyphens-auto">
            <TranslatedText translationKey="home.testimonials.title" fallback="What Our Users Say" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md p-6 border border-gray-100">
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  "<TranslatedText translationKey={testimonial.text} fallback={testimonial.text} />"
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-800">
                  - <TranslatedText translationKey={testimonial.author} fallback={testimonial.author} />
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={getLocalizedHref('/create')} className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md inline-block">
              <TranslatedText translationKey="home.testimonials.cta" fallback="Start Creating Now" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 break-words hyphens-auto">
            <TranslatedText translationKey="home.cta.title" fallback="Ready to Create Your First Coloring Page?" />
          </h2>
          <p className="text-base sm:text-xl max-w-2xl mx-auto mb-8">
            <TranslatedText translationKey="home.cta.subtitle" fallback="Start creating beautiful coloring pages for free. No sign-up required." />
          </p>
          <Link href={getLocalizedHref('/create')} className="px-10 py-4 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors shadow-lg inline-block">
            <TranslatedText translationKey="home.cta.button" fallback="Start Creating for Free" />
          </Link>
        </div>
      </section>
    </main>
  );
} 