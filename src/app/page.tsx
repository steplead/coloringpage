import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { headers } from 'next/headers';
import TranslatedText from '@/components/TranslatedText';

export const metadata: Metadata = {
  title: 'AI Coloring Page Generator - Create Custom Coloring Pages',
  description: 'Create and print custom black outline coloring pages using AI. Generate unique coloring pages based on any description.',
  openGraph: {
    title: 'AI Coloring Page Generator',
    description: 'Create custom black outline coloring pages with AI',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Coloring Page Generator',
    description: 'Create custom black outline coloring pages with AI',
    images: ['/twitter-image.png'],
  },
};

export default function Home({ params }: { params?: { lang?: string } }) {
  // Get the current language from params or headers
  const headersList = headers();
  const headerLang = headersList.get('x-locale'); 
  const currentLang = params?.lang || headerLang || 'en';

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

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <TranslatedText translationKey="home.hero.title" fallback="Create Beautiful Coloring Pages with AI" lang={currentLang} />
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <TranslatedText translationKey="home.hero.subtitle" fallback="Turn your ideas into stunning coloring pages in seconds. Perfect for kids, teachers, and coloring enthusiasts." lang={currentLang} />
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/create" className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md">
                <TranslatedText translationKey="home.hero.createButton" fallback="Create Now" lang={currentLang} />
              </Link>
              <a href="#how-it-works" className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium border border-blue-200 hover:bg-blue-50 transition-colors">
                <TranslatedText translationKey="home.hero.learnButton" fallback="Learn More" lang={currentLang} />
              </a>
            </div>
            <div className="mt-4 text-gray-500">
              <TranslatedText translationKey="home.hero.stats" fallback="Over 5,000 coloring pages created" lang={currentLang} />
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
                    <TranslatedText translationKey={example.title} fallback={example.title.split('.').pop()} lang={currentLang} />
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            <TranslatedText translationKey="home.howItWorks.title" fallback="Create Coloring Pages Your Way" lang={currentLang} />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creationMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  <TranslatedText translationKey={method.title} fallback={method.title.split('.').pop()} lang={currentLang} />
                </h3>
                <p className="text-gray-600 mb-6">
                  <TranslatedText translationKey={method.description} fallback={method.description.split('.').pop()} lang={currentLang} />
                </p>
                <Link href={method.link} className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition-colors">
                  <TranslatedText translationKey="common.tryIt" fallback="Try It" lang={currentLang} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles Preview */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            <TranslatedText translationKey="home.styles.title" fallback="Choose Your Style" lang={currentLang} />
          </h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
            <TranslatedText translationKey="home.styles.subtitle" fallback="Select from multiple artistic styles to create the perfect coloring page" lang={currentLang} />
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['home.styles.simple', 'home.styles.medium', 'home.styles.complex', 'home.styles.cartoon', 'home.styles.realistic'].map((style, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-2">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">{['🐢', '🦁', '🐉', '🚀', '🏰'][index]}</span>
                  </div>
                </div>
                <div className="p-3 text-center border-t border-gray-100">
                  <h3 className="font-medium text-gray-800">
                    <TranslatedText translationKey={style} fallback={style.split('.').pop()} lang={currentLang} />
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            <TranslatedText translationKey="home.testimonials.title" fallback="What Our Users Say" lang={currentLang} />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md p-6 border border-gray-100">
                <p className="text-gray-600 mb-4">"<TranslatedText translationKey={testimonial.text} fallback={testimonial.text} lang={currentLang} />"</p>
                <p className="font-medium text-gray-800">- <TranslatedText translationKey={testimonial.author} fallback={testimonial.author} lang={currentLang} /></p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/create" className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md inline-block">
              <TranslatedText translationKey="home.testimonials.cta" fallback="Start Creating Now" lang={currentLang} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            <TranslatedText translationKey="home.features.title" fallback="Why Choose Our AI Coloring Page Generator?" lang={currentLang} />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🚀', title: 'home.features.fast.title', desc: 'home.features.fast.desc' },
              { icon: '🎨', title: 'home.features.styles.title', desc: 'home.features.styles.desc' },
              { icon: '📱', title: 'home.features.everywhere.title', desc: 'home.features.everywhere.desc' },
              { icon: '🔄', title: 'home.features.unlimited.title', desc: 'home.features.unlimited.desc' },
              { icon: '🖨️', title: 'home.features.print.title', desc: 'home.features.print.desc' },
              { icon: '🎮', title: 'home.features.easy.title', desc: 'home.features.easy.desc' },
              { icon: '🔒', title: 'home.features.secure.title', desc: 'home.features.secure.desc' },
              { icon: '✏️', title: 'home.features.control.title', desc: 'home.features.control.desc' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  <TranslatedText translationKey={feature.title} fallback={feature.title.split('.').pop()} lang={currentLang} />
                </h3>
                <p className="text-gray-600">
                  <TranslatedText translationKey={feature.desc} fallback={feature.desc.split('.').pop()} lang={currentLang} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <TranslatedText translationKey="home.cta.title" fallback="Ready to Create Your Coloring Pages?" lang={currentLang} />
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            <TranslatedText translationKey="home.cta.subtitle" fallback="Get started in seconds. No credit card required." lang={currentLang} />
          </p>
          <Link href="/create" className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium text-lg hover:bg-blue-50 transition-colors shadow-lg inline-block">
            <TranslatedText translationKey="home.cta.button" fallback="Start Creating for Free" lang={currentLang} />
          </Link>
        </div>
      </section>
    </main>
  );
} 